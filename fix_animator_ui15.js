const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

txt = txt.replace(/color: '#fff',\s*border: 'none',\s*cursor: 'pointer',\s*fontSize: '11px',\s*textTransform: 'capitalize',/g, 
  "color: activePanel === panel ? '#f39c12' : '#888',\n                border: 'none',\n                cursor: 'pointer',\n                fontSize: '11px',\n                fontWeight: activePanel === panel ? 'bold' : 'normal',\n                textTransform: 'uppercase',\n                borderBottom: activePanel === panel ? '3px solid #f39c12' : '3px solid transparent',");

fs.writeFileSync('src/Animator3D.tsx', txt);
