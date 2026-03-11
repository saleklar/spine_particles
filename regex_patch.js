const fs = require('fs');
let txt = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /particleHorizontalFlipChance: Number\(\(selectedObject.properties as EmitterObject\['properties'\] \| undefined\)\?.particleHorizontalFlipChance \?\? 0\),/;

txt = txt.replace(regex, `particleHorizontalFlipChance: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleHorizontalFlipChance ?? 0),
        particlePivotX: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particlePivotX ?? 0.5),
        particlePivotY: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particlePivotY ?? 0.5),`);

fs.writeFileSync('src/App.tsx', txt);
console.log("Done regex patch.");