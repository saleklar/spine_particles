const fs = require('fs');

const file1 = 'src/FireGenerator.tsx';
let txt1 = fs.readFileSync(file1, 'utf8');

// 1. Add to interface
txt1 = txt1.replace(
  'peakTemperature?: number;\n}',
  'peakTemperature?: number;\n  globalWarpAmount?: number;\n}'
);

// 2. Add to uniform
txt1 = txt1.replace(
  'uniform float peakTemperature;\n',
  'uniform float peakTemperature;\nuniform float globalWarpAmount;\n'
);

// 3. Add to material uniforms
txt1 = txt1.replace(
  'peakTemperature: { value: currentParams.peakTemperature ?? 1500.0 }',
  'peakTemperature: { value: currentParams.peakTemperature ?? 1500.0 },\n        globalWarpAmount: { value: currentParams.globalWarpAmount ?? 0.0 }'
);

// 4. Update getDensity shader code
const getDensityStr = 'float getDensity(vec3 p, float t) {\n';
if (txt1.includes(getDensityStr)) {
  txt1 = txt1.replace(
    getDensityStr,
    `float getDensity(vec3 p, float t) {
    if (globalWarpAmount > 0.0) {
        float gw = globalWarpAmount;
        // Low frequency global warp to bend the whole shape slowly
        p.x += snoise3(p * 1.5 + vec3(0.0, t * 1.5, 12.3)) * gw;
        p.y += snoise3(p * 1.5 + vec3(45.6, -t * 1.5, 0.0)) * gw;
        p.z += snoise3(p * 1.5 + vec3(78.9, 0.0, t * 1.5)) * gw;
    }\n`
  );
} else {
    // try different spacing
    let startIdx = txt1.indexOf('float getDensity(vec3 p, float t)');
    if(startIdx !== -1) {
        let openBraceIdx = txt1.indexOf('{', startIdx);
        let part1 = txt1.substring(0, openBraceIdx + 1);
        let part2 = txt1.substring(openBraceIdx + 1);
        txt1 = part1 + `
    if (globalWarpAmount > 0.0) {
        float gw = globalWarpAmount;
        // Low frequency global warp to bend the whole shape slowly
        p.x += snoise3(p * 1.5 + vec3(0.0, t * 1.5, 12.3)) * gw;
        p.y += snoise3(p * 1.5 + vec3(45.6, -t * 1.5, 0.0)) * gw;
        p.z += snoise3(p * 1.5 + vec3(78.9, 0.0, t * 1.5)) * gw;
    }` + part2;
    } else {
        console.log("Could not find getDensity");
    }
}

// 5. Add UI in FireGenerator.tsx
const uiMarker = '<label style={{display: \'block\', fontSize: \'12px\', marginBottom:\'5px\', marginTop:\'10px\'}}>Shape Density / Detail</label>';
if (txt1.includes(uiMarker)) {
  txt1 = txt1.replace(uiMarker, `
          <div style={{ marginTop: '10px' }}>
            <label style={{display: 'block', fontSize: '12px', marginBottom:'5px'}} title="Manually warps the overall overall shape structure">Global Warp (Shape Morph)</label>
            <input type="range" min="0" max="2" step="0.05" value={params.globalWarpAmount ?? 0.0} onChange={e => setParams({...params, globalWarpAmount: parseFloat(e.target.value)})} style={{width:'100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.globalWarpAmount ?? 0.0).toFixed(2)}</div>
          </div>
          ` + uiMarker);
} else {
    // If we can't find that marker, find `detail:` which is in a slider
    const detailSliderMarker = 'value={params.detail} onChange={e => setParams({...params, detail: parseFloat(e.target.value)})}';
    let p1 = txt1.indexOf(detailSliderMarker);
    if(p1!==-1) {
        let parentDivEnd = txt1.indexOf('</div>', p1) + 6;
        let pText1 = txt1.substring(0, parentDivEnd);
        let pText2 = txt1.substring(parentDivEnd);
        txt1 = pText1 + `
          <div style={{ marginTop: '10px' }}>
            <label style={{display: 'block', fontSize: '12px', marginBottom:'5px'}} title="Manually warps the overall overall shape structure">Global Warp (Shape Morph)</label>
            <input type="range" min="0" max="2" step="0.05" value={params.globalWarpAmount ?? 0.0} onChange={e => setParams({...params, globalWarpAmount: parseFloat(e.target.value)})} style={{width:'100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.globalWarpAmount ?? 0.0).toFixed(2)}</div>
          </div>
        ` + pText2;
    } else {
        console.log("Could not find UI marker");
    }
}

fs.writeFileSync(file1, txt1, 'utf8');
console.log("Patched FireGenerator.tsx");

// Patch FireHeadless.ts as well
const file2 = 'src/FireHeadless.ts';
if (fs.existsSync(file2)) {
    let txt2 = fs.readFileSync(file2, 'utf8');
    txt2 = txt2.replace(
        'peakTemperature: { value: params.peakTemperature ?? 1500.0 }',
        'peakTemperature: { value: params.peakTemperature ?? 1500.0 },\n          globalWarpAmount: { value: params.globalWarpAmount ?? 0.0 }'
    );
    fs.writeFileSync(file2, txt2, 'utf8');
    console.log("Patched FireHeadless.ts");
}
