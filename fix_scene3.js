const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');

// Inject flipX into Cache definitions
code = code.replace(/size: number;\n};/g, "size: number;\n  flipX?: boolean;\n};");

// Inject into spawn logic
const spawnSearch = "scene.add(particleMesh);\n                particleSystem.particles.push({";
const spawnReplace = "const particleFlipXChance = Number(emitterProps.particleHorizontalFlipChance ?? 0);\n                const flipX = Math.random() < particleFlipXChance;\n                scene.add(particleMesh);\n                particleSystem.particles.push({";
code = code.replace(spawnSearch, spawnReplace);

const setSizeSpawnOld = "setParticleSize(particleMesh, previewedSize);";
const setSizeSpawnNew = "setParticleSize(particleMesh, previewedSize, flipX);";
code = code.replace(setSizeSpawnOld, setSizeSpawnNew);

// Since my last script added \lipX,\ blindly to propertiesOld, let's fix it if flipX is out of scope. But wait, I just injected const flipX = Math... into spawn block, so now it IS in scope for particles.push()!

// BUT we need it in restoreParticleFrame too, because that also has a setParticleSize call maybe, or a particles.push()!
const restoreSearch = "scene.add(particleMesh);\n            particleSystem.particles.push({";
const restoreReplace = "const flipX = cached.flipX ?? false;\n            scene.add(particleMesh);\n            particleSystem.particles.push({";
code = code.replace(restoreSearch, restoreReplace);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed spawn definitions.');
