const fs = require('fs');

const scenePath = 'src/Scene3D.tsx';
let txt = fs.readFileSync(scenePath, 'utf8');

// Fix `color: \nfffff` which might be messed up
txt = txt.replace(/color:\s*[\n\r]*\s*fffff/g, "color: `ffffff${finalAlpha}`");

// Also add to SceneSettings interface in App.tsx and Scene3D.tsx to avoid the error
const appPath = 'src/App.tsx';
let appTxt = fs.readFileSync(appPath, 'utf8');

if (!appTxt.includes('particleType?:')) {
  appTxt = appTxt.replace(/type SceneSettings = \{/, 'type SceneSettings = {\n  particleType?: string;\n  glowEnabled?: boolean;');
  fs.writeFileSync(appPath, appTxt);
}

if (!txt.includes('particleType?:')) {
  txt = txt.replace(/type SceneSettings = \{/, 'type SceneSettings = {\n  particleType?: string;\n  glowEnabled?: boolean;');
}

fs.writeFileSync(scenePath, txt);
console.log("Fixed!");
