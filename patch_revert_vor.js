const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(
    /for\(int k=0; k<=1; k\+\+\) \{\s*for\(int j=0; j<=1; j\+\+\) \{\s*for\(int i=0; i<=1; i\+\+\) \{/g,
    `for(int k=-1; k<=1; k++) {
        for(int j=-1; j<=1; j++) {
            for(int i=-1; i<=1; i++) {`
);

code = code.replace(
    'vec3 b = vec3(float(i) - 0.5, float(j) - 0.5, float(k) - 0.5);',
    'vec3 b = vec3(float(i), float(j), float(k));'
);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Reverted voronoi loop hack');
