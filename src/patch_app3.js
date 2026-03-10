const fs = require('fs');

function patch() {
  let appCode = fs.readFileSync('src/App.tsx', 'utf8');

  // Fix particleType
  appCode = appCode.replace("dataUrls.length > 0 ? 'sequence' : 'dots'", "dataUrls.length > 0 ? 'sprites' : 'dots'");

  // Fix particleColor
  appCode = appCode.replace(
    "particleColor: '#ffbb00', // yellow-orange", 
    "particleColor: dataUrls.length > 0 ? '#ffffff' : '#ffbb00',"
  );
  
  // Fix particleColorOverLife
  appCode = appCode.replace(
    "particleColorOverLifeTarget: '#ff0000', // fading to red",
    "particleColorOverLifeTarget: dataUrls.length > 0 ? '#ffffff' : '#ff0000',"
  );

  // Fix particleSize
  appCode = appCode.replace(
    "particleSize: presetType === 'campfire' ? 1.5 : 1.0,",
    "particleSize: dataUrls.length > 0 ? (presetType === 'campfire' ? 3.0 : 2.0) : (presetType === 'campfire' ? 1.5 : 1.0),"
  );
  
  // Also we want to use 'volume' emission but with small radius
  // Or what is it?
  
  fs.writeFileSync('src/App.tsx', appCode);
  console.log('App patched fixes.');
}

patch();
