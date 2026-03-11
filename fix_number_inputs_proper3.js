const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const regex = /<span>(.*?)<\/span>([\s\S]*?)<\/label>([\s\S]*?)(<input\b[^>]*type="range"[^>]*\/>)/g;
let count = 0;

code = code.replace(regex, (m, c1, sp1, sp2, fullInput) => {
  if (m.includes('<input type="number"')) {
      return m;
  }
  count++;

  let v = "";
  let vIndex = fullInput.indexOf('value={');
  if (vIndex !== -1) {
      let vEnd = fullInput.indexOf('}', vIndex);
      v = fullInput.substring(vIndex + 7, vEnd);
  }
  
  let onChange = "";
  let onChangeIndex = fullInput.indexOf('onChange={');
  if (onChangeIndex !== -1) {
      let bracketCount = 0;
      let startIdx = onChangeIndex + 10;
      let endIdx = -1;
      for (let i = startIdx; i < fullInput.length; i++) {
          if (fullInput[i] === '{') bracketCount++;
          else if (fullInput[i] === '}') {
              if (bracketCount === 0) {
                  endIdx = i;
                  break;
              }
              bracketCount--;
          }
      }
      if (endIdx !== -1) onChange = fullInput.substring(startIdx, endIdx);
  }

  let m1 = fullInput.match(/step="([^"]+)"/);
  let step = m1 ? m1[1] : 'any';

  let numInput = `<input type="number" value={${v}} onChange={${onChange}} step="${step}" style={{ width: '50px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid #555', textAlign: 'right', fontSize: '11px', outline: 'none' }} />`;
  
  return numInput + sp1 + '</label>' + sp2 + fullInput;
});

console.log('Replaced : ', count);
fs.writeFileSync('src/FireGenerator.tsx', code);
