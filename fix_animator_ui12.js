const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

txt = txt.replace(/\{true && \(\n\s*<>\n\s*\{\/\* Panel Tabs \*\/\}/, '{!embedded && (\n          <>\n          {/* Panel Tabs */}');

txt = txt.replace(/\{\/\* 3D Viewer \*\/\}\n\s*\{true && \(/, '{/* 3D Viewer */}\n        {!embedded && (');

fs.writeFileSync('src/Animator3D.tsx', txt);
