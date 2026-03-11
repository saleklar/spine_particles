const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const anchorA = 'float fbm(vec3 x) {\n    float v = 0.0;\n    float a = 0.5;\n    vec3 shift = vec3(100.0);\n    int octaves = (noiseType > 1.5 && noiseType < 2.5) ? 2 : 4;\n    for (int i = 0; i < 4; ++i) {\n        if (i >= octaves) break;\n        v += a * getNoiseVal(x);\n        x = x * 2.0 + shift;\n        a *= 0.5;\n    }\n    return v;\n}';

const replacementA = 'float fbm(vec3 x) {\n    float v = 0.0;\n    float a = 0.5;\n    vec3 shift = vec3(100.0);\n    for (int i = 0; i < 4; ++i) {\n        v += a * getNoiseVal(x);\n        x = x * 2.0 + shift;\n        a *= 0.5;\n    }\n    return v;\n}';

if (code.includes(anchorA)) {
    code = code.replace(anchorA, replacementA);
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log("Restored FBM.");
} else {
    // If exact whitespace matching fails, do substring logic
    const s1 = code.indexOf('float fbm(vec3 x) {');
    const s2 = code.indexOf('return v;\n}', s1);
    if (s1 !== -1 && s2 !== -1) {
        code = code.substring(0, s1) + replacementA + code.substring(s2 + 11);
        fs.writeFileSync('src/FireGenerator.tsx', code);
        console.log("Restored FBM via substring.");
    } else {
        console.log("Could not find FBM");
    }
}

