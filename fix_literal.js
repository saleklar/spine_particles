const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

c = c.split('\\n').join('\n');

fs.writeFileSync('src/FireGenerator.tsx', c);
console.log('Fixed literal \\n characters');
