const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace('float width = mix(0.4, 0.05, vUv.y);', 'float width = mix(0.25, 0.02, vUv.y);');
code = code.replace('float bottomPinch = smoothstep(0.0, 0.15, vUv.y);', 'float bottomPinch = smoothstep(0.0, 0.1, vUv.y);');

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed width');
