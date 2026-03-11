const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const s1Match = code.indexOf('float fbm(vec3 x) {');
const e1Match = code.indexOf('float getDensity(vec3 p, float t) {');

if (s1Match !== -1 && e1Match !== -1) {
    const fixedFBM = `float fbm(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100.0);
      for (int i = 0; i < 4; ++i) {
          v += a * getNoiseVal(x);
          x = x * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }

  `;
    code = code.substring(0, s1Match) + fixedFBM + code.substring(e1Match);
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log("Restored FBM successfully!");
}
