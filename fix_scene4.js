const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');

code = code.replace(/scene\.add\(particleMesh\);\s+particleSystem\.particles\.push\(\{/g, "const particleFlipXChance = Number(emitterProps.particleHorizontalFlipChance ?? 0);\n                const flipX = Math.random() < particleFlipXChance;\n                scene.add(particleMesh);\n                particleSystem.particles.push({");

fs.writeFileSync('src/Scene3D.tsx', code);
