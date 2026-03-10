const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  'attachment: "particle"',
  'attachment: null'
).replace(
  'const boneAnim = { translate: [] as any[], scale: [] as any[] };',
  'const boneAnim = { translate: [] as any[], scale: [] as any[], rotate: [] as any[] };'
).replace(
  'const slotAnim: any = { rgba: [] as any[] };',
  'const slotAnim: any = { rgba: [] as any[], attachment: [] as any[] };'
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Replaced start chunk');