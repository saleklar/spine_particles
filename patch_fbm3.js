const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const s1 = code.indexOf('float fbm(vec3 x) {');
const s2 = code.indexOf('return v;\n  }', s1);

if (s1 !== -1 && s2 !== -1) {
    const replacementA = `float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 4; ++i) {
        v += a * getNoiseVal(x);
        x = x * 2.0 + shift;
        a *= 0.5;
    }`;
    code = code.substring(0, s1) + replacementA + code.substring(s2 + 9);
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log("Restored FBM via substring!");
} else {
    console.log("Still failed", s1, s2);
}
