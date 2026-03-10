const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const injection = `        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Flow Dir X</span>
            <span>{params.flowX.toFixed(2)}</span>
          </label>
          <input type="range" min="-5.0" max="5.0" step="0.1" value={params.flowX} onChange={e => setParams({...params, flowX: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Flow Dir Y</span>
            <span>{params.flowY.toFixed(2)}</span>
          </label>
          <input type="range" min="-5.0" max="5.0" step="0.1" value={params.flowY} onChange={e => setParams({...params, flowY: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Flow Dir Z</span>
            <span>{params.flowZ.toFixed(2)}</span>
          </label>
          <input type="range" min="-5.0" max="5.0" step="0.1" value={params.flowZ} onChange={e => setParams({...params, flowZ: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Rotation X</span>
            <span>{params.rotX.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="6.28" step="0.1" value={params.rotX} onChange={e => setParams({...params, rotX: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Rotation Y</span>
            <span>{params.rotY.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="6.28" step="0.1" value={params.rotY} onChange={e => setParams({...params, rotY: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Rotation Z</span>
            <span>{params.rotZ.toFixed(2)}</span>
          </label>
          <input type="range" min="0" max="6.28" step="0.1" value={params.rotZ} onChange={e => setParams({...params, rotZ: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

code = code.replace(/<div[^>]*>[\s\r\n]*<label[^>]*>[\s\r\n]*<span>Fractal Detail<\/span>/s, injection + '\n\n' + '$&');

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Done injection UI in React');
