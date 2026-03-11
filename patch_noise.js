const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// 1. Update GeneratorParams
code = code.replace(
  "noiseType: 'simplex' | 'voronoi';",
  "noiseType: 'simplex' | 'voronoi' | 'cellular' | 'value';"
);

// 2. Update default params
code = code.replace(
  "noiseType: 'voronoi' as 'simplex' | 'voronoi',",
  "noiseType: 'voronoi' as 'simplex' | 'voronoi' | 'cellular' | 'value',"
);

// 3. Update uniforms object in material creation
code = code.replace(
  "noiseType: { value: params.noiseType === 'voronoi' ? 1.0 : 0.0 },",
  "noiseType: { value: params.noiseType === 'value' ? 3.0 : (params.noiseType === 'cellular' ? 2.0 : (params.noiseType === 'voronoi' ? 1.0 : 0.0)) },"
);

// 4. Update uniforms object in useEffect
code = code.replace(
  "materialRef.current.uniforms.noiseType.value = params.noiseType === 'voronoi' ? 1.0 : 0.0;",
  "materialRef.current.uniforms.noiseType.value = params.noiseType === 'value' ? 3.0 : (params.noiseType === 'cellular' ? 2.0 : (params.noiseType === 'voronoi' ? 1.0 : 0.0));"
);

// 5. Update UI Select
code = code.replace(
  "onChange={e => setParams({...params, noiseType: e.target.value as 'simplex' | 'voronoi'})}",
  "onChange={e => setParams({...params, noiseType: e.target.value as 'simplex' | 'voronoi' | 'cellular' | 'value'})}"
);
code = code.replace(
  "<option value=\"voronoi\">Voronoi (Sharp & Wispy)</option>",
  "<option value=\"voronoi\">Billow / Ridge (Sharp & Wispy)</option>\n              <option value=\"cellular\">Cellular (Bubbly / Plasma)</option>\n              <option value=\"value\">Value Noise (Blocky / Digital)</option>"
);

// 6. GLSL implementation
const glslNewNoise = `
float hash(vec3 p) {
    p = fract(p * vec3(12.9898, 78.233, 151.7182));
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
}

float vnoise3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    
    return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)), f.x),
                   mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)), f.x),
                   mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)), f.x), f.y), f.z) * 2.0 - 1.0;
}

float voronoi3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    float res = 100.0;
    for(int k=-1; k<=1; k++) {
        for(int j=-1; j<=1; j++) {
            for(int i=-1; i<=1; i++) {
                vec3 b = vec3(float(i), float(j), float(k));
                vec3 r = vec3(b) - f + hash(p + b);
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

float fbm(vec3 x) {`;

code = code.replace("float fbm(vec3 x) {", glslNewNoise);

code = code.replace(
  "v += a * snoise3(x);",
  "v += a * getNoiseVal(x);"
);

// Also use getNoiseVal for erosion, but maybe scaled to 0-1 instead of -1..1
code = code.replace(
  "float erosionNoise = snoise3(p * scale * 2.0 - vec3(0.0, t*1.5, 0.0));\n            if (noiseType > 0.5) erosionNoise = abs(erosionNoise);",
  "float erosionNoise = getNoiseVal(p * scale * 2.0 - vec3(0.0, t*1.5, 0.0));"
);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Noise patched");
