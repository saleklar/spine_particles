const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');
c = c.replace(
  /slotAnim\.rgba\.push\(\{ time: 0, color: "ffffff00", curve: "stepped" \}\);/,
  'slotAnim.rgba.push({ time: 0, color: "ffffff00", curve: "stepped" });\n            boneAnim.scale.push({ time: 0, x: 0, y: 0, curve: "stepped" });'
);
fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Done5');
