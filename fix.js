const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const badStr = '    rotZ: number;\nuniform float coreBottom;';
const newStr = '    rotZ: number;\n  }\n\n  export interface SavedPreset {\n    name: string;\n    params: GeneratorParams;\n  }\n\n  export const vertexShader = \\n  varying vec2 vUv;\n  void main() {\n      vUv = uv;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n  \;\n\n  export const fragmentShader = \\n  uniform float loopProgress;\n  uniform float speed;\n  uniform float scale;\n  uniform float coreBottom;';

code = code.replace(badStr, newStr);
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed syntax error!');
