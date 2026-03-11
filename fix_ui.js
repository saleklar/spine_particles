const fs = require('fs');
let txt = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const oldStr = /<label[^>]*>Global Warp \(Shape Morph\)<\/label>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newStr = `<label style={{display: 'block', fontSize: '12px', marginBottom:'5px'}} title="Stretch Horizontally">Stretch X</label>
            <input type="range" min="0.1" max="5.0" step="0.05" value={params.stretchX ?? 1.0} onChange={e => setParams({...params, stretchX: parseFloat(e.target.value)})} style={{width: '100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.stretchX ?? 1.0).toFixed(2)}</div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={{display: 'block', fontSize: '12px', marginBottom:'5px'}} title="Stretch Vertically">Stretch Y</label>
            <input type="range" min="0.1" max="5.0" step="0.05" value={params.stretchY ?? 1.0} onChange={e => setParams({...params, stretchY: parseFloat(e.target.value)})} style={{width: '100%'}}/>
            <div style={{fontSize:'10px', color:'#aaa', textAlign:'right'}}>{(params.stretchY ?? 1.0).toFixed(2)}</div>
          </div>`;

txt = txt.replace(oldStr, newStr);

fs.writeFileSync('src/FireGenerator.tsx', txt);
console.log('Done!');
