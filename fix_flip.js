const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');
const searchString = \const replacementMesh = createParticleMesh(
                      particle.mesh.position.clone(),
                      getPreviewedParticleColor(particle.baseColor ?? '#ffffff'),
                      getPreviewedParticleSize(particle.baseSize ?? 3),
                      existingMaterial.opacity,
                      effectiveParticleType,
                      getPreviewedGlow(emitterGlow),
                      particle.rotation ?? getParticleRotation(particle.mesh),
                      (effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined
                    );
                    scene.remove(particle.mesh);
                    scene.add(replacementMesh);
                    particle.mesh = replacementMesh;
                  }

                  // Apply particle appearance updates\;

const replaceString = \const replacementMesh = createParticleMesh(
                      particle.mesh.position.clone(),
                      getPreviewedParticleColor(particle.baseColor ?? '#ffffff'),
                      getPreviewedParticleSize(particle.baseSize ?? 3),
                      existingMaterial.opacity,
                      effectiveParticleType,
                      getPreviewedGlow(emitterGlow),
                      particle.rotation ?? getParticleRotation(particle.mesh),
                      (effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined
                    );
                    scene.remove(particle.mesh);
                    scene.add(replacementMesh);
                    particle.mesh = replacementMesh;
                    setParticleSize(particle.mesh, getPreviewedParticleSize(particle.baseSize ?? 3), particle.flipX);
                  }

                  // Apply particle appearance updates\;

code = code.replace(searchString, replaceString);
fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Flipped fixed.');
