const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

// replace track logic
code = code.replace(/trackData = new Map<number/g, 'trackData = new Map<string');
code = code.replace(/trackData\.has\(state\.trackId\)/g, "trackData.has(state.emitterId + '_' + state.trackId)");
code = code.replace(/trackData\.set\(state\.trackId/g, "trackData.set(state.emitterId + '_' + state.trackId");
code = code.replace(/trackData\.get\(state\.trackId\)/g, "trackData.get(state.emitterId + '_' + state.trackId)");

// Now for rotation. We need to find the specific push methods.
code = code.replace(
  /const boneAnim = \{ translate: \[\] as any\[\], scale: \[\] as any\[\] \};/g,
  'const boneAnim = { translate: [] as any[], scale: [] as any[], rotate: [] as any[] };'
);

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time:\s*0,\s*x:\s*0,\s*y:\s*0,\s*curve:\s*"stepped"\s*\}\);/g,
  'boneAnim.scale.push({ time: 0, x: 0, y: 0, curve: "stepped" });\n            boneAnim.rotate.push({ time: 0, angle: 0, curve: "stepped" });'
);

code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time:\s*Math\.max\(0,\s*\(life\[0\]\.frame\s*-\s*1\)\)\s*\/\s*24,\s*x:\s*0,\s*y:\s*0,\s*curve:\s*"stepped"\s*\}\);/g,
  'boneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: "stepped" });\n              boneAnim.rotate.push({ time: Math.max(0, (life[0].frame - 1)) / 24, angle: 0, curve: "stepped" });'
);

// find the linear push to add rotate
let indexCurve = code.indexOf('boneAnim.scale.push({');
// The 4th instance of boneAnim.scale.push is the one we want.
// Let's just use string replace for the exact code.

let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('boneAnim.scale.push({') && lines[i+1].includes('time,') && lines[i+4].includes('curve: "linear"')) {
    // found it
    lines.splice(i + 6, 0, 
      '              boneAnim.rotate.push({',
      '                 time,',
      '                 angle: state.rotation * -(180 / Math.PI),',
      '                 ...curveDefinition',
      '              });'
    );
    break; // only first match! (we only have one loop anyway)
  }
}
code = lines.join('\n');

// final death frame
code = code.replace(
  /boneAnim\.scale\.push\(\{\s*time:\s*\(deathFrame\s*\+\s*1\)\s*\/\s*24,\s*x:\s*0,\s*y:\s*0,\s*curve:\s*"stepped"\s*\}\);/g,
  'boneAnim.scale.push({ time: (deathFrame + 1) / 24, x: 0, y: 0, curve: "stepped" });\n            boneAnim.rotate.push({ time: (deathFrame + 1) / 24, angle: 0, curve: "stepped" });'
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed file via smart replacement script.');
