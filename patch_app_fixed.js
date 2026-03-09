const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add particleSeed?: number; to EmitterObject properties type
code = code.replace(
  /particleSizeOverLife: string;/g,
  'particleSizeOverLife: string;\n      particleSeed?: number;'
);

// 2. Add to handleCreateObject mapping
code = code.replace(
  /particleSizeOverLife: String\(\(selectedObject\.properties as EmitterObject\['properties'\] \| undefined\)\?.particleSizeOverLife \?\? 'none'\),/g,
  'particleSizeOverLife: String((selectedObject.properties as EmitterObject[\'properties\'] | undefined)?.particleSizeOverLife ?? \'none\'),\n        particleSeed: Number((selectedObject.properties as EmitterObject[\'properties\'] | undefined)?.particleSeed ?? 0),'
);

// 3. Add to UI
code = code.replace(
  /<option value="grow">Grow<\/option>\s*<\/select>/m,
  `<option value="grow">Grow</option>\n                          </select>\n\n                          <label htmlFor="particle-seed">\n                            Random Seed: {selectedEmitterProperties.particleSeed ?? 0}\n                          </label>\n                          <input\n                            id="particle-seed"\n                            type="range"\n                            min="0"\n                            max="1000000"\n                            step="1"\n                            value={selectedEmitterProperties.particleSeed ?? 0}\n                            onChange={(event) => handleUpdateEmitterProperty('particleSeed', Number(event.target.value))}\n                          />`
);

let count = 0;
code = code.replace(/particleSizeOverLife:\s*'none',/g, (match) => {
    count++;
    return `${match}\n          particleSeed: Math.floor(Math.random() * 1000000),`;
});
console.log(`Replaced ${count} initializers with particleSeed`);

fs.writeFileSync('src/App.tsx', code);
