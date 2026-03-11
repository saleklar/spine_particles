const fs = require('fs');
const file = 'src/Scene3D.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. the chunk where spawnTrackId is calculated:
const trackIdCalc = `
                // Find lowest available track ID for pooling/Spine export bone reuse
                const activeTracks = new Set<number>();
                particleSystem.particles.forEach(p => activeTracks.add(p.trackId));
                let spawnTrackId = 0;
                while (activeTracks.has(spawnTrackId)) {
                  spawnTrackId++;
                }

`;

// remove the original
txt = txt.replace(
`                // Find lowest available track ID for pooling/Spine export bone reuse
                const activeTracks = new Set<number>();
                particleSystem.particles.forEach(p => activeTracks.add(p.trackId));
                let spawnTrackId = 0;
                while (activeTracks.has(spawnTrackId)) {
                  spawnTrackId++;
                }`, "");

// and insert it before spawnSpriteTexture
const targetPos = "const spawnSpriteTexture = (emitterParticleType === 'sprites' || emitterParticleType === '3d-model')";
txt = txt.replace(targetPos, trackIdCalc + "                " + targetPos);

// and then replace `trackId)` in that line with `spawnTrackId)` 
// specifically, the one that has trackId at the end:
txt = txt.replace(
  "resolveSpriteTexture(emitterSpriteImageDataUrl, emitterSpriteSequenceDataUrls, 0, emitterSpriteSequenceFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), Number(emitterProps.particleLifetime ?? 3), trackId)",
  "resolveSpriteTexture(emitterSpriteImageDataUrl, emitterSpriteSequenceDataUrls, 0, emitterSpriteSequenceFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), Number(emitterProps.particleLifetime ?? 3), spawnTrackId)"
);


fs.writeFileSync(file, txt, 'utf8');
console.log("Hoisted spawnTrackId in Scene3D.tsx");
