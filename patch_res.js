const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(
    /resolution: 256,/g,
    'resolution: 128,'
);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Set default resolution to 128');
