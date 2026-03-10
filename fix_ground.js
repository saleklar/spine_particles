const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

let p1 = c.indexOf('float bottomPinch = smoothstep(0.0, 0.2, ny);');
let p2 = c.indexOf('float density = (n * 0.5 + 0.5) * mask;', p1);

if (p1 > -1 && p2 > -1) {
  let sub = c.substring(p1, p2);
  console.log('Replacing: ', sub);
  
  let newSub = \loat bottomPinch = smoothstep(0.0, 0.2, ny);
          mask *= topFade * mix(0.2, 1.0, bottomPinch);
      }

      // Add a bottom fade to all
      mask *= smoothstep(-1.0, -0.6, p.y);

      \;
  
  c = c.substring(0, p1) + newSub + c.substring(p2);
  fs.writeFileSync('src/FireGenerator.tsx', c);
  console.log('Fixed ground block');
} else {
  console.log('Could not find markers', p1, p2);
}

