const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /for \(const item of history\) \{\s*if \(item\.frame > lastFrame \+ 1 && lastFrame !== -2\) \{/g,
  `let lastAge = -1;
          for (const item of history) {
            // Split lifespan if there is a gap in frames OR if the particle's age resets (meaning a new particle reused this track immediately)
            if ((item.frame > lastFrame + 1 || item.state.age < lastAge) && lastFrame !== -2) {`
);

code = code.replace(
  /currentLifespan\.push\(item\);\s*lastFrame = item\.frame;\s*\}/g,
  `currentLifespan.push(item);
            lastFrame = item.frame;
            lastAge = item.state.age;
          }`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed age separation');
