const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// First update the fragment shader definition
if (!code.includes('uniform vec3 flowDirection;')) {
  code = code.replace(/uniform float alphaThreshold;/, 'uniform float alphaThreshold;\nuniform vec3 flowDirection;\nuniform vec3 rotation;');
}

if (!code.includes('mat3 getRotationMatrix(vec3 rot)')) {
  const rotMatrixStr = `
mat3 getRotationMatrix(vec3 rot) {
    float cx = cos(rot.x), sx = sin(rot.x);
    float cy = cos(rot.y), sy = sin(rot.y);
    float cz = cos(rot.z), sz = sin(rot.z);

    mat3 rx = mat3(
        1.0, 0.0, 0.0,
        0.0, cx, -sx,
        0.0, sx, cx
    );

    mat3 ry = mat3(
        cy, 0.0, sy,
        0.0, 1.0, 0.0,
        -sy, 0.0, cy
    );

    mat3 rz = mat3(
        cz, -sz, 0.0,
        sz, cz, 0.0,
        0.0, 0.0, 1.0
    );

    return rz * ry * rx;
}`;
  code = code.replace(/\/\/ --- 3D Simplex Noise ---/, rotMatrixStr + '\n\n// --- 3D Simplex Noise ---');
}

if (!code.includes('np -= flowDirection * t * 1.5;')) {
  code = code.replace(/np\.y -= t \* 1\.5;/g, 'np -= flowDirection * t * 1.5;\n    np = getRotationMatrix(rotation) * np;\n');
}

// Ensure the uniforms are initialized
const uniformInjection = `
          alphaThreshold: { value: params.alphaThreshold || 0.0 },
          flowDirection: { value: new THREE.Vector3(params.flowX || 0, params.flowY || 1.0, params.flowZ || 0) },
          rotation: { value: new THREE.Vector3(params.rotX || 0, params.rotY || 0, params.rotZ || 0) }
        },`;

if (!code.includes('flowDirection: { value: new THREE.Vector3')) {
  code = code.replace(/alphaThreshold: \{ value: params\.alphaThreshold \|\| 0\.0 \}[\s\n\r]*\},/s, uniformInjection);
}

// Ensure useEffect updates it
const updateInjection = `
        materialRef.current.uniforms.alphaThreshold.value = params.alphaThreshold || 0.0;
        if (materialRef.current.uniforms.flowDirection) {
           materialRef.current.uniforms.flowDirection.value.set(params.flowX || 0, params.flowY || 1, params.flowZ || 0);
        }
        if (materialRef.current.uniforms.rotation) {
           materialRef.current.uniforms.rotation.value.set(params.rotX || 0, params.rotY || 0, params.rotZ || 0);
        }
`;
if (!code.includes('materialRef.current.uniforms.flowDirection')) {
  code = code.replace(/materialRef\.current\.uniforms\.alphaThreshold\.value = params\.alphaThreshold \|\| 0\.0;/s, updateInjection);
}

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Shader correctly patched!');
