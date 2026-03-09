const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/const \[appMode, setAppMode\] = useState\<'particle-system' \| '3d-animator'\>\('particle-system'\);/, `const [appMode, setAppMode] = useState<'particle-system' | '3d-animator' | 'split'>('particle-system');`);

c = c.replace(/    if \(appMode === '3d-animator'\) \{/g, `  if (appMode === '3d-animator' || appMode === 'split') {`);

c = c.replace(/      \<div className="workspace"\>\n        \<div className="menu-bar"\>\n          \<div className="menu-item"\>\n            \<button\n              className="menu-button"\n              onClick=\{.*?\}\n              type="button"\n              style=\{\{ backgroundColor: '#0066cc', color: '#fff' \}\}\n            \>\n              ← Particle System\n            \<\/button\>\n          \<\/div\>\n          \<div style=\{\{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px' \}\}\>\n            3D Asset Creator Mode\n          \<\/div\>\n        \<\/div\>\n        \<Animator3D onExportToParticleSystem=\{handleExportToParticleSystem\} \/\>\n      \<\/div\>\n    \);\n  \}/, `      <div className="workspace">
        <div className="menu-bar">
          <div className="menu-item">
            <button
              className="menu-button"
              onClick={() => setAppMode('particle-system')}
              type="button"
              style={{ backgroundColor: '#0066cc', color: '#fff' }}
            >
              ← Particle System
            </button>
          </div>
          <div className="menu-item">
            <button
              className="menu-button"
              onClick={() => setAppMode(appMode === 'split' ? '3d-animator' : 'split')}
              type="button"
            >
              {appMode === 'split' ? 'Full Screen' : 'Split View'}
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px' }}>
            3D Asset Creator Mode
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {appMode === 'split' && (
            <div style={{ flex: 1, borderRight: '1px solid #333', background: '#252525' }}>
              <Scene3D
              ref={scene3DRef}
              sceneSize={draftSize}
              sceneSettings={sceneSettings}
              snapSettings={snapSettings}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sceneObjects={sceneObjects}
              currentFrame={currentFrame}
              isPlaying={isPlaying}
              isCaching={isCaching}
              physicsForces={physicsForces}
              selectedObjectId={selectedObjectId}
              selectedForceId={selectedForceId}
              onObjectSelect={setSelectedObjectId}
              onForceSelect={setSelectedForceId}
              onObjectTransform={handleUpdateObjectTransform}
              onForceTransform={handleUpdateForceTransform}
              handleScale={handleScale}
              onCacheFrameCountChange={(count) => setCachedFrameCount(count)}
              cacheResetToken={cacheResetToken}
              onUpdateSceneSettings={handleUpdateSceneSettings}
            />
            </div>
          )}
          <div style={{ width: appMode === 'split' ? '50%' : '100%' }}>
            <Animator3D onExportToParticleSystem={appMode === 'split' ? handleExportToParticleSystemNoSwitch : handleExportToParticleSystem} autoRenderOnChange={appMode === 'split'} />
          </div>
        </div>
      </div>
    );
  }`);

c = c.replace(/  const handleExportToParticleSystem = useCallback\(\(dataUrls: string\[\]\) =\> \{/g, `  const handleExportToParticleSystemNoSwitch = useCallback((dataUrls: string[]) => {    
    let targetId = selectedObjectId;
    let target = sceneObjects.find(obj => obj.id === targetId && obj.type === 'Emitter');
    if (!target) {
      target = sceneObjects.find(obj => obj.type === 'Emitter');
      targetId = target?.id || null;
    }

    if (targetId && target) {
      handleUpdateObjectProperty(targetId, 'particleSpriteSequenceDataUrls', dataUrls);
      handleUpdateObjectProperty(targetId, 'particleSpriteSequenceFirstName', 'Rendered Animation');
      
      const currentProps = target.properties as EmitterObject['properties'] | undefined;
      if (!currentProps?.particleSpriteSequenceFps) {
        handleUpdateObjectProperty(targetId, 'particleSpriteSequenceFps', 24);
      }
      
      handleUpdateObjectProperty(targetId, 'particleType', 'sprites');
      
      handleUpdateObjectProperty(targetId, 'particleSpriteImageDataUrl', '');
      handleUpdateObjectProperty(targetId, 'particleSpriteImageName', '');
      
      if (selectedObjectId !== targetId) {
        setSelectedObjectId(targetId);
      }
    } else {
      const newObject: EmitterObject = {
        id: \`emitter_\${Date.now()}\`,
        name: 'emitter',
        type: 'Emitter',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        parentId: null,
        properties: {
          emissionRate: 200,
          particleLife: 5,
          particleLifeVariation: 1,
          particleSpeed: 100,
          particleSpeedVariation: 20,
          particleSize: 30,
          particleSizeVariation: 10,
          particleColor: '#ffffff',
          particleType: 'sprites',
          particleGlow: false,
          particleRotation: 0,
          particleRotationVariation: 0,
          particleRotationSpeed: 0,
          particleRotationSpeedVariation: 0,
          particleSpriteImageDataUrl: '',
          particleSpriteImageName: '',
          particleOpacityOverLife: false,
          particleColorOverLife: false,
          particleColorOverLifeTarget: '#000000',
          particleSizeOverLife: 'none',
          particleSpriteSequenceDataUrls: dataUrls,
          particleSpriteSequenceFirstName: 'Rendered Animation',
          particleSpriteSequenceFps: 24,
        },
      };

      setSceneObjects((prev) => [...prev, newObject]);
      setSelectedObjectId(newObject.id);
    }
  }, [sceneObjects, selectedObjectId]);
  
  const handleExportToParticleSystem = useCallback((dataUrls: string[]) => {
    setAppMode('particle-system');
    handleExportToParticleSystemNoSwitch(dataUrls);
    `);

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed App');
