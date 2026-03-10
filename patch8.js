const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// The line is: float baseAlpha = pow(clamp(outColor.a, 0.0, 1.0), mix(1.5, 0.8, clamp(outColor.a, 0.0, 1.0)));
const re1 = /float baseAlpha = pow\(clamp\(outColor\.a, 0\.0, 1\.0\), mix\(1\.5, 0\.8, clamp\(outColor\.a, 0\.0, 1\.0\)\)\);/;
code = code.replace(re1, "float baseAlpha = pow(clamp(outColor.a, 0.0, 1.0), mix(0.7, 0.8, clamp(outColor.a, 0.0, 1.0)));");

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Fixed baseAlpha mismatch", !!code.match(/mix\(0\.7, 0\.8/));
