const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

let lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Domain Resolution') && lines[i+1]) {
     if (lines[i+1].includes('<span>{')) {
         lines[i+1] = `            <span>{params.domainResolution || 24}</span>\r`;
     }
  }
  if (lines[i].includes('input type="range"') && lines[i].includes('domainResolution: parseInt')) {
      lines[i] = `          <input type="range" min="8" max="64" step="1" value={params.domainResolution || 24} onChange={e => setParams({...params, domainResolution: parseInt(e.target.value)})} style={{width:'100%'}}/>\r`;
  }
}

fs.writeFileSync('src/FireGenerator.tsx', lines.join('\n'));
console.log('Fixed UI markup');
