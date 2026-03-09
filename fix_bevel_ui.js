const fs = require('fs');

let uiCode = fs.readFileSync('src/Animator3D.tsx', 'utf8');

const regex = /<label style=\{\{ display: 'block', marginBottom: '4px', fontSize: '12px' \}\}>\s*Scene Edge Bevel:.*?<\/label>\s*<input[^>]+value=\{project\.object\.geometryParams\.edgeBevel \?\? 0\.06\}[^>]+onChange=\{[^>]+geometryParams: \{ \.\.\.prev\.object\.geometryParams, edgeBevel: Number\(e\.target\.value\) \}[^>]+>\s*\}\)\)\}[^>]+\/>/s;

const section = `
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Bevel Width: {((project.object.geometryParams.edgeBevel ?? 0) * 100).toFixed(0)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="0.25"
                          step="0.005"
                          value={project.object.geometryParams.edgeBevel ?? 0.06}
                          onChange={(e) => setProject(prev => ({
                            ...prev,
                            object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevel: Number(e.target.value) } }
                          }))}
                          style={{ width: '100%', accentColor: '#f39c12' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Bevel Height: {((project.object.geometryParams.edgeBevelHeight ?? project.object.geometryParams.edgeBevel ?? 0) * 100).toFixed(0)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="0.25"
                          step="0.005"
                          value={project.object.geometryParams.edgeBevelHeight ?? project.object.geometryParams.edgeBevel ?? 0.06}
                          onChange={(e) => setProject(prev => ({
                            ...prev,
                            object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevelHeight: Number(e.target.value) } }
                          }))}
                          style={{ width: '100%', accentColor: '#f39c12' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Bevel Segments</label>
                        <input
                          title="Higher values give rounder bevels, lower give sharper bevels"
                          type="number"
                          min="1" max="128" step="1"
                          value={project.object.geometryParams.edgeBevelSegments ?? 12}
                          onChange={(e) => setProject(prev => ({
                            ...prev,
                            object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevelSegments: Number(e.target.value) } }
                          }))}
                          style={{ width: '100%', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px', fontSize: '12px' }}
                        />
                      </div>
                    </div>
`;

const res = uiCode.replace(regex, section);
if (res !== uiCode) {
    fs.writeFileSync('src/Animator3D.tsx', res);
    console.log("Successfully replaced edge bevel UI!");
} else {
    console.log("Could not find edge bevel UI regex.");
}
