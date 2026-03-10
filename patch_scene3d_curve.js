const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

if (!code.includes('function evaluateCurve')) {
    const EVAL_FUNC = `
function evaluateCurve(curveJson, progress, defaultValue = 1) {
  if (!curveJson) return defaultValue;
  try {
    const points = JSON.parse(curveJson);
    if (!Array.isArray(points) || points.length === 0) return defaultValue;
    if (points.length === 1) return points[0].y;
    
    let sortedPoints = [...points].sort((a, b) => a.x - b.x);

    if (progress <= sortedPoints[0].x) return sortedPoints[0].y;
    if (progress >= sortedPoints[sortedPoints.length - 1].x) return sortedPoints[sortedPoints.length - 1].y;

    for (let i = 0; i < sortedPoints.length - 1; i++) {
        if (progress >= sortedPoints[i].x && progress <= sortedPoints[i + 1].x) {
            const range = sortedPoints[i + 1].x - sortedPoints[i].x;
            if (range === 0) return sortedPoints[i].y;
            const t = (progress - sortedPoints[i].x) / range;
            return sortedPoints[i].y + t * (sortedPoints[i + 1].y - sortedPoints[i].y);
        }
    }
  } catch(e) {
  }
  return defaultValue;
}
`;
    // Insert after imports or around line 200
    code = code.replace("export const Scene3D = forwardRef<", EVAL_FUNC + "\nexport const Scene3D = forwardRef<");
}

let opacityReplaceFrom = `                  if (particle.opacityOverLife) {
                    material.opacity = (particle.baseOpacity ?? 0.8) * (1 - progress);
                  } else {
                    material.opacity = particle.baseOpacity ?? 0.8;
                  }`;
                  
let opacityReplaceTo = `                  if (emitterProps?.particleOpacityOverLifeCurve) {
                    const curveValue = evaluateCurve(emitterProps.particleOpacityOverLifeCurve, progress, 1);
                    material.opacity = (particle.baseOpacity ?? 0.8) * curveValue;
                  } else if (particle.opacityOverLife) {
                    material.opacity = (particle.baseOpacity ?? 0.8) * (1 - progress);
                  } else {
                    material.opacity = particle.baseOpacity ?? 0.8;
                  }`;

code = code.replace(opacityReplaceFrom, opacityReplaceTo);

let sizeReplaceFrom = `                  } else if (sizeOverLife === 'shrink') {
                    setParticleSize(particle.mesh, baseSize * (1 - progress));
                  } else if (sizeOverLife === 'grow') {
                    setParticleSize(particle.mesh, baseSize * (0.5 + progress * 0.5));
                  } else {
                    setParticleSize(particle.mesh, baseSize);
                  }`;
                  
let sizeReplaceTo = `                  } else if (sizeOverLife === 'curve') {
                    const curveValue = evaluateCurve(emitterProps?.particleSizeOverLifeCurve, progress, 1);
                    setParticleSize(particle.mesh, baseSize * curveValue);
                  } else if (sizeOverLife === 'shrink') {
                    setParticleSize(particle.mesh, baseSize * (1 - progress));
                  } else if (sizeOverLife === 'grow') {
                    setParticleSize(particle.mesh, baseSize * (0.5 + progress * 0.5));
                  } else {
                    setParticleSize(particle.mesh, baseSize);
                  }`;

code = code.replace(sizeReplaceFrom, sizeReplaceTo);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Patched Scene3D.tsx for curve usages (Take 2).");
