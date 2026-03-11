const fs = require('fs');

let AppTxt = fs.readFileSync('src/App.tsx', 'utf8');

AppTxt = AppTxt.replace(
  'particleBudget: number;',
  'particleBudget: number;\n  adaptiveEmission?: boolean;'
);
AppTxt = AppTxt.replace(
  'particleBudget: 500,',
  'particleBudget: 500,\n  adaptiveEmission: true,'
);

const oldUI = `                  <input
                    id="particle-budget"
                    max={2000}
                    min={10}
                    onChange={(event) => setSceneSettings((prev) => ({
                      ...prev,
                      particleBudget: Number.parseInt(event.target.value, 10),
                    }))}
                    step={10}
                    type="range"
                    value={sceneSettings.particleBudget}
                  />`;

const newUI = oldUI + `\n                  <label className="checkbox-label" style={{ marginTop: '10px' }} title="Automatically adapts emission rate to prevent sudden bursts and smoothly match the particle budget.">
                    <input
                      type="checkbox"
                      checked={sceneSettings.adaptiveEmission ?? true}
                      onChange={(e) => setSceneSettings((prev) => ({
                        ...prev,
                        adaptiveEmission: e.target.checked
                      }))}
                    />
                    Adaptive Emission Rate
                  </label>`;

AppTxt = AppTxt.replace(oldUI, newUI);
fs.writeFileSync('src/App.tsx', AppTxt);


let SceneTxt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

let regex = /const safeEmissionRate = Number\.isFinite\(emissionRate\) && emissionRate > 0 \? emissionRate : 100;/;

let replacement = `const rawSafeEmissionRate = Number.isFinite(emissionRate) && emissionRate > 0 ? emissionRate : 100;
              
              const totalEmitters = Array.from(sceneObjectsRef.current.values()).filter(o => o.type === 'Emitter').length || 1;
              const isAdaptive = sceneSettingsRef.current.adaptiveEmission !== false;
              
              const emitterLifetimeBase = Number(emitterProps.particleLifetime ?? 3);
              const maxContinuousEmission = (particleBudget / totalEmitters) / Math.max(0.1, emitterLifetimeBase);
              const safeEmissionRate = isAdaptive ? Math.min(rawSafeEmissionRate, maxContinuousEmission) : rawSafeEmissionRate;`;

SceneTxt = SceneTxt.replace(regex, replacement);
fs.writeFileSync('src/Scene3D.tsx', SceneTxt);
console.log('done patching!');
