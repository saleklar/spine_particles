const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// Use [\s\S]*? instead of [^>]* because there may be > in the lambda functions inside onChange
const regex = /<span>(.*?)<\/span>([\s\S]*?)<\/label>([\s\S]*?)(<input\b[\s\S]*?type="range"[\s\S]*?\/>)/g;
let count = 0;

code = code.replace(regex, (m, c1, sp1, sp2, fullInput) => {
  if (m.includes('<input type="number"')) {
      return m;
  }
  count++;

  // Value
  let v = "";
  let vIndex = fullInput.indexOf('value={');
  if (vIndex !== -1) {
      let vEnd = fullInput.indexOf('}', vIndex);
      v = fullInput.substring(vIndex + 7, vEnd);
  }
  
  // onChange
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

  let m1 = fullInput.match(/step="([0-9.]+)"/);
  if (!m1) m1 = fullInput.match(/step=\{([0-9.]+)\}/);
  let step = m1 ? m1[1] : 'any';

  // We are replacing the span that holds the `{value.toFixed(2)}` text, which is the exact match in `m` that maps to <span>(.*?)</span>
  // But wait, the original text had: `<span>{params.distortion.toFixed(2)}</span>`
  // And the user just wants to replace that span.
  // We can just emit the number input exactly where the span was.
  
  let numInput = `<input type="number" value={${v}} onChange={${onChange}} step="${step}" style={{ width: '50px', background: 'transparent', color: 'white', border: '1px solid #444', borderRadius: '3px', textAlign: 'right', fontSize: '11px', outline: 'none', padding: '0 4px' }} />`;
  
  return numInput + sp1 + '</label>' + sp2 + fullInput;
});

console.log('Replaced : ', count);
fs.writeFileSync('src/FireGenerator.tsx', code);
