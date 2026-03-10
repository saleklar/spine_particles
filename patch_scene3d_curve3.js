const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

let count = 0;
// Find opacity logic
code = code.replace(/if\s*\(\s*particle\.opacityOverLife\s*\)\s*\{\s*material\.opacity\s*=\s*\(\s*particle\.baseOpacity\s*\?\?\s*0\.8\s*\)\s*\*\s*\(\s*1\s*-\s*progress\s*\);\s*\}\s*else\s*\{\s*material\.opacity\s*=\s*particle\.baseOpacity\s*\?\?\s*0\.8;\s*\}/, function(match) {
    count++;
    return `if (emitterProps.particleOpacityOverLifeCurve && !particle.opacityOverLife) {
                    const curveValue = evaluateCurve(emitterProps.particleOpacityOverLifeCurve, progress, 1);
                    material.opacity = (particle.baseOpacity ?? 0.8) * curveValue;
                  } else if (particle.opacityOverLife) {
                    material.opacity = (particle.baseOpacity ?? 0.8) * (1 - progress);
                  } else {
                    material.opacity = particle.baseOpacity ?? 0.8;
                  }`;
});

code = code.replace(/\} else if \(sizeOverLife === 'shrink'\) \{\s*setParticleSize\(particle\.mesh,\s*baseSize \*\s*\(1 - progress\)\);\s*\} else if \(sizeOverLife === 'grow'\) \{\s*setParticleSize\(particle\.mesh,\s*baseSize \*\s*\(0\.5 \+ progress \* 0\.5\)\);\s*\} else \{\s*setParticleSize\(particle\.mesh,\s*baseSize\);\s*\}/, function(match) {
    count++;
    return `} else if (sizeOverLife === 'curve') {
                    const curveValue = evaluateCurve(emitterProps?.particleSizeOverLifeCurve, progress, 1);
                    setParticleSize(particle.mesh, baseSize * curveValue);
                  } else if (sizeOverLife === 'shrink') {
                    setParticleSize(particle.mesh, baseSize * (1 - progress));
                  } else if (sizeOverLife === 'grow') {
                    setParticleSize(particle.mesh, baseSize * (0.5 + progress * 0.5));
                  } else {
                    setParticleSize(particle.mesh, baseSize);
                  }`;
});

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Patched Scene3D.tsx count:", count);
