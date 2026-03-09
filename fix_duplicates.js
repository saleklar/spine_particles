const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(/particleSystem\.lastEmit = Date\.now\(\);\s+particleSystem\.spawnCount = 0;\s+particleSystem\.spawnCount = 0;/g, 'particleSystem.lastEmit = Date.now(); particleSystem.spawnCount = 0;');

fs.writeFileSync('src/Scene3D.tsx', code);
