const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /\/\/ Rebirth gap invisible frame handling - attach\n\s*slotAnim\.attachment\.push\(\{ time: life\[0\]\.frame \/ 24, name: "particle"\ \}\);/g,
  `// Rebirth gap invisible frame handling
            if (i > 0 || life[0].frame > 0) {
              slotAnim.rgba.push({ time: Math.max(0, (life[0].frame - 1)) / 24, color: 'ffffff00', curve: "stepped" });
            }
            slotAnim.attachment.push({ time: life[0].frame / 24, name: "particle" });`
);

code = code.replace(
  /\/\/ Death invisible frame toggle visibility\n\s*const deathFrame = life\[life\.length - 1\]\.frame;\n\s*slotAnim\.attachment\.push\(\{ time: \(deathFrame \+ 1\) \/ 24, name: null \}\);/g,
  `// Death invisible frame toggle visibility
            const deathFrame = life[life.length - 1].frame;
            slotAnim.rgba.push({ time: (deathFrame + 1) / 24, color: 'ffffff00', curve: "stepped" });
            slotAnim.attachment.push({ time: (deathFrame + 1) / 24, name: null });`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Done");