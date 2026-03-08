const fs = require('fs');

let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regex = /\/\/ For determining gaps where particle is dead\/reborn[\s\S]*?lastFrame = frame;\n\s*\}/;

const newLogic = `// Chunk history into contiguous life segments
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

          // Process each lifespan segment, downsampling keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            
            // Rebirth gap invisible frame
            if (i > 0 || life[0].frame > 0) {
              slotAnim.rgba.push({ time: (life[0].frame - 0.01) / 24, color: "ffffff00" });
            }

            // Downsample: Keep one key every 6 frames (~4 keys per second)
            const KEY_STEP = 6;
            const bakedKeys = [];
            for (let k = 0; k < life.length; k += KEY_STEP) {
              bakedKeys.push(life[k]);
            }
            if (bakedKeys[bakedKeys.length - 1] !== life[life.length - 1]) {
              bakedKeys.push(life[life.length - 1]);
            }

            for (let k = 0; k < bakedKeys.length; k++) {
              const { frame, state } = bakedKeys[k];
              const time = frame / 24;
              
              const alphaFade = Math.max(0, Math.min(1, 1 - (state.age / state.lifetime)));
              const baseAlpha = Math.max(0, Math.min(1, state.opacity));
              const finalAlpha = Math.floor(alphaFade * baseAlpha * 255).toString(16).padStart(2, '0');
              
              const isLastKey = k === bakedKeys.length - 1;
              const bezierData = !isLastKey ? { curve: "bezier", c1: 0.333, c2: 0.333, c3: 0.666, c4: 0.666 } : {};

              slotAnim.rgba.push({ time, color: \`ffffff\${finalAlpha}\`, ...bezierData });
              
              boneAnim.translate.push({
                 time,
                 x: state.position.x,
                 y: state.position.y,
                 ...bezierData
              });

              const sizeScale = state.size / 10;
              boneAnim.scale.push({
                 time,
                 x: sizeScale,
                 y: sizeScale,
                 ...bezierData
              });
            }

            // Death invisible frame
            const deathFrame = life[life.length - 1].frame;
            slotAnim.rgba.push({ time: (deathFrame + 1) / 24, color: "ffffff00" });
          }`;

c = c.replace(regex, newLogic);
fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Updated exportSpineData to output Bezier keys with downsampling!');