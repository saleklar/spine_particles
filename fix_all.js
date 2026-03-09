const fs = require('fs');

// 1. Animator3D UI
let code = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// Replace the Scene Edge Bevel block
const oldBevelUI = `<label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                    Scene Edge Bevel: {((project.object.geometryParams.edgeBevel ?? 0) * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.005"
                    value={project.object.geometryParams.edgeBevel ?? 0.06}
                    onChange={(e) => setProject(prev => ({
                      ...prev,
                      object: {
                        ...prev.object,
                        geometryParams: { ...prev.object.geometryParams, edgeBevel: Number(e.target.value) }
                      }
                    }))}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />`;

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

code = code.replace(oldBevelUI, newBevelUI);

// Replace headers colors
code = code.replace(/color: "#fff"/g, 'color: "#4da6ff"');
code = code.replace(/color: '#fff'/g, "color: '#4da6ff'");
code = code.replace(/borderLeft: "4px solid #f39c12"/g, 'borderLeft: "4px solid #4da6ff"');

fs.writeFileSync('src/Animator3D.tsx', code);

// 2. CSS Styles
let css = fs.readFileSync('src/styles.css', 'utf8');

css += `
.panel h3,
.right-panel h3,
.left-panel h3 {
  color: #4da6ff !important;
}

.property-form label {
  color: #4da6ff !important;
}

.panel label {
  color: #4da6ff !important;
}
`;

fs.writeFileSync('src/styles.css', css);

