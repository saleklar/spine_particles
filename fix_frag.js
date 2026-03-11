const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
let top = fs.readFileSync('frag_top.txt', 'utf8');
let den = fs.readFileSync('frag_density.txt', 'utf8');

// I also need fbm! getDensity in old file calls fbm(np). Let's see if fbm is in top.
// Yes, fbm is in frag_top.txt usually? No, I need to check.

let m = code.match(/export const fragmentShader = `[\s\S]*?`;/);

let cPosStr = `
uniform vec3 cameraPos;
uniform vec3 cameraDir;
uniform vec3 cameraUp;
uniform vec3 cameraRight;
uniform float fovT;
uniform vec2 resolution;
`;

let mainFunc = `
void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float t = loopProgress * speed * 2.5;
    vec2 puv = uv; puv.x *= resolution.x / resolution.y;
    vec3 ro = cameraPos;
    vec3 rd = normalize(cameraDir + puv.x * cameraRight * fovT + puv.y * cameraUp * fovT);
    float max_dist = 7.0;
    float step_size = 0.04;
    float dist = max(0.0, length(ro) - 3.0);
    vec3 col = vec3(0.0);
    float alpha = 0.0;
    for(int i = 0; i < 150; i++) {
        vec3 p = ro + rd * dist;
        float local_den = getDensity(p, t);
        if(local_den > 0.005) {
            float temp = mix(baseTemperature, peakTemperature, local_den);
            vec3 emit = vec3(0.0);
            if (useBlackbody) {
                emit = blackbody(temp) * local_den * 2.0;
            } else {
                vec3 colMix = mix(color3, color2, smoothstep(0.0, 0.5, local_den));
                emit = mix(colMix, color1, smoothstep(0.5, 1.0, local_den)) * local_den * 2.0;
            }
            emit *= step_size;
            col += emit * (1.0 - alpha);
            alpha += local_den * step_size * 1.5;
            if(alpha > 0.98) { alpha = 1.0; break; }
        }
        dist += step_size;
        if(dist > max_dist) break;
    }
    gl_FragColor = vec4(col, min(alpha * 1.2, 1.0));
}
\`;`;

let newShad = 'export const fragmentShader = `\n' + top + cPosStr + den + mainFunc;
code = code.replace(/export const fragmentShader = `[\s\S]*?`;/, newShad);
fs.writeFileSync('src/FireGenerator.tsx', code);
