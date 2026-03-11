const fs = require('fs');

const file = 'src/FireGenerator.tsx';
let txt = fs.readFileSync(file, 'utf8');

const regex = /peakTemperature:\s*\{\s*value:\s*params\.peakTemperature\s*\|\|\s*3500\s*\}/g;

if (!txt.includes('globalWarpAmount: { value: params.globalWarpAmount || 0.0 }')) {
    txt = txt.replace(regex, "peakTemperature: { value: params.peakTemperature || 3500 },\n          globalWarpAmount: { value: params.globalWarpAmount || 0.0 }");
}

fs.writeFileSync(file, txt, 'utf8');
console.log("Patched uniforms with regex in FireGenerator.tsx");
