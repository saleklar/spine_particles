const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// Patch fbm
code = code.replace(
    'for (int i = 0; i < 4; ++i) {',
    `int octaves = (noiseType > 1.5 && noiseType < 2.5) ? 2 : 4;
    for (int i = 0; i < 4; ++i) {
        if (i >= octaves) break;`
);

// Patch computeVolumetric
const cv_search = `float tStep = 0.04;
    float tMax = 2.0;
    float currentT = 0.0;

    float T = 1.0;
    vec3 finalColor = vec3(0.0);

    for(int i=0; i < 50; i++) {`;

const cv_replace = `float tStep = (noiseType > 1.5 && noiseType < 2.5) ? 0.08 : 0.04;
    float tMax = 2.0;
    float currentT = 0.0;

    float T = 1.0;
    vec3 finalColor = vec3(0.0);

    int maxSteps = (noiseType > 1.5 && noiseType < 2.5) ? 25 : 50;
    for(int i=0; i < 50; i++) {
        if (i >= maxSteps) break;`;

code = code.replace(cv_search, cv_replace);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Successfully optimized shader constraints');
