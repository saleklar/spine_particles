const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Scene3DRef import
c = c.replace(/import \{ Scene3D \} from '\.\/Scene3D';/, `import { Scene3D, Scene3DRef } from './Scene3D';`);

// 2. Add useRef and export handler
c = c.replace(/const \[draftSize, setDraftSize\] = useState<SceneSize>\(DEFAULT_SCENE_SIZE\);/, 
`const [draftSize, setDraftSize] = useState<SceneSize>(DEFAULT_SCENE_SIZE);
  const scene3DRef = useRef<Scene3DRef>(null);

  const handleExportSpine = () => {
    if (!scene3DRef.current) return;
    const spineData = scene3DRef.current.exportSpineData();
    if (!spineData) {
      alert("No particle cache data available. Please play the animation to cache frames first.");
      return;
    }
    const jsonString = JSON.stringify(spineData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'particle_export_spine.json';
    a.click();
    URL.revokeObjectURL(url);
  };`);

// 3. Inject ref prop in <Scene3D />
c = c.replace(/<Scene3D\s+sceneSize=/, `<Scene3D\n              ref={scene3DRef}\n              sceneSize=`);

// 4. Inject Export Button
c = c.replace(/Show Particle Paths for Spine Export\s*<\/label>\s*\{\(selectedEmitterProperties\.showPathCurves\) &&/g, 
`Show Particle Paths for Spine Export
                        </label>
                        <button
                            className="properties-panel-button"
                            style={{ marginTop: '0.5rem', backgroundColor: '#eeb868', color: '#1a1a1a' }}
                            onClick={handleExportSpine}
                        >
                            Export Cached Animation to Spine JSON
                        </button>
                        {(selectedEmitterProperties.showPathCurves) &&`);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx updated successfully.');