const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

txt = txt.replace(/}, \[sceneSettings\.showParticles, currentFrame\]\);/, '}, [sceneSettings.showParticles]);');

fs.writeFileSync('src/Scene3D.tsx', txt);
