const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const s = code.indexOf('handleCreateFirePreset = useCallback(');
const e = code.indexOf('setShowCreateMenu(false);', s);

const newFunc = `handleCreateFirePreset = useCallback(async (presetType: 'campfire' | 'torch') => {
    let dataUrls: string[] = [];
    if (presetType === 'torch') {
      try {
        dataUrls = await generateFireSequenceHeadless(defaultTorchParams);
      } catch(e) { console.error(e) }
    } else if (presetType === 'campfire') {
      try {
        dataUrls = await generateFireSequenceHeadless(defaultCampfireParams);
      } catch(e) { console.error(e) }
    }
    const emitterId = \`emitter_\${Date.now()}\`;
    const newEmitter: SceneObject = {
      id: emitterId,
      name: presetType === 'campfire' ? 'Campfire Emitter' : 'Torch Emitter',
      type: 'Emitter',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      parentId: null,
      properties: {
        emissionRate: presetType === 'campfire' ? 80 : 150,
        emitterType: 'circle',
        emissionMode: 'volume',
        layerImageDataUrl: '',
        particleLifetime: presetType === 'campfire' ? 2 : 1.5,
        particleSpeed: presetType === 'campfire' ? 20 : 50,
        particleColor: '#ffffff',
        particleSize: dataUrls.length > 0 ? (presetType === 'campfire' ? 20.0 : 15.0) : 10.0,
        particleOpacity: 0.8,
        particleType: dataUrls.length > 0 ? 'sprites' : 'dots',
        particleGlow: true,
        particleRotation: 0,
        particleRotationVariation: 180,
        particleRotationSpeed: 2,
        particleRotationSpeedVariation: 1,
        particleStretch: false,
        particleStretchAmount: 0.05,
        particleSpriteImageDataUrl: '',
        particleSpriteImageName: '',
        particleSpriteSequenceDataUrls: dataUrls,
        particleSpriteSequenceFps: dataUrls.length > 0 ? (presetType === 'campfire' ? defaultCampfireParams.fps : defaultTorchParams.fps) : 30,
        particleSpriteSequenceFirstName: '',
        particleSpeedVariation: 0.3,
        particleLifetimeVariation: 0.2,
        particleSizeVariation: 0.4,
        particleColorVariation: 0,
        particleOpacityOverLife: true,
        particleColorOverLife: true,
        particleColorOverLifeTarget: '#ffbb00', // fade to orange instead of pure black/white
        particleSizeOverLife: 'shrink',
        particleSeed: Math.floor(Math.random() * 1000000),
        showPathCurves: false,
        pathCurveKeyCount: 5,
      }
    };

    // Adjust scale for shape based on preset
    const shapeScaleX = presetType === 'campfire' ? 1.5 : 0.5;
    const shapeScaleZ = presetType === 'campfire' ? 1.5 : 0.5;

    const baseShapeNode = createEmitterShapeNode(emitterId, newEmitter);
    const emitterShapeNode = {
      ...baseShapeNode,
      scale: { x: shapeScaleX, y: 1, z: shapeScaleZ }
    };

    // Physics forces
    const windForceId = \`force-\${Date.now()}-wind\`;
    const windForce: PhysicsForce = {
      id: windForceId,
      name: 'Fire Wind',
      type: 'wind',
      position: { x: 0, y: 0, z: 0 },
      strength: presetType === 'campfire' ? 15 : 30, // move particles up
      radius: 100,
      direction: { x: 0, y: 1, z: 0 },
      affectedEmitterIds: [emitterId],
      enabled: true,
    };

    const turbulenceForceId = \`force-\${Date.now()}-turb\`;
    const turbulenceForce: PhysicsForce = {
      id: turbulenceForceId,
      name: 'Fire Turbulence',
      type: 'turbulence',
      position: { x: 0, y: 50, z: 0 },
      strength: presetType === 'campfire' ? 20 : 10,
      radius: 200,
      direction: { x: 0, y: 1, z: 0 },
      affectedEmitterIds: [emitterId],
      enabled: true,
    };

    setSceneObjects((prev) => [...prev, newEmitter, emitterShapeNode]);
    setPhysicsForces((prev) => [...prev, windForce, turbulenceForce]);
    setSelectedObjectId(newEmitter.id);
    `;

code = code.substring(0, s) + newFunc + code.substring(e);
fs.writeFileSync('src/App.tsx', code);
console.log('Reset physical presets');
