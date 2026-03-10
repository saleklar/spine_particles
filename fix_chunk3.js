const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regex3 = /\/\/ Process each lifespan segment[\s\S]*?spineData\.animations\.animation\.bones\[boneName\] = boneAnim;/;

const newLogic3 = `// Process each lifespan segment, downsampling to exactly 4 keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            if (life.length === 0) continue;

            // Rebirth gap invisible frame handling
            if (i > 0 || life[0].frame > 0) {
              slotAnim.rgba.push({ time: Math.max(0, (life[0].frame - 1)) / 24, color: 'ffffff00', curve: "stepped" });
              boneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: "stepped" });
              boneAnim.rotate.push({ time: Math.max(0, (life[0].frame - 1)) / 24, angle: 0, curve: "stepped" });
            }
            
            slotAnim.attachment.push({ time: life[0].frame / 24, name: "particles/png/particle" });

            if (seqInfo && seqInfo.count > 0) {
                sequenceAnim!.push({
                   time: life[0].frame / 24,
                   mode: "loop",
                   index: 0,
                   delay: 1 / seqInfo.fps
                });
            }

            // Exactly 4 keys distributed evenly
            const maxKeys = 4;
            const bakedKeys: typeof life = [];
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

              // Used real opacity from material instead of forcing fade
              const finalAlpha = Math.floor(Math.max(0, Math.min(1, state.opacity)) * 255).toString(16).padStart(2, '0');
              
              const isLastKey = k === bakedKeys.length - 1;
              const curveDefinition = !isLastKey ? { curve: "linear" } : { curve: "stepped" };

              slotAnim.rgba.push({ time, color: \`ffffff\${finalAlpha}\`, curve: "linear" });
              
              boneAnim.translate.push({
                 time,
                 x: state.position.x * 10,
                 y: state.position.y * 10,
                 ...curveDefinition
              });

              const sizeScale = Math.max(0.05, state.size * 4) / 64;
              boneAnim.scale.push({
                 time,
                 x: sizeScale,
                 y: sizeScale,
                 curve: "linear"
              });

              boneAnim.rotate.push({
                 time,
                 angle: state.rotation * -(180 / Math.PI),
                 ...curveDefinition
              });
            }

            // Death invisible frame toggle visibility
            const deathFrame = life[life.length - 1].frame;
            slotAnim.rgba.push({ time: (deathFrame + 1) / 24, color: 'ffffff00', curve: "stepped" });
            boneAnim.scale.push({ time: (deathFrame + 1) / 24, x: 0, y: 0, curve: "stepped" });
            boneAnim.rotate.push({ time: (deathFrame + 1) / 24, angle: 0, curve: "stepped" });
            slotAnim.attachment.push({ time: (deathFrame + 1) / 24, name: null });
          }

          spineData.animations.animation.bones[boneName] = boneAnim;`;

code = code.replace(regex3, newLogic3);
fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Replaced block 3');