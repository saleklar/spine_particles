const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(
    /ctx\.clearRect\(0, 0, targetSize, targetSize\);\s*ctx\.globalCompositeOperation = 'source-over';\s*ctx\.filter = 'none';/g,
    `ctx.clearRect(0, 0, targetSize, targetSize);
          ctx.globalCompositeOperation = 'source-over';
          ctx.filter = 'none';
          ctx.globalAlpha = 1.0;`
);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Restored alpha reset");
