const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const anchorRegex = /float stepAlpha = max\(.*?\);\r?\n\s+stepAlpha = pow\(stepAlpha,.*?\);/s;

const repl = `float erosionNoise = snoise3(p * scale * 2.0 - vec3(0.0, t*1.5, 0.0));
              if (noiseType > 0.5) erosionNoise = abs(erosionNoise); // pseudo-voronoi for crispness
              float erosionThreshold = alphaThreshold * mix(1.0, erosionNoise * 0.5 + 0.5, clamp(distortion * 0.5, 0.0, 1.0));
              
              float stepAlpha = smoothstep(erosionThreshold, erosionThreshold + 0.15, density) * density;
              stepAlpha *= mix(3.5, 8.0, clamp(alphaThreshold, 0.0, 1.0));
              stepAlpha = pow(stepAlpha, mix(1.0, 1.2, clamp(alphaThreshold, 0.0, 1.0)));`;

code = code.replace(anchorRegex, repl);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Regex alpha behavior patched", !!code.match(/erosionNoise/));
