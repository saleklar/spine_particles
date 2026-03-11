const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');

const s1 = \      const createParticleMesh = (
        position: THREE.Vector3,
        color = '#ffffff',
        size = 3,
        opacity = 1,
        particleType: ParticleVisualType = 'dots',
        customGlow = false,
        rotation = 0,
        spriteTexture?: THREE.Texture
      ) => {\;

const r1 = \      const createParticleMesh = (
        position: THREE.Vector3,
        color = '#ffffff',
        size = 3,
        opacity = 1,
        particleType: ParticleVisualType = 'dots',
        customGlow = false,
        rotation = 0,
        spriteTexture?: THREE.Texture,
        pivotX = 0.5,
        pivotY = 0.5
      ) => {\;

code = code.replace(s1, r1);

const s2 = \          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.position.copy(position);
          setParticleSize(sprite, size);
          setParticleRotation(sprite, rotation);\;

const r2 = \          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.position.copy(position);
          sprite.center.set(pivotX, pivotY);
          setParticleSize(sprite, size);
          setParticleRotation(sprite, rotation);\;

code = code.replace(s2, r2);

// Now update the occurrences of createParticleMesh to pass pivotX and pivotY from emitterProps or cached
// 1. In restoreParticleFrame:
const resSearch = \(previewedType === 'sprites' || previewedType === '3d-model') ? restoredSpriteTexture : undefined
          );\;
const resReplace = \(previewedType === 'sprites' || previewedType === '3d-model') ? restoredSpriteTexture : undefined,
            Number(emitterProps.particlePivotX ?? 0.5),
            Number(emitterProps.particlePivotY ?? 0.5)
          );\;
code = code.replace(resSearch, resReplace);

// 2. In spawn (updateParticles loops):
const spawnSearch = \(previewedType === 'sprites' || previewedType === '3d-model') ? spawnSpriteTexture : undefined
                );\;
const spawnReplace = \(previewedType === 'sprites' || previewedType === '3d-model') ? spawnSpriteTexture : undefined,
                    Number(emitterProps.particlePivotX ?? 0.5),
                    Number(emitterProps.particlePivotY ?? 0.5)
                );\;
code = code.replace(spawnSearch, spawnReplace);

// 3. In mesh replacement swap:
const repSearch = \(effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined
                  );\;
const repReplace = \(effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined,
                      Number(emitterProps.particlePivotX ?? 0.5),
                      Number(emitterProps.particlePivotY ?? 0.5)
                  );\;
code = code.replace(repSearch, repReplace);


fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Scene3D sprite pivot patched.');
