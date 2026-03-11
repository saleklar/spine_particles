const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const targetStr = '<input type="range" min="0.0" max="3.0" step="0.05" value={params.distortion} onChange={e => setParams({...params, distortion: parseFloat(e.target.value)})} style={{width:\'100%\'}}/>\\r\\n        </div>';

const replaceIdx = c.indexOf('<span>Domain Distortion (Turbulence)</span>');
if (replaceIdx !== -1) {
    const endDivIdx = c.indexOf('</div>', replaceIdx);
    const originalBlock = c.substring(replaceIdx - 50, endDivIdx + 6);
    
    const newBlock = originalBlock + `

        <div>
          <label style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
            <span>Domain Resolution</span>
            <span>{params.domainResolution || 32}</span>
          </label>
          <input type="range" min="8" max="64" step="1" value={params.domainResolution || 32} onChange={e => setParams({...params, domainResolution: parseInt(e.target.value)})} style={{width:'100%'}}/>
        </div>`;
        
    c = c.replace(originalBlock, newBlock);
    fs.writeFileSync('src/FireGenerator.tsx', c);
    console.log('patched');
} else {
    console.log('not found');
}
