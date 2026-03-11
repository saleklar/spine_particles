const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(/<div style=\{\{ marginTop: '10px' \}\}>[\s\S]*?Global Warp \(Shape Morph\)[\s\S]*?<\/div>[\s\S]*?<\/div>/, 
\<div style={{ marginTop: '10px' }}>
            <label style={{display: 'block', fontSize: '12px', marginBottom:'5px'}} title="Stretch Width">Stretch X</label>
            <input type="range" min="0" max="2" step="0.05" value={params.stretchX ?? 1.0} onChange={e => setParams({...params, stretchX: parseFloat(e.target.value)})} style={{width:'100%'}}/>
          </div>\);

fs.writeFileSync('src/FireGenerator.tsx', code);

let h = fs.readFileSync('src/FireHeadless.ts', 'utf8');
h = h.replace(/globalWarpAmount: \{ value: params\.globalWarpAmount \|\| 0\.0 \},/, \stretchX: { value: params.stretchX || 1.0 },
    stretchY: { value: params.stretchY || 1.0 },\);
fs.writeFileSync('src/FireHeadless.ts', h);
console.log('Fixed stretch');
