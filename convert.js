const fs = require('fs');
let code = fs.readFileSync('src/Animator3D.tsx', 'utf8');

code = code.replace(
  /<option value="cylinder">Cylinder<\/option>/,
  '<option value="cylinder">Cylinder</option>\n                <option value="coin">Coin (Parametric)</option>'
);

code = code.replace(
  /case 'cylinder':\s+defaultParams = \{ radiusTop: 50, radiusBottom: 50, height: 20, radialSegments: 64, edgeBevel: 0\.06 \};\s+break;/,
  \case 'cylinder':
          defaultParams = { radiusTop: 50, radiusBottom: 50, height: 20, radialSegments: 64, edgeBevel: 0.06 };
          break;
        case 'coin':
          defaultParams = { 
            radiusTop: 50, 
            radiusBottom: 50, 
            height: 20, 
            radialSegments: 64, 
            coinFrameWidth: 5, 
            coinFrameHeight: 2, 
            coinInnerShapePattern: 'star',
            coinInnerShapeSize: 20,
            coinInnerShapeDepth: 2,
            coinInnerShapePoints: 5,
            coinInnerShapeRoundness: 0
          };
          break;\
);

let formStr = \
              {project.object.geometry === 'coin' && (
                <>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Radius</label>
                  <input
                    type="number" value={project.object.geometryParams.radiusTop ?? 50}
                    onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, radiusTop: Number(e.target.value), radiusBottom: Number(e.target.value) } } }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Thickness</label>
                  <input
                    type="number" value={project.object.geometryParams.height ?? 20}
                    onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, height: Number(e.target.value) } } }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Frame Width</label>
                  <input
                    type="number" value={project.object.geometryParams.coinFrameWidth ?? 5}
                    onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinFrameWidth: Number(e.target.value) } } }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Frame Extrusion</label>
                  <input
                    type="number" value={project.object.geometryParams.coinFrameHeight ?? 2}
                    onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinFrameHeight: Number(e.target.value) } } }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  />
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Inner Shape</label>
                  <select
                    value={project.object.geometryParams.coinInnerShapePattern ?? 'star'}
                    onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapePattern: e.target.value as any } } }))}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                  >
                    <option value="none">None</option>
                    <option value="star">Star</option>
                    <option value="polygon">Polygon</option>
                    <option value="circle">Circle</option>
                  </select>
                  {project.object.geometryParams.coinInnerShapePattern && project.object.geometryParams.coinInnerShapePattern !== 'none' && (
                    <>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Shape Size</label>
                      <input
                        type="number" value={project.object.geometryParams.coinInnerShapeSize ?? 20}
                        onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapeSize: Number(e.target.value) } } }))}
                        style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                      />
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Shape Depth</label>
                      <input
                        type="number" value={project.object.geometryParams.coinInnerShapeDepth ?? 2}
                        onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapeDepth: Number(e.target.value) } } }))}
                        style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                      />
                      {(project.object.geometryParams.coinInnerShapePattern === 'star' || project.object.geometryParams.coinInnerShapePattern === 'polygon') && (
                        <>
                          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Points/Sides</label>
                          <input
                            type="number" value={project.object.geometryParams.coinInnerShapePoints ?? 5}
                            onChange={(e) => setProject(prev => ({ ...prev, object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, coinInnerShapePoints: Number(e.target.value) } } }))}
                            style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
\;

code = code.replace(
  /\{project\.object\.geometry === 'cylinder' && \(/,
  formStr + "\n              {project.object.geometry === 'cylinder' && ("
);

fs.writeFileSync('src/Animator3D.tsx', code);
console.log('UI updated');
