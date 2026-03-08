const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');
c = c.replace(/spine: \.4\.2\.00\./, 'spine: "4.2.00"');
fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Fixed spine version');