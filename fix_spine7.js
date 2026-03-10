const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /const curveDefinition = !isLastKey \? \{ curve: "linear" \} : \{ curve: "stepped" \};\s*slotAnim\.rgba\.push\(\{ time, color: \`ffffff\$\{finalAlpha\}\`, \.\.\.curveDefinition \}\);\s*boneAnim\.translate\.push\(\{[\s\S]*?\}\);\s*const sizeScale = Math\.max\(0\.05, state\.size \* 4\) \/ 64;\s*boneAnim\.scale\.push\(\{[\s\S]*?\}\);/m,
  `const curveDefinition = !isLastKey ? { curve: "linear" } : { curve: "stepped" };

              slotAnim.rgba.push({ time, color: \`ffffff\${finalAlpha}\`, curve: "linear" });
              
              boneAnim.translate.push({
                 time,
                 x: state.position.x * 10,
                 y: state.position.y * 10,
                 ...curveDefinition
              });

              const sizeScale = Math.max(0.05, state.size * 4) / 64;
              boneAnim.scale.push({
                 time,
                 x: sizeScale,
                 y: sizeScale,
                 curve: "linear"
              });`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed interpolation');