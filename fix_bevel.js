const fs = require('fs');

// 1. Update Types
let typesCode = fs.readFileSync('src/Animator3DTypes.ts', 'utf8');
typesCode = typesCode.replace(
  /edgeBevel\?: number;\s*\/\/\s*0-0\.3[^\n]*/,
  'edgeBevel?: number;\n  edgeBevelHeight?: number;\n  edgeBevelSegments?: number;'
);
fs.writeFileSync('src/Animator3DTypes.ts', typesCode);

// 2. Update Scene3DAnimator.tsx
let sceneCode = fs.readFileSync('src/Scene3DAnimator.tsx', 'utf8');
sceneCode = sceneCode.replace(
  /const applyCylinderEdgeBevel = \([\s\S]*?targetGeometry\.computeVertexNormals\(\);\n\s*\};/,
  `const applyCylinderEdgeBevel = (targetGeometry: THREE.BufferGeometry, radiusTop: number, radiusBottom: number, height: number, edgeBevelWidth: number, edgeBevelHeight: number) => {
      const bWidth = Math.max(0, Math.min(0.25, edgeBevelWidth));
      const bHeight = Math.max(0, Math.min(0.25, edgeBevelHeight));
      if (bWidth <= 0 && bHeight <= 0) return;

      const position = targetGeometry.getAttribute('position');
      if (!position) return;

      const minRadius = Math.max(0.001, Math.min(radiusTop, radiusBottom));
      const bevelH = Math.max(0.001, height * bHeight);
      const bevelInset = Math.min(minRadius * 0.6, minRadius * bWidth * 0.9);
      const halfHeight = height / 2;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);

        const radial = Math.sqrt(x * x + z * z);
        if (radial <= 0.00001) continue;

        const distToTop = Math.abs(halfHeight - y);
        const distToBottom = Math.abs(y + halfHeight);
        const edgeDist = Math.min(distToTop, distToBottom);
        if (edgeDist > bevelH) continue;

        const t = 1 - edgeDist / bevelH;
        const smooth = t * t * (3 - 2 * t);
        const inset = bevelInset * smooth;
        const targetRadius = Math.max(0.00001, radial - inset);
        const scale = targetRadius / radial;

        position.setX(i, x * scale);
        position.setZ(i, z * scale);
      }

      position.needsUpdate = true;
      targetGeometry.computeVertexNormals();
    };`
);

sceneCode = sceneCode.replace(
  /geometry = new THREE\.CylinderGeometry\(\s*radiusTop,\s*radiusBottom,\s*height,\s*radialSegments,\s*8\s*\);\s*applyCylinderEdgeBevel\(geometry, radiusTop, radiusBottom, height, params\.edgeBevel \?\? 0\);/m,
  "geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, params.edgeBevelSegments ?? 12);\n          applyCylinderEdgeBevel(geometry, radiusTop, radiusBottom, height, params.edgeBevel ?? 0, params.edgeBevelHeight ?? (params.edgeBevel ?? 0.06));"
);

fs.writeFileSync('src/Scene3DAnimator.tsx', sceneCode);

// 3. Update Animator3D.tsx
let uiCode = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// Default params
uiCode = uiCode.replace(
  /defaultParams = \{ radiusTop: 50, radiusBottom: 50, height: 20, radialSegments: 64, edgeBevel: 0\.06 \};/,
  'defaultParams = { radiusTop: 50, radiusBottom: 50, height: 20, radialSegments: 64, edgeBevel: 0.06, edgeBevelHeight: 0.06, edgeBevelSegments: 12 };'
);

// Form
const edgeBevelSection = `
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Bevel Width</label>
                    <input
                      type="range"
                      min="0" max="0.25" step="0.01"
                      value={project.object.geometryParams.edgeBevel ?? 0.06}
                      onChange={(e) => updateProject(prev => ({
                        object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevel: Number(e.target.value) } }
                      }))}
                      style={{ width: '100%', accentColor: '#f39c12' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Bevel Height</label>
                    <input
                      type="range"
                      min="0" max="0.25" step="0.01"
                      value={project.object.geometryParams.edgeBevelHeight ?? (project.object.geometryParams.edgeBevel ?? 0.06)}
                      onChange={(e) => updateProject(prev => ({
                        object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevelHeight: Number(e.target.value) } }
                      }))}
                      style={{ width: '100%', accentColor: '#f39c12' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Bevel Segments</label>
                    <input
                      type="number"
                      min="1" max="32" step="1"
                      value={project.object.geometryParams.edgeBevelSegments ?? 12}
                      onChange={(e) => updateProject(prev => ({
                        object: { ...prev.object, geometryParams: { ...prev.object.geometryParams, edgeBevelSegments: Number(e.target.value) } }
                      }))}
                      style={{ width: '100%', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px' }}
                    />
                  </div>
                </div>`;

uiCode = uiCode.replace(
  /<label style=\{\{ display: 'block', marginBottom: '4px', fontSize: '12px' \}\}>Edge Bevel<\/label>\s*<input\s*type="range"\s*min="0" max="0\.25" step="0\.01"\s*value=\{project\.object\.geometryParams\.edgeBevel \?\? 0\.06\}\s*onChange=\{\(e\) => updateProject\(prev => \(\{\s*object: \{ \.\.\.prev\.object, geometryParams: \{ \.\.\.prev\.object\.geometryParams, edgeBevel: Number\(e\.target\.value\) \} \}\s*\}\)\)\}\s*style=\{\{ width: '100%', accentColor: '#f39c12', marginBottom: '12px' \}\}\s*\/>/m,
  edgeBevelSection
);

fs.writeFileSync('src/Animator3D.tsx', uiCode);
