const fs = require('fs');

let txt = fs.readFileSync('src/App.tsx', 'utf8');
const searchStr = 'value={selectedEmitterProperties.particleRotationSpeedVariation}\n                        />';
const insertStr = `value={selectedEmitterProperties.particleRotationSpeedVariation}
                        />

                        <label className=\"checkbox-label\" style={{ marginTop: '10px' }} title=\"Automatically align particle rotation to match its movement direction (velocity)\">
                          <input
                            type=\"checkbox\"
                            checked={selectedEmitterProperties.particleAlignToVelocity ?? false}
                            onChange={(e) => handleUpdateEmitterProperty('particleAlignToVelocity', e.target.checked)}
                          />
                          Align Rotation to Velocity
                        </label>`;

txt = txt.replace(searchStr, insertStr);

txt = txt.replace('particleRotationSpeedVariation: number;', 'particleRotationSpeedVariation: number;\n    particleAlignToVelocity?: boolean;');
txt = txt.replace('particleRotationSpeedVariation: 0,', 'particleRotationSpeedVariation: 0,\n      particleAlignToVelocity: false,');

fs.writeFileSync('src/App.tsx', txt);
console.log('UI injected');
