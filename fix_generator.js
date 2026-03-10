const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(/return parsed;/g, `
          if (parsed.flowX === undefined) parsed.flowX = 0;
          if (parsed.flowY === undefined) parsed.flowY = 1;
          if (parsed.flowZ === undefined) parsed.flowZ = 0;
          if (parsed.rotX === undefined) parsed.rotX = 0;
          if (parsed.rotY === undefined) parsed.rotY = 0;
          if (parsed.rotZ === undefined) parsed.rotZ = 0;
          return parsed;
`);

code = code.replace(/detail: 1\.0, alphaThreshold: 0\.0/g, `detail: 1.0, alphaThreshold: 0.0, flowX: 0, flowY: 1, flowZ: 0, rotX: 0, rotY: 0, rotZ: 0`);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed undefined properties in FireGenerator');
