const fs = require('fs');
const gen = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
const head = fs.readFileSync('src/FireHeadless.ts', 'utf8');
const match = gen.match(/const vertexShader = \([\s\S]*?)\;/);
if (match) {
    const headMatch = head.match(/const vertexShader = \([\s\S]*?)\;/);
    if (headMatch) {
       fs.writeFileSync('src/FireHeadless.ts', head.replace(headMatch[0], 'const vertexShader = \' + match[1] + '\;'));
       console.log('SYNCED HEADLESS');
    }
}
