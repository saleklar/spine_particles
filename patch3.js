const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// Fix Top Level wrapper
txt = txt.replace(
  "height: embedded ? '100%' : '100vh',",
  "height: embedded ? 'auto' : '100vh',"
);

// Fix Left Panel header '3D Asset Creator'
txt = txt.replace(
  "<div style={{ padding: '12px', borderBottom: '1px solid #333' }}>\r\n          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>3D Asset Creator</h2>\r\n        </div>",
  "{!embedded && (\n          <div style={{ padding: '12px', borderBottom: '1px solid #333' }}>\n            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>3D Asset Creator</h2>\n          </div>\n        )}"
);
txt = txt.replace(
  "<div style={{ padding: '12px', borderBottom: '1px solid #333' }}>\n          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>3D Asset Creator</h2>\n        </div>",
  "{!embedded && (\n          <div style={{ padding: '12px', borderBottom: '1px solid #333' }}>\n            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>3D Asset Creator</h2>\n          </div>\n        )}"
);

// Fix Panel Content overflow
txt = txt.replace(
  "<div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>",
  "<div style={{ flex: 1, overflowY: embedded ? 'visible' : 'auto', padding: embedded ? '0' : '12px' }}>"
);

fs.writeFileSync('src/Animator3D.tsx', txt);
