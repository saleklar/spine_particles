const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// replace the loops in voronoi3
code = code.replace(
    /for\(int k=-1; k<=1; k\+\+\) \{\s*for\(int j=-1; j<=1; j\+\+\) \{\s*for\(int i=-1; i<=1; i\+\+\) \{/g,
    `for(int k=0; k<=1; k++) {
        for(int j=0; j<=1; j++) {
            for(int i=0; i<=1; i++) {`
);

// We need to offset the b calculation because 0..1 means it only looks ahead, shifting the noise.
// Actually passing vec3(float(i) - 0.5) works fine.
code = code.replace(
    'vec3 b = vec3(float(i), float(j), float(k));',
    'vec3 b = vec3(float(i) - 0.5, float(j) - 0.5, float(k) - 0.5);'
);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Successfully optimized voronoi loop!');
