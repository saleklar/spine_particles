const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// 1. Update uniforms in shader
code = code.replace('uniform float core;', 'uniform float coreBottom;\nuniform float coreTop;');

// 2. Update shader usage
code = code.replace('n = pow(n * gradient, core);', 'float currentCore = mix(coreBottom, coreTop, uv.y);\n    n = pow(n * gradient, currentCore);');
code = code.replace('float bn = pow(mix(bn1, (bn1 * 0.5 + n2 * 0.3 + n3 * 0.2), detail) * gradient, core);', 'float bn = pow(mix(bn1, (bn1 * 0.5 + n2 * 0.3 + n3 * 0.2), detail) * gradient, currentCore);');

// 3. Initial params
code = code.replace(/core:\s*1.5,/, 'coreBottom: 1.5,\n      coreTop: 1.0,');

// 4. Initial state fallback logic
code = code.replace('return JSON.parse(saved);', `const parsed = JSON.parse(saved);
        if (parsed.core !== undefined && parsed.coreBottom === undefined) {
          parsed.coreBottom = parsed.core;
          parsed.coreTop = parsed.core;
        } else if (parsed.coreBottom === undefined) {
          parsed.coreBottom = 1.5;
          parsed.coreTop = 1.0;
        }
        return parsed;`);

// 5. Uniforms array in ShaderMaterial
code = code.replace('core: { value: params.core },', 'coreBottom: { value: params.coreBottom },\n        coreTop: { value: params.coreTop },');

// 6. useEffect uniform updates
code = code.replace('materialRef.current.uniforms.core.value = params.core;', 'materialRef.current.uniforms.coreBottom.value = params.coreBottom;\n      materialRef.current.uniforms.coreTop.value = params.coreTop;');

const targetUI = `<div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Core Contrast (Sharpness)</span>
            <span>{params.core}</span>
          </label>
          <input type="range" min="0.1" max="5" step="0.1" value={params.core} onChange={e => setParams({...params, core: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

const newUI = `<div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Core Contrast Bottom</span>
            <span>{params.coreBottom.toFixed(2)}</span>
          </label>
          <input type="range" min="0.1" max="5" step="0.1" value={params.coreBottom} onChange={e => setParams({...params, coreBottom: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>
        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Core Contrast Top</span>
            <span>{params.coreTop.toFixed(2)}</span>
          </label>
          <input type="range" min="0.1" max="5" step="0.1" value={params.coreTop} onChange={e => setParams({...params, coreTop: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

if(code.includes('Core Contrast (Sharpness)')) {
    const rx = /<div[\s\S]*?Core Contrast \(Sharpness\)[\s\S]*?<\/div>/;
    code = code.replace(rx, newUI);
}

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Done!');
