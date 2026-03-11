const fs = require('fs');

const file3D = 'src/Scene3D.tsx';
let txt3D = fs.readFileSync(file3D, 'utf8');

// 1. Update resolveSpriteTexture signature and logic
const matchResolve = txt3D.match(/const resolveSpriteTexture = \([\s\S]*?return undefined;\s*\};/);
if (matchResolve) {
    const newResolve = `const resolveSpriteTexture = (imageDataUrl: string, sequenceDataUrls: string[], age: number, fps: number = 12, mode: string = 'loop', particleLifetime: number = 1, trackId: number = 0) => {
          const validSequence = Array.isArray(sequenceDataUrls)
            ? sequenceDataUrls.filter((url) => typeof url === 'string' && url.length > 0)
            : [];

          if (validSequence.length > 0) {
            let frameIndex = 0;
            if (mode === 'random-static') {
               frameIndex = Math.abs(trackId * 2654435761) % validSequence.length;
            } else if (mode === 'match-life') {
               let progress = Math.max(0, age) / Math.max(0.001, particleLifetime);
               if (progress > 0.999) progress = 0.999;
               frameIndex = Math.floor(progress * validSequence.length);
            } else {
               const sequenceFps = fps;
               frameIndex = Math.floor(Math.max(0, age) * sequenceFps) % validSequence.length;
            }
            return getExternalSpriteTexture(validSequence[frameIndex]);
          }

          if (imageDataUrl && imageDataUrl.length > 0) {
            return getExternalSpriteTexture(imageDataUrl);
          }

          return undefined;
        };`;
    txt3D = txt3D.replace(matchResolve[0], newResolve);
}

// 2. Update calls to resolveSpriteTexture to pass trackId
const callsToUpdate = [
    [/resolveSpriteTexture\(emitterSpriteImageDataUrl, emitterSpriteSequenceDataUrls, cached\.age, emitterSpriteSequenceFps, String\(emitterProps\.particleSpriteSequenceMode \?\? 'loop'\), Number\(emitterProps\.particleLifetime \?\? 3\)\)/g, "resolveSpriteTexture(emitterSpriteImageDataUrl, emitterSpriteSequenceDataUrls, cached.age, emitterSpriteSequenceFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), Number(emitterProps.particleLifetime ?? 3), cached.trackId)"],
    
    // For spawn we probably pass 0 or a newly created trackId ... wait! The trackId might not be generated yet at the top of spawn?
    // Let's pass 0 for spawn if trackId is not yet available, since frame is 0 anyway or it will be updated right after spawn.
    // wait, for spawn, trackId is available as `trackId` variable inside spawn loop!
    [/resolveSpriteTexture\(emitterSpriteImageDataUrl, emitterSpriteSequenceDataUrls, 0, emitterSpriteSequenceFps, String\(emitterProps\.particleSpriteSequenceMode \?\? 'loop'\), Number\(emitterProps\.particleLifetime \?\? 3\)\)/g, "resolveSpriteTexture(emitterSpriteImageDataUrl, emitterSpriteSequenceDataUrls, 0, emitterSpriteSequenceFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), Number(emitterProps.particleLifetime ?? 3), trackId)"],

    // And in the update loop it passes particle.age ... so we should pass particle.trackId
    [/resolveSpriteTexture\(particle\.spriteImageDataUrl \?\? '', particle\.spriteSequenceDataUrls \?\? \[\], particle\.age, currentEmitterFps, String\(emitterProps\.particleSpriteSequenceMode \?\? 'loop'\), particle\.lifetime\)/g, "resolveSpriteTexture(particle.spriteImageDataUrl ?? '', particle.spriteSequenceDataUrls ?? [], particle.age, currentEmitterFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), particle.lifetime, particle.trackId)"]
];

// Oh wait, one has a newline in currentEmitterFps
txt3D = txt3D.replace(/resolveSpriteTexture\(particle\.spriteImageDataUrl \?\? '',\s*particle\.spriteSequenceDataUrls \?\? \[\],\s*particle\.age,\s*currentEmitterFps\s*,\s*String\(emitterProps\.particleSpriteSequenceMode \?\? 'loop'\),\s*particle\.lifetime\)/g, "resolveSpriteTexture(particle.spriteImageDataUrl ?? '', particle.spriteSequenceDataUrls ?? [], particle.age, currentEmitterFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), particle.lifetime, particle.trackId)");

for (const [pattern, replacement] of callsToUpdate) {
    txt3D = txt3D.replace(pattern, replacement);
}

fs.writeFileSync(file3D, txt3D, 'utf8');
console.log("Patched Scene3D.tsx");

// 3. Update App.tsx
const fileApp = 'src/App.tsx';
let txtApp = fs.readFileSync(fileApp, 'utf8');

txtApp = txtApp.replace(
    `particleSpriteSequenceMode?: 'loop' | 'match-life';`,
    `particleSpriteSequenceMode?: 'loop' | 'match-life' | 'random-static';`
);

const modeUIMarker = '{selectedEmitterProperties.particleSpriteSequenceDataUrls.length > 0 && (';
if (txtApp.includes(modeUIMarker)) {
    const p1 = txtApp.indexOf(modeUIMarker);
    const labelFps = txtApp.indexOf('<label htmlFor="', p1);
    
    // We will inject the select before the label for FPS
    const insertion = `
                                <label style={{marginTop: '10px'}}>
                                  Sequence Mode
                                </label>
                                <select
                                  value={selectedEmitterProperties.particleSpriteSequenceMode ?? 'loop'}
                                  onChange={(e) => handleUpdateEmitterProperty('particleSpriteSequenceMode', e.target.value)}
                                  className="property-input"
                                >
                                  <option value="loop">Loop</option>
                                  <option value="match-life">Match Life</option>
                                  <option value="random-static">Random Frame (Static)</option>
                                </select>
`;
    txtApp = txtApp.substring(0, labelFps) + insertion + txtApp.substring(labelFps);
    fs.writeFileSync(fileApp, txtApp, 'utf8');
    console.log("Patched App.tsx");
} else {
    console.log("Could not patch App.tsx UI");
}
