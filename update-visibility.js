const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const hookStr = `
  useEffect(() => {
    sceneObjectMeshesRef.current.forEach((mesh) => {
      mesh.visible = sceneSettings.showObjects ?? true;
    });
  }, [sceneSettings.showObjects, sceneObjects]);

  useEffect(() => {
    particleSystemsRef.current.forEach((system) => {
      system.particles.forEach(p => {
        if (p.mesh) p.mesh.visible = sceneSettings.showParticles ?? true;
      });
    });
  }, [sceneSettings.showParticles, currentFrame]);
`;

txt = txt.replace(/(\/\/ Handle view mode changes)/, hookStr + "\n  $1");

fs.writeFileSync('src/Scene3D.tsx', txt);
