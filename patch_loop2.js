const fs = require('fs');

const path = 'src/Scene3D.tsx';
let txt = fs.readFileSync(path, 'utf8');

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
                    spriteTexture = spriteTexture.clone();
                    spriteTexture.repeat.x = -1;
                    spriteTexture.offset.x = 1;
                    spriteTexture.needsUpdate = true;
                  }

                  // Note: we might be constantly cloning the texture if it's strictly compared, 
                  // but for sequences it will usually be a new base texture anyway.
                  // For a single image, it's inefficient but we'll try it for now.
                  if (material.map !== (spriteTexture ?? null)) {
                    material.map = spriteTexture ?? null;
                    material.needsUpdate = true;
                  }
                }

                `;

txt = txt.substring(0, start) + replacement + txt.substring(end);
fs.writeFileSync(path, txt, 'utf8');
console.log("Replaced block using substring.");
