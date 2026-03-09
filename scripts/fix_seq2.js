const fs = require('fs'); let c = fs.readFileSync('src/Scene3D.tsx', 'utf8'); c = c.replace(/if \\(seqInfo && seqInfo\\.count > 0\\) \\{\\s*slotAnim\\.sequence\\.push\\(\\{\\s*time: life\\[0\\]\\.frame \\/ 24,\\s*mode: \
loop\,\\s*index: 0,\\s*delay: 1 \\/ seqInfo\\.fps\\s*\\}\\);\\s*\\}/g, ''); fs.writeFileSync('src/Scene3D.tsx', c); console.log('Fixed B');
