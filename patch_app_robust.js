const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Normalize line endings to avoid regex issues
content = content.replace(/\r\n/g, '\n');

// 2. Add handleExportToParticleSystemNoSwitch
const exportDefOld = "  const handleExportToParticleSystem = useCallback((dataUrls: string[]) => {\n    setAppMode('particle-system');\n\n    // Find either selected Emitter or first Emitter";
if (content.includes(exportDefOld)) {
    const handleExportCode = "  const handleExportToParticleSystemNoSwitch = useCallback((dataUrls: string[]) => {\n" +
      "    let targetId = selectedObjectId;\n" +
      "    let target = sceneObjects.find(obj => obj.id === targetId && obj.type === 'Emitter');\n" +
      "    if (!target) {\n" +
      "      target = sceneObjects.find(obj => obj.type === 'Emitter');\n" +
      "      if (target) { targetId = target.id; }\n" +
      "    }\n\n" +
      "    if (target) {\n" +
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
      "      setSelectedObjectId(target.id);\n" +
      "    } else {\n" +
      "      const newObject: any = { id: \Emitter_\\, name: 'Animated Sprite Emitter', type: 'Emitter', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, parentId: null };\n" +
      "      newObject.properties = { emissionRate: 5, emitterType: 'point', emissionMode: 'volume', layerImageDataUrl: '', particleLifetime: 3, particleSpeed: 50, particleSpeedVariation: 0.2, particleSize: 5, particleSizeVariation: 0.2, particleColor: '#ffffff', particleColorVariation: 0.1, particleOpacity: 1, particleType: 'sprites', particleGlow: false, particleRotation: 0, particleRotationVariation: 0, particleRotationSpeed: 0, particleRotationSpeedVariation: 0, particleTextureUrl: '', particleTextureName: '', particleSpriteImageDataUrl: '', particleSpriteImageName: '', particleOpacityOverLife: false, particleColorOverLife: false, particleColorOverLifeTarget: '#000000', particleSizeOverLife: 'none', particleSpriteSequenceDataUrls: dataUrls, particleSpriteSequenceFirstName: 'Rendered Animation', particleSpriteSequenceFps: 24};\n" +
      "      setSceneObjects(prev => [...prev, newObject]);\n" +
      "      setSelectedObjectId(newObject.id);\n" +
      "    }\n" +
      "  }, [sceneObjects, selectedObjectId]);\n\n  const handleExportToParticleSystem = useCallback((dataUrls: string[]) => {\n    setAppMode('particle-system');\n    handleExportToParticleSystemNoSwitch(dataUrls);\n  }, [handleExportToParticleSystemNoSwitch]);\n\n/*";
      
    content = content.replace("  const handleExportToParticleSystem = useCallback((dataUrls: string[]) => {\n    setAppMode('particle-system');\n\n    // Find either selected Emitter or first Emitter", 
      handleExportCode);
    
    // We commented out the rest, need to close the comment at the end of the original function
    content = content.replace("    }\n  }, [sceneObjects, selectedObjectId]);\n\n  const handleCreateObject = useCallback((objectType: string) => {", 
      "    }\n  }, [sceneObjects, selectedObjectId]);*/\n\n  const handleCreateObject = useCallback((objectType: string) => {");
}

// 3. Replace 3d-animator block
const renderBlockRegex = /  if \(appMode === '3d-animator'\) \{[\s\S]*?<Animator3D onExportToParticleSystem=\{handleExportToParticleSystem\} \/>\n      <\/div>\n    \);\n  \}/;

const newRenderBlock = "  if (appMode === '3d-animator' || appMode === 'split') {\n" +
"    return (\n" +
"      <div className=\"workspace\">\n" +
"        <div className=\"menu-bar\">\n" +
"          <div className=\"menu-item\">\n" +
"            <button\n" +
"              className=\"menu-button\"\n" +
"              onClick={() => setAppMode('particle-system')}\n" +
"              type=\"button\"\n" +
"              style={{ backgroundColor: '#0066cc', color: '#fff' }}\n" +
"            >\n" +
"              ← Particle System\n" +
"            </button>\n" +
"          </div>\n" +
"          <div className=\"menu-item\">\n" +
"            <button\n" +
"              className=\"menu-button\"\n" +
"              onClick={() => setAppMode(appMode === 'split' ? '3d-animator' : 'split')}\n" +
"              type=\"button\"\n" +
"              style={{ backgroundColor: '#1abc9c', color: '#fff', fontWeight: 'bold' }}\n" +
"            >\n" +
"              {appMode === 'split' ? 'Full Screen 3D Asset Creator' : 'Split View with Particles'}\n" +
"            </button>\n" +
"          </div>\n" +
"          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px' }}>\n" +
"            3D Asset Creator Mode\n" +
"          </div>\n" +
"        </div>\n" +
"        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>\n" +
"          {appMode === 'split' && (\n" +
"            <div style={{ flex: 1, borderRight: '1px solid #333', background: '#252525' }}>\n" +
"              <Scene3D\n" +
"                ref={scene3DRef}\n" +
"                sceneSize={sceneSize}\n" +
"                sceneSettings={sceneSettings}\n" +
"                snapSettings={snapSettings}\n" +
"                viewMode={viewMode}\n" +
"                onViewModeChange={setViewMode}\n" +
"                sceneObjects={sceneObjects}\n" +
"                currentFrame={currentFrame}\n" +
"                isPlaying={isPlaying}\n" +
"                isCaching={isCaching}\n" +
"                physicsForces={physicsForces}\n" +
"                selectedObjectId={selectedObjectId}\n" +
"                selectedForceId={selectedForceId}\n" +
"                onObjectSelect={setSelectedObjectId}\n" +
"                onForceSelect={setSelectedForceId}\n" +
"                onObjectTransform={handleUpdateSelectedObjectTransform}\n" +
"                onForceTransform={handleUpdatePhysicsForceTransform}\n" +
"                handleScale={handleScale}\n" +
"                onCacheFrameCountChange={(count) => setCachedFrameCount(count)}\n" +
"                cacheResetToken={cacheResetToken}\n" +
"                onUpdateSceneSettings={handleUpdateSceneSettings}\n" +
"              />\n" +
"            </div>\n" +
"          )}\n" +
"          <div style={{ width: appMode === 'split' ? '60%' : '100%' }}>\n" +
"            <Animator3D \n" +
"              onExportToParticleSystem={appMode === 'split' ? handleExportToParticleSystemNoSwitch : handleExportToParticleSystem}\n" +
"              autoRenderOnChange={appMode === 'split'}\n" +
"            />\n" +
"          </div>\n" +
"        </div>\n" +
"      </div>\n" +
"    );\n" +
"  }";

content = content.replace(renderBlockRegex, newRenderBlock);

// 4. Add Split View Button to particle system menu
const menuButtonOld = "        <div className=\"menu-item\">\n          <button\n            className=\"menu-button\"\n            onClick={() => setAppMode('3d-animator')}\n            type=\"button\"\n            style={{ backgroundColor: '#eeb868', color: '#1a1a1a', fontWeight: 'bold' }}\n          >\n            3D Asset Creator\n          </button>\n        </div>";

const menuButtonNew = menuButtonOld + "\n        <div className=\"menu-item\">\n          <button\n            className=\"menu-button\"\n            onClick={() => setAppMode('split')}\n            type=\"button\"\n            style={{ backgroundColor: '#1abc9c', color: '#fff', fontWeight: 'bold' }}\n          >\n            Split View (3D + Particles)\n          </button>\n        </div>";

content = content.replace(menuButtonOld, menuButtonNew);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched correctly? ", content.includes("Split View with"));
