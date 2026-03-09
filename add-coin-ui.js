const fs = require('fs');

const path = 'src/Animator3D.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add Coin parameters UI
const coinParamsUI = `
              {project.object.geometry === 'coin' && (
                <>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Total Radius</label>
                  <input
                    type="number"
                    value={project.object.geometryParams.radiusTop ?? 50}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, radiusTop: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Rim Thickness</label>
                  <input
                    type="number"
                    value={project.object.geometryParams.coinFrameWidth ?? 10}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinFrameWidth: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Coin Depth</label>
                  <input
                    type="number"
                    value={project.object.geometryParams.coinFrameHeight ?? 20}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinFrameHeight: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Inner Shape Pattern</label>
                  <select
                    value={project.object.geometryParams.coinInnerShapePattern ?? 'star'}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapePattern: e.target.value } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  >
                    <option value="none">None</option>
                    <option value="circle">Circle</option>
                    <option value="polygon">Polygon</option>
                    <option value="star">Star</option>
                  </select>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Inner Shape Size</label>
                  <input
                    type="number"
                    value={project.object.geometryParams.coinInnerShapeSize ?? 20}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapeSize: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Inner Shape Depth</label>
                  <input
                    type="number"
                    value={project.object.geometryParams.coinInnerShapeDepth ?? 10}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapeDepth: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Inner Shape Points</label>
                  <input
                    type="number"
                    value={project.object.geometryParams.coinInnerShapePoints ?? 5}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapePoints: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                    Scene Edge Bevel: {((project.object.geometryParams.edgeBevel ?? 0) * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.005"
                    value={project.object.geometryParams.edgeBevel ?? 0.06}
                    onChange={(e) => setProject(prev => ({
                      ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevel: Number(e.target.value) } }
                    }))}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                </>
              )}
`;

content = content.replace(
  "{/* Add similar controls for other geometry types */}",
  coinParamsUI + "\n              {/* Add similar controls for other geometry types */}"
);

content = content.replace(
  "{/* Coin Presets Section */}\n              {project.object.geometry === 'cylinder' && (",
  "{/* Coin Presets Section */}\n              {(project.object.geometry === 'cylinder' || project.object.geometry === 'coin') && ("
);

// Also check bump map section 
content = content.replace(
  "project.object.geometry === 'cylinder' && project.object.bumpMapType",
  "(project.object.geometry === 'cylinder' || project.object.geometry === 'coin') && project.object.bumpMapType"
);

fs.writeFileSync(path, content);
console.log('Done!');
