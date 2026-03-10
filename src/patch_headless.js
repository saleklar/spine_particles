const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const interfaceCode = `export interface GeneratorParams {
  shapeType: 'ground' | 'fireball';
  color1: string;
  color2: string;
  color3: string;
  speed: number;
  scale: number;
  coreBottom: number;
  coreTop: number;
  brightness: number;
  contrast: number;
  saturation: number;
  frames: number;
  fps: number;
  resolution: number;
  noiseType: 'simplex' | 'voronoi';
  distortion: number;
  detail: number;
}
`;

if (!code.includes('export interface GeneratorParams')) {
  // Insert after imports
  const importEnd = code.lastIndexOf('import ');
  const insertPos = code.indexOf('\n', importEnd) + 1;
  code = code.substring(0, insertPos) + '\n' + interfaceCode + code.substring(insertPos);
  
  // Replace typing in useState
  code = code.replace(/useState\(\(\) => \{/, 'useState<GeneratorParams>(() => {');
  
  fs.writeFileSync('src/FireGenerator.tsx', code);
  console.log('Added GeneratorParams interface manually.');
} else {
  console.log('GeneratorParams already exists.');
}
