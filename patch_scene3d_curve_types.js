const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  'function evaluateCurve(curveJson, progress, defaultValue = 1) {',
  'function evaluateCurve(curveJson: string | undefined, progress: number, defaultValue: number = 1): number {'
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Patched Scene3D.tsx types");
