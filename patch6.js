const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const repl = `float erosionNoise = snoise3(p * scale * 2.0 - vec3(0.0, t*1.5, 0.0));
              if (noiseType > 0.5) erosionNoise = abs(erosionNoise); // pseudo-voronoi for crispness
              float erosionThreshold = alphaThreshold * mix(1.0, erosionNoise * 0.5 + 0.5, clamp(distortion * 0.5, 0.0, 1.0));
              
              float stepAlpha = max(0.0, density - erosionThreshold) * mix(3.5, 20.0, clamp(alphaThreshold, 0.0, 1.0));
              stepAlpha = pow(stepAlpha, mix(1.0, 1.5, clamp(alphaThreshold, 0.0, 1.0)));`;

code = code.replace(/float stepAlpha = smoothstep[\s\S]*?pow\(stepAlpha,[\s\S]*?\);/, 
    "float stepAlpha = max(0.0, density - erosionThreshold) * mix(3.5, 20.0, clamp(alphaThreshold, 0.0, 1.0));\n              stepAlpha = pow(stepAlpha, mix(1.0, 1.5, clamp(alphaThreshold, 0.0, 1.0)));");

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Alpha brightness restored");
