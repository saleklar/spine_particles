const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const repl = `float erosionNoise = snoise3(p * scale * 2.0 - vec3(0.0, t*1.5, 0.0));
              if (noiseType > 0.5) erosionNoise = abs(erosionNoise); // pseudo-voronoi for crispness
              float erosionThreshold = alphaThreshold * mix(1.0, erosionNoise * 0.5 + 0.5, clamp(distortion * 0.5, 0.0, 1.0));
              
              float stepAlpha = max(0.0, density - erosionThreshold) * mix(8.0, 30.0, clamp(alphaThreshold, 0.0, 1.0));
              stepAlpha = pow(stepAlpha, mix(0.7, 1.5, clamp(alphaThreshold, 0.0, 1.0)));`;

code = code.replace(/float erosionNoise =[\s\S]*?pow\(stepAlpha,[\s\S]*?\);/, repl);

// Also patch the end opacity mapping to be more generous
code = code.replace(/float baseAlpha = pow\(clamp\(outColor\.a, 0\.0, 1\.0\), mix\(1\.5, 0\.8, clamp\(alphaThreshold, 0\.0, 1\.0\)\)\);/, 
                    "float baseAlpha = pow(clamp(outColor.a, 0.0, 1.0), mix(0.8, 0.8, clamp(alphaThreshold, 0.0, 1.0)));");
code = code.replace(/float a = baseAlpha \* mix\(1\.0, 2\.0, clamp\(alphaThreshold, 0\.0, 1\.0\)\);/,
                    "float a = baseAlpha * mix(1.5, 2.5, clamp(alphaThreshold, 0.0, 1.0));");

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Made fire base opacity / size more generous");
