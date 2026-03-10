const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regex2 = /\/\/ Chunk history into contiguous life segments[\s\S]*?const lifespans = \[\];[\s\S]*?let currentLifespan = \[\];[\s\S]*?let lastFrame = -2;[\s\S]*?for \(const item of history\) \{[\s\S]*?if \(item\.frame > lastFrame \+ 1 && lastFrame !== -2\) \{[\s\S]*?lifespans\.push\(currentLifespan\);[\s\S]*?currentLifespan = \[\];[\s\S]*?\}[\s\S]*?currentLifespan\.push\(item\);[\s\S]*?lastFrame = item.frame;[\s\S]*?\}/;

const newLogic2 = `// Chunk history into contiguous life segments
        if (history.length > 0 && history[0].frame > 0) {
            slotAnim.attachment.push({ time: 0, name: null });
            slotAnim.rgba.push({ time: 0, color: "ffffff00", curve: "stepped" });
            boneAnim.scale.push({ time: 0, x: 0, y: 0, curve: "stepped" });
            boneAnim.rotate.push({ time: 0, angle: 0, curve: "stepped" });
        }
          const lifespans = [];
          let currentLifespan: typeof history = [];
          let lastFrame = -2;
          let lastAge = -1;

          for (const item of history) {
            if ((item.frame > lastFrame + 1 || item.state.age < lastAge) && lastFrame !== -2) {
              lifespans.push(currentLifespan);
              currentLifespan = [];
            }
            currentLifespan.push(item);
            lastFrame = item.frame;
            lastAge = item.state.age;
          }`;

code = code.replace(regex2, newLogic2);
fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Replaced block 2');