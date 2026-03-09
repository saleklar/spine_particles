const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// The embedded panels could be obscuring things. The request to organize subtabs for embedded panels will also help
txt = txt.replace(/\{embedded && <h3 style=\{\{ .*?\}\}>/g, '{embedded && <h3 style={{ margin: "0 0 16px 0", padding: "8px 12px", backgroundColor: "#333", borderBottom: "2px solid #5a5a5a", borderLeft: "4px solid #f39c12", borderRadius: "4px 4px 0 0", fontSize: "14px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px", position: "relative", zIndex: 10 }}>');

fs.writeFileSync('src/Animator3D.tsx', txt);
