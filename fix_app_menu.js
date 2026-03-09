const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /onClick=\{\(\) => setAppMode\('3d-animator'\)\}\s*type="button"\s*>/,
  \onClick={() => setAppMode('3d-animator')}
            type="button"
            style={{ backgroundColor: '#eeb868', color: '#1a1a1a', fontWeight: 'bold' }}
          >\
);

fs.writeFileSync(file, content);
