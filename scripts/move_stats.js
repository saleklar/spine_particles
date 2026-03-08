const fs = require('fs');

let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

c = c.replace(/stats\.dom\.style\.left = '10px';/, "stats.dom.style.right = '10px';\n    stats.dom.style.left = '';");
c = c.replace(/statsDisplay\.style\.left = '10px';/, "statsDisplay.style.right = '10px';\n    statsDisplay.style.left = '';");

fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Moved stats to right');