const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regexMap = /const texture = getParticleTexture\(resolvedParticleType, customGlow\);\s*if \(shouldUseSprite\) \{\s*const spriteMaterial = new THREE\.SpriteMaterial\(\{\s*color: new THREE\.Color\(color\),\s*map: \(resolvedParticleType === 'sprites' \|\| resolvedParticleType === '3d-model'\) && spriteTexture \? spriteTexture : texture,\s*transparent: true,\s*opacity,\s*depthWrite: !customGlow,\s*blending: customGlow \? THREE\.AdditiveBlending : THREE\.NormalBlending,\s*\}\);\s*const sprite = new THREE\.Sprite\(spriteMaterial\);\s*sprite\.position\.copy\(position\);\n\s*sprite\.center\.set\(pivotX, pivotY\);\s*setParticleSize\(sprite, size, flipX\);/;

if (regexMap.test(txt)) {
    const replacement = `const texture = getParticleTexture(resolvedParticleType, customGlow);

        if (shouldUseSprite) {
          let baseMap = (resolvedParticleType === 'sprites' || resolvedParticleType === '3d-model') && spriteTexture ? spriteTexture : texture;
          if (baseMap && flipX) {
            baseMap = baseMap.clone();
            baseMap.repeat.x = -1;
            // When scaling with repeat.x = -1, Three.js offsets the map. We need to shift it back.
            // Oh wait, for Sprites, is offset needed if we flip? Let's just set repeat.x = -1 and offset.x = 1.
            baseMap.offset.x = 1;
            baseMap.needsUpdate = true;
          }

          const spriteMaterial = new THREE.SpriteMaterial({
            color: new THREE.Color(color),
            map: baseMap,
            transparent: true,
            opacity,
            depthWrite: !customGlow,
            blending: customGlow ? THREE.AdditiveBlending : THREE.NormalBlending,
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.position.copy(position);
          sprite.center.set(flipX ? 1.0 - pivotX : pivotX, pivotY);
          setParticleSize(sprite, size, flipX);`;
          
    txt = txt.replace(regexMap, replacement);
    fs.writeFileSync('src/Scene3D.tsx', txt);
    console.log("Patched createParticleMesh perfectly");
} else {
    console.log("Regex didn't match.");
}
