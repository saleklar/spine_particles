const fs = require('fs');

let file = 'src/FireGenerator.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('savedPresets')) {
    // Add Preset interface
    const interfaceEnd = code.indexOf('export const vertexShader');
    let insertCode = `
export interface SavedPreset {
  name: string;
  params: GeneratorParams;
}
`;
    // We'll insert it right before vertexShader
    code = code.substring(0, interfaceEnd) + insertCode + code.substring(interfaceEnd);

    // Add state for saved presets
    const stateHook = `const [params, setParams] = useState<GeneratorParams>(() => {`;
    const stateIndex = code.indexOf(stateHook);
    
    let presetsStateCode = `
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>(() => {
    const saved = localStorage.getItem('fireGeneratorSavedPresets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        name: 'Default Campfire',
        params: {
          shapeType: 'ground',
          color1: '#ff0000', color2: '#ff6600', color3: '#ffff00',
          speed: 3.0, scale: 3.0, coreBottom: 1.5, coreTop: 1.0,
          brightness: 1.0, contrast: 1.0, saturation: 1.0,
          frames: 64, fps: 30, resolution: 128,
          noiseType: 'simplex', distortion: 2.0, detail: 1.0
        }
      },
      {
        name: 'Magic Blue Fire',
        params: {
          shapeType: 'ground',
          color1: '#0000ff', color2: '#00ffff', color3: '#ffffff',
          speed: 4.0, scale: 2.5, coreBottom: 2.0, coreTop: 1.2,
          brightness: 1.2, contrast: 1.1, saturation: 1.5,
          frames: 64, fps: 30, resolution: 128,
          noiseType: 'simplex', distortion: 2.5, detail: 1.2
        }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('fireGeneratorSavedPresets', JSON.stringify(savedPresets));
  }, [savedPresets]);

  const [presetName, setPresetName] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | ''>('');

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    const newPreset = { name: presetName.trim(), params: { ...params } };
    setSavedPresets([...savedPresets, newPreset]);
    setPresetName('');
    setSelectedPresetIndex(savedPresets.length); // the new one
  };

  const handleLoadPreset = (index: number) => {
    if (index >= 0 && index < savedPresets.length) {
      setParams(savedPresets[index].params);
      setSelectedPresetIndex(index);
    }
  };

  const handleDeletePreset = (index: number) => {
    if (confirm('Delete preset: ' + savedPresets[index].name + '?')) {
      const newPresets = [...savedPresets];
      newPresets.splice(index, 1);
      setSavedPresets(newPresets);
      if (selectedPresetIndex === index) {
        setSelectedPresetIndex('');
      } else if (typeof selectedPresetIndex === 'number' && selectedPresetIndex > index) {
        setSelectedPresetIndex(selectedPresetIndex - 1);
      }
    }
  };
`;
    code = code.substring(0, stateIndex) + presetsStateCode + code.substring(stateIndex);

    // Now for the UI
    const uiStartStr = `{!embeddedUI && <h3 style={{ margin: 0 }}>Fire Shader Generator</h3>}`;
    const uiStartIndex = code.indexOf(uiStartStr);
    
    if (uiStartIndex !== -1) {
        let uiCode = `
          {/* Presets Section */}
          <div style={{ background: '#222', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Presets</div>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
              <select 
                value={selectedPresetIndex}
                onChange={e => {
                  const val = e.target.value;
                  if (val !== '') {
                    handleLoadPreset(Number(val));
                  } else {
                    setSelectedPresetIndex('');
                  }
                }}
                style={{ flex: 1, background:'#2a2a2a', border:'1px solid #444', color:'#fff', padding:'5px' }}
              >
                <option value="">-- Load Preset --</option>
                {savedPresets.map((p, i) => (
                  <option key={i} value={i}>{p.name}</option>
                ))}
              </select>
              {typeof selectedPresetIndex === 'number' && selectedPresetIndex !== '' && (
                <button 
                  onClick={() => handleDeletePreset(selectedPresetIndex)}
                  style={{ background:'#dc3545', color:'white', border:'none', borderRadius:'3px', padding:'0 8px', cursor:'pointer' }}
                  title="Delete Preset"
                >
                  X
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                type="text" 
                placeholder="New preset name..." 
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                style={{ flex: 1, background:'#2a2a2a', border:'1px solid #444', color:'#fff', padding:'5px' }}
              />
              <button 
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                style={{ background: presetName.trim() ? '#28a745' : '#555', color:'white', border:'none', borderRadius:'3px', padding:'5px 10px', cursor: presetName.trim() ? 'pointer' : 'default' }}
              >
                Save
              </button>
            </div>
          </div>
`;
        code = code.substring(0, uiStartIndex + uiStartStr.length) + uiCode + code.substring(uiStartIndex + uiStartStr.length);
        
        fs.writeFileSync(file, code);
        console.log('Successfully added presets logic and UI to FireGenerator');
    } else {
        console.log('Could not find UI insertion point');
    }
} else {
    console.log('Presets seem to be already added');
}
