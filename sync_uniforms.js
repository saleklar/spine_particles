const fs = require('fs');

const fileSrc = 'src/FireGenerator.tsx';
const fileDst = 'src/FireHeadless.ts';

let txtSrc = fs.readFileSync(fileSrc, 'utf8');
let txtDst = fs.readFileSync(fileDst, 'utf8');

// Extract the uniforms object from FireGenerator
const uStart = txtSrc.indexOf('uniforms: {');
let openBraces = 1;
let uEnd = uStart + 'uniforms: {'.length;
while (uEnd < txtSrc.length && openBraces > 0) {
    if (txtSrc[uEnd] === '{') openBraces++;
    if (txtSrc[uEnd] === '}') openBraces--;
    uEnd++;
}
const uniformsBlock = txtSrc.substring(uStart, uEnd);

// Replace "currentParams" with "params" in the block
let newUniformsBlock = uniformsBlock.replace(/currentParams\./g, 'params.');

// Now replace the uniforms object in FireHeadless
const dStart = txtDst.indexOf('uniforms: {');
let dOpenBraces = 1;
let dEnd = dStart + 'uniforms: {'.length;
while (dEnd < txtDst.length && dOpenBraces > 0) {
    if (txtDst[dEnd] === '{') dOpenBraces++;
    if (txtDst[dEnd] === '}') dOpenBraces--;
    dEnd++;
}

txtDst = txtDst.substring(0, dStart) + newUniformsBlock + txtDst.substring(dEnd);

fs.writeFileSync(fileDst, txtDst, 'utf8');
console.log("Copied uniforms from FireGenerator.tsx to FireHeadless.ts");
