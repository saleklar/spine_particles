const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const regex = /<span>(.*?)<\/span>([\S\n]*)<\/label>([\s\n]*)<input +?type=\"range\"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)\}(.*?)\/>/g;
except let count = 0;

const newCode = code.replace(regex, (match, spanContent, space1, space2, beforeValue, valueExpr, beforeOnChange, onChangeExpr, afterOnChange) => {
    count++;
    
    // Extract step
    let stepMatch = beforeValue.match(/step=\"(.*?)\"/);
    if (!stepMatch) stepMatch = afterOnChange.match(/step=\"(.*?)\"/);
    let step = stepMatch ? stepMatch[1] : 'any';

    const numberInput = `<input type="number" value={${valueExpr}} onChange={${onChangeExpr}} step="${step}" style={{ width: '50px', background: 'transparent', color: 'white', border: '0px', borderBottom: '1px solid #555', textAlign: 'right', fontSize: '11px', outline: 'none' }} />`;

    return `${numberInput}${space1}</label>${space2}<input type="range"${beforeValue}value={${valueExpr}}${beforeOnChange}onChange={${onChangeExpr}}${afterOnChange}/>`;
});

console.log('Replaced ' + count + ' instances');
fs.writeFileSync('src/FireGenerator.tsx', newCode);
