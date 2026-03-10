const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace("sizeOverLife?: 'none' | 'shrink' | 'grow';", "sizeOverLife?: string;");

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Patched type");
