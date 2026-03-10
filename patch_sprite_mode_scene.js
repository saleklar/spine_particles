const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

let target1 = `const resolveSpriteTexture = (imageDataUrl: string, sequenceDataUrls: string[], age: number, fps: number = 12) => {
          const validSequence = Array.isArray(sequenceDataUrls)
            ? sequenceDataUrls.filter((url) => typeof url === 'string' && url.length > 0)
            : [];

          if (validSequence.length > 0) {
            const sequenceFps = fps;
            const frameIndex = Math.floor(Math.max(0, age) * sequenceFps) % validSequence.length;
            return getExternalSpriteTexture(validSequence[frameIndex]);
          }`;

let replace1 = `const resolveSpriteTexture = (imageDataUrl: string, sequenceDataUrls: string[], age: number, fps: number = 12, mode: string = 'loop', particleLifetime: number = 1) => {
          const validSequence = Array.isArray(sequenceDataUrls)
            ? sequenceDataUrls.filter((url) => typeof url === 'string' && url.length > 0)
            : [];

          if (validSequence.length > 0) {
            if (mode === 'match-life') {
                const progress = particleLifetime > 0 ? Math.max(0, Math.min(1, age / particleLifetime)) : 0;
                const frameIndex = Math.floor(progress * (validSequence.length - 1));
                return getExternalSpriteTexture(validSequence[frameIndex]);
            } else {
                const sequenceFps = fps;
                const frameIndex = Math.floor(Math.max(0, age) * sequenceFps) % validSequence.length;
                return getExternalSpriteTexture(validSequence[frameIndex]);
            }
          }`;

code = code.replace(target1, replace1);

let count = 0;
// We need to pass the new parameters to resolveSpriteTexture in Scene3D
code = code.replace(/resolveSpriteTexture\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, (match, p1, p2, p3, p4) => {
    count++;
    if (p1.includes('particle.spriteImageDataUrl')) {
        // This is inside the particle loop where we have particle.lifetime
        return `resolveSpriteTexture(${p1}, ${p2}, ${p3}, ${p4}, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), particle.lifetime)`;
    } else {
        // this is inside the spawn code where particle just spawns (so lifetime doesn't matter too much, but we can pass emitterProps.particleLifetime)
        return `resolveSpriteTexture(${p1}, ${p2}, ${p3}, ${p4}, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), Number(emitterProps.particleLifetime ?? 3))`;
    }
});

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Patched Scene3D with replace count:", count);
