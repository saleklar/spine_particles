const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const search = `        const createParticleMesh = (
          position: THREE.Vector3,
          color = '#ffffff',
          size = 3,
          opacity = 1,
          particleType: ParticleVisualType = 'dots',
          customGlow = false,
          rotation = 0,
          spriteTexture?: THREE.Texture`;
          
const repl = search + `,
          pivotX: number = 0.5,
          pivotY: number = 0.5,
          flipX: boolean = false`;

txt = txt.replace(search, repl);

const sprSearch = `            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.copy(position);`;
const sprRepl = sprSearch + `\n            sprite.center.set(pivotX, pivotY);`;

txt = txt.replace(sprSearch, sprRepl);
txt = txt.replace('setParticleSize(sprite, size);', 'setParticleSize(sprite, size, flipX);');
txt = txt.replace('setParticleSize(points, size);', 'setParticleSize(points, size, flipX);');

fs.writeFileSync('src/Scene3D.tsx', txt);
console.log('Patched Scene3D.tsx');
