const fs = require('fs');

const file = 'src/FireGenerator.tsx';
let txt = fs.readFileSync(file, 'utf8');

if (!txt.includes('globalWarpAmount: { value: params.globalWarpAmount || 0.0 }')) {
    txt = txt.replace(
        'peakTemperature: { value: params.peakTemperature || 3500 }\n        },',
        'peakTemperature: { value: params.peakTemperature || 3500 },\n          globalWarpAmount: { value: params.globalWarpAmount || 0.0 }\n        },'
    );
}

if (!txt.includes('globalWarpAmount.value = params.globalWarpAmount || 0.0')) {
    txt = txt.replace(
        'materialRef.current.uniforms.peakTemperature.value = params.peakTemperature || 3500;',
        'materialRef.current.uniforms.peakTemperature.value = params.peakTemperature || 3500;\n      if(materialRef.current.uniforms.globalWarpAmount) materialRef.current.uniforms.globalWarpAmount.value = params.globalWarpAmount || 0.0;'
    );
}

fs.writeFileSync(file, txt, 'utf8');
console.log("Patched uniforms in FireGenerator.tsx");
