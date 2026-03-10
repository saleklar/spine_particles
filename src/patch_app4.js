const fs = require('fs');

function patch() {
  let appCode = fs.readFileSync('src/App.tsx', 'utf8');

  const pStart = appCode.indexOf('handleCreateFirePreset = useCallback');
  const pEnd = appCode.indexOf('// Physics forces', pStart);

  let customCode = appCode.substring(pStart, pEnd);

  customCode = customCode.replace(
    'particleSpriteSequenceDataUrls: [],',
    "particleSpriteSequenceDataUrls: dataUrls,\n        particleSpriteSequenceFps: dataUrls.length > 0 ? (presetType === 'campfire' ? defaultCampfireParams.fps : defaultTorchParams.fps) : 30,"
  );

  customCode = customCode.replace(
    'particleColorVariation: 0,',
    'particleColorVariation: dataUrls.length > 0 ? 0 : 0.2,'
  );

  customCode = customCode.replace(
    'particleSpeedVariation: 0.3,',
    'particleSpeedVariation: dataUrls.length > 0 ? 0.05 : 0.3,'
  );

  appCode = appCode.substring(0, pStart) + customCode + appCode.substring(pEnd);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log('Fixed inside handleCreateFirePreset only!');
}

patch();
