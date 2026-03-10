const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add to EmiterShapeProperties
code = code.replace("particleSpriteSequenceFps?: number;", "particleSpriteSequenceFps?: number;\n      particleSpriteSequenceMode?: 'loop' | 'match-life';");

// Add to newObject default properties
code = code.replace("particleSpriteSequenceFps: 24}", "particleSpriteSequenceFps: 24, particleSpriteSequenceMode: 'loop'}");

// Add to map for selected object
code = code.replace("particleSpriteSequenceFps: Number((selectedObject.properties", "particleSpriteSequenceMode: String((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSpriteSequenceMode ?? 'loop'),\n        particleSpriteSequenceFps: Number((selectedObject.properties");

// Add UI component just after particleSpriteSequenceFps
let targetUI = `/>
                            </label>
                            
                            <label htmlFor="particle-sprite-sequence-fps">
                              Sequence FPS: {selectedEmitterProperties.particleSpriteSequenceFps ?? 12}
                            </label>
                            <input
                              id="particle-sprite-sequence-fps"
                              type="range"
                              min="1"
                              max="60"
                              step="1"
                              value={selectedEmitterProperties.particleSpriteSequenceFps ?? 12}
                              onChange={(event) => handleUpdateEmitterProperty('particleSpriteSequenceFps', Number(event.target.value))}
                            />
                          </>
                        )}`;

let replaceUI = `/>
                            </label>
                            
                            <label htmlFor="particle-sprite-sequence-fps">
                              Sequence FPS: {selectedEmitterProperties.particleSpriteSequenceFps ?? 12}
                            </label>
                            <input
                              id="particle-sprite-sequence-fps"
                              type="range"
                              min="1"
                              max="60"
                              step="1"
                              value={selectedEmitterProperties.particleSpriteSequenceFps ?? 12}
                              onChange={(event) => handleUpdateEmitterProperty('particleSpriteSequenceFps', Number(event.target.value))}
                            />
                            
                            <label htmlFor="particle-sprite-sequence-mode" style={{ marginTop: '10px' }}>
                              Sequence Playback Mode
                            </label>
                            <select
                              id="particle-sprite-sequence-mode"
                              value={selectedEmitterProperties.particleSpriteSequenceMode ?? 'loop'}
                              onChange={(event) => handleUpdateEmitterProperty('particleSpriteSequenceMode', event.target.value)}
                            >
                              <option value="loop">Loop</option>
                              <option value="match-life">Match Particle Life</option>
                            </select>
                          </>
                        )}`;

code = code.replace(targetUI, replaceUI);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched for sprite sequence mode!");
