const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');

// 1. Add flipX to Particle Type
code = code.replace(/sizeMultiplier\?: number;/g, 'sizeMultiplier?: number;\n        flipX?: boolean;');
code = code.replace(/size: number;\n}/g, 'size: number;\n    flipX?: boolean;\n}');

// 2. Add flipX to setParticleSize
const setSizeOld = "const setParticleSize = (mesh: THREE.Points | THREE.Sprite, size: number) => {";
const setSizeNew = "const setParticleSize = (mesh: THREE.Points | THREE.Sprite, size: number, flipX: boolean = false) => {";
code = code.replace(setSizeOld, setSizeNew);

const setScaleOld = "mesh.scale.set(spriteScale, spriteScale, spriteScale);";
const setScaleNew = "mesh.scale.set(flipX ? -spriteScale : spriteScale, spriteScale, spriteScale);";
code = code.replace(setScaleOld, setScaleNew);

const getParticleSizeOld = "return mesh.scale.x / 4;";
const getParticleSizeNew = "return Math.abs(mesh.scale.x) / 4;";
code = code.replace(getParticleSizeOld, getParticleSizeNew);

// 3. Inject particleHorizontalFlipChance into spawn logic
const spawnLogicOld = "const newParticle = {";
const spawnLogicNew = "const particleFlipXChance = Number(emitterProps.particleHorizontalFlipChance ?? 0);\n                  const flipX = Math.random() < particleFlipXChance;\n\n                  const newParticle = {";
code = code.replace(spawnLogicOld, spawnLogicNew);

const propertiesOld = "sizeOverLife: emitterProps.particleSizeOverLife ?? 'none',";
const propertiesNew = "sizeOverLife: emitterProps.particleSizeOverLife ?? 'none',\n                    flipX,";
code = code.replace(propertiesOld, propertiesNew);

const setSizeSpawnOld = "setParticleSize(particleMesh, previewedSize);";
const setSizeSpawnNew = "setParticleSize(particleMesh, previewedSize, flipX);";
code = code.replace(setSizeSpawnOld, setSizeSpawnNew);

// 4. Update the updateParticles loop setParticleSize calls
code = code.replace(/setParticleSize\(particle\.mesh, previewDotSize\);/g, "setParticleSize(particle.mesh, previewDotSize, particle.flipX);");
code = code.replace(/setParticleSize\(particle\.mesh, baseSize \* curveValue\);/g, "setParticleSize(particle.mesh, baseSize * curveValue, particle.flipX);");
code = code.replace(/setParticleSize\(particle\.mesh, baseSize \* \(1 - progress\)\);/g, "setParticleSize(particle.mesh, baseSize * (1 - progress), particle.flipX);");
code = code.replace(/setParticleSize\(particle\.mesh, baseSize \* \(0\.5 \+ progress \* 0\.5\)\);/g, "setParticleSize(particle.mesh, baseSize * (0.5 + progress * 0.5), particle.flipX);");
code = code.replace(/setParticleSize\(particle\.mesh, baseSize\);/g, "setParticleSize(particle.mesh, baseSize, particle.flipX);");

// 5. check for particle.mesh = replacementMesh; and fix it correctly
const repRegex = /particle\.mesh = replacementMesh;\s+setParticleSize\(particle\.mesh, getPreviewedParticleSize\(particle\.baseSize \?\? 3\), particle\.flipX\);\s+\}/g;
if (!repRegex.test(code)) {
    code = code.replace(/particle\.mesh = replacementMesh;\s*\}/g, "particle.mesh = replacementMesh;\n                    setParticleSize(particle.mesh, getPreviewedParticleSize(particle.baseSize ?? 3), particle.flipX);\n                  }");
}

// Write file
fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Scene3D fixed.');
