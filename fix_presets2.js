const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(/setParams\(savedPresets\[index\]\.params\);/g, `
  const p = {...savedPresets[index].params};
  if (p.flowX === undefined) p.flowX = 0;
  if (p.flowY === undefined) p.flowY = 1;
  if (p.flowZ === undefined) p.flowZ = 0;
  if (p.rotX === undefined) p.rotX = 0;
  if (p.rotY === undefined) p.rotY = 0;
  if (p.rotZ === undefined) p.rotZ = 0;
  setParams(p);
`);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed preset loading in FireGenerator');
