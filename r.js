const fs = require('fs');
let txt = fs.readFileSync('src/App.tsx', 'utf8');
const search = '        particleHorizontalFlipChance: Number((selectedObject.properties as EmitterObject[\'properties\'] | undefined)?.particleHorizontalFlipChance ?? 0),';
const add = '\n        particlePivotX: Number((selectedObject.properties as EmitterObject[\'properties\'] | undefined)?.particlePivotX ?? 0.5),\n        particlePivotY: Number((selectedObject.properties as EmitterObject[\'properties\'] | undefined)?.particlePivotY ?? 0.5),';
txt = txt.replace(search, search + add);
fs.writeFileSync('src/App.tsx', txt);
