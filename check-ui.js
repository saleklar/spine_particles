const fs=require('fs');
const lines=fs.readFileSync('src/Animator3D.tsx','utf8').split('\n');
console.log(lines.slice(1150, 1200).join('\n'));
