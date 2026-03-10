
const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  'const boneAnim = { translate: [] as any[], scale: [] as any[] };',
  'const boneAnim = { translate: [] as any[], scale: [] as any[], rotate: [] as any[] };'
);

code = code.replace(
  'boneAnim.scale.push({ time: 0, x: 0, y: 0, curve: \
stepped\ });',
  'boneAnim.scale.push({ time: 0, x: 0, y: 0, curve: \stepped\ });\\n            boneAnim.rotate.push({ time: 0, angle: 0, curve: \stepped\ });'
);

code = code.replace(
  'boneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: \stepped\ });',
  'boneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: \stepped\ });\\n              boneAnim.rotate.push({ time: Math.max(0, (life[0].frame - 1)) / 24, angle: 0, curve: \stepped\ });'
);

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time,\s*x: sizeScale,\s*y: sizeScale,\s*curve: \linear\\s*\}\);/,
  'boneAnim.scale.push({ time, x: sizeScale, y: sizeScale, curve: \linear\ });\\n              boneAnim.rotate.push({ time, angle: state.rotation * (180 / Math.PI), ...curveDefinition });'
);

code = code.replace(
  'boneAnim.scale.push({ time: (deathFrame + 1) / 24, x: 0, y: 0, curve: \stepped\ });',
  'boneAnim.scale.push({ time: (deathFrame + 1) / 24, x: 0, y: 0, curve: \stepped\ });\\n            boneAnim.rotate.push({ time: (deathFrame + 1) / 24, angle: 0, curve: \stepped\ });'
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Spine rotation replaced successfully!');


