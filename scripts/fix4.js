const fs = require('fs');

let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

c = c.replace(/spine: "4\.2\.00"/, 'spine: "4.2.43"');

c = c.replace(
  /const slotAnim = \{ color: \[\] as any\[\] \};/g,
  'const slotAnim = { rgba: [] as any[] };'
);

c = c.replace(
  /slotAnim\.color\.push\(\{ time: \(lastFrame \+ 1\) \/ 24, color: "ffffff00" \}\);/g,
  'slotAnim.rgba.push({ time: (lastFrame + 1) / 24, color: "ffffff00" });'
);

c = c.replace(
  /slotAnim\.color\.push\(\{ time: \(frame - 0\.01\) \/ 24, color: "ffffff00" \}\);/g,
  'slotAnim.rgba.push({ time: (frame - 0.01) / 24, color: "ffffff00" });'
);

c = c.replace(
  /slotAnim\.color\.push\(\{ time, color: `ffffff\$\{finalAlpha\}` \}\);/g,
  'slotAnim.rgba.push({ time, color: `ffffff${finalAlpha}` });'
);


fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Fixed Spine 4.2 rgba slot timeline');
