const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The block starts around line 680
let fromStr = `particleSizeOverLife: String((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSizeOverLife ?? 'none'),`;
let toStr = `particleSizeOverLife: String((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSizeOverLife ?? 'none'),
        particleSizeOverLifeCurve: String((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSizeOverLifeCurve ?? ''),
        particleOpacityOverLifeCurve: String((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleOpacityOverLifeCurve ?? ''),`;

code = code.replace(fromStr, toStr);
fs.writeFileSync('src/App.tsx', code);
console.log("App types patched");
