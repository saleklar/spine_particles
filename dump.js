const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
const fragMatch = code.match(/export const fragmentShader = `([\s\S]*?)`;/);
if (fragMatch) {
  fs.writeFileSync('temp_shader.glsl', fragMatch[1]);
  console.log('Shader dumped');
}
