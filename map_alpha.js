const fs = require('fs');

let file = 'src/FireGenerator.tsx';
let code = fs.readFileSync(file, 'utf8');

// Interface update
if (!code.includes('alphaThreshold: number;')) {
    code = code.replace(/detail: number;/, 'detail: number;\n  alphaThreshold: number;');
}

// Add state update fallback
if (!code.includes('alphaThreshold: 0.0')) {
    code = code.replace(/detail: 1\.0\s*\}/, 'detail: 1.0,\n      alphaThreshold: 0.0\n    }');
}

// Ensure uniform updates
if (!code.includes('alphaThreshold: { value: params.alphaThreshold || 0.0 }')) {
    code = code.replace(/detail: \{ value: params\.detail \}\s*\}/, 'detail: { value: params.detail },\n          alphaThreshold: { value: params.alphaThreshold || 0.0 }\n        }');
}

if (!code.includes('materialRef.current.uniforms.alphaThreshold.value')) {
    code = code.replace(/materialRef\.current\.uniforms\.detail\.value = params\.detail;/, 'materialRef.current.uniforms.detail.value = params.detail;\n      materialRef.current.uniforms.alphaThreshold.value = params.alphaThreshold || 0.0;');
}

const UI_SNIPPET = `
        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Alpha Control</span>
            <span>{(params.alphaThreshold || 0).toFixed(2)}</span>
          </label>
          <input type="range" min="0.0" max="1.5" step="0.01" value={params.alphaThreshold || 0.0} onChange={e => setParams({...params, alphaThreshold: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>
        <hr style={{ borderColor: '#333', margin: '5px 0' }} />`;

if (!code.includes('Alpha Control')) {
    code = code.replace(/<hr style=\{\{ borderColor: '#333', margin: '5px 0' \}\} \/>/, UI_SNIPPET);
}


fs.writeFileSync(file, code);
console.log('Alpha mapped');
