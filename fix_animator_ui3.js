const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');
txt = txt.replace(/<input\n\s*type="checkbox"/g, '<input\n                  style={{ cursor: "pointer", pointerEvents: "auto", position: "relative", zIndex: 100 }}\n                  type="checkbox"');
fs.writeFileSync('src/Animator3D.tsx', txt);
