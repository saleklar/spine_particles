const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const targetStr = `        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Alpha Control</span>
            <span>{(params.alphaThreshold || 0).toFixed(2)}</span>
          </label>
          <input type="range" min="0.0" max="1.5" step="0.01" value={params.alphaThreshold || 0.0} onChange={e => setParams({...params, alphaThreshold: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

const newStr = `        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Alpha Control</span>
            <span>{(params.alphaThreshold || 0).toFixed(2)}</span>
          </label>
          <input type="range" min="0.0" max="1.5" step="0.01" value={params.alphaThreshold || 0.0} onChange={e => setParams({...params, alphaThreshold: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Emitter Turbulence</span>
            <span>{(params.emitterTurbulence ?? 0.5).toFixed(2)}</span>
          </label>
          <input type="range" min="0.0" max="2.0" step="0.05" value={params.emitterTurbulence ?? 0.5} onChange={e => setParams({...params, emitterTurbulence: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>
        
        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Emitter Speed</span>
            <span>{(params.emitterSpeed ?? 1.0).toFixed(2)}</span>
          </label>
          <input type="range" min="0.0" max="5.0" step="0.1" value={params.emitterSpeed ?? 1.0} onChange={e => setParams({...params, emitterSpeed: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

c = c.split(targetStr).join(newStr);
c = c.split(targetStr.replace(/\n/g, '\r\n')).join(newStr.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/FireGenerator.tsx', c);
console.log('patched UI');
