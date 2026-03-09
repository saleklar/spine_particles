const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Normalize line endings to avoid regex issues
content = content.replace(/\r\n/g, '\n');

// Replace wrong handler names inside the Split view block we just injected:
content = content.replace("onObjectTransform={handleUpdateSelectedObjectTransform}", "onObjectTransform={handleObjectTransform}");
content = content.replace("onForceTransform={handleUpdatePhysicsForceTransform}", "onForceTransform={handleForceTransform}");
content = content.replace("onUpdateSceneSettings={handleUpdateSceneSettings}", ""); // We'll just remove this prop if it doesn't exist

const exportRegex = /  const handleExportToParticleSystem = useCallback\(\(dataUrls: string\[\]\) => \{[\s\S]*?setSelectedObjectId\(newObject\.id\);\n    \}\n  \}, \[sceneObjects, selectedObjectId\]\);/;

const handleExportCode = "  const handleExportToParticleSystemNoSwitch = useCallback((dataUrls: string[]) => {\n" +
      "    let targetId = selectedObjectId;\n" +
      "    let target = sceneObjects.find(obj => obj.id === targetId && obj.type === 'Emitter');\n" +
      "    if (!target) {\n" +
      "      target = sceneObjects.find(obj => obj.type === 'Emitter');\n" +
      "      if (target) { targetId = target.id; }\n" +
      "    }\n\n" +
      "    if (targetId && target) {\n" +
      "      setSceneObjects(prev => prev.map(obj => {\n" +
      "        if (obj.id === target?.id) {\n" +
      "          return {\n" +
      "            ...obj,\n" +
      "            properties: {\n" +
      "              ...(obj.properties as any),\n" +
      "              particleType: 'sprites',\n" +
      "              particleSpriteSequenceDataUrls: dataUrls,\n" +
      "              particleSpriteSequenceFirstName: 'Rendered Animation',\n" +
      "              particleSpriteSequenceFps: (obj.properties as any).particleSpriteSequenceFps || 24,\n" +
      "              particleSpriteSequenceWaitFrames: 0,\n" +
      "            }\n" +
      "          };\n" +
      "        }\n" +
      "        return obj;\n" +
      "      }));\n" +
      "      setSelectedObjectId(targetId);\n" +
      "    } else {\n" +
      "      const newObject: any = { id: \Emitter_\\, name: 'Animated Sprite Emitter', type: 'Emitter', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, parentId: null };\n" +
      "      newObject.properties = { emissionRate: 5, emitterType: 'point', emissionMode: 'volume', layerImageDataUrl: '', particleLifetime: 3, particleSpeed: 50, particleSpeedVariation: 0.2, particleSize: 5, particleSizeVariation: 0.2, particleColor: '#ffffff', particleColorVariation: 0.1, particleOpacity: 1, particleType: 'sprites', particleGlow: false, particleRotation: 0, particleRotationVariation: 0, particleRotationSpeed: 0, particleRotationSpeedVariation: 0, particleTextureUrl: '', particleTextureName: '', particleSpriteImageDataUrl: '', particleSpriteImageName: '', particleOpacityOverLife: false, particleColorOverLife: false, particleColorOverLifeTarget: '#000000', particleSizeOverLife: 'none', particleSpriteSequenceDataUrls: dataUrls, particleSpriteSequenceFirstName: 'Rendered Animation', particleSpriteSequenceFps: 24};\n" +
      "      setSceneObjects(prev => [...prev, newObject]);\n" +
      "      setSelectedObjectId(newObject.id);\n" +
      "    }\n" +
      "  }, [sceneObjects, selectedObjectId]);\n\n  const handleExportToParticleSystem = useCallback((dataUrls: string[]) => {\n    setAppMode('particle-system');\n    handleExportToParticleSystemNoSwitch(dataUrls);\n  }, [handleExportToParticleSystemNoSwitch]);";

if (content.match(exportRegex)) {
    content = content.replace(exportRegex, handleExportCode);
    console.log("Replaced handleExportToParticleSystem successfully.");
} else {
    console.log("Failed to find handleExportToParticleSystem block!");
}

fs.writeFileSync('src/App.tsx', content);
