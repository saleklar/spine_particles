const fs = require('fs'); let c = fs.readFileSync('src/Scene3D.tsx', 'utf8'); c = c.replace('            const firstFrame = life[0].frame;', '            const firstFrame = life[0].frame;\\n            slotAnim.attachment.push({ time: firstFrame / 24, name: \
particle\ });'); fs.writeFileSync('src/Scene3D.tsx', c); console.log('Replaced first frame');
