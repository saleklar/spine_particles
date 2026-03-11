const fs = require('fs');

const path = 'src/Scene3D.tsx';
let txt = fs.readFileSync(path, 'utf8');

const oldStr = `                if ((effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model')) {
                  const spriteTexture = resolveSpriteTexture(particle.spriteImageDataUrl ?? '', particle.spriteSequenceDataUrls ?? [], particle.age, currentEmitterFps, String(emitterProps.particleSpriteSequenceMode ?? 'loop'), particle.lifetime);
                  if (material.map !== (spriteTexture ?? null)) {
                    material.map = spriteTexture ?? null;
                    material.needsUpdate = true;
                  }
                }`;

const newStr = `                if ((effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model')) {
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
                }`;

if (txt.includes(oldStr)) {
    txt = txt.replace(oldStr, newStr);
    fs.writeFileSync(path, txt, 'utf8');
    console.log("Replaced block.");
} else {
    console.log("Could not find block.");
}