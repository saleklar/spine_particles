const fs = require('fs');

function patch() {
  let appCode = fs.readFileSync('src/App.tsx', 'utf8');

  const pStart = appCode.indexOf('handleCreateFirePreset = useCallback');
  const pEnd = appCode.indexOf('// Physics forces', pStart);

  let customCode = appCode.substring(pStart, pEnd);

  customCode = customCode.replace(
    'particleOpacityOverLife: true,',
    'particleOpacityOverLife: dataUrls.length > 0 ? false : true,'
  );

  customCode = customCode.replace(
    "particleSizeOverLife: 'shrink',",
    "particleSizeOverLife: dataUrls.length > 0 ? 'constant' : 'shrink',"
  );

  appCode = appCode.substring(0, pStart) + customCode + appCode.substring(pEnd);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log('Fixed overlife inside handleCreateFirePreset only!');
}

patch();
