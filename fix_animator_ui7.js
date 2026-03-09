const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// The main left panel header shouldn't be shown if embedded, so let's carefully revert just that part while keeping tabs.
txt = txt.replace(/\{true && \(\n\s*<div style=\{\{ padding: '12px', borderBottom: '1px solid #333' \}\}>\n\s*<h2 style=\{\{ margin: 0, fontSize: '16px', fontWeight: 600 \}\}>3D Asset Creator<\/h2>\n\s*<\/div>\n\s*\)\}/, '{!embedded && (\n          <div style={{ padding: "12px", borderBottom: "1px solid #333" }}>\n            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>3D Asset Creator</h2>\n          </div>\n        )}');

txt = txt.replace(/\{true && \(\n\s*<div style=\{\{ padding: '8px 12px', borderBottom: '1px solid #333' \}\}>/g, '{!embedded && (\n        <div style={{ padding: "8px 12px", borderBottom: "1px solid #333" }}>');

fs.writeFileSync('src/Animator3D.tsx', txt);
