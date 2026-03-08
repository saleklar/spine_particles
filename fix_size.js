const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const sIdx = txt.lastIndexOf('const sizeScale = Math.max');
console.log(sIdx);
// Let's find "const sizeScale" and delete the second one
let firstIdx = txt.indexOf('const sizeScale');
let lastIdx = txt.lastIndexOf('const sizeScale');

if (firstIdx !== lastIdx && lastIdx > firstIdx) {
  // It appears more than once! The second one is right below the first
  const blockStart = txt.lastIndexOf('const sizeScale');
  const blockEnd = txt.indexOf('});', blockStart) + 3;
  txt = txt.substring(0, blockStart) + txt.substring(blockEnd);
  fs.writeFileSync('src/Scene3D.tsx', txt);
  console.log("Fixed!");
}
