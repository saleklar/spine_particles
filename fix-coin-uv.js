const fs = require('fs');

const path = 'src/Scene3DAnimator.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /geometries\.forEach\(g => \{\s*g\.deleteAttribute\('uv'\);\s*g\.deleteAttribute\('normal'\);\s*\}\);\s*geometry = BufferGeometryUtils\.mergeGeometries\(geometries, false\);\s*geometry\.computeVertexNormals\(\);/;

const replacement = `geometries.forEach(g => {
        g.deleteAttribute('uv');
        g.deleteAttribute('normal');
    });
    geometry = BufferGeometryUtils.mergeGeometries(geometries, false);
    geometry.computeVertexNormals();

    // Reconstruct UV mapping via Planar Projection so textures map correctly
    const posAttribute = geometry.attributes.position;
    const uvArray = new Float32Array(posAttribute.count * 2);
    const r = radius > 0 ? radius : 50;
    for (let i = 0; i < posAttribute.count; i++) {
        const px = posAttribute.getX(i);
        const py = posAttribute.getY(i);
        // Map [-r, r] to [0, 1] on both axes
        uvArray[i * 2] = (px / r) * 0.5 + 0.5;
        uvArray[i * 2 + 1] = (py / r) * 0.5 + 0.5;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
console.log('Fixed UV missing issue on Coin geometry.');
