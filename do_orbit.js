const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(/const cameraRef = useRef<THREE\.OrthographicCamera \| null>\(null\);/, 
  'const cameraRef = useRef<THREE.OrthographicCamera | null>(null);\n  const perspCameraRef = useRef<THREE.PerspectiveCamera | null>(null);\n  const controlsRef = useRef<OrbitControls | null>(null);');

code = code.replace(/const camera = new THREE\.OrthographicCamera\(-1, 1, 1, -1, 0, 1\);/, 
  'const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);\n    const perspCam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);\n    perspCam.position.set(0, 0.5, 4.0);\n    perspCameraRef.current = perspCam;\n    if (renderer) {\n      const controls = new OrbitControls(perspCam, renderer.domElement);\n      controls.enableDamping = true;\n      controls.target.set(0, 0.5, 0);\n      controlsRef.current = controls;\n    }');

code = code.replace(/stretchY: \{ value: params\.stretchY \?\? 1\.0 \},/, 
  'stretchY: { value: params.stretchY ?? 1.0 },\n        cameraPos: { value: new THREE.Vector3() },\n        cameraDir: { value: new THREE.Vector3() },\n        cameraUp: { value: new THREE.Vector3() },\n        cameraRight: { value: new THREE.Vector3() },\n        fovT: { value: Math.tan(45 * 0.5 * Math.PI / 180) },\n        resolution: { value: new THREE.Vector2(1, 1) },');

code = code.replace(/renderer\.dispose\(\);\n      cancelAnimationFrame\(animationFrameId\);/g, 
  'if (controlsRef.current) controlsRef.current.dispose();\n      renderer.dispose();\n      cancelAnimationFrame(animationFrameId);');

code = code.replace(/material\.uniforms\.stretchY\.value = params\.stretchY \?\? 1\.0;/, 
  'material.uniforms.stretchY.value = params.stretchY ?? 1.0;\n      if (controlsRef.current && perspCameraRef.current) {\n        controlsRef.current.update();\n        const pCam = perspCameraRef.current;\n        material.uniforms.cameraPos.value.copy(pCam.position);\n        pCam.getWorldDirection(material.uniforms.cameraDir.value);\n        material.uniforms.cameraUp.value.copy(pCam.up).applyQuaternion(pCam.quaternion);\n        material.uniforms.cameraRight.value.crossVectors(material.uniforms.cameraDir.value, material.uniforms.cameraUp.value).normalize();\n        const canvas = renderer.domElement;\n        pCam.aspect = canvas.width / canvas.height;\n        pCam.updateProjectionMatrix();\n        material.uniforms.fovT.value = Math.tan(THREE.MathUtils.degToRad(pCam.fov * 0.5));\n        material.uniforms.resolution.value.set(canvas.width, canvas.height);\n      }');

const s1 = 'vec3 ro = vec3(0.0, 0.5, 4.0); // ray origin (backed off to see full volume)\\n    vec3 rd = normalize(vec3(uv, -1.0)); // ray direction into the screen';
const r1 = 'vec2 puv = uv;\n    puv.x *= resolution.x / resolution.y;\n    vec3 ro = cameraPos;\n    vec3 rd = normalize(cameraDir + puv.x * cameraRight * fovT + puv.y * cameraUp * fovT);';

code = code.replace(s1, r1);

const su1 = 'uniform float stretchY;\n';
const ru1 = 'uniform float stretchY;\nuniform vec3 cameraPos;\nuniform vec3 cameraDir;\nuniform vec3 cameraUp;\nuniform vec3 cameraRight;\nuniform float fovT;\nuniform vec2 resolution;\n';

code = code.replace(su1, ru1);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Script patched FireGenerator.tsx.');

