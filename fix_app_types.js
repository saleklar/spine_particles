const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// remove duplicate lines carefully
const lines = code.split('\n');
const uniqueLines = [];
let lastLine1 = "";
let lastLine2 = "";
for (let line of lines) {
    if (line.includes('particleSizeOverLifeCurve: String(') && line === lastLine1) {
        continue;
    }
    if (line.includes('particleOpacityOverLifeCurve: String(') && line === lastLine2) {
        continue;
    }
    uniqueLines.push(line);
    if (line.includes('particleSizeOverLifeCurve: String(')) lastLine1 = line;
    if (line.includes('particleOpacityOverLifeCurve: String(')) lastLine2 = line;
}

fs.writeFileSync('src/App.tsx', uniqueLines.join('\n'));
console.log("Cleaned duplicates");
