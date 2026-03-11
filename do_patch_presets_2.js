const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = \                  <span>Torch</span>
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
                        if (confirm(\\\Delete preset "\\\"?\\\)) {
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

code = code.replace(/                  <span>Torch<\/span>\s*<\/button>\s*<\/div>/, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx replaced div.");
