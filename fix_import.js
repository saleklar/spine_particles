const fs = require('fs'); let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8'); c = c.replace(/OrbitControls';/g, 'OrbitControls.js\';'); fs.writeFileSync('src/FireGenerator.tsx', c);
