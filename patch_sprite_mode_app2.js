const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("particleSpriteSequenceMode: 'loop'")) {
    console.log("NOT FOUND IN APP");
}

let t3 = `particleSpriteSequenceFps: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSpriteSequenceFps ?? 12),`;
let r3 = `particleSpriteSequenceMode: String((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSpriteSequenceMode ?? 'loop'),\n        particleSpriteSequenceFps: Number((selectedObject.properties as EmitterObject['properties'] | undefined)?.particleSpriteSequenceFps ?? 12),`;
if (code.includes(t3)) {
    code = code.replace(t3, r3);
    fs.writeFileSync('src/App.tsx', code);
}
