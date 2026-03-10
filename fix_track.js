const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

code = code.replace(
  /const trackData = new Map<number, \{ frame: number, state: CachedParticleState \}\[\]>\(\);[\s\S]*?const boneName = `bone_\$\{trackId\}`;/,
  `const trackData = new Map<string, { frame: number, state: CachedParticleState }[]>();

      // Group states by trackId
      for (const [frameObj, states] of frames) {
        for (const state of states) {
          const uniqueId = \`\${state.emitterId}_\${state.trackId}\`;
          if (!trackData.has(uniqueId)) trackData.set(uniqueId, []);
          trackData.get(uniqueId)!.push({ frame: frameObj, state });
        }
      }

      // Root bone
      spineData.bones.push({ name: "root" });

      // Cache emitter sequence info
      const emitterSequences = new Map<string, {count: number, fps: number}>();
      (sceneSettings?.objects || []).forEach(obj => {
         if (obj.type === 'emitter' && obj.sequenceCount) {
             emitterSequences.set(obj.id, {
                 count: obj.sequenceCount,
                 fps: obj.sequenceFps || 24
             });
         }
      });


      trackData.forEach((history, trackId) => {
        const slotName = \`particle_\${trackId}\`;
        const boneName = \`bone_\${trackId}\`;`
);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('Fixed track typing and group!');
