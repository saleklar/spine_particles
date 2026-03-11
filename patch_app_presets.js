const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const stateInjection = \
    const [customPresets, setCustomPresets] = useState<Record<string, Record<string, any>>>(() => {
      try {
        const saved = localStorage.getItem('customEmitterPresets');
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        return {};
      }
    });

    const handleSaveCustomPreset = useCallback(() => {
      const selectedObj = sceneObjects.find(obj => obj.id === selectedObjectId);
      if (!selectedObj || selectedObj.type !== 'Emitter') {
        alert("Please select an Emitter object to save its preset.");
        return;
      }
      const presetName = prompt("Enter a name for the custom emitter preset (must be unique):");
      if (!presetName || presetName.trim() === '') return;
      
      const savedProps = JSON.parse(JSON.stringify(selectedObj.properties));
      setCustomPresets(prev => {
         const next = { ...prev, [presetName.trim()]: savedProps };
         localStorage.setItem('customEmitterPresets', JSON.stringify(next));
         return next;
      });
      alert('"' + presetName.trim() + '" saved to presets!');
    }, [sceneObjects, selectedObjectId]);

    const handleLoadCustomPreset = useCallback((presetName: string) => {
      const props = customPresets[presetName];
      if (!props) return;
      const newEmitter: SceneObject = {
          id: \\\mitter_\\\\,
          name: presetName,
          type: 'Emitter',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          parentId: null,
          properties: JSON.parse(JSON.stringify(props))
      };
      
      // Need createEmitterShapeNode here, but handleCreateFirePreset uses it so it's in scope later
      // But we will place it after createEmitterShapeNode definition if possible, wait!
      // This is inside App component. Let's put this right after handleCreateFirePreset instead!
    };
\;

// let's look for handleCreateFirePreset
