const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// The issue might actually be the wrapping label having pointerEvents: 'none' or similar. 
// Let's rewrite the labels for checkboxes specifically to ensure they allow clicks
txt = txt.replace(/<label style=\{\{ display: 'flex', alignItems: 'center'/g, 
  "<label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 ");

fs.writeFileSync('src/Animator3D.tsx', txt);
