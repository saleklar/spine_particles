const fs = require('fs');
const lines = fs.readFileSync('src/Animator3D.tsx', 'utf8').split('\n');
let start = lines.findIndex(l => l.includes("project.object.geometry === 'coin'"));
console.log(lines.slice(Math.max(0, start-5), Math.max(0, start+35)).join('\n'));
