const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');

if (code.includes("return 'mesh_bounds';")) {
  console.log('Already has mesh_bounds!');
} else {
  let patch = `                  if (source.type === 'Cylinder' || source.type === 'Cone' || source.type === 'Torus') return 'ball';
                  if (source.type === 'Spine' || source.type === 'Animator3D' || source.type === '3DModel') return 'mesh_bounds';`;
  code = code.replace(/if\s*\(source\.type === 'Cylinder' \|\| source\.type === 'Cone' \|\| source\.type === 'Torus'\) return 'ball';/, patch);

  let searchStr = `                  } else if (emitterType === 'point') {
                    localNormal.set(0, -0.5, 1).normalize();
                  }`;

  let dispatchPatch = `                  } else if (emitterType === 'mesh_bounds') {
                    sourceMesh.updateMatrixWorld(true);
                    let lx = 0, ly = 0, lz = 0;
                    
                    const globalBox = new THREE.Box3().setFromObject(sourceMesh);
                    if (!globalBox.isEmpty()) {
                        const size = new THREE.Vector3();
                        globalBox.getSize(size);
                        
                        const worldX = globalBox.min.x + Math.random() * size.x;
                        const worldY = globalBox.min.y + Math.random() * size.y;
                        const worldZ = globalBox.min.z + Math.random() * size.z;
                        let worldPos = new THREE.Vector3(worldX, worldY, worldZ);
                        
                        if (isEdgeMode || isSurfaceMode) {
                            const c = new THREE.Vector3();
                            globalBox.getCenter(c);
                            const dx = worldX - c.x;
                            const dy = worldY - c.y;
                            const dz = worldZ - c.z;
                            const nx = Math.abs(dx) / (size.x/2);
                            const ny = Math.abs(dy) / (size.y/2);
                            const nz = Math.abs(dz) / (size.z/2);
                            const m = Math.max(nx, ny, nz);
                            if (m === nx) worldPos.x = c.x + Math.sign(dx) * size.x / 2;
                            else if (m === ny) worldPos.y = c.y + Math.sign(dy) * size.y / 2;
                            else worldPos.z = c.z + Math.sign(dz) * size.z / 2;
                        }
                        
                        const smWorldPos = new THREE.Vector3();
                        sourceMesh.getWorldPosition(smWorldPos);
                        
                        const diff = worldPos.clone().sub(smWorldPos);
                        diff.applyEuler(new THREE.Euler(-sourceMesh.rotation.x, -sourceMesh.rotation.y, -sourceMesh.rotation.z));
                        diff.set(diff.x / sourceMesh.scale.x, diff.y / sourceMesh.scale.y, diff.z / sourceMesh.scale.z);
                        
                        lx = diff.x; ly = diff.y; lz = diff.z;
                    }

                    localOffset.set(lx, ly, lz);
                    localNormal.set(0, 1, 0);
                  } else if (emitterType === 'point') {
                    localNormal.set(0, -0.5, 1).normalize();
                  }`;
  
  if(code.indexOf(searchStr) !== -1) {
    code = code.replace(searchStr, dispatchPatch);
    fs.writeFileSync('src/Scene3D.tsx', code);
    console.log('Done patch mesh_bounds single replacement!');
  } else {
    console.log('Could not find search string in Scene3D.tsx');
  }
}
