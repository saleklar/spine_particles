const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regex = /(if \(isUnderBudget && \(isPlayingRef\.current \|\| isCachingRef\.current\) && timeSinceLastEmit >= emissionInterval && activeSources\.length > 0\) \{)([\s\S]*?)(particleSystem\.lastEmit = now;\s*\})/m;

const match = code.match(regex);
if (match) {
  let block = match[2];
  
  // Add prng to the block start
  block = `\n                  const prng = mulberry32((emitterProps.particleSeed ?? 0) + (particleSystem.spawnCount ?? 0));\n                  particleSystem.spawnCount = (particleSystem.spawnCount ?? 0) + 1;\n` + block;
  
  // Replace Math.random() with prng()
  block = block.replace(/Math\.random\(\)/g, 'prng()');
  
  const replaced = code.replace(regex, match[1] + block + match[3]);
  fs.writeFileSync('src/Scene3D.tsx', replaced);
  console.log("Successfully patched random block!");
} else {
  console.log("Could not find block");
}
