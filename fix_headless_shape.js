const fs = require('fs');
let code = fs.readFileSync('src/FireHeadless.ts', 'utf8');

code = code.replace(/shapeType: 'ground'/g, "shapeType: 'fireball'");
fs.writeFileSync('src/FireHeadless.ts', code);
console.log('Updated FireHeadless.ts to use fireball shape');
