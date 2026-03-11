
const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(/vec3\(0,0,0\)/g, 'vec3(0.0, 0.0, 0.0)');
code = code.replace(/vec3\(1,0,0\)/g, 'vec3(1.0, 0.0, 0.0)');
code = code.replace(/vec3\(0,1,0\)/g, 'vec3(0.0, 1.0, 0.0)');
code = code.replace(/vec3\(1,1,0\)/g, 'vec3(1.0, 1.0, 0.0)');
code = code.replace(/vec3\(0,0,1\)/g, 'vec3(0.0, 0.0, 1.0)');
code = code.replace(/vec3\(1,0,1\)/g, 'vec3(1.0, 0.0, 1.0)');
code = code.replace(/vec3\(0,1,1\)/g, 'vec3(0.0, 1.0, 1.0)');
code = code.replace(/vec3\(1,1,1\)/g, 'vec3(1.0, 1.0, 1.0)');

code = code.replace(
  /float hash\\(vec3 p\\) \\{\\s+p = fract\\(p \\* vec3\\(12\\.9898, 78\\.233, 151\\.7182\\)\\);\\s+p \\+= dot\\(p, p\\.yzx \\+ 33\\.33\\);\\s+return fract\\(\\(p\\.x \\+ p\\.y\\) \\* p\\.z\\);\\s+\\}/g,
\loat hash(vec3 p) {
    p = fract(p * vec3(12.9898, 78.233, 151.7182));
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
}

vec3 hash3(vec3 p) {
    vec3 q = vec3(dot(p, vec3(127.1, 311.7)), dot(p, vec3(269.5, 183.3)), dot(p, vec3(113.5, 271.9)));
    return fract(sin(q) * 43758.5453);
}\
);

code = code.replace(/vec3 r = vec3\\(b\\) - f \\+ hash\\(p \\+ b\\);/g, 'vec3 r = vec3(b) - f + hash3(p + b);');

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed GLSL type errors');

