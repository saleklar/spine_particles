const fs = require('fs'); let C = fs.readFileSync('src/FireGenerator.tsx', 'utf8'); C = C.replace(/\\\\n/g, '\\n'); fs.writeFileSync('src/FireGenerator.tsx', C);
