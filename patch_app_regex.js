const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { CurveEditor }")) {
  code = code.replace("import { FireGenerator } from './FireGenerator';", "import { FireGenerator } from './FireGenerator';\nimport { CurveEditor } from './CurveEditor';");
}

let target1 = /<select\s+id="particle-size-over-life"\s+value=\{selectedEmitterProperties\.particleSizeOverLife\}\s+onChange=\{\(event\) => handleUpdateEmitterProperty\('particleSizeOverLife', event\.target\.value\)\}\s+>\s+<option value="none">None<\/option>\s+<option value="shrink">Shrink<\/option>\s+<option value="grow">Grow<\/option>\s+<\/select>/g;

let replace1 = `<select
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

code = code.replace(target1, replace1);

let target2 = /<input\s+id="particle-opacity-over-life"\s+type="checkbox"\s+checked=\{selectedEmitterProperties\.particleOpacityOverLife\}\s+onChange=\{\(event\) => handleUpdateEmitterProperty\('particleOpacityOverLife', event\.target\.checked\)\}\s+style=\{\{ marginRight: '8px' \}\}\s+\/>\s+Fade to Transparent/g;

let replace2 = `<input
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
                                  handleUpdateEmitterProperty('particleOpacityOverLifeCurve', '[{"x":0,"y":1},{"x":1,"y":0}]');
                                  handleUpdateEmitterProperty('particleOpacityOverLife', false);
                                } else {
                                  handleUpdateEmitterProperty('particleOpacityOverLifeCurve', '');
                                }
                              }}
                              style={{ marginRight: '8px' }}
                            />
                            Use Opacity Curve`;

code = code.replace(target2, replace2);

// Add Opacity curve editor just after the previous label is closed. Wait, my regex target2 is just the input and the text. We should add it after the closing label. Let's just find the opacity curve label and append it.
let target3 = /<label htmlFor="particle-color-over-life">/g;
let replace3 = `{(selectedEmitterProperties.particleOpacityOverLifeCurve !== undefined && selectedEmitterProperties.particleOpacityOverLifeCurve !== '') && (
                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', color: '#8a93a2', fontSize: '0.8rem' }}>Opacity Curve Target</label>
                              <CurveEditor 
                                value={selectedEmitterProperties.particleOpacityOverLifeCurve || '[{"x":0,"y":1},{"x":1,"y":0}]'}
                                onChange={(val) => handleUpdateEmitterProperty('particleOpacityOverLifeCurve', val)}
                              />
                            </div>
                          )}
                          <label htmlFor="particle-color-over-life">`;

code = code.replace(target3, replace3);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx modified");
