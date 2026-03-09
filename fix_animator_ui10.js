const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

txt = txt.replace(/<label style=\{\{ display: 'flex', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 , cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 , gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 \}\}>/g, 
  "<label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 110 }}>");

txt = txt.replace(/<label style=\{\{ display: 'flex', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 , cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 , gap: '8px', marginBottom: '12px', fontSize: '12px', fontWeight: 600 \}\}>/g, 
  "<label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 110 }}>");

txt = txt.replace(/<label style=\{\{ display: 'flex', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 , cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 90 , gap: '8px', marginBottom: '10px', fontSize: '12px', fontWeight: 600 \}\}>/g, 
  "<label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 110 }}>");

// Checkboxes themselves:
// <input style={{ cursor: "pointer", pointerEvents: "auto", position: "relative", zIndex: 100 }} type="checkbox"
// Add size to make them easier to click. Checkboxes in some React/Electron setups suffer if not sized properly when styled.
txt = txt.replace(/<input style=\{\{ cursor: "pointer", pointerEvents: "auto", position: "relative", zIndex: 100 \}\} type="checkbox"/g,
  '<input style={{ cursor: "pointer", pointerEvents: "auto", position: "relative", zIndex: 110, width: "16px", height: "16px", flexShrink: 0 }} type="checkbox"');


fs.writeFileSync('src/Animator3D.tsx', txt);
