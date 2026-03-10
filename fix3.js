const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

c = c.replace(
  'vec3 shapeDist = p;\\n          shapeDist.x += snoise3(vec3(p.y * 3.0, t * 2.0, 0.0)) * distortion * 0.2;\\n          shapeDist.z += snoise3(vec3(0.0, t * 2.0, p.y * 3.0)) * distortion * 0.2;\\n          float distFromCenter = abs(shapeDist.x) + abs(shapeDist.z)*0.5; // flatten it a bit',
  \ec3 shapeDist = p;
          shapeDist.x += snoise3(vec3(p.y * 3.0, t * 2.0, 0.0)) * distortion * 0.2;
          shapeDist.z += snoise3(vec3(0.0, t * 2.0, p.y * 3.0)) * distortion * 0.2;
          float distFromCenter = abs(shapeDist.x) + abs(shapeDist.z)*0.5; // flatten it a bit\
);
fs.writeFileSync('src/FireGenerator.tsx', c);

