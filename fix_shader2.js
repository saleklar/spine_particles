
const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const hash3Replacement = 'float hash(vec3 p) {\\n    p = fract(p * vec3(12.9898, 78.233, 151.7182));\\n    p += dot(p, p.yzx + 33.33);\\n    return fract((p.x + p.y) * p.z);\\n}\\n\\nvec3 hash3(vec3 p) {\\n    vec3 q = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));\\n    return fract(sin(q) * 43758.5453);\\n}';

code = code.replace(/float hash\\(vec3 p\\) \\{[\\s\\S]*?return fract\\(\\(p\\.x \\+ p\\.y\\) \\* p\\.z\\);\\r?\\n\\s*\\}/g, hash3Replacement);

code = code.replace(/vec3 r = vec3\\(b\\) - f \\+ hash\\(p \\+ b\\);/g, 'vec3 r = vec3(b) - f + hash3(p + b);');

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Done script');

