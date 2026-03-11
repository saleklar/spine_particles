const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const targetFunc = `        const createParticleMesh = (
          position: THREE.Vector3,
          color = '#ffffff',
          size = 3,
          opacity = 1,
          particleType: ParticleVisualType = 'dots',
          customGlow = false,
          rotation = 0,
          spriteTexture?: THREE.Texture
        ) => {`;

const replFunc = `        const createParticleMesh = (
          position: THREE.Vector3,
          color = '#ffffff',
          size = 3,
          opacity = 1,
          particleType: ParticleVisualType = 'dots',
          customGlow = false,
          rotation = 0,
          spriteTexture?: THREE.Texture,
          flipX: boolean = false
        ) => {`;

if(txt.includes(targetFunc)) {
    txt = txt.replace(targetFunc, replFunc);
    
    // Now replace setParticleSize(sprite, size) and setParticleSize(points, size)
    // ONLY INSIDE createParticleMesh
    const startIdx = txt.indexOf(replFunc);
    const endIdx = txt.indexOf("return sprite;", startIdx);
    
    if(startIdx !== -1 && endIdx !== -1) {
        let funcBody = txt.substring(startIdx, endIdx);
        funcBody = funcBody.replace('setParticleSize(sprite, size);', 'setParticleSize(sprite, size, flipX);');
        funcBody = funcBody.replace('setParticleSize(points, size);', 'setParticleSize(points, size, flipX);');
        
        txt = txt.substring(0, startIdx) + funcBody + txt.substring(endIdx);
    }
    
    fs.writeFileSync('src/Scene3D.tsx', txt);
    console.log("Patched createParticleMesh");
} else {
    console.log("Could not find target function");
}