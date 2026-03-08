const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

txt = txt.replace(/sceneRef\.current\.background = new THREE\.Color\(sceneSettings\.backgroundColor\);\s*\}, \[sceneSettings\.backgroundColor\]\);/, `if (sceneSettings.referenceImage) {
      sceneRef.current.background = null;
    } else {
      sceneRef.current.background = new THREE.Color(sceneSettings.backgroundColor);
    }
  }, [sceneSettings.backgroundColor, sceneSettings.referenceImage]);`);

fs.writeFileSync('src/Scene3D.tsx', txt);
