const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<option value="grow">Grow<\/option>\s*<\/select>/m,
  `<option value="grow">Grow</option>\n                          </select>\n\n                          <label htmlFor="particle-seed">\n                            Random Seed\n                          </label>\n                          <input\n                            id="particle-seed"\n                            type="number"\n                            min="0"\n                            max="9999999"\n                            value={selectedEmitterProperties.particleSeed ?? 0}\n                            onChange={(event) => handleUpdateEmitterProperty('particleSeed', Number(event.target.value))}\n                          />`
);

fs.writeFileSync('src/App.tsx', code);
