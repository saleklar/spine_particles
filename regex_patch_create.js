const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regex = /const createParticleMesh = \([\s\S]*?spriteTexture\?: THREE\.Texture/;
const repl = `const createParticleMesh = (
          position: THREE.Vector3,
          color = '#ffffff',
          size = 3,
          opacity = 1,
          particleType: ParticleVisualType = 'dots',
          customGlow = false,
          rotation = 0,
          spriteTexture?: THREE.Texture,
          pivotX: number = 0.5,
          pivotY: number = 0.5,
          flipX: boolean = false`;

if(regex.test(txt)) {
    txt = txt.replace(regex, repl);
    fs.writeFileSync('src/Scene3D.tsx', txt);
    console.log("Successfully replaced signature");
} else {
    console.log("Regex didn't match.");
}
