
const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time:\s*0,\s*x:\s*0,\s*y:\s*0,\s*curve:\s*\
stepped\\s*\}\);/,
  \oneAnim.scale.push({ time: 0, x: 0, y: 0, curve: \stepped\ });
            boneAnim.rotate.push({ time: 0, angle: 0, curve: \stepped\ });\
);

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time:\s*Math\.max\(0,\s*\(life\[0\]\.frame\s*-\s*1\)\)\s*\/\s*24,\s*x:\s*0,\s*y:\s*0,\s*curve:\s*\stepped\\s*\}\);/,
  \oneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: \stepped\ });
              boneAnim.rotate.push({ time: Math.max(0, (life[0].frame - 1)) / 24, angle: 0, curve: \stepped\ });\
);

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time,\s*x:\s*sizeScale,\s*y:\s*sizeScale,\s*curve:\s*\linear\\s*\}\);/,
  \oneAnim.scale.push({ time, x: sizeScale, y: sizeScale, curve: \linear\ });
              boneAnim.rotate.push({ time, angle: -(state.rotation * (180 / Math.PI)), ...curveDefinition });\
);

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time:\s*\(deathFrame\s*\+\s*1\)\s*\/\s*24,\s*x:\s*0,\s*y:\s*0,\s*curve:\s*\stepped\\s*\}\);/,
  \oneAnim.scale.push({ time: (deathFrame + 1) / 24, x: 0, y: 0, curve: \stepped\ });
            boneAnim.rotate.push({ time: (deathFrame + 1) / 24, angle: 0, curve: \stepped\ });\
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Spine rotation replaced successfully!');

