const fs = require('fs');
let txt = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const s = `        const texture = getParticleTexture(resolvedParticleType, customGlow);

        if (shouldUseSprite) {
          const spriteMaterial = new THREE.SpriteMaterial({
            color: new THREE.Color(color),
            map: (resolvedParticleType === 'sprites' || resolvedParticleType === '3d-model') && spriteTexture ? spriteTexture : texture,
            transparent: true,
            opacity,
            depthWrite: !customGlow,
            blending: customGlow ? THREE.AdditiveBlending : THREE.NormalBlending,
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.position.copy(position);
          setParticleSize(sprite, size, flipX);
          setParticleRotation(sprite, rotation);`;

const r = `        const texture = getParticleTexture(resolvedParticleType, customGlow);

        if (shouldUseSprite) {
          let baseMap = (resolvedParticleType === 'sprites' || resolvedParticleType === '3d-model') && spriteTexture ? spriteTexture : texture;
          if (baseMap && flipX) {
            baseMap = baseMap.clone();
            baseMap.repeat.x = -1;
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
          setParticleSize(sprite, size, flipX);
          setParticleRotation(sprite, rotation);`;

// Handle carriage returns
let fixedTxt = txt.replace(/\r\n/g, '\n');

if (fixedTxt.includes(s)) {
    fixedTxt = fixedTxt.replace(s, r);
    fs.writeFileSync('src/Scene3D.tsx', fixedTxt);
    console.log("Replaced create");
} else {
    console.log("NOT FOUND!");
}
