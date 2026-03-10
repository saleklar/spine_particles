const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /const trackData = new Map<number, \{ frame: number, state: CachedParticleState \}\[\]>\(\);/,
  `const trackData = new Map<string, { frame: number, state: CachedParticleState }[]>();`
);

code = code.replace(
  /if \(!trackData\.has\(state\.trackId\)\) trackData\.set\(state\.trackId, \[\]\);\s*trackData\.get\(state\.trackId\)\!\.push\(\{ frame: frameObj, state \}\);/g,
  `const uniqueTrackId = \`\${state.emitterId}_\${state.trackId}\`;
          if (!trackData.has(uniqueTrackId)) trackData.set(uniqueTrackId, []);
          trackData.get(uniqueTrackId)!.push({ frame: frameObj, state });`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed track collision');
