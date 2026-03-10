const fs = require('fs'); let C = fs.readFileSync('src/FireHeadless.ts', 'utf8'); C = C.replace(/detail: 1\.0/g, 'detail: 1.0, alphaThreshold: 0.0'); fs.writeFileSync('src/FireHeadless.ts', C);
