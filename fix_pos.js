const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
const searchStr = 'vec3 shapeDist = p;\\n          shapeDist.x += snoise3(vec3(p.y * 3.0, t * 2.0, 0.0)) * distortion * 0.2;\\n          shapeDist.z += snoise3(vec3(0.0, t * 2.0, p.y * 3.0)) * distortion * 0.2;\\n          float distFromCenter = abs(shapeDist.x) + abs(shapeDist.z)*0.5;';
const replaceStr = \ec3 shapeDist = p;
          shapeDist.x += snoise3(vec3(p.y * 3.0, t * 2.0, 0.0)) * distortion * 0.2;
          shapeDist.z += snoise3(vec3(0.0, t * 2.0, p.y * 3.0)) * distortion * 0.2;
          float distFromCenter = abs(shapeDist.x) + abs(shapeDist.z)*0.5;\;

if (c.includes(searchStr)) {
  console.log('Found literal backslash-n string');
  c = c.replace(searchStr, replaceStr);
} else {
  console.log('Not found, looking for alternative...');
}

fs.writeFileSync('src/FireGenerator.tsx', c);

