const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(/\| 'sprites' \| '3d-model'/g, "| 'sprites' | '3d-model' | 'volumetric-fire'");

// Find uses of 3d-model where we check if it is an animated sequence type 
code = code.replace(/textureType === '3d-model'/g, "(textureType === '3d-model' || textureType === 'volumetric-fire')");
code = code.replace(/resolvedParticleType === '3d-model'/g, "(resolvedParticleType === '3d-model' || resolvedParticleType === 'volumetric-fire')");
code = code.replace(/emitterParticleType === '3d-model'/g, "(emitterParticleType === '3d-model' || emitterParticleType === 'volumetric-fire')");
code = code.replace(/previewedType === '3d-model'/g, "(previewedType === '3d-model' || previewedType === 'volumetric-fire')");
code = code.replace(/effectiveParticleType === '3d-model'/g, "(effectiveParticleType === '3d-model' || effectiveParticleType === 'volumetric-fire')");

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Scene3D patched');
