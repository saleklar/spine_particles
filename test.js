const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// 1. Update GeneratorParams
code = code.replace(/alphaThreshold: number;\n  \}/g, "alphaThreshold: number;\n    flowX: number;\n    flowY: number;\n    flowZ: number;\n    rotX: number;\n    rotY: number;\n    rotZ: number;\n  }");

// 2. Uniforms in fragmentShader
code = code.replace(/uniform float alphaThreshold;/g, "uniform float alphaThreshold;\n  uniform vec3 flowDirection;\n  uniform vec3 rotation;");

// 3. Rotation functions in fragmentShader
const snoiseStr = "float snoise3(vec3 v) {";
const rotationFunctions = \
  mat3 getRotationMatrix(vec3 rot) {
      float cx = cos(rot.x), sx = sin(rot.x);
      float cy = cos(rot.y), sy = sin(rot.y);
      float cz = cos(rot.z), sz = sin(rot.z);

      mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
      mat3 ry = mat3(cy, 0.0, sy, 0.0, 1.0, 0.0, -sy, 0.0, cy);
      mat3 rz = mat3(cz, -sz, 0.0, sz, cz, 0.0, 0.0, 0.0, 1.0);
      
      return rz * ry * rx;
  }
\;
code = code.replace(snoiseStr, rotationFunctions + "\\n  " + snoiseStr);

// 4. Update getDensity for flow direction
const oldDensity = \      vec3 np = p * scale * 0.5;
      np.y -= t * 1.5;\;
const newDensity = \      vec3 np = p * scale * 0.5;
      np -= flowDirection * t * 1.5;\;
code = code.replace(oldDensity, newDensity);

// 5. Update computeVolumetric for rotation
const oldCompute = \      for(int i=0; i < 50; i++) {
          vec3 p = rayOrigin + rayDir * currentT;\;
const newCompute = \      mat3 rotMat = getRotationMatrix(rotation);
      for(int i=0; i < 50; i++) {
          vec3 p = rayOrigin + rayDir * currentT;
          p = rotMat * p;\;
code = code.replace(oldCompute, newCompute);

// 6. Default parameters in saved presets
code = code.replace(/alphaThreshold: 0.0\n          \}/g, "alphaThreshold: 0.0, flowX: 0, flowY: 1, flowZ: 0, rotX: 0, rotY: 0, rotZ: 0\n          }");
code = code.replace(/alphaThreshold: 0.2\n          \}/g, "alphaThreshold: 0.2, flowX: 0, flowY: 1, flowZ: 0, rotX: 0, rotY: 0, rotZ: 0\n          }");
code = code.replace(/detail: 1.2\n          \}/g, "detail: 1.2,\n            flowX: 0, flowY: 1, flowZ: 0, rotX: 0, rotY: 0, rotZ: 0, alphaThreshold: 0.0\n          }");

// 7. Initial params default
code = code.replace(/alphaThreshold: 0.0\n      \};/g, "alphaThreshold: 0.0,\n        flowX: 0, flowY: 1, flowZ: 0,\n        rotX: 0, rotY: 0, rotZ: 0\n      };");

// 8. Uniforms initialization (first part)
const oldUniforms = \lphaThreshold: { value: 0.0 }\;
const newUniforms = \lphaThreshold: { value: 0.0 },
          flowDirection: { value: new THREE.Vector3(0, 1, 0) },
          rotation: { value: new THREE.Vector3(0, 0, 0) }\;
code = code.replace(oldUniforms, newUniforms);

// 9. Uniforms update
const oldUpdate = "materialRef.current.uniforms.alphaThreshold.value = params.alphaThreshold || 0.0;";
const newUpdate = \materialRef.current.uniforms.alphaThreshold.value = params.alphaThreshold || 0.0;
        if (!materialRef.current.uniforms.flowDirection) {
           materialRef.current.uniforms.flowDirection = { value: new THREE.Vector3(0, 1, 0) };
           materialRef.current.uniforms.rotation = { value: new THREE.Vector3(0, 0, 0) };
        }
        materialRef.current.uniforms.flowDirection.value.set(params.flowX ?? 0, params.flowY ?? 1, params.flowZ ?? 0);
        materialRef.current.uniforms.rotation.value.set(params.rotX ?? 0, params.rotY ?? 0, params.rotZ ?? 0);\;
code = code.replace(oldUpdate, newUpdate);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Update script prepared and written');
