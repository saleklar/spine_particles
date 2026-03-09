const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

// Add spawnCount to the type
code = code.replace(
  /lastEmit: number;/g,
  'lastEmit: number;\n      spawnCount?: number;'
);

// Add spawnCount initialization in the setup loop
code = code.replace(
  /lastEmit: Date.now\(\)\n\s*}\);/g,
  'lastEmit: Date.now(),\n                spawnCount: 0\n              });'
);

// Add clear logic
code = code.replace(
  /particleSystem\.lastEmit = Date\.now\(\);/g,
  'particleSystem.lastEmit = Date.now(); particleSystem.spawnCount = 0;'
);

// Add PRNG definition
const prngDef = `
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
`;

code = code.replace(
  /export function Scene3D\(.*\) \{/m,
  prngDef + '\nexport function Scene3D(props: Scene3DProps) {'
);

fs.writeFileSync('src/Scene3D.tsx', code);
