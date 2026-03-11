const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const newPresets = \{ name: 'Digital Matrix Fire', params: { shapeType: 'ground', color1: '#002200', color2: '#00ff00', color3: '#aaffaa', speed: 2.0, scale: 5.0, coreBottom: 2.0, coreTop: 1.0, brightness: 1.2, contrast: 1.5, saturation: 1.0, frames: 64, fps: 30, resolution: 128, noiseType: 'value', distortion: 0.5, detail: 1.0, alphaThreshold: 0.3, thermalBuoyancy: 1.0, vorticityConfinement: 0.0 } },
{ name: 'Boiling Plasma (Cellular)', params: { shapeType: 'fireball', color1: '#220066', color2: '#9900ff', color3: '#ff55ff', speed: 1.5, scale: 3.5, coreBottom: 1.2, coreTop: 1.2, brightness: 1.4, contrast: 1.1, saturation: 1.2, frames: 64, fps: 30, resolution: 128, noiseType: 'cellular', distortion: 1.5, detail: 0.5, alphaThreshold: 0.1, thermalBuoyancy: 1.0, vorticityConfinement: 2.0 } },
\;

code = code.replace("{ name: 'Scientific FDS Fire',", newPresets + "{ name: 'Scientific FDS Fire',");

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Presets added");
