const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/try \{[\s\S]*? catch \(err\) \{/,
`try {
      const jsonString = JSON.stringify(spineData, null, 2);

      const assets = await scene3DRef.current.getExportAssets();
      const exportAssets = [];
      
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      zip.file('particle_export_spine.json', jsonString);

      if (assets && assets.length > 0) {
        for (const asset of assets) {
          zip.file(asset.name, asset.blob);
          exportAssets.push({ name: asset.name, data: await asset.blob.arrayBuffer() });
        }
      } else {
        const imageBlob = await scene3DRef.current.getParticleTextureBlob();    
        if (imageBlob) {
          zip.file('images/particles/png/particle.png', imageBlob);
          exportAssets.push({ name: 'images/particles/png/particle.png', data: await imageBlob.arrayBuffer() });
        }
      }

      if ((window as any).boneGyre2?.isElectron && (window as any).boneGyre2?.saveSpineExport) {
        const res = await (window as any).boneGyre2.saveSpineExport({ jsonString, assets: exportAssets, projectName: 'particles' });
        if (!res.success && res.error !== 'Cancelled') {
           alert("Error saving: " + res.error);
        }
        return;
      }

      // Generate trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spine_particles_export.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {`
);

fs.writeFileSync('src/App.tsx', c);
