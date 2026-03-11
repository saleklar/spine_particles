const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

c = c.replace(/\\r\\n/g, '\r\n');

fs.writeFileSync('src/FireGenerator.tsx', c);
console.log('Fixed newlines');
