const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// Use regex to catch slight spacing differences
const pattern = /if \(autoRenderOnChange && onExportToParticleSystem && !isRendering && prevProjectRef\.current !== project\) \{[\s\S]*?setExportFormat\('particle_system'\);[\s\S]*?const timer = setTimeout\(\(\) => \{[\s\S]*?setIsRendering\(true\);/;

const replacement = \if (autoRenderOnChange && onExportToParticleSystem && prevProjectRef.current !== project) {
      if (isRendering) return; // Don't trigger if already rendering
      prevProjectRef.current = project;
      setExportFormat('particle_system');

      const timer = setTimeout(() => {
        setIsPreviewPlaying(false);
        setIsRendering(true);\;

txt = txt.replace(pattern, replacement);
fs.writeFileSync('src/Animator3D.tsx', txt);
