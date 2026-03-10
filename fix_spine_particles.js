const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /const slotAnim: any = \{ rgba: \[\] as any\[\] \};/g,
  `const slotAnim: any = { rgba: [] as any[], attachment: [] as any[] };`
);

code = code.replace(
  /\/\/ Chunk history into contiguous life segments/,
  `// Chunk history into contiguous life segments
        if (history.length > 0 && history[0].frame > 0) {
            slotAnim.attachment.push({ time: 0, name: null });
        }`
);

code = code.replace(
  /\/\/ Rebirth gap invisible frame[\s\S]*?if \(i > 0 \|\| life\[0\]\.frame > 0\) \{[\s\S]*?slotAnim\.rgba\.push\(\{ time: \(life\[0\]\.frame - 1\) \/ 24, color: 'ffffff00' \}\);[\s\S]*?\}/,
  `// Rebirth gap invisible frame handling - attach
            slotAnim.attachment.push({ time: life[0].frame / 24, name: "particle" });`
);

code = code.replace(
  /\/\/ Death invisible frame[\s\S]*?const deathFrame = life\[life\.length - 1\]\.frame;[\s\S]*?slotAnim\.rgba\.push\(\{ time: \(deathFrame \+ 1\) \/ 24, color: 'ffffff00' \}\);/,
  `// Death invisible frame toggle visibility
            const deathFrame = life[life.length - 1].frame;
            slotAnim.attachment.push({ time: (deathFrame + 1) / 24, name: null });`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Patch complete!');
