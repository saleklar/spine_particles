const fs = require('fs');
let txt = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

txt = txt.replace(/params\.globalWarpAmount/g, 'params.stretchX');
txt = txt.replace(/globalWarpAmount:\s*parseFloat/g, 'stretchX: parseFloat');

fs.writeFileSync('src/FireGenerator.tsx', txt);
console.log('fixed');