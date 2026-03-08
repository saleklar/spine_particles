const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

txt = txt.replace(/}, \[sceneSettings\.gridOpacity\]\);/, `}, [sceneSettings.gridOpacity, sceneSettings.showGrid]);`);

txt = txt.replace(/gridHelpersRef\.current\.forEach\(\(grid\) => \{/, `gridHelpersRef.current.forEach((grid) => {
      grid.visible = sceneSettings.showGrid ?? true;`);

fs.writeFileSync('src/Scene3D.tsx', txt);
