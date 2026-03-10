const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

// 1. Hide by default in setup pose
code = code.replace(
  /spineData\.slots\.push\(\{ name: slotName, bone: boneName, attachment: "particle" \}\);/g,
  `spineData.slots.push({ name: slotName, bone: boneName });`
);

// 2. Fix attachment properties (remove prefix from name so it just expects particle.png)
code = code.replace(
  /"particle": \{ type: "region", name: "particles\/png\/particle", width: 64, height: 64, sequence: \{ count: seqInfo\.count, start: 0, digits: 2 \} \}/g,
  `"particle": { type: "region", name: "particle", width: 64, height: 64, sequence: { count: seqInfo.count, start: 0, digits: 2 } }`
);

code = code.replace(
  /\{ "particle": \{ type: "region", name: "particles\/png\/particle", width: 64, height: 64 \} \}/g,
  `{ "particle": { type: "region", name: "particle", width: 64, height: 64 } }`
);

// 3. Fix "moving back and forth" by enforcing stepped interpolation on final key of every lifespan
code = code.replace(
  /const curveDefinition = !isLastKey \? \{ curve: "linear" \} : \{\};/g,
  `const curveDefinition = !isLastKey ? { curve: "linear" } : { curve: "stepped" };`
);

// 4. Update getExportAssets to match the exact filename we're telling Spine to look for
code = code.replace(
  /name: \`images\/particles\/png\/particle_\$\{frameName\}\.png\`/g,
  `name: \`particle_\${frameName}.png\``
);
code = code.replace(
  /name: 'images\/particles\/png\/particle\.png'/g,
  `name: 'particle.png'`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log("Done");
