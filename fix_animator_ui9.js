const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

txt = txt.replace(/<label style=\{\{ display: 'block', marginBottom: '8px', fontSize: '12px' \}\}>/g, 
  "<label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 110 }}>");

fs.writeFileSync('src/Animator3D.tsx', txt);
