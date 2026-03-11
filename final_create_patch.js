const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const restoreRegex = /const previewedGlow = getPreviewedGlow\(emitterGlow\);\s*const particleMesh = createParticleMesh\([\s\S]*?undefined\r?\n\s*\);\s*const particleFlipXChance = [\s\S]*?const flipX = Math\.random\(\) < particleFlipXChance;/;

const restoreTarget = txt.match(restoreRegex);
if(restoreTarget) {
    const replacement = `const previewedGlow = getPreviewedGlow(emitterGlow);
            const particleFlipXChance = Number(emitterProps.particleHorizontalFlipChance ?? 0);
            const flipX = (cached.flipX !== undefined) ? cached.flipX : (Math.random() < particleFlipXChance);
            const pivotX = Number(emitterProps.particlePivotX ?? 0.5);
            const pivotY = Number(emitterProps.particlePivotY ?? 0.5);
            const particleMesh = createParticleMesh(
              new THREE.Vector3(cached.position.x, cached.position.y, cached.position.z),
              previewedColor,
              previewedSize,
              emitterOpacity,
              previewedType,
              previewedGlow,
              cached.rotation,
              (previewedType === 'sprites' || previewedType === '3d-model') ? restoredSpriteTexture : undefined,
              pivotX,
              pivotY,
              flipX
            );`;
    txt = txt.replace(restoreTarget[0], replacement);
    console.log("Replaced restoreLoop");
}

const spawnRegex = /const previewedGlow = getPreviewedGlow\(emitterGlow\);\s*const particleMesh = createParticleMesh\([\s\S]*?undefined\r?\n\s*\);([\s\S]*?)const particleFlipXChance = Number\(emitterProps\.particleHorizontalFlipChance \?\? 0\);\s*const flipX = Math\.random\(\) < particleFlipXChance;/;

const spawnTarget = txt.match(spawnRegex);

if(spawnTarget) {
    const midSection = spawnTarget[1];
    
    const replacement = `const previewedGlow = getPreviewedGlow(emitterGlow);
                  const particleFlipXChance = Number(emitterProps.particleHorizontalFlipChance ?? 0);
                  const flipX = Math.random() < particleFlipXChance;
                  const pivotX = Number(emitterProps.particlePivotX ?? 0.5);
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
                  );${midSection}`;
                  
    txt = txt.replace(spawnTarget[0], replacement);
    console.log("Replaced spawnLoop");
}

const replaceRegex = /const replacementMesh = createParticleMesh\([\s\S]*?undefined\r?\n\s*\);/;
const replaceTarget = txt.match(replaceRegex);

if(replaceTarget) {
    const replacement = `const pivotX = Number(emitterProps.particlePivotX ?? 0.5);
                  const pivotY = Number(emitterProps.particlePivotY ?? 0.5);
                  const replacementMesh = createParticleMesh(
                      particle.mesh.position.clone(),
                      getPreviewedParticleColor(particle.baseColor ?? '#ffffff'),
                      getPreviewedParticleSize(particle.baseSize ?? 3),
                      existingMaterial.opacity,
                      effectiveParticleType,
                      getPreviewedGlow(emitterGlow),
                      particle.rotation ?? getParticleRotation(particle.mesh),
                      (effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model') ? replacementSpriteTexture : undefined,
                      pivotX,
                      pivotY,
                      particle.flipX ?? false
                    );`;
    txt = txt.replace(replaceTarget[0], replacement);
    console.log("Replaced replaceLoop");
}

fs.writeFileSync('src/Scene3D.tsx', txt);
