const fs = require('fs');

const shader = `export const fragmentShader = \`
uniform float loopProgress;
uniform float speed;
uniform float scale;
uniform float stretchX;
uniform float stretchY;

uniform bool useBlackbody;
uniform float baseTemperature;
uniform float peakTemperature;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;

// --- 3D Value Noise for Fluid Flow ---
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

// Fractal Brownian Motion for Turbulence 
float fbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i=0; i<4; i++) {
        f += amp * noise(p);
        p *= 2.01;
        amp *= 0.5;
    }
    return f;
}

// Realistic Temperature to Light mapping
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

// Calculates Volumetric Density at any 3D coordinate (Voxel proxy)
float getDensity(vec3 p, float t) {
    p.y += 0.8; // Move core down
    
    // Stretch and Scale Mapping
    float sx = stretchX > 0.01 ? stretchX : 1.0;
    float sy = stretchY > 0.01 ? stretchY : 1.0;
    p.x /= (sx * scale);
    p.y /= (sy * scale);
    p.z /= (sx * scale); // scale Z symmetrically to X to maintain volume
    
    // Base 3D teardrop/candle constraint
    float radius = max(0.01, 1.2 - p.y * 0.4); // Tends smaller towards top
    float d = length(p.xz) - radius; // Signed distance to column
    
    // 3D Flow Noise (Convection)
    vec3 np = p * 1.8;
    np.y -= t * 1.5; // Flow upwards
    float n1 = fbm(np);
    float n2 = fbm(np * 2.0 - vec3(0.0, t * 2.0, 0.0));
    
    // Deform the volume distance using the fluid noise 
    // Higher up (p.y) = more turbulence matching atmospheric physics
    d += (n1 * 0.7 + n2 * 0.35) * smoothstep(0.0, 1.5, p.y + 0.5); 
    
    // Convert distance field to internal density (soft edges)
    float den = smoothstep(0.6, -0.2, d);
    
    // Bound the vertical height
    den *= smoothstep(-0.3, 0.5, p.y);  // Fade at bottom
    den *= smoothstep(3.5, 1.2, p.y);   // Fade at top
    
    return den;
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float t = loopProgress * speed * 2.5;
    
    // Set up a 3D Raymarching Camera Setup
    vec3 ro = vec3(0.0, 0.5, 4.0); // ray origin (backed off to see full volume)
    vec3 rd = normalize(vec3(uv, -1.0)); // ray direction into the screen
    
    float max_dist = 7.0;
    float step_size = 0.06; // resolution of our voxels along the ray
    float dist = 0.0;
    
    vec3 col = vec3(0.0);
    float alpha = 0.0;

    // Raymarch Volumetric Accumulation Loop
    for(int i = 0; i < 70; i++) {
        vec3 p = ro + rd * dist;
        float local_den = getDensity(p, t);
        
        if(local_den > 0.005) {
            // Hotter in the denser regions
            float temp = mix(baseTemperature, peakTemperature, local_den);
            vec3 emit = vec3(0.0);
            
            if (useBlackbody) {
                emit = blackbody(temp) * local_den * 2.5;
            } else {
                vec3 colMix = mix(color3, color2, smoothstep(0.0, 0.5, local_den));
                emit = mix(colMix, color1, smoothstep(0.5, 1.0, local_den)) * local_den * 2.5;
            }
            
            // Front-to-back blending (Volume accumulation)
            emit *= step_size;
            col += emit * (1.0 - alpha);
            alpha += local_den * step_size * 2.0; // Absorb light based on density
            
            // Early exit if the pixel is fully opaque
            if(alpha > 0.98) {
                alpha = 1.0;
                break;
            }
        }
        dist += step_size;
        if(dist > max_dist) break;
    }

    gl_FragColor = vec4(col, min(alpha * 1.2, 1.0));
}
\`;

`;

let f1 = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
let pre1 = f1.substring(0, f1.indexOf('export const fragmentShader ='));
let post1 = f1.substring(f1.indexOf('export const FireGenerator'));
fs.writeFileSync('src/FireGenerator.tsx', pre1 + shader + post1);

let f2 = fs.readFileSync('src/FireHeadless.ts', 'utf8');
let pre2 = f2.substring(0, f2.indexOf('export const fragmentShader ='));
let post2 = f2.substring(f2.indexOf('export async function generateFireSequenceHeadless'));
fs.writeFileSync('src/FireHeadless.ts', pre2 + shader + post2);

console.log("3D Volumetric Raymarcher Patched successfully.");
