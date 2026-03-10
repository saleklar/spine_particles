const fs = require('fs'); let C = fs.readFileSync('src/FireGenerator.tsx', 'utf8'); C = C.split('\\\\n').join('\\n'); fs.writeFileSync('src/FireGenerator.tsx', C);
