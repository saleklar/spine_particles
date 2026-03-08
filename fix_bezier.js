const fs = require('fs');

const path = 'src/Scene3D.tsx';
let txt = fs.readFileSync(path, 'utf8');

const regex = /const isLastKey = k === bakedKeys\.length - 1;[^]+?\.\.\.bezierArray[\s]+}\);/g;

const replacement = `const isLastKey = k === bakedKeys.length - 1;
              let translateCurve = {};
              let scaleCurve = {};
              let rgbaCurve = {};
              
              const currentFinalAlphaFloat = alphaFade * baseAlpha;

              if (!isLastKey) {
                const nextFrameKey = bakedKeys[k + 1];
                const nextTime = nextFrameKey.frame / 24;
                const nextState = nextFrameKey.state;
                
                const cTime1 = time + (nextTime - time) * 0.333;
                const cTime2 = time + (nextTime - time) * 0.667;
                
                // Spine 4.2 curve format uses absolute handles [cx1, cy1, cx2, cy2] per interpolated property
                const tx1 = state.position.x * 10;
                const tx2 = nextState.position.x * 10;
                const ty1 = state.position.y * 10;
                const ty2 = nextState.position.y * 10;
                translateCurve = { curve: [
                    cTime1, tx1, cTime2, tx2,
                    cTime1, ty1, cTime2, ty2
                ] };
                
                const s1 = Math.max(0.05, state.size * 4) / 64;
                const s2 = Math.max(0.05, nextState.size * 4) / 64;
                scaleCurve = { curve: [
                    cTime1, s1, cTime2, s2,
                    cTime1, s1, cTime2, s2
                ] };

                const nextAlphaFade = Math.max(0, Math.min(1, 1 - (nextState.age / nextState.lifetime)));
                const nextBaseAlpha = Math.max(0, Math.min(1, nextState.opacity));
                const nextFinalAlphaFloat = nextAlphaFade * nextBaseAlpha;
                
                rgbaCurve = { curve: [
                    cTime1, 1, cTime2, 1, 
                    cTime1, 1, cTime2, 1, 
                    cTime1, 1, cTime2, 1, 
                    cTime1, currentFinalAlphaFloat, cTime2, nextFinalAlphaFloat
                ] };
              }

              slotAnim.rgba.push({ time, color: \`ffffff\${finalAlpha}\`, ...rgbaCurve });

              boneAnim.translate.push({
                 time,
                 x: state.position.x * 10,
                 y: state.position.y * 10,
                 ...translateCurve
              });

              const sizeScale = Math.max(0.05, state.size * 4) / 64;
              boneAnim.scale.push({
                 time,
                 x: sizeScale,
                 y: sizeScale,
                 ...scaleCurve
              });`;

txt = txt.replace(regex, replacement);
fs.writeFileSync(path, txt);
console.log("Replaced!");
