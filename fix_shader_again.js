const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const correctVertexShader = \xport const vertexShader = \\\
  varying vec2 vUv;
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  \\\;
\;

code = code.replace(/export const vertexShader = \[\s\S]*?gl_FragColor = vec4\(clamp\(c, 0\.0, 1\.0\), clamp\(a, 0\.0, 1\.0\)\);\\n\}\\n\s*\;/, correctVertexShader);

const correctFragmentShaderStart = \
export const fragmentShader = \\\
  uniform float loopProgress;
  uniform float speed;
  uniform float scale;
  uniform float coreBottom;
  uniform float coreTop;
  uniform float shapeType;
  uniform float brightness;
  uniform float contrast;
  uniform float saturation;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float noiseType;
  uniform float distortion;
  uniform float detail;
  uniform float alphaThreshold;
  uniform vec3 flowDirection;
  uniform vec3 rotation;
  uniform float evolveOverLife;
  uniform vec3 rotationSpeed;

  varying vec2 vUv;
\;

if (!code.includes('export const fragmentShader')) {
    code = code.replace('uniform float loopProgress;', correctFragmentShaderStart);
}

fs.writeFileSync('src/FireGenerator.tsx', code);
