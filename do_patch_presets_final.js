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
    alert('Preset "' + presetName.trim() + '" saved!');
  }, [sceneObjects, selectedObjectId]);

  const handleLoadCustomPreset = useCallback((presetName: string) => {
    const props = customPresets[presetName];
    if (!props) return;
    const newEmitter: SceneObject = {
        id: '\\\mitter_\\\\',
        name: presetName,
        type: 'Emitter',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        parentId: null,
        properties: JSON.parse(JSON.stringify(props))
    };
    
    const emitterShapeNode = createEmitterShapeNode(newEmitter.id, newEmitter);
    setSceneObjects((prev) => [...prev, newEmitter, emitterShapeNode]);
    setSelectedObjectId(newEmitter.id);
  }, [customPresets, createEmitterShapeNode]);

\;

const searchStr = "const handleCreateFirePreset = useCallback(async (presetType: 'campfire' | 'torch') => {";
if (!code.includes('handleSaveCustomPreset')) {
    code = code.replace(searchStr, stateInjection + "\n  " + searchStr);
}

const uiOld = /<span>Torch<\/span>\s*<\/button>\s*<\/div>/;
const uiNew = \<span>Torch</span>
                </button>
                <div style={{ height: '1px', background: '#444', margin: '4px 0' }} />
                <button
                  className="menu-option"
                  onClick={() => {
                    handleSaveCustomPreset();
                    setShowPresetsMenu(false);
                  }}
                  type="button"
                >
                  <span style={{ color: '#4cc9f0' }}>+ Save Selected Emitter</span>
                </button>
                {Object.keys(customPresets).map((presetName) => (
                  <button
                    key={presetName}
                    className="menu-option"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      handleLoadCustomPreset(presetName);
                      setShowPresetsMenu(false);
                    }}
                    type="button"
                    title="Load Preset"
                  >
                    <span>{presetName}</span>
                    <span 
                      style={{ color: '#e76f51', marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px', borderRadius: '4px', background: 'rgba(231, 111, 81, 0.1)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete preset "' + presetName + '"?')) {
                          setCustomPresets(prev => {
                            const next = { ...prev };
                            delete next[presetName];
                            localStorage.setItem('customEmitterPresets', JSON.stringify(next));
                            return next;
                          });
                        }
                      }}
                      title="Delete Preset"
                    >✕</span>
                  </button>
                ))}
              </div>\;

code = code.replace(uiOld, uiNew);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched!');
