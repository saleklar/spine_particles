const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /particleSizeOverLife: 'none',([\s\S]*?)showPathCurves: false,/gm,
  'particleSizeOverLife: \'none\',$1particleSeed: Math.floor(Math.random() * 1000000),$1showPathCurves: false,'
);

code = code.replace(
  /particleSizeOverLife: 'none',([\s\S]*?)particleSpriteSequenceDataUrls: dataUrls,/gm,
  'particleSizeOverLife: \'none\',$1particleSeed: Math.floor(Math.random() * 1000000),$1particleSpriteSequenceDataUrls: dataUrls,'
);

fs.writeFileSync('src/App.tsx', code);
