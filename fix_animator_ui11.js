const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

txt = txt.replace(/style=\{\{ marginRight: '8px' \}\}/g, "");

fs.writeFileSync('src/Animator3D.tsx', txt);
