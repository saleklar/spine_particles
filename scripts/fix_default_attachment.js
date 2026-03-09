const fs = require('fs'); let c = fs.readFileSync('src/Scene3D.tsx', 'utf8'); c = c.replace('spineData.slots.push({ name: realSlotName, bone: boneName, attachment: \
particle\ });', 'spineData.slots.push({ name: realSlotName, bone: boneName });'); fs.writeFileSync('src/Scene3D.tsx', c); console.log('Removed default attachment');
