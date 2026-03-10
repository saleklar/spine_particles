const fs = require('fs');
const gl = require('gl')(1, 1);

const vert = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// Threejs prepends some stuff, we just want to see if the syntax is valid.
// We'll declare standard ThreeJS variables here to mock what ThreeJS adds.

let code = fs.readFileSync('temp_shader.glsl', 'utf8');

const prefix = `
precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform mat4 cameraPosition;
// ... whatever ThreeJS gives
`;

const sh = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(sh, prefix + code);
gl.compileShader(sh);

if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("SHADER ERROR:", gl.getShaderInfoLog(sh));
} else {
    console.log("SHADER COMPILED FINE");
}
