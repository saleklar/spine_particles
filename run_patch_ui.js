const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

let replaceFrom = `<span>Domain Distortion (Turbulence)</span>
            <span>{params.distortion.toFixed(2)}</span>
          </label>
          <input type="range" min="0.0" max="3.0" step="0.05" value={params.distortion} onChange={e => setParams({...params, distortion: parseFloat(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

let replaceTo = replaceFrom + `

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Domain Resolution</span>
            <span>{params.domainResolution}</span>
          </label>
          <input type="range" min="8" max="64" step="1" value={Math.round(params.domainResolution || 32)} onChange={e => setParams({...params, domainResolution: parseInt(e.target.value)})} style={{width:'100%'}}/>
        </div>`;

if(c.includes(replaceFrom)) {
   fs.writeFileSync('src/FireGenerator.tsx', c.replace(replaceFrom, replaceTo));
   console.log('patched');
} else {
   console.log('not found');
}
