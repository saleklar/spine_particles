const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  'if (item.frame > lastFrame + 1 && lastFrame !== -2) {',
  'if ((item.frame > lastFrame + 1 || item.state.age < lastAge) && lastFrame !== -2) {'
);
code = code.replace(
  '          let lastFrame = -2;',
  '          let lastFrame = -2;\n          let lastAge = -1;'
);
code = code.replace(
  '            lastFrame = item.frame;',
  '            lastFrame = item.frame;\n            lastAge = item.state.age;'
);
fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Restored age fix');
