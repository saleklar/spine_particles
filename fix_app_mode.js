const fs = require('fs');

// Fix App.tsx duplicates
let codeApp = fs.readFileSync('src/App.tsx', 'utf8');
const linesApp = codeApp.split('\n');
const uniqueLinesApp = [];
let m1 = "";
let m2 = "";
for (let line of linesApp) {
    if (line.includes('particleSpriteSequenceMode?:') && line === m1) continue;
    if (line.includes('particleSpriteSequenceMode: String(') && line === m2) continue;
    
    uniqueLinesApp.push(line);
    
    if (line.includes('particleSpriteSequenceMode?:')) m1 = line;
    if (line.includes('particleSpriteSequenceMode: String(')) m2 = line;
}
fs.writeFileSync('src/App.tsx', uniqueLinesApp.join('\n'));

// Fix Scene3D.tsx parameter count in memory
let codeScene = fs.readFileSync('src/Scene3D.tsx', 'utf8');
if (!codeScene.includes("mode: string = 'loop'")) {
    // try to fix manually if regex didn't catch the parameters correctly
    codeScene = codeScene.replace(/const resolveSpriteTexture = \(imageDataUrl: string, sequenceDataUrls: string\[\], age: number, fps: number = 12\) => \{/g, "const resolveSpriteTexture = (imageDataUrl: string, sequenceDataUrls: string[], age: number, fps: number = 12, mode: string = 'loop', particleLifetime: number = 1) => {");
}
fs.writeFileSync('src/Scene3D.tsx', codeScene);
console.log("Fixed duplicates and params");
