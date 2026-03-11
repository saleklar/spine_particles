const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const sliderHtml = `          <div>
            <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span>Thermal Buoyancy</span>
              <span>{params.thermalBuoyancy?.toFixed(2) || '1.00'}</span>
            </label>
            <input type="range" min="0.0" max="5.0" step="0.1" value={params.thermalBuoyancy ?? 1.0} onChange={e => setParams({...params, thermalBuoyancy: parseFloat(e.target.value)})} style={{width:'100%'}}/>
          </div>
          <div>
            <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span>Vorticity Confinement</span>
              <span>{params.vorticityConfinement?.toFixed(2) || '1.00'}</span>
            </label>
            <input type="range" min="0.0" max="5.0" step="0.1" value={params.vorticityConfinement ?? 1.0} onChange={e => setParams({...params, vorticityConfinement: parseFloat(e.target.value)})} style={{width:'100%'}}/>
          </div>`;

code = code.replace(
  /<div>\s*<label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>\s*<span>Fractal Detail<\/span>/g,
  sliderHtml + '\n          <div>\n            <label style={{display: \'flex\', justifyContent: \'space-between\', fontSize: \'12px\'}}>\n              <span>Fractal Detail</span>'
);

fs.writeFileSync('src/FireGenerator.tsx', code);
