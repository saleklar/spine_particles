const fs = require('fs');

async function patch() {
  let appCode = fs.readFileSync('src/App.tsx', 'utf8');

  if (!appCode.includes('import { generateFireSequenceHeadless')) {
      appCode = appCode.replace(
        "import { vertexShader, fragmentShader } from './FireGenerator';",
        "import { vertexShader, fragmentShader } from './FireGenerator';\nimport { generateFireSequenceHeadless, defaultTorchParams, defaultCampfireParams } from './FireHeadless';"
      );
  }

  const findFunc = "const handleCreateFirePreset = useCallback((presetType: 'campfire' | 'torch') => {";
  const replaceFunc = `const handleCreateFirePreset = useCallback(async (presetType: 'campfire' | 'torch') => {
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
`;

  appCode = appCode.replace(findFunc, replaceFunc);
  
  if (appCode.includes('particleSpriteSequenceDataUrls: [],')) {
      appCode = appCode.replace(
        'particleSpriteSequenceDataUrls: [],',
        'particleSpriteSequenceDataUrls: dataUrls,'
      );
  }
  
  // Also we want to use 'sequence' instead of 'dots' for particleType
  const particleTypeFind = "particleType: 'dots',";
  const particleTypeReplace = "particleType: dataUrls.length > 0 ? 'sequence' : 'dots',";
  appCode = appCode.replace(particleTypeFind, particleTypeReplace);
  
  const particleLifetimeFind = "particleLifetime: presetType === 'campfire' ? 3 : 1.5,";
  const particleLifetimeReplace = "particleLifetime: dataUrls.length > 0 ? (presetType === 'campfire' ? defaultCampfireParams.frames/defaultCampfireParams.fps : defaultTorchParams.frames/defaultTorchParams.fps) : (presetType === 'campfire' ? 3 : 1.5),";
  appCode = appCode.replace(particleLifetimeFind, particleLifetimeReplace);

  const particleSpriteSequenceFpsAdd = `particleSpriteSequenceFps: dataUrls.length > 0 ? (presetType === 'campfire' ? defaultCampfireParams.fps : defaultTorchParams.fps) : 30,`;
  // put it after sequence data
  appCode = appCode.replace(
    'particleSpriteSequenceDataUrls: dataUrls,',
    \`particleSpriteSequenceDataUrls: dataUrls,\\n        \${particleSpriteSequenceFpsAdd}\`
  );
  
  const propertiesFind = "emissionRate: presetType === 'campfire' ? 150 : 250,";
  const propertiesReplace = "emissionRate: dataUrls.length > 0 ? (presetType === 'campfire' ? 5 : 10) : (presetType === 'campfire' ? 150 : 250),"; // small budgets!
  appCode = appCode.replace(propertiesFind, propertiesReplace);

  fs.writeFileSync('src/App.tsx', appCode);
  console.log('App patched.');
}

patch();