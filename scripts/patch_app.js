const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  /const \[leftPanelTab, setLeftPanelTab\] = useState\<'scene' \| 'hierarchy'\>\('hierarchy'\);/,
  "const [leftPanelTab, setLeftPanelTab] = useState<'scene' | 'hierarchy' | '3d-asset'>('hierarchy');"
);

let tabsHTML = `<div className="property-tabs">
                <button
                  type="button"
                  className={leftPanelTab === 'scene' ? 'active' : ''}
                  onClick={() => setLeftPanelTab('scene')}
                >
                  Scene
                </button>
                <button
                  type="button"
                  className={leftPanelTab === 'hierarchy' ? 'active' : ''}
                  onClick={() => setLeftPanelTab('hierarchy')}
                >
                  Hierarchy
                </button>
                <button
                  type="button"
                  className={leftPanelTab === '3d-asset' ? 'active' : ''}
                  onClick={() => setLeftPanelTab('3d-asset')}
                >
                  3D Asset FX
                </button>
              </div>`;

c = c.replace(/<div className="property-tabs">[\s\S]*?<\/div>/, tabsHTML);

let newAssetTab = `              {leftPanelTab === '3d-asset' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '0.8rem', borderBottom: '1px solid #3b455c', fontSize: '0.8rem', color: '#a9b5ca', background: '#1e2430' }}>
                      Change 3D Asset settings here to automatically render and update your particle sprite sequence!
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <Animator3D 
                            embedded={true} 
                            autoRenderOnChange={true} 
                            onExportToParticleSystem={(dataUrls) => {
                                let targetId = selectedObjectId;
                                let target = sceneObjects.find(obj => obj.id === targetId && obj.type === 'Emitter');
                                if (!target) {
                                  target = sceneObjects.find(obj => obj.type === 'Emitter');
                                  targetId = target?.id || null;
                                }

                                if (targetId && target) {
                                  handleUpdateEmitterProperty('particleSpriteSequenceDataUrls', dataUrls);
                                  handleUpdateEmitterProperty('particleSpriteSequenceFirstName', 'Rendered Animation');
                                  handleUpdateEmitterProperty('particleType', 'sprites');
                                  
                                  const currentProps = target.properties;
                                  if (!currentProps?.particleSpriteSequenceFps) {
                                    handleUpdateEmitterProperty('particleSpriteSequenceFps', 24);
                                  }
                                }
                            }} 
                        />
                    </div>
                </div>
              )}`;

c = c.replace(/              \{leftPanelTab === 'scene' && \(/, newAssetTab + '\n              {leftPanelTab === \'scene\' && (');

fs.writeFileSync('src/App.tsx', c);
console.log('App embedded 3d asset tab added');
