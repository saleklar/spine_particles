const fs = require('fs');
['src/FireGenerator.tsx', 'src/FireHeadless.ts'].forEach(file => {
  let txt = fs.readFileSync(file, 'utf8');
  txt = txt.replace(/varying vec2 vUv;\s*varying vec2 vUv;/g, 'varying vec2 vUv;');
  txt = txt.replace(/vUv = uv;\s*vUv = uv;/g, 'vUv = uv;');
  fs.writeFileSync(file, txt);
  console.log('Fixed ', file);
});
