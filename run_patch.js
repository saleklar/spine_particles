const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// Add domainResolution to GeneratorParams
code = code.replace(/resolution: number;/, "resolution: number;\n  domainResolution?: number;");

// Update Default Preset to have domainResolution: 24
code = code.replace(/resolution: 128,/g, "resolution: 128, domainResolution: 24,");
code = code.replace(/if \(parsed\.peakTemperature === undefined\) parsed\.peakTemperature = 3500;/g, "if (parsed.peakTemperature === undefined) parsed.peakTemperature = 3500;\n          if (parsed.domainResolution === undefined) parsed.domainResolution = 24;");
code = code.replace(/peakTemperature: 3500\n    };/g, "peakTemperature: 3500,\n      domainResolution: 24\n    };");

// Add meshRef
let addRefRegex = /const controlsRef = useRef<OrbitControls \| null>\(null\);/;
code = code.replace(addRefRegex, "const controlsRef = useRef<OrbitControls | null>(null);\n  const meshRef = useRef<THREE.InstancedMesh | null>(null);\n  const [sceneReady, setSceneReady] = useState(false);");

// Wrap the main mesh creation
let meshCodeRegex = /const GRID_SIZE = 24;[\s\S]*?scene\.add\(mesh\);/;

let mainEffectEnd = "scene.add(mesh);\n\n    setSceneReady(true);";
code = code.replace(/scene\.add\(mesh\);/, mainEffectEnd);

let separateEffect = `
  useEffect(() => {
    if (!sceneReady || !sceneRef.current || !materialRef.current) return;
    
    if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        meshRef.current.dispose();
        meshRef.current = null;
    }
    
    const GRID_SIZE = params.domainResolution || 24;
    const VOLUME_SIZE = 4.8;
    const SPACING = VOLUME_SIZE / Math.max(1, GRID_SIZE);
    const geometry = new THREE.BoxGeometry(SPACING*0.9, SPACING*0.9, SPACING*0.9);
    
    const COUNT = GRID_SIZE * GRID_SIZE * GRID_SIZE;
    const mesh = new THREE.InstancedMesh(geometry, materialRef.current, COUNT);
    
    let idx = 0;
    const dummy = new THREE.Object3D();
    const offset = VOLUME_SIZE / 2.0;
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let z = 0; z < GRID_SIZE; z++) {
                dummy.position.set(x * SPACING - offset + SPACING/2, y * SPACING - offset + SPACING/2 + 1.0, z * SPACING - offset + SPACING/2);
                dummy.updateMatrix();
                mesh.setMatrixAt(idx++, dummy.matrix);
            }
        }
    }
    sceneRef.current.add(mesh);
    meshRef.current = mesh;
  }, [sceneReady, params.domainResolution]);
`;

code = code.replace(/const \[isRendering, setIsRendering\] = useState\(false\);/, separateEffect + "\n  const [isRendering, setIsRendering] = useState(false);");

// Now we need to remove the initial mesh creation from the old mount or just leave it to be replaced instantly. Leaving it is fine but less efficient. Let's remove it and let the new effect do it.

let newMainEffectRegex = /const GRID_SIZE = 24;[\s\S]*?scene\.add\(mesh\);/;
code = code.replace(newMainEffectRegex, "/* GRID GENERATION MOVED TO SEPARATE USE_EFFECT */");

// Also add a UI slider for domainResolution
let uiInsert = `<div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', color: '#ccc' }}>Resolution <span style={{ float: 'right' }}>{params.resolution}</span></label>
            <input type="range" min="16" max="512" step="16" value={params.resolution} onChange={e => handleChange('resolution', Number(e.target.value))} />
          </div>`;

let newUiInsert = uiInsert + `
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', color: '#ccc' }}>Voxel Domain Target <span style={{ float: 'right' }}>{params.domainResolution}</span></label>
            <input type="range" min="8" max="48" step="1" value={params.domainResolution || 24} onChange={e => handleChange('domainResolution', Number(e.target.value))} />
          </div>
`;
code = code.replace(uiInsert, newUiInsert);


fs.writeFileSync('patch_res.js', code);
