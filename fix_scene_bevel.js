const fs = require('fs');

let code = fs.readFileSync('src/Animator3D.tsx', 'utf8');

const regex = /<label style=\{\{ display: 'block', marginBottom: '4px', fontSize: '12px' \}\}>\s*Scene Edge Bevel:.+?margin[bB]ottom: '10px' \}\}\s*\/>/s;

const newBevelUI = `<div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#4da6ff' }}>
                        Bevel Width: {((project.object.geometryParams.edgeBevel ?? 0) * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0" max="0.2" step="0.005"
                        value={project.object.geometryParams.edgeBevel ?? 0.06}
                        onChange={(e) => setProject(prev => ({
                          ...prev,
                          object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevel: Number(e.target.value) } }
                        }))}
                        style={{ width: '100%', accentColor: '#4da6ff' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#4da6ff' }}>
                        Bevel Height: {((project.object.geometryParams.edgeBevelHeight ?? project.object.geometryParams.edgeBevel ?? 0.06) * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0" max="0.2" step="0.005"
                        value={project.object.geometryParams.edgeBevelHeight ?? project.object.geometryParams.edgeBevel ?? 0.06}
                        onChange={(e) => setProject(prev => ({
                          ...prev,
                          object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevelHeight: Number(e.target.value) } }
                        }))}
                        style={{ width: '100%', accentColor: '#4da6ff' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#4da6ff' }}>
                      Bevel Segments: {project.object.geometryParams.edgeBevelSegments ?? 12}
                    </label>
                    <input
                      type="range"
                      min="1" max="32" step="1"
                      value={project.object.geometryParams.edgeBevelSegments ?? 12}
                      onChange={(e) => setProject(prev => ({
                        ...prev,
                        object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevelSegments: Number(e.target.value) } }
                      }))}
                      style={{ width: '100%', accentColor: '#4da6ff' }}
                    />
                  </div>`;

if (regex.test(code)) {
    code = code.replace(regex, newBevelUI);
    fs.writeFileSync('src/Animator3D.tsx', code);
    console.log("Successfully replaced Scene Edge Bevel block");
} else {
    console.log("Failed to match Scene Edge Bevel regex");
}
