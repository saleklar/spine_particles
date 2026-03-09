const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

// We want to replace ctx.fillStyle = customGlow ? grad : 'rgba(255,255,255,1)';
// with ctx.fillStyle = grad; 
// But ONLY in the 'stars' section.
// Also coreGrad: coreGrad.addColorStop(1, customGlow ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,1)');
// with coreGrad.addColorStop(1, 'rgba(255,255,255,0)');

// We can just rely on the fact that replace logic for these precise lines is predictable.

code = code.replace(/ctx\.fillStyle = customGlow \? grad \: 'rgba\(255,255,255,1\)';/g, "ctx.fillStyle = grad;");
code = code.replace(/coreGrad\.addColorStop\(1, customGlow \? 'rgba\(255,255,255,0\)' : 'rgba\(255,255,255,1\)'\);/g, "coreGrad.addColorStop(1, 'rgba(255,255,255,0)');");

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed stars in Scene3D.tsx');
