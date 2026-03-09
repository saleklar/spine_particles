const fs = require('fs');

const file = 'src/Scene3D.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldStr = `
          // Process each lifespan segment, downsampling to exactly 4 keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            if (life.length === 0) continue;

            const birthTime = life[0].frame / 24;

            // Ensure explicitly null at absolute beginning if born late
            if (i === 0 && life[0].frame > 0) {
                slotAnim.attachment.push({ time: 0, name: null });
                slotAnim.rgba.push({ time: 0, color: 'ffffff00', curve: "stepped" });

                // Keep translation locked at start location to prevent sliding from 0,0
                boneAnim.translate.push({
                   time: 0,
                   x: life[0].state.position.x * 10,
                   y: life[0].state.position.y * 10,
                   curve: "stepped"
                });
            }

            slotAnim.attachment.push({ time: birthTime, name: "particle" });

            // Rebirth gap invisible frame
            if (i > 0 || life[0].frame > 0) {
                slotAnim.rgba.push({ time: (life[0].frame - 1) / 24, color: 'ffffff00', curve: "stepped" });
            }
            if (seqInfo && seqInfo.count > 0 && sequenceAnim) {
                  sequenceAnim.push({
                       time: birthTime,
                       mode: "loop",
                       delay: 1 / seqInfo.fps
                  });
              }

            // Do not downsample keys - bake every cached frame so it perfectly follows physical curves!
            const bakedKeys = life;

            for (let k = 0; k < bakedKeys.length; k++) {
              const { frame, state } = bakedKeys[k];
              const time = frame / 24;

              const alphaFade = Math.max(0, Math.min(1, 1 - (state.age / state.lifetime)));
              const baseAlpha = Math.max(0, Math.min(1, state.opacity));
              const finalAlpha = Math.floor(alphaFade * baseAlpha * 255).toString(16).padStart(2, '0');

              // Since \`stepped\` was crashing, let's explicitly inject \`curve: "linear"\` AGAIN just in case
              // But ONLY for the properties that can take curves. Alpha/RGB usually does too,
// For the last key of a lifespan, use stepped to prevent it from linearly interpolating (drifting back)
                // during the delay before its next birth in a recycled track.
                const isLastKey = k === bakedKeys.length - 1;
                const curveDefinition = !isLastKey ? { curve: "linear" } : { curve: "stepped" };

              slotAnim.rgba.push({ time, color: \`ffffff\${finalAlpha}\`, ...curveDefinition });

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
                 ...curveDefinition
              });


            }

            // Death invisible frame
            const deathFrame = life[life.length - 1].frame;
            const deathTime = (deathFrame + 1) / 24;
            slotAnim.rgba.push({ time: deathTime, color: 'ffffff00', curve: 'stepped' });
            slotAnim.attachment.push({ time: deathTime, name: null });
          }
`;

const replaceStr = `          // Process each lifespan segment, downsampling to exactly 4 keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            if (life.length === 0) continue;

            const birthTime = life[0].frame / 24;

            // Ensure explicitly null at absolute beginning if born late
            if (i === 0 && life[0].frame > 0) {
                slotAnim.attachment.push({ time: 0, name: null });
                slotAnim.rgba.push({ time: 0, color: 'ffffff00', curve: "stepped" });

                // Keep translation locked at start location to prevent sliding from 0,0
                boneAnim.translate.push({
                   time: 0,
                   x: life[0].state.position.x * 10,
                   y: life[0].state.position.y * 10,
                   curve: "stepped"
                });
            }

            const prevLife = i > 0 ? lifespans[i - 1] : null;
            const prevDeathFrame = prevLife ? prevLife[prevLife.length - 1].frame : -2;
            const isImmediateRespawn = (prevDeathFrame === life[0].frame - 1);

            if (!isImmediateRespawn) {
                slotAnim.attachment.push({ time: birthTime, name: "particle" });

                // Rebirth gap invisible frame
                if (i > 0) {
                    slotAnim.rgba.push({ time: (life[0].frame - 1) / 24, color: 'ffffff00', curve: "stepped" });
                }
            }

            if (seqInfo && seqInfo.count > 0 && sequenceAnim) {
                  sequenceAnim.push({
                       time: birthTime,
                       mode: "loop",
                       delay: 1 / seqInfo.fps
                  });
              }

            // Do not downsample keys - bake every cached frame so it perfectly follows physical curves!
            const bakedKeys = life;

            for (let k = 0; k < bakedKeys.length; k++) {
              const { frame, state } = bakedKeys[k];
              const time = frame / 24;

              const alphaFade = Math.max(0, Math.min(1, 1 - (state.age / state.lifetime)));
              const baseAlpha = Math.max(0, Math.min(1, state.opacity));
              const finalAlpha = Math.floor(alphaFade * baseAlpha * 255).toString(16).padStart(2, '0');

              // For the last key of a lifespan, use stepped to prevent it from linearly interpolating (drifting back)
              // during the delay before its next birth in a recycled track.
              const isLastKey = k === bakedKeys.length - 1;
              const curveDefinition = !isLastKey ? { curve: "linear" } : { curve: "stepped" };

              slotAnim.rgba.push({ time, color: \`ffffff\${finalAlpha}\`, ...curveDefinition });

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
                 ...curveDefinition
              });
            }

            // Death invisible frame
            const deathFrame = life[life.length - 1].frame;
            const nextLife = i < lifespans.length - 1 ? lifespans[i + 1] : null;
            const nextBirthFrame = nextLife ? nextLife[0].frame : -2;
            const isEndingInstantlyIntoNext = (nextBirthFrame === deathFrame + 1);

            if (!isEndingInstantlyIntoNext) {
                const deathTime = (deathFrame + 1) / 24;
                slotAnim.rgba.push({ time: deathTime, color: 'ffffff00', curve: 'stepped' });
                slotAnim.attachment.push({ time: deathTime, name: null });
            }
          }`;

// Check exact match by ignoring all whitespace 
const clean = str => str.replace(/\s+/g, '');

const oldClean = clean(oldStr);
const fileClean = clean(code);

if (fileClean.includes(oldClean)) {
    console.log('Match found! Doing smart replacement...');
    // We will do a regex approach to match oldStr loosely.
    
    // Actually, let's just find the start and end indices of the block.
    const startStr = '// Process each lifespan segment, downsampling to exactly 4 keys';
    const endStr = 'slotAnim.attachment.push({ time: deathTime, name: null });\n          }';
    
    const startIdx = code.indexOf(startStr);
    const endIdx = code.indexOf(endStr, startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        const trueEndIdx = endIdx + endStr.length;
        code = code.substring(0, startIdx) + replaceStr + code.substring(trueEndIdx);
        fs.writeFileSync(file, code);
        console.log('Successfully replaced!');
    } else {
        console.log('Could not find exact boundaries.');
    }
} else {
    console.log('No loose match found.');
}
