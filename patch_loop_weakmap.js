const fs = require('fs');

const path = 'src/Scene3D.tsx';
let txt = fs.readFileSync(path, 'utf8');

const mapDecl = "const flippedTextureCache = new WeakMap<THREE.Texture, THREE.Texture>();";
if (!txt.includes(mapDecl)) {
    const importThree = "import * as THREE from 'three';";
    const idx = txt.indexOf(importThree);
    if (idx !== -1) {
        txt = txt.substring(0, idx + importThree.length) + "\n" + mapDecl + "\n" + txt.substring(idx + importThree.length);
    }
}

const startStr = "if ((effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model')) {";
const endStr = "setParticleRotation(particle";

const start = txt.indexOf(startStr);
const end = txt.indexOf(endStr, start);

if (start === -1 || end === -1) {
    console.log("Could not find start or end.", start, end);
    process.exit(1);
}

const replacement = `if ((effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model')) {
                  let spriteTexture = resolveSpriteTexture(particle.spriteImageDataUrl ?? '', particle.spriteSequenceDataUrls ?? [], particle.age, currentEmitterFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), particle.lifetime);
                  
                  if (particle.flipX && spriteTexture) {
                    let flipped = flippedTextureCache.get(spriteTexture);
                    if (!flipped) {
                        flipped = spriteTexture.clone();
                        flipped.repeat.x = -1;
                        flipped.offset.x = 1;
                        flippedTextureCache.set(spriteTexture, flipped);
                    }
                    spriteTexture = flipped;
                  }

                  if (material.map !== (spriteTexture ?? null)) {
                    material.map = spriteTexture ?? null;
                    material.needsUpdate = true;
                  }
                }

                `;

txt = txt.substring(0, start) + replacement + txt.substring(end);
fs.writeFileSync(path, txt, 'utf8');
console.log("Replaced block with WeakMap caching.");
