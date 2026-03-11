const fs = require('fs');
const lines = fs.readFileSync('src/FireGenerator.tsx', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('type="range"')) {
        console.log(\Line \: \\);
    }
}
