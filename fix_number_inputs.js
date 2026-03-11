const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// Match chunks that look like:
// <span>{...}</span>
// </label>
// <input type="range" min="..." max="..." step="..." value={...} onChange={...} ... />

const regex = /<span>(.*?)<\/span>([\s\n]*)<\/label>([\s\n]*)<input type=\"range\"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)\}(.*?)\/>/g;

let count = 0;
let newCode = code.replace(regex, (match, spanContent, space1, space2, beforeValue, valueExpr, beforeOnChange, onChangeExpr, afterOnChange) => {
    count++;
    
    // We want to replace <span>...</span> with <input type="number" value={valueExpr} onChange={onChangeExpr} ... />
    // Extract step if it exists to put it in the number input
    let stepMatch = beforeValue.match(/step=\"(.*?)\"/);
    if (!stepMatch) stepMatch = afterOnChange.match(/step=\"(.*?)\"/);
    let step = stepMatch ? stepMatch[1] : 'any';

    const numberInput = \<input type="number" value={\} onChange={\} step="\" style={{ width: '60px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #555', borderRadius: '3px', textAlign: 'center', fontSize: '11px', outline: 'none' }} />\;

    return \\\</label>\<input type="range"\value={\}\onChange={\}\/>\;
});

console.log('Replaced ' + count + ' instances');
fs.writeFileSync('src/FireGenerator.tsx', newCode);

