const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const t = "alphaThreshold: parseFloat(e.target.value)})} style={{width:'100%'}}/>\n          </div>";
const r = t + "\n\n          <div style={{ marginTop: '8px', marginBottom: '8px' }}>\n            <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>\n              <input type=\"checkbox\" checked={params.evolveOverLife || false} onChange={e => setParams({...params, evolveOverLife: e.target.checked})} style={{ marginRight: '8px' }} />\n              Evolve Shape Over Sequence (Match Life)\n            </label>\n          </div>";

if (code.includes(t)) {
    code = code.replace(t, r);
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log("Success UI patch");
} else {
    console.log("no match");
}
