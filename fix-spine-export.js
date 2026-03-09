const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const handleExportSpine = async \(\) => \{[\s\S]*?  \};/;
const replacement = `const handleExportSpine = async () => {
    if (!scene3DRef.current) return;
    const spineData = scene3DRef.current.exportSpineData();
    if (!spineData) {
      alert("No particle cache data available. Please play the animation to cache frames first.");
      return;
    }

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add JSON
      const jsonString = JSON.stringify(spineData, null, 2);
      zip.file('particle_export_spine.json', jsonString);

      // Try getExportAssets first (handles sequences properly)
      const assets = await scene3DRef.current.getExportAssets();
      if (assets && assets.length > 0) {
        for (const asset of assets) {
          zip.file(asset.name, asset.blob);
        }
      } else {
        // Fallback to getParticleTextureBlob for simple particle types like dots/stars
        const imageBlob = await scene3DRef.current.getParticleTextureBlob();
        if (imageBlob) {
          zip.file('particle.png', imageBlob);
        }
      }

      // Generate trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spine_particles_export.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error creating zip export:", err);
      // Fallback
      alert("Error creating zip file. Check console.");
    }
  };`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
console.log('App.tsx handleExportSpine updated');
