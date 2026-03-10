const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(/params\.flowX\.toFixed/g, '(params.flowX || 0).toFixed');
code = code.replace(/params\.flowY\.toFixed/g, '(params.flowY || 0).toFixed');
code = code.replace(/params\.flowZ\.toFixed/g, '(params.flowZ || 0).toFixed');
code = code.replace(/params\.rotX\.toFixed/g, '(params.rotX || 0).toFixed');
code = code.replace(/params\.rotY\.toFixed/g, '(params.rotY || 0).toFixed');
code = code.replace(/params\.rotZ\.toFixed/g, '(params.rotZ || 0).toFixed');

code = code.replace(/value=\{params\.flowX\}/g, 'value={params.flowX || 0}');
code = code.replace(/value=\{params\.flowY\}/g, 'value={params.flowY || 0}');
code = code.replace(/value=\{params\.flowZ\}/g, 'value={params.flowZ || 0}');
code = code.replace(/value=\{params\.rotX\}/g, 'value={params.rotX || 0}');
code = code.replace(/value=\{params\.rotY\}/g, 'value={params.rotY || 0}');
code = code.replace(/value=\{params\.rotZ\}/g, 'value={params.rotZ || 0}');

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Made rendering bulletproof in FireGenerator');
