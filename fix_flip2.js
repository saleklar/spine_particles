const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');

const regex = /scene\.remove\(particle\.mesh\);\s*scene\.add\(replacementMesh\);\s*particle\.mesh = replacementMesh;\s*\}/g;

code = code.replace(regex, \scene.remove(particle.mesh);
                    scene.add(replacementMesh);
                    particle.mesh = replacementMesh;
                    setParticleSize(particle.mesh, getPreviewedParticleSize(particle.baseSize ?? 3), particle.flipX);
                  }\);

fs.writeFileSync('src/Scene3D.tsx', code);
console.log('regex replaced');
