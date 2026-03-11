const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

// Replacement 1: Spawn loop
const s1 = `const particleMesh = createParticleMesh(
                    spawnPosition,
                    previewedColor,
                    previewedSize,
                    emitterOpacity,
                    previewedType,
                    previewedGlow,
                    particleRotation,
                    (previewedType === 'sprites' || previewedType === '3d-model') ? spawnSpriteTexture : undefined
                  );`;

const r1 = `const pivotX = Number(emitterProps.particlePivotX ?? 0.5);
                  const pivotY = Number(emitterProps.particlePivotY ?? 0.5);
                  const particleMesh = createParticleMesh(
                    spawnPosition,
                    previewedColor,
                    previewedSize,
                    emitterOpacity,
                    previewedType,
                    previewedGlow,
                    particleRotation,
                    (previewedType === 'sprites' || previewedType === '3d-model') ? spawnSpriteTexture : undefined,
                    pivotX,
                    pivotY,
                    flipX
                  );`;

// Replacement 2: Restore loop
const s2 = `const particleMesh = createParticleMesh(
              new THREE.Vector3(cached.position.x, cached.position.y, cached.position.z),
              previewedColor,
              previewedSize,
              emitterOpacity,
              previewedType,
              previewedGlow,
              cached.rotation,
              (previewedType === 'sprites' || previewedType === '3d-model') ? restoredSpriteTexture : undefined
            );`;

const r2 = `const particleMesh = createParticleMesh(
              new THREE.Vector3(cached.position.x, cached.position.y, cached.position.z),
              previewedColor,
              previewedSize,
              emitterOpacity,
              previewedType,
              previewedGlow,
              cached.rotation,
              (previewedType === 'sprites' || previewedType === '3d-model') ? restoredSpriteTexture : undefined,
              Number(emitterProps.particlePivotX ?? 0.5),
              Number(emitterProps.particlePivotY ?? 0.5),
              cached.flipX ?? false
            );`;
            
// Replacement 3: Replacement mesh (in life loop for animating seq)
const s3 = `const replacementMesh = createParticleMesh(
                      particle.mesh.position.clone(),
                      getPreviewedParticleColor(particle.baseColor ?? '#ffffff'),
                      getPreviewedParticleSize(particle.baseSize ?? 3),
                      existingMaterial.opacity,
                      effectiveParticleType,
                      getPreviewedGlow(emitterGlow),
                      particle.rotation ?? getParticleRotation(particle.mesh),
                      (effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined
                    );`;

const r3 = `const replacementMesh = createParticleMesh(
                      particle.mesh.position.clone(),
                      getPreviewedParticleColor(particle.baseColor ?? '#ffffff'),
                      getPreviewedParticleSize(particle.baseSize ?? 3),
                      existingMaterial.opacity,
                      effectiveParticleType,
                      getPreviewedGlow(emitterGlow),
                      particle.rotation ?? getParticleRotation(particle.mesh),
                      (effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined,
                      Number(emitterProps.particlePivotX ?? 0.5),
                      Number(emitterProps.particlePivotY ?? 0.5),
                      particle.flipX ?? false
                    );`;

txt = txt.replace(s1, r1);
txt = txt.replace(s2, r2);
txt = txt.replace(s3, r3);

fs.writeFileSync('src/Scene3D.tsx', txt);
console.log('patched all createParticleMesh calls');
