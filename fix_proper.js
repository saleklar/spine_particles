const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const s1Match = code.indexOf('float hash(vec3 p) {');
const fbmIdx = code.indexOf('float fbm(vec3 x) {');

if (s1Match !== -1 && fbmIdx !== -1) {
    const fixedBlock = `float hash(vec3 p) {
    p = fract(p * vec3(12.9898, 78.233, 151.7182));
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
}

vec3 hash3(vec3 p) {
    vec3 q = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(q) * 43758.5453) * 2.0 - 1.0;
}

float vnoise3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);

    return mix(mix(mix(hash(p+vec3(0.0, 0.0, 0.0)), hash(p+vec3(1.0, 0.0, 0.0)), f.x),
                   mix(hash(p+vec3(0.0, 1.0, 0.0)), hash(p+vec3(1.0, 1.0, 0.0)), f.x), f.y),
               mix(mix(hash(p+vec3(0.0, 0.0, 1.0)), hash(p+vec3(1.0, 0.0, 1.0)), f.x),
                   mix(hash(p+vec3(0.0, 1.0, 1.0)), hash(p+vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z) * 2.0 - 1.0;
}

float voronoi3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    float res = 100.0;
    for(int k=-1; k<=1; k++) {
        for(int j=-1; j<=1; j++) {
            for(int i=-1; i<=1; i++) {
                vec3 b = vec3(float(i), float(j), float(k));
                vec3 r = vec3(b) - f + hash3(p + b);
                float d = dot(r, r);
                res = min(res, d);
            }
        }
    }
    return sqrt(res) * 2.0 - 1.0;
}

float getNoiseVal(vec3 x) {
    if (noiseType > 2.5) {
        return vnoise3(x);
    } else if (noiseType > 1.5) {
        return voronoi3(x*1.5);
    } else if (noiseType > 0.5) {
        return abs(snoise3(x)) * 2.0 - 1.0;
    } else {
        return snoise3(x);
    }
}

`;

    const newCode = code.substring(0, s1Match) + fixedBlock + code.substring(fbmIdx);
    fs.writeFileSync('src/FireGenerator.tsx', newCode);
    console.log('Fixed block successfully');
} else {
    console.log('Could not find bounds');
}
