const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /slotAnim\.rgba\.push\(\{ time: Math\.max\(0, \(life\[0\]\.frame - 1\)\) \/ 24, color: 'ffffff00', curve: "stepped" \}\);/,
  `slotAnim.rgba.push({ time: Math.max(0, (life[0].frame - 1)) / 24, color: 'ffffff00', curve: "stepped" });
              boneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: "stepped" });`
);

code = code.replace(
  /slotAnim\.rgba\.push\(\{ time: \(deathFrame \+ 1\) \/ 24, color: 'ffffff00', curve: "stepped" \}\);/,
  `slotAnim.rgba.push({ time: (deathFrame + 1) / 24, color: 'ffffff00', curve: "stepped" });
            boneAnim.scale.push({ time: (deathFrame + 1) / 24, x: 0, y: 0, curve: "stepped" });`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Done4");