const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /slotAnim\.attachment\.push\(\{ time: 0, name: null \}\);/,
  `slotAnim.attachment.push({ time: 0, name: null });
            slotAnim.rgba.push({ time: 0, color: "ffffff00", curve: "stepped" });`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Done3");