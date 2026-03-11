const fs = require('fs');
const gen = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
const head = fs.readFileSync('src/FireHeadless.ts', 'utf8');
const startIndex = gen.indexOf('const vertexShader = \');
const endIndex = gen.indexOf('\;', startIndex) + 2;
const vertexShaderStr = gen.substring(startIndex, endIndex);

const hStart = head.indexOf('const vertexShader = \');
const hEnd = head.indexOf('\;', hStart) + 2;
const headFixed = head.substring(0, hStart) + vertexShaderStr + head.substring(hEnd);
fs.writeFileSync('src/FireHeadless.ts', headFixed);
console.log('SYNCED HEADLESS');
