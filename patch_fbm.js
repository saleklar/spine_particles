const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const badChunk = `    int octaves = (noiseType > 1.5 && noiseType < 2.5) ? 2 : 4;
    int octaves = (noiseType > 1.5 && noiseType < 2.5) ? 2 : 4;
    for (int i = 0; i < 4; ++i) {
        if (i >= octaves) break;
        if (i >= octaves) break;`;

const goodChunk = `    int octaves = (noiseType > 1.5 && noiseType < 2.5) ? 2 : 4;
    for (int i = 0; i < 4; ++i) {
        if (i >= octaves) break;`;

if (code.includes(badChunk)) {
    code = code.replace(badChunk, goodChunk);
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log("Fixed duplicates!");
} else {
    console.log("Not found precisely. Doing manual cleanup.");
    
    // Instead of precise string matching, let's locate the fbm function and clean it entirely.
}
