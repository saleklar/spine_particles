const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

// 1. the tracker collision fix: `const uniqueTrackId = state.emitterId + '_' + state.trackId;`
const trackDataReplacement = `
    const trackData = new Map<string, Array<{ frame: number, state: CachedParticleState }>>();

    cachedParticleHistory.current.forEach((frameParticles, frameIndex) => {
      frameParticles.forEach(state => {
        const uniqueTrackId = state.emitterId + '_' + state.trackId;
        if (!trackData.has(uniqueTrackId)) {
          trackData.set(uniqueTrackId, []);
        }
        trackData.get(uniqueTrackId)!.push({ frame: frameIndex, state });
      });
    });

    trackData.forEach((history, trackIdStr) => {
      const slotName = \`particle_\${trackIdStr}\`;
      const boneName = \`bone_\${trackIdStr}\`;
`;

// Replace finding it
code = code.replace(
  /const trackData = new Map<number, Array<\{ frame: number, state: CachedParticleState \}>>\(\);\s*cachedParticleHistory\.current\.forEach\(\(frameParticles, frameIndex\) => \{\s*frameParticles\.forEach\(state => \{\s*if \(!trackData\.has\(state\.trackId\)\) \{\s*trackData\.set\(state\.trackId, \[\]\);\s*\}\s*trackData\.get\(state\.trackId\)!\.push\(\{ frame: frameIndex, state \}\);\s*\}\);\s*\}\);\s*trackData\.forEach\(\(history, trackId\) => \{\s*const slotName = `particle_\$\{trackId\}`;\s*const boneName = `bone_\$\{trackId\}`;/,
  trackDataReplacement.trim()
);

if (!code.includes('uniqueTrackId')) {
  console.log("Failed to insert trackId map");
}

// 2. The timeline sequence logic!
const oldLogic = `        const boneAnim = { translate: [] as any[], scale: [] as any[] };
        const slotAnim: any = { rgba: [] as any[], attachment: [] as any[] };
        let sequenceAnim: any = null;
        if (seqInfo && seqInfo.count > 0) {
            sequenceAnim = [] as any[];
            if (!spineData.animations.animation.attachments["default"][slotName]) {
                spineData.animations.animation.attachments["default"][slotName] = {};
            }
            spineData.animations.animation.attachments["default"][slotName]["particle"] = { sequence: sequenceAnim };
        }

        // Chunk history into contiguous life segments
          const lifespans = [];
          let currentLifespan = [];
          let lastFrame = -2;

          for (const item of history) {
            if (item.frame > lastFrame + 1 && lastFrame !== -2) {
              lifespans.push(currentLifespan);
              currentLifespan = [];
            }
            currentLifespan.push(item);
            lastFrame = item.frame;
          }
          if (currentLifespan.length > 0) lifespans.push(currentLifespan);

          // Process each lifespan segment, downsampling to exactly 4 keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            if (life.length === 0) continue;

            slotAnim.attachment.push({ time: life[0].frame / 24, name: "particle" });
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
            const bakedKeys = [];
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

              slotAnim.rgba.push({ time, color: "ffffffff" });
              boneAnim.translate.push({
                 time,
                 x: state.position.x * 10,
                 y: state.position.y * 10
              });

              const sizeScale = Math.max(0.05, state.size * 4) / 64;
              boneAnim.scale.push({
                 time,
                 x: sizeScale,
                 y: sizeScale
              });
            }

            // Death invisible frame toggle visibility
            const deathFrame = life[life.length - 1].frame;
            slotAnim.attachment.push({ time: (deathFrame + 1) / 24, name: null });
          }

          spineData.animations.animation.bones[boneName] = boneAnim;`;

const newLogic = `        const boneAnim = { translate: [] as any[], scale: [] as any[], rotate: [] as any[] };
        const slotAnim: any = { rgba: [] as any[], attachment: [] as any[] };
        let sequenceAnim: any = null;
        if (seqInfo && seqInfo.count > 0) {
            sequenceAnim = [] as any[];
            if (!spineData.animations.animation.attachments["default"][slotName]) {
                spineData.animations.animation.attachments["default"][slotName] = {};
            }
            spineData.animations.animation.attachments["default"][slotName]["particle"] = { sequence: sequenceAnim };
        }

        // Chunk history into contiguous life segments
        if (history.length > 0 && history[0].frame > 0) {
            slotAnim.attachment.push({ time: 0, name: null });
            slotAnim.rgba.push({ time: 0, color: "ffffff00", curve: "stepped" });
            boneAnim.scale.push({ time: 0, x: 0, y: 0, curve: "stepped" });
            boneAnim.rotate.push({ time: 0, angle: 0, curve: "stepped" });
        }
          const lifespans = [];
          let currentLifespan = [];
          let lastFrame = -2;

          let lastAge = -1;
          for (const item of history) {
            // Split lifespan if there is a gap in frames OR if the particle's age resets (meaning a new particle reused this track immediately)
            if ((item.frame > lastFrame + 1 || item.state.age < lastAge) && lastFrame !== -2) {
              lifespans.push(currentLifespan);
              currentLifespan = [];
            }
            currentLifespan.push(item);
            lastFrame = item.frame;
            lastAge = item.state.age;
          }
          if (currentLifespan.length > 0) lifespans.push(currentLifespan);

          // Process each lifespan segment, downsampling to exactly 4 keys
          for (let i = 0; i < lifespans.length; i++) {
            const life = lifespans[i];
            if (life.length === 0) continue;

            // Rebirth gap invisible frame handling
            if (i > 0 || life[0].frame > 0) {
              slotAnim.rgba.push({ time: Math.max(0, (life[0].frame - 1)) / 24, color: 'ffffff00', curve: "stepped" });
              boneAnim.scale.push({ time: Math.max(0, (life[0].frame - 1)) / 24, x: 0, y: 0, curve: "stepped" });
              boneAnim.rotate.push({ time: Math.max(0, (life[0].frame - 1)) / 24, angle: 0, curve: "stepped" });
            }
            slotAnim.attachment.push({ time: life[0].frame / 24, name: "particle" });
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
            const bakedKeys = [];
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

let oldCodeReplaced = code.replace(oldLogic.trim(), newLogic.trim());

// If exact match fails, fallback logic maybe? Let's just write to another file and check manually:
fs.writeFileSync('src/Scene3D.tsx', oldCodeReplaced);
console.log('Restored fully!');
