const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

txt = txt.replace(/border: 'none',\n\s*cursor: 'pointer',\n\s*fontSize: '11px',\n\s*textTransform: 'capitalize',/g, 
  "border: 'none',\n                cursor: 'pointer',\n                fontSize: '11px',\n                fontWeight: activePanel === panel ? 'bold' : 'normal',\n                textTransform: 'uppercase',\n                borderBottom: activePanel === panel ? '3px solid #f39c12' : '3px solid transparent',\n                color: activePanel === panel ? '#f39c12' : '#888',");

fs.writeFileSync('src/Animator3D.tsx', txt);
