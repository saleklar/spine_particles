const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');
let p1 = c.indexOf('float bottomPinch = smoothstep(0.0, 0.2, ny);');
let p2 = c.indexOf('float density = (n * 0.5 + 0.5) * mask;', p1);
if (p1 > -1 && p2 > -1) {
    let replaced = 'float bottomPinch = smoothstep(0.0, 0.2, ny);\n          mask *= topFade * mix(0.2, 1.0, bottomPinch);\n      }\n\n      // Add a bottom fade to all\n      mask *= smoothstep(-1.0, -0.6, p.y);\n\n      ';
    c = c.substring(0, p1) + replaced + c.substring(p2);
    fs.writeFileSync('src/FireGenerator.tsx', c);
    console.log('Success');
} else {
    console.log('Fail', p1, p2);
}

