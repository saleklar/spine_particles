
const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const startIndex = c.indexOf('// For determining gaps where particle is dead/reborn');
const endIndex = c.indexOf('lastFrame = frame;\n          }') + 'lastFrame = frame;\n          }'.length;

if (startIndex !== -1 && endIndex > startIndex) {
    const regex = c.substring(startIndex, endIndex);

    const newLogic = \// Chunk history into contiguous life segments
          const lifespans: {frame: number, state: CachedParticleState}[][] = [];
          let currentLifespan: {frame: number, state: CachedParticleState}[] = [];
          let lastFrame = -2;

          for (const item of history) {
            if (item.frame > lastFrame + 1 && lastFrame !== -2) {
              lifespans.push(currentLifespan);
              currentLifespan = [];
            }
            currentLifespan.push(item);
            lastFrame = item.frame;
          }
          if (currentLifespan.length > 0) lifespans.push(currentLifespan);

          // Process each lifespan segment, downsampling to exactly 4 keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            if (life.length === 0) continue;
            
            // Rebirth gap invisible frame
            if (i > 0 || life[0].frame > 0) {
              slotAnim.rgba.push({ time: (Math.max(0, life[0].frame - 0.01)) / 24, color: \\
ffffff00\\ });
            }

            // Exactly 4 keys distributed evenly
            const maxKeys = 4;
            const bakedKeys = [];
            if (life.length <= maxKeys) {
                bakedKeys.push(...life);
            } else {
                for (let j = 0; j < maxKeys; j++) {
                    const idx = Math.floor(j * (life.length - 1) / (maxKeys - 1));
                    bakedKeys.push(life[idx]);
                }
            }

            for (let k = 0; k < bakedKeys.length; k++) {
              const { frame, state } = bakedKeys[k];
              const time = frame / 24;
              
              const alphaFade = Math.max(0, Math.min(1, 1 - (state.age / state.lifetime)));
              const baseAlpha = Math.max(0, Math.min(1, state.opacity));
              const finalAlpha = Math.floor(alphaFade * baseAlpha * 255).toString(16).padStart(2, '0');
              
              const isLastKey = k === bakedKeys.length - 1;
              const bezierData = !isLastKey ? { curve: \\bezier\\, c1: 0.33, c2: 0.33, c3: 0.66, c4: 0.66 } : {};

              slotAnim.rgba.push({ time, color: \\\fffff\\\\, ...bezierData });
              
              boneAnim.translate.push({
                 time,
                 x: state.position.x * 10,
                 y: state.position.y * 10,
                 ...bezierData
              });

              const sizeScale = Math.max(0.05, state.size * 4) / 64;
              boneAnim.scale.push({
                 time,
                 x: sizeScale,
                 y: sizeScale,
                 ...bezierData
              });
            }

            // Death invisible frame
            const deathFrame = life[life.length - 1].frame;
            slotAnim.rgba.push({ time: (deathFrame + 1) / 24, color: \\ffffff00\\ });
          }\;

    c = c.replace(regex, newLogic);
    fs.writeFileSync('src/Scene3D.tsx', c);
    console.log('Successfully baked exactly 4 keys per path using indexOf!');
} else {
    console.log('Could not find substring');
}

