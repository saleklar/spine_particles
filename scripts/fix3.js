const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');
c = c.replace(/spine:\s*"4\.1\.00"/, 'spine: "4.2.00"'); // Try again with correct search string
fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Hopefully fixed spine version');