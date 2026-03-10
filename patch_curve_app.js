const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes("import { CurveEditor }")) {
  code = code.replace("import { FireGenerator } from './FireGenerator';", "import { FireGenerator } from './FireGenerator';\nimport { CurveEditor } from './CurveEditor';");
}

let targetSelectString = `<select
                            id="particle-size-over-life"
                            value={selectedEmitterProperties.particleSizeOverLife}
                            onChange={(event) => handleUpdateEmitterProperty('particleSizeOverLife', event.target.value)}
                          >
                            <option value="none">None</option>
                            <option value="shrink">Shrink</option>
                            <option value="grow">Grow</option>
                          </select>`;
let replaceSelectString = `<select
                            id="particle-size-over-life"
                            value={selectedEmitterProperties.particleSizeOverLife}
                            onChange={(event) => handleUpdateEmitterProperty('particleSizeOverLife', event.target.value)}
                          >
                            <option value="none">None</option>
                            <option value="shrink">Shrink</option>
                            <option value="grow">Grow</option>
                            <option value="curve">Curve</option>
                          </select>
                          
                          {selectedEmitterProperties.particleSizeOverLife === 'curve' && (
                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', color: '#8a93a2', fontSize: '0.8rem' }}>Size Curve Multiplier</label>
                              <CurveEditor 
                                value={selectedEmitterProperties.particleSizeOverLifeCurve || '[{"x":0,"y":1},{"x":1,"y":0}]'}
                                onChange={(val) => handleUpdateEmitterProperty('particleSizeOverLifeCurve', val)}
                              />
                            </div>
                          )}`;

code = code.replace(targetSelectString, replaceSelectString);

let targetOpacityString = `<label htmlFor="particle-opacity-over-life">
                            <input
                              id="particle-opacity-over-life"
                              type="checkbox"
                              checked={selectedEmitterProperties.particleOpacityOverLife}
                              onChange={(event) => handleUpdateEmitterProperty('particleOpacityOverLife', event.target.checked)}
                              style={{ marginRight: '8px' }}
                            />
                            Fade to Transparent
                          </label>`;
let replaceOpacityString = `<label htmlFor="particle-opacity-over-life">
                            <input
                              id="particle-opacity-over-life"
                              type="checkbox"
                              checked={selectedEmitterProperties.particleOpacityOverLife}
                              onChange={(event) => {
                                handleUpdateEmitterProperty('particleOpacityOverLife', event.target.checked);
                                if (event.target.checked) handleUpdateEmitterProperty('particleOpacityOverLifeCurve', '');
                              }}
                              style={{ marginRight: '8px' }}
                            />
                            Fade to Transparent
                          </label>
                          <label htmlFor="particle-opacity-use-curve" style={{ marginTop: '0.5rem' }}>
                            <input
                              id="particle-opacity-use-curve"
                              type="checkbox"
                              checked={selectedEmitterProperties.particleOpacityOverLifeCurve !== undefined && selectedEmitterProperties.particleOpacityOverLifeCurve !== ''}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  // initialize if empty
                                  handleUpdateEmitterProperty('particleOpacityOverLifeCurve', '[{"x":0,"y":1},{"x":1,"y":0}]');
                                  handleUpdateEmitterProperty('particleOpacityOverLife', false); // disable basic fade
                                } else {
                                  handleUpdateEmitterProperty('particleOpacityOverLifeCurve', '');
                                }
                              }}
                              style={{ marginRight: '8px' }}
                            />
                            Use Opacity Curve
                          </label>
                          
                          {(selectedEmitterProperties.particleOpacityOverLifeCurve !== undefined && selectedEmitterProperties.particleOpacityOverLifeCurve !== '') && (
                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', color: '#8a93a2', fontSize: '0.8rem' }}>Opacity Curve Target</label>
                              <CurveEditor 
                                value={selectedEmitterProperties.particleOpacityOverLifeCurve || '[{"x":0,"y":1},{"x":1,"y":0}]'}
                                onChange={(val) => handleUpdateEmitterProperty('particleOpacityOverLifeCurve', val)}
                              />
                            </div>
                          )}`;

code = code.replace(targetOpacityString, replaceOpacityString);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched source App");
