const fs = require('fs');

let text = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

text = text.replace('globalWarpAmount?: number;', 'stretchX?: number;\n  stretchY?: number;');

text = text.replace('uniform float globalWarpAmount;', 'uniform float stretchX;\nuniform float stretchY;');

const getDensityRegex = /if \(globalWarpAmount > 0\.0\) \{[\s\S]*?\}\s*vec3 np = p \* scale \* 0\.5;/;
text = text.replace(getDensityRegex, 'p.x /= stretchX;\n    p.y /= stretchY;\n    vec3 np = p * scale * 0.5;');

text = text.replace('globalWarpAmount: { value: params.globalWarpAmount || 0.0 }', 'stretchX: { value: params.stretchX || 1.0 },\n          stretchY: { value: params.stretchY || 1.0 }');

text = text.replace('if(materialRef.current.uniforms.globalWarpAmount) materialRef.current.uniforms.globalWarpAmount.value = params.globalWarpAmount || 0.0;', 'if(materialRef.current.uniforms.stretchX) materialRef.current.uniforms.stretchX.value = params.stretchX || 1.0;\n      if(materialRef.current.uniforms.stretchY) materialRef.current.uniforms.stretchY.value = params.stretchY || 1.0;');

const oldUI = `<label style={{display:'block', fontSize: '12px', marginBottom:'5px'}} title="Manually warps the overall overall shape structure">Global Warp (Shape Morph)</label>
            <input type="range" min="0" max="2" step="0.05" value={params.globalWarpAmount ?? 0.0} onChange={e => setParams({...params, globalWarpAmount: parseFloat(e.target.value)})} style={{width:'100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.globalWarpAmount ?? 0.0).toFixed(2)}</div>`;
            
const newUI = `<label style={{display:'block', fontSize: '12px', marginBottom:'5px'}} title="Stretch Horizontally">Stretch X</label>
            <input type="range" min="0.1" max="5" step="0.05" value={params.stretchX ?? 1.0} onChange={e => setParams({...params, stretchX: parseFloat(e.target.value)})} style={{width: '100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.stretchX ?? 1.0).toFixed(2)}</div>
          </div>
          <div style={{marginBottom:'15px'}}>
            <label style={{display:'block', fontSize: '12px', marginBottom:'5px'}} title="Stretch Vertically">Stretch Y</label>
            <input type="range" min="0.1" max="5" step="0.05" value={params.stretchY ?? 1.0} onChange={e => setParams({...params, stretchY: parseFloat(e.target.value)})} style={{width: '100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.stretchY ?? 1.0).toFixed(2)}</div>`;

text = text.replace(oldUI, newUI);

fs.writeFileSync('src/FireGenerator.tsx', text);
console.log('done patching fire generator');

