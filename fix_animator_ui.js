const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// Fix checkbox clickability
txt = txt.replace(/<input\s+type=""checkbox""/g, '<input style={{ cursor: \"pointer\", pointerEvents: \"auto\", position: \"relative\", zIndex: 100 }} type=\"checkbox\"');

// Fix embedded header styling for better segment distinction
txt = txt.replace(/\{embedded && <h3 style=\{\{ .*?\}\}>/g, '{embedded && <h3 style={{ margin: \"0 0 16px 0\", padding: \"8px 12px\", backgroundColor: \"#333\", borderBottom: \"2px solid #5a5a5a\", borderLeft: \"4px solid #f39c12\", borderRadius: \"4px 4px 0 0\", fontSize: \"14px\", color: \"#fff\", textTransform: \"uppercase\", letterSpacing: \"1px\" }}>');

// Convert embedded single columns back to a tabbed interface by ignoring embedded for the activePanel check
// The prompt said: "tab names should always be visible, so i can always switch to hierachy oe scene and back"
// This actually refers to the main App.tsx tabs. They were already fixed by earlier CSS flex changes, making the left panel scrollable rather than hiding tabs.
// Wait, the user specifically mentioned "borders between fx panel segments overall should be more visible so i can distinguish segments if needed they should be organized as sub tabs that should go for all panels that have segments".

fs.writeFileSync('src/Animator3D.tsx', txt);
