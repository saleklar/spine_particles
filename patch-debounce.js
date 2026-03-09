const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

const oldUseEffect =   useEffect(() => {
    try {
      localStorage.setItem('bone_gyre_project', JSON.stringify(project));
    } catch (error) {
      console.error('Failed to save project to localStorage:', error);
    }

    if (autoRenderOnChange && onExportToParticleSystem && !isRendering && prevProjectRef.current !== project) {
      prevProjectRef.current = project;
      setExportFormat('particle_system');

      const timer = setTimeout(() => {
        setIsPreviewPlaying(false);
        setIsRendering(true);
        setRenderProgress({
          currentFrame: 0,
          totalFrames: project.animation.duration,
          isRendering: true,
          renderedFrames: [],
        });
      }, 500); // debounce
      return () => clearTimeout(timer);
    }
  }, [project, autoRenderOnChange, isRendering, onExportToParticleSystem]);;

const newUseEffect =   useEffect(() => {
    try {
      localStorage.setItem('bone_gyre_project', JSON.stringify(project));
    } catch (error) {
      console.error('Failed to save project to localStorage:', error);
    }

    if (autoRenderOnChange && onExportToParticleSystem && prevProjectRef.current !== project) {
      prevProjectRef.current = project;
      setExportFormat('particle_system');

      const timer = setTimeout(() => {
        if (!isRendering) {
          setIsPreviewPlaying(false);
          setIsRendering(true);
          setRenderProgress({
            currentFrame: 0,
            totalFrames: project.animation.duration,
            isRendering: true,
            renderedFrames: [],
          });
        }
      }, 500); // debounce
      return () => clearTimeout(timer);
    }
  }, [project, autoRenderOnChange, isRendering, onExportToParticleSystem]);;

txt = txt.replace(oldUseEffect, newUseEffect);

// In case line endings are different:
const oldUseEffectCRLF = oldUseEffect.replace(/\n/g, '\r\n');
const newUseEffectCRLF = newUseEffect.replace(/\n/g, '\r\n');
txt = txt.replace(oldUseEffectCRLF, newUseEffectCRLF);

fs.writeFileSync('src/Animator3D.tsx', txt);
