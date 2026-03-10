const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const repl = `</div>
          <hr style={{ borderColor: '#333', margin: '5px 0' }} />
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Rotation Speed</div>
          <div>
            <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span>Rot Speed X</span>
              <span>{(params.rotSpeedX || 0).toFixed(2)}</span>
            </label>
            <input type="range" min="-5.0" max="5.0" step="0.1" value={params.rotSpeedX || 0} onChange={e => setParams({...params, rotSpeedX: parseFloat(e.target.value)})} style={{width:'100%'}}/>
          </div>
          <div>
            <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span>Rot Speed Y</span>
              <span>{(params.rotSpeedY || 0).toFixed(2)}</span>
            </label>
            <input type="range" min="-5.0" max="5.0" step="0.1" value={params.rotSpeedY || 0} onChange={e => setParams({...params, rotSpeedY: parseFloat(e.target.value)})} style={{width:'100%'}}/>
          </div>
          <div>
            <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span>Rot Speed Z</span>
              <span>{(params.rotSpeedZ || 0).toFixed(2)}</span>
            </label>
            <input type="range" min="-5.0" max="5.0" step="0.1" value={params.rotSpeedZ || 0} onChange={e => setParams({...params, rotSpeedZ: parseFloat(e.target.value)})} style={{width:'100%'}}/>
          </div>
  <div>
            <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span>Fractal Detail</span>`;

code = code.replace(/<\/div>\s*<div>\s*<label[^>]*>\s*<span>Fractal Detail<\/span>/, repl);
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Sliders installed');
