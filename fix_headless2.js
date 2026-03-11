const fs = require('fs');
let c = fs.readFileSync('src/FireHeadless.ts', 'utf8');

c = c.replace(/\\n/g, '\n');

fs.writeFileSync('src/FireHeadless.ts', c);
console.log('Fixed headless');
