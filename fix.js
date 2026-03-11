const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
const regex = /<span>(.*?)<\/span>([\s\S]*?)<\/label>([\s\S]*?)<input\b([^>]*)type="range"([^>]*)value=\{(.*?)\}([^>]*)c?onChange=\{(.*?)\}([^>]*)\//>/g;
let count = 0;
code = code.replace(regex, (m, c1, sp1, sp2, a, b, v, c, onChange, end) => {
  count++;
  let m1 = m.match(/step="([0-9. ]+)"/);
  let step = m1 ? m1[1] : 'any';
  let numInput = `<input type="number" value={${v}} onChange={${onChange}} step="${step}" style={{ width: '50px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid #555', textAlign: 'right', fontSize: '11px', outline: 'none' }} />`;
  let input2 = `<input ${a}type="range"${b}value={${v}}${c}onChange={${onChange}}${end}/>`;
  
  if (sp2.includes('<input type="number"')) {
      count--;
      return m;
  }
  return numInput + sp1 + '</label>' + sp2 + modifiedInput2(a, b, v, c, onChange, end);
});
function modifiedInput2(a, b, v, c, onChange, end) {
  return `<input ${a}type="range"${b}value={${v}}${c}onChange={${onChange}}${end}/>`;
}
console.log('Replaced : ', count);
fs.writeFileSync('src/FireGenerator.tsx', code);
