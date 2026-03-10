const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /const alphaFade =[\s\S]*?finalAlpha[\s\S]*?padStart\(2, '0'\);/,
  `// Used real opacity from material instead of forcing fade
              const finalAlpha = Math.floor(Math.max(0, Math.min(1, state.opacity)) * 255).toString(16).padStart(2, '0');`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Done fade fix");