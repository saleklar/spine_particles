const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `particleHorizontalFlipChance: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleHorizontalFlipChance ?? 0),\n        particleStretch: Boolean((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleStretch ?? false),`;

const r1 = `particleHorizontalFlipChance: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleHorizontalFlipChance ?? 0),
        particlePivotX: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particlePivotX ?? 0.5),
        particlePivotY: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particlePivotY ?? 0.5),
        particleStretch: Boolean((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleStretch ?? false),`;

let res = content.replace(t1, r1);
fs.writeFileSync('src/App.tsx', res);
console.log("Replaced!");