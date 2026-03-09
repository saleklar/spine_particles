const fs = require('fs');
let c = fs.readFileSync('src/Animator3D.tsx', 'utf8');

c = c.replace(/interface Animator3DProps \{/, `interface Animator3DProps {
  autoRenderOnChange?: boolean;`);

let useEffCode = `
  useEffect(() => {
    try {
      localStorage.setItem('bone_gyre_project', JSON.stringify(project));
    } catch (error) {
      console.error('Failed to save project to localStorage:', error);
    }
  }, [project]);
`;
// we replace the useEffect
let newUseEffCode = `  const prevProjectRef = useRef(project);
  useEffect(() => {
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
  }, [project, autoRenderOnChange, isRendering, onExportToParticleSystem]);
`;

c = c.replace(useEffCode, newUseEffCode);

fs.writeFileSync('src/Animator3D.tsx', c);
console.log('Fixed Animator3D');
