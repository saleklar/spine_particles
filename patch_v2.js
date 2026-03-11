const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const newVertexShader = `
uniform float loopProgress;
uniform float speed;
uniform float scale;
uniform float stretchX;
uniform float stretchY;
uniform float shapeType;
uniform vec3 flowDirection;
uniform vec3 rotation;
uniform vec3 rotationSpeed;
uniform float thermalBuoyancy;
uniform float distortion;
uniform float detail;
uniform bool useBlackbody;
uniform float baseTemperature;
uniform float peakTemperature;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float alphaThreshold;

varying vec3 vColor;
varying float vAlpha;

mat3 getRotationMatrix(vec3 rot) {
    float cx = cos(rot.x), sx = sin(rot.x);
    float cy = cos(rot.y), sy = sin(rot.y);
    float cz = cos(rot.z), sz = sin(rot.z);
    mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
    mat3 ry = mat3(cy, 0.0, sy, 0.0, 1.0, 0.0, -sy, 0.0, cy);
    mat3 rz = mat3(cz, -sz, 0.0, sz, cz, 0.0, 0.0, 0.0, 1.0);
    return rz * ry * rx;
}

float hash(float n) { return fract(sin(n) * 1e4); }
float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

float fbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    vec3 shift = vec3(100.0);
    for(int i=0; i<4; i++) {
        f += amp * noise(p);
        p = p * 2.01 + shift;
        amp *= 0.5;
    }
    return f;
}

float getDensity(vec3 p, float t) {
    p.y += 0.8; 
    float sx = stretchX > 0.01 ? stretchX : 1.0;
    float sy = stretchY > 0.01 ? stretchY : 1.0;
    p.x /= sx;
    p.y /= sy;
    p.z /= sx;
    
    // Convert to volume shape distance
    float radius = max(0.01, 1.2 - p.y * 0.4); 
    float d = length(p.xz) - radius; 
    
    vec3 np = p * scale * 0.5; 
    np.y -= t * speed;
    float n1 = fbm(np);
    float n2 = fbm(np * 2.0 - vec3(0.0, t * 2.0, 0.0));
    
    d += (n1 * 0.7 + n2 * 0.35) * smoothstep(0.0, 1.5, p.y + 0.5); 
    float den = smoothstep(0.6, -0.2, d);
    den *= smoothstep(-0.3, 0.5, p.y);  
    den *= smoothstep(3.5, 1.2, p.y);
    
    return den;
}

vec3 blackbody(float Temp) {
    vec3 c = vec3(255.0);
    c.x = 56100000. * pow(Temp,(-3.0 / 2.0)) + 148.0;
    c.y = 100.04 * log(Temp) - 236.0;
    if (Temp <= 6500.0) c.y = 99.47 * log(Temp) - 161.11;
    if (Temp <= 1900.0) c.y = 50.0;
    c.z = 194.18 * log(Temp) - 262.0;
    if (Temp <= 1900.0) c.z = 0.0;
    return clamp(c / 255.0, 0.0, 1.0);
}

void main() {
    vec3 instancePos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float t = loopProgress * speed * 2.5;
    float local_den = getDensity(instancePos, t);
    
    if (local_den < 0.05) {
        gl_Position = vec4(2.0, 2.0, 2.0, 0.0);
        return;
    }
    
    float temp = mix(baseTemperature, peakTemperature, local_den);
    if (useBlackbody) {
        vColor = blackbody(temp) * local_den * 2.0;
    } else {
        vec3 colMix = mix(color3, color2, smoothstep(0.0, 0.5, local_den));
        vColor = mix(colMix, color1, smoothstep(0.5, 1.0, local_den)) * local_den * 2.0;
    }
    
    vAlpha = smoothstep(alphaThreshold, alphaThreshold + 0.1, local_den);
    if (vAlpha <= 0.0) {
        gl_Position = vec4(2.0, 2.0, 2.0, 0.0);
        return;
    }
    
    vec3 scalePos = position * clamp(local_den * 1.5, 0.2, 1.0);
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(scalePos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const newFragmentShader = `
uniform float brightness;
uniform float contrast;
uniform float saturation;

varying vec3 vColor;
varying float vAlpha;

void main() {
    if (vAlpha <= 0.05) discard;
    vec3 col = vColor;
    col = col * brightness;
    col = (col - 0.5) * contrast + 0.5;
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, saturation);
    
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), vAlpha * 0.8);
}
`;

code = code.replace(/export const vertexShader = `[\s\S]*?`;/, 'export const vertexShader = `\n' + newVertexShader + '\n`;');
code = code.replace(/export const fragmentShader = `[\s\S]*?`;/, 'export const fragmentShader = `\n' + newFragmentShader + '\n`;');

code = code.replace(/const geometry = new THREE\.PlaneGeometry\(2, 2\);/, `
    const GRID_SIZE = 24;
    const SPACING = 0.2;
    const geometry = new THREE.BoxGeometry(SPACING*0.9, SPACING*0.9, SPACING*0.9);
`);

let addMeshRegex = /const mesh = new THREE\.Mesh\(geometry, material\);\s*scene\.add\(mesh\);/;
let newMeshInit = `
    const COUNT = GRID_SIZE * GRID_SIZE * GRID_SIZE;
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    
    // Add additive blending back directly onto material
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    
    let idx = 0;
    const dummy = new THREE.Object3D();
    const offset = (GRID_SIZE / 2.0) * SPACING;
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let z = 0; z < GRID_SIZE; z++) {
                dummy.position.set(x * SPACING - offset, y * SPACING - offset + 1.0, z * SPACING - offset);
                dummy.updateMatrix();
                mesh.setMatrixAt(idx++, dummy.matrix);
            }
        }
    }
    scene.add(mesh);
`;

code = code.replace(addMeshRegex, newMeshInit);

fs.writeFileSync('src/FireGenerator.tsx', code);
