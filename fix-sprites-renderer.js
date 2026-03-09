const fs = require('fs');

const path = 'src/Scene3D.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replacements
content = content.replace(
  "resolvedParticleType === 'circles' || resolvedParticleType === 'glow-circles' || resolvedParticleType === 'sprites' || resolvedParticleType === 'stars';",
  "resolvedParticleType === 'circles' || resolvedParticleType === 'glow-circles' || resolvedParticleType === 'sprites' || resolvedParticleType === '3d-model' || resolvedParticleType === 'stars';"
);

content = content.replace(
  "effectiveParticleType === 'circles' || effectiveParticleType === 'glow-circles' || effectiveParticleType === 'sprites' || effectiveParticleType === 'stars';",
  "effectiveParticleType === 'circles' || effectiveParticleType === 'glow-circles' || effectiveParticleType === 'sprites' || effectiveParticleType === '3d-model' || effectiveParticleType === 'stars';"
);

content = content.replace(
  "map: resolvedParticleType === 'sprites' && spriteTexture ? spriteTexture : texture,",
  "map: (resolvedParticleType === 'sprites' || resolvedParticleType === '3d-model') && spriteTexture ? spriteTexture : texture,"
);

const toReplace = [
  "emitterParticleType === 'sprites'",
  "previewedType === 'sprites'",
  "effectiveParticleType === 'sprites'",
  "textureType === 'sprites'",
  "resolvedParticleType === 'sprites'"
];

for (const query of toReplace) {
    const replacement = `(${query} || ${query.replace(/'sprites'/, "'3d-model'")})`;
    content = content.split(query).join(replacement);
}

fs.writeFileSync(path, content);
console.log('done updating sprites logic');
