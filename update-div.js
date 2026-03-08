const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

txt = txt.replace(/return \(\s*<div style={{ position: 'relative', width: '100%', height: '100%' }}>/, `return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: sceneSettings.backgroundColor }}>`);

fs.writeFileSync('src/Scene3D.tsx', txt);
