const fs = require('fs');

const file = 'src/FireGenerator.tsx';
let txt = fs.readFileSync(file, 'utf8');

// remove any garbage I might have introduced
txt = txt.replace('uniform float peakTemperature; float globalWarpAmount;', 'uniform float peakTemperature;');
txt = txt.replace('uniform float peakTemperature;uniform float globalWarpAmount;', 'uniform float peakTemperature;');
txt = txt.replace('uniform float peakTemperature;\nuniform float globalWarpAmount;', 'uniform float peakTemperature;');
txt = txt.replace('uniform float peakTemperature;\r\nuniform float globalWarpAmount;', 'uniform float peakTemperature;');

// Do it right
const target = '\\nuniform float peakTemperature;';
const parts = txt.split('uniform float peakTemperature;');
if (parts.length > 1) {
    txt = parts[0] + 'uniform float peakTemperature;\nuniform float globalWarpAmount;' + parts[1];
}

fs.writeFileSync(file, txt, 'utf8');
console.log("Fixed uniform in FireGenerator.tsx");
