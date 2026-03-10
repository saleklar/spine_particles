const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
code = code.replace(/\{\s*\{\s*name: 'Plasma Wisp \(Details\)'/, "{ name: 'Plasma Wisp (Details)'");
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed syntax');
