const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  /const handleExportSpine = \(\) => \{[\s\S]*?URL\.revokeObjectURL\(url\);\n  \};/,
  `const handleExportSpine = async () => {
    if (!scene3DRef.current) return;
    const spineData = scene3DRef.current.exportSpineData();
    if (!spineData) {
      alert("No particle cache data available. Please play the animation to cache frames first.");
      return;
    }
    
    // Download JSON
    const jsonString = JSON.stringify(spineData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'particle_export_spine.json';
    a.click();
    URL.revokeObjectURL(url);
    
    // Download texture image
    const imageBlob = await scene3DRef.current.getParticleTextureBlob();
    if (imageBlob) {
      const imgUrl = URL.createObjectURL(imageBlob);
      const imgA = document.createElement('a');
      imgA.href = imgUrl;
      imgA.download = 'particle.png';
      imgA.click();
      URL.revokeObjectURL(imgUrl);
    }
  };`
);

fs.writeFileSync('src/App.tsx', c);
console.log('Added texture download to export handler');
