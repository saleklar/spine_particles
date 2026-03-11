const fs = require('fs');

let c = fs.readFileSync('src/FireHeadless.ts', 'utf8');

c = c.replace(/const camera = new THREE\.OrthographicCamera\(.*?\);/, `
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0.5, 0);
`);

c = c.replace(/const geometry = new THREE\.PlaneGeometry\(2, 2\);/, `
    const GRID_SIZE = 24;
    const SPACING = 0.2;
    const geometry = new THREE.BoxGeometry(SPACING*0.9, SPACING*0.9, SPACING*0.9);
`);

let oldMaterialHeadless = `const material = new THREE.ShaderMaterial({`;
let instMeshRegexHeadless = /const mesh = new THREE\.Mesh\(geometry, material\);\s*scene\.add\(mesh\);/;
let newMeshInitHeadless = `
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    
    const COUNT = GRID_SIZE * GRID_SIZE * GRID_SIZE;
    const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
    let idx = 0;
    const dummy = new THREE.Object3D();
    const offset = (GRID_SIZE / 2.0) * SPACING;
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let z = 0; z < GRID_SIZE; z++) {
                dummy.position.set(x * SPACING - offset, y * SPACING - offset + 1.0, z * SPACING - offset);
                dummy.updateMatrix();
                mesh.setMatrixAt(idx++, dummy.matrix);
            }
        }
    }
    scene.add(mesh);
`;

c = c.replace(instMeshRegexHeadless, newMeshInitHeadless);

fs.writeFileSync('src/FireHeadless.ts', c);
