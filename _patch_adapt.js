
const fs = require('fs');
const c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

let p = c.replace(/const safeEmissionRate = Number\\.isFinite\\(emissionRate\\) && emissionRate > 0 \\? emissionRate : 100;/, 
\const rawSafeEmissionRate = Number.isFinite(emissionRate) && emissionRate > 0 ? emissionRate : 100;

              // Calculate how many emitters there are to share the budget equally
              const totalEmitters = Array.from(sceneObjectsRef.current.values()).filter(o => o.type === 'Emitter').length || 1;
              const isAdaptive = sceneSettingsRef.current.adaptiveEmission !== false;
              
              // Note: using emitter.particleLifetime if available, otherwise just use 3
              const emitterLifetime = emitterProps.particleLifetime ?? 3;

              // Adaptive emission: cap the rate so that over the particle's lifetime, 
              // it exactly reaches its fair share of the global particle budget without bursting.
              const maxContinuousEmission = (particleBudget / totalEmitters) / emitterLifetime;
              const safeEmissionRate = isAdaptive ? Math.min(rawSafeEmissionRate, maxContinuousEmission) : rawSafeEmissionRate;\
);

fs.writeFileSync('src/Scene3D.tsx', p);
console.log('done');

