const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add properties to App.tsx EmitterObject
const prop1 = "particleHorizontalFlipChance?: number;";
const prop1New = "particleHorizontalFlipChance?: number;\n  particlePivotX?: number;\n  particlePivotY?: number;";
code = code.replace(prop1, prop1New);

// UI insert using simple regex
const uiInsertOldRegex = /<hr style={{ margin: '0\.5rem 0', borderColor: '#3b455c' }} \/>/;

const uiInsertNew = "<label htmlFor=\"particle-pivot-x\">Pivot X (0-1): {selectedEmitterProperties.particlePivotX ?? 0.5}</label>\n" +
"<input id=\"particle-pivot-x\" max={1} min={0} onChange={(event) => handleUpdateEmitterProperty('particlePivotX', Number.parseFloat(event.target.value))} step={0.05} type=\"range\" value={selectedEmitterProperties.particlePivotX ?? 0.5} />\n" +
"<label htmlFor=\"particle-pivot-y\">Pivot Y (0-1): {selectedEmitterProperties.particlePivotY ?? 0.5}</label>\n" +
"<input id=\"particle-pivot-y\" max={1} min={0} onChange={(event) => handleUpdateEmitterProperty('particlePivotY', Number.parseFloat(event.target.value))} step={0.05} type=\"range\" value={selectedEmitterProperties.particlePivotY ?? 0.5} />\n" +
"<hr style={{ margin: '0.5rem 0', borderColor: '#3b455c' }} />";
code = code.replace(uiInsertOldRegex, uiInsertNew);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
