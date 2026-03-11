const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const regex = /<span>(.*?)<\/span>([\s\S]*?)<\/label>([\s\S]*?)<input\b([^>]*)type="range"([^>]*)value=\{(.*?)\}([^>]*)onChange=\{(.*?)\}([^>]*)\/>/g;
let count = 0;

code = code.replace(regex, (m, c1, sp1, sp2, a, b, v, c, onChange, end) => {
  count++;
  let m1 = m.match(/step="([0-9.]+)"/);
  let step = m1 ? m1[1] : 'any';
  
  if (sp2.includes('<input type="number"')) {
      count--;
      return m;
  }

  let numInput = `<input type="number" value={${v}} onChange={${onChange}} step="${step}" style={{ width: '50px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid #555', textAlign: 'right', fontSize: '11px', outline: 'none' }} />`;
  let input2 = `<input type="range"${a}value={${v}}${b}onChange={${onChange}}${c}${end}/>`;
  
  return numInput + sp1 + '</label>' + sp2 + input2;
});

console.log('Replaced : ', count);
fs.writeFileSync('src/FireGenerator.tsx', code);
