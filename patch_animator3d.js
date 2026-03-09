const fs = require('fs');
let c = fs.readFileSync('src/Animator3D.tsx', 'utf8');

c = c.replace(/interface Animator3DProps \{\n  onExportToParticleSystem\?\: \(\(dataUrls: string\[\]\) \=\> void\);\n\}/, 
"interface Animator3DProps {\n  onExportToParticleSystem?: (dataUrls: string[]) => void;\n  autoRenderOnChange?: boolean;\n}");

let oldSig = "export function Animator3D({ onExportToParticleSystem }: Animator3DProps = {}) {";
let newSig = "export function Animator3D({ onExportToParticleSystem, autoRenderOnChange }: Animator3DProps = {}) {";
c = c.replace(oldSig, newSig);

const useEffCode = "  useEffect(() => {\n" +
"    try {\n" +
"      localStorage.setItem('bone_gyre_project', JSON.stringify(project));\n" +
"    } catch (error) {\n" +
"      console.error('Failed to save project to localStorage:', error);\n" +
"    }\n" +
"  }, [project]);";

const newUseEffCode = "  const prevProjectRef = useRef(project);\n" +
"  useEffect(() => {\n" +
"    try {\n" +
"      localStorage.setItem('bone_gyre_project', JSON.stringify(project));\n" +
"    } catch (error) {\n" +
"      console.error('Failed to save project to localStorage:', error);\n" +
"    }\n" +
"\n" +
"    if (autoRenderOnChange && onExportToParticleSystem && !isRendering && prevProjectRef.current !== project) {\n" +
"      prevProjectRef.current = project;\n" +
"      setExportFormat('particle_system');\n" +
"      \n" +
"      const timer = setTimeout(() => {\n" +
"        setIsPreviewPlaying(false);\n" +
"        setIsRendering(true);\n" +
"        setRenderProgress({\n" +
"          currentFrame: 0,\n" +
"          totalFrames: project.animation.duration,\n" +
"          isRendering: true,\n" +
"          renderedFrames: [],\n" +
"        });\n" +
"      }, 500); // debounce\n" +
"      return () => clearTimeout(timer);\n" +
"    }\n" +
"  }, [project, autoRenderOnChange, isRendering, onExportToParticleSystem]);";

c = c.replace(useEffCode, newUseEffCode);

fs.writeFileSync('src/Animator3D.tsx', c);
