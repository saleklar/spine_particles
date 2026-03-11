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

vec2 hash2( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float snoise2( in vec2 p ) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2 o = vec2(m,1.0-m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash2(i+0.0)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
    return dot( n, vec3(70.0) );
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
    float t = loopProgress * speed * 4.0;
    vec2 uv = vUv;
    
    // Stretch controls width/height 
    uv -= 0.5;
    float sx = stretchX > 0.01 ? stretchX : 1.0;
    float sy = stretchY > 0.01 ? stretchY : 1.0;
    uv.x /= (sx * scale);
    uv.y /= (sy * scale);
    uv += 0.5;

    // Center pivot
    vec2 p = uv * 2.0 - 1.0;
    // Move base anchor to bottom
    p.y += 0.6;
    
    // Teardrop / Candle Flame Mask
    float taper = 1.0 - smoothstep(0.0, 2.0, p.y + 0.5);
    float d = length(vec2(p.x * (1.2 / max(taper, 0.1)), p.y));

    // Wavy physics
    float w = smoothstep(0.0, 1.5, p.y + 0.5); 
    float noise1 = snoise2(vec2(p.x * 2.5, p.y * 3.0 - t)) * 0.3;
    float noise2 = snoise2(vec2(p.x * 5.0 + t, p.y * 5.0 - t*1.5)) * 0.15;
    d += (noise1 + noise2) * w;
    
    // Structure
    float core = smoothstep(0.4, 0.0, d);
    float glow = smoothstep(1.0, 0.2, d) * 0.5;
    float intensity = clamp(glow + core, 0.0, 1.0);
    
    vec3 resultColor = vec3(0.0);
    if (useBlackbody) {
        float temp = mix(baseTemperature, peakTemperature, intensity);
        vec3 bb = blackbody(temp);
        resultColor = bb * intensity * 1.5;
    } else {
        vec3 colMix = mix(color3, color2, smoothstep(0.0, 0.5, intensity));
        resultColor = mix(colMix, color1, smoothstep(0.5, 1.0, intensity)) * intensity;
    }

    float alpha = min(intensity * 1.5, 1.0);
    gl_FragColor = vec4(resultColor, alpha);
}
\`;

`;

let f1 = fs.readFileSync('src/FireGenerator.tsx.bak', 'utf8');
let pre1 = f1.substring(0, f1.indexOf('export const fragmentShader ='));
let post1 = f1.substring(f1.indexOf('export const FireGenerator'));
fs.writeFileSync('src/FireGenerator.tsx', pre1 + shader + post1);

let f2 = fs.readFileSync('src/FireHeadless.ts.bak', 'utf8');
let pre2 = f2.substring(0, f2.indexOf('export const fragmentShader ='));
let post2 = f2.substring(f2.indexOf('export async function generateFireSequenceHeadless'));
fs.writeFileSync('src/FireHeadless.ts', pre2 + shader + post2);

console.log("Patched successfully.");