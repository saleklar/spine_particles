const fs = require('fs');

function patch() {
  let appCode = fs.readFileSync('src/App.tsx', 'utf8');

  if (!appCode.includes('import { generateFireSequenceHeadless')) {
      appCode = appCode.replace(
        "import { vertexShader, fragmentShader } from './FireGenerator';",
        "import { vertexShader, fragmentShader } from './FireGenerator';\nimport { generateFireSequenceHeadless, defaultTorchParams, defaultCampfireParams } from './FireHeadless';"
      );
  }

  const pStart = appCode.indexOf('handleCreateFirePreset = useCallback');
  const pEnd = appCode.indexOf('// Physics forces', pStart);

  let customCode = appCode.substring(pStart, pEnd);

  customCode = customCode.replace(
    "const handleCreateFirePreset = useCallback((presetType: 'campfire' | 'torch') => {",
    `const handleCreateFirePreset = useCallback(async (presetType: 'campfire' | 'torch') => {
    let dataUrls: string[] = [];
    if (presetType === 'torch') {
      try {
        dataUrls = await generateFireSequenceHeadless(defaultTorchParams);
      } catch(e) { console.error(e) }
    } else if (presetType === 'campfire') {
      try {
        dataUrls = await generateFireSequenceHeadless(defaultCampfireParams);
      } catch(e) { console.error(e) }
    }`
  );

  customCode = customCode.replace(
    "emissionRate: presetType === 'campfire' ? 150 : 250,",
    "emissionRate: dataUrls.length > 0 ? (presetType === 'campfire' ? 5 : 10) : (presetType === 'campfire' ? 150 : 250),"
  );

  customCode = customCode.replace(
    "particleLifetime: presetType === 'campfire' ? 3 : 1.5,",
    "particleLifetime: dataUrls.length > 0 ? (presetType === 'campfire' ? defaultCampfireParams.frames/defaultCampfireParams.fps : defaultTorchParams.frames/defaultTorchParams.fps) : (presetType === 'campfire' ? 3 : 1.5),"
  );
  
  customCode = customCode.replace(
    "particleColor: '#ffbb00', // yellow-orange",
    "particleColor: dataUrls.length > 0 ? '#ffffff' : '#ffbb00',"
  );
  
  customCode = customCode.replace(
    "particleSize: presetType === 'campfire' ? 1.5 : 1.0,",
    "particleSize: dataUrls.length > 0 ? (presetType === 'campfire' ? 3.0 : 2.0) : (presetType === 'campfire' ? 1.5 : 1.0),"
  );

  customCode = customCode.replace(
    "particleType: 'dots',",
    "particleType: dataUrls.length > 0 ? 'sprites' : 'dots',"
  );
  
  customCode = customCode.replace(
    "particleSpriteSequenceDataUrls: [],",
    "particleSpriteSequenceDataUrls: dataUrls,\n        particleSpriteSequenceFps: dataUrls.length > 0 ? (presetType === 'campfire' ? defaultCampfireParams.fps : defaultTorchParams.fps) : 30,"
  );

  customCode = customCode.replace(
    "particleColorVariation: 0,",
    "particleColorVariation: dataUrls.length > 0 ? 0 : 0,"
  );

  customCode = customCode.replace(
    "particleOpacityOverLife: true,",
    "particleOpacityOverLife: dataUrls.length > 0 ? false : true,"
  );

  customCode = customCode.replace(
    "particleColorOverLifeTarget: '#ff0000', // fading to red",
    "particleColorOverLifeTarget: dataUrls.length > 0 ? '#ffffff' : '#ff0000',"
  );

  customCode = customCode.replace(
    "particleSizeOverLife: 'shrink',",
    "particleSizeOverLife: dataUrls.length > 0 ? 'constant' : 'shrink',"
  );

  appCode = appCode.substring(0, pStart) + customCode + appCode.substring(pEnd);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log('App patched properly.');
}

patch();
