const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const target = \        particleHorizontalFlipChance: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleHorizontalFlipChance ?? 0),
        particleStretch: Boolean((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleStretch ?? false),\;
const replacement = \        particleHorizontalFlipChance: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleHorizontalFlipChance ?? 0),
        particlePivotX: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particlePivotX ?? 0.5),
        particlePivotY: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particlePivotY ?? 0.5),
        particleStretch: Boolean((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleStretch ?? false),\;
fs.writeFileSync('src/App.tsx', content.replace(target, replacement));
