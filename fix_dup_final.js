const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target1 = "  const handleDeleteObject = useCallback(() => {";

const replace1 = "  const handleDuplicateObject = useCallback(() => {\n" +
"    if (!selectedObjectId) return;\n" +
"    const selectedObj = sceneObjects.find(obj => obj.id === selectedObjectId);\n" +
"    if (!selectedObj) return;\n" +
"    handlePushState();\n" +
"    const newId = selectedObj.type.toLowerCase() + '_' + Date.now();\n" +
"    const newObj = JSON.parse(JSON.stringify(selectedObj));\n" +
"    newObj.id = newId;\n" +
"    newObj.name = (newObj.name || selectedObj.type) + ' Copy';\n" +
"    newObj.position.x += 0.5;\n" +
"    newObj.position.y -= 0.5;\n" +
"    let newShapeNode = null;\n" +
"    if (newObj.type === 'Emitter') {\n" +
"      newShapeNode = createEmitterShapeNode(newId, newObj);\n" +
"    }\n" +
"    setSceneObjects(prev => {\n" +
"       const next = [...prev, newObj];\n" +
"       if (newShapeNode) next.push(newShapeNode);\n" +
"       return next;\n" +
"    });\n" +
"    setSelectedObjectId(newId);\n" +
"  }, [selectedObjectId, sceneObjects, handlePushState, createEmitterShapeNode]);\n\n" +
"  const handleDeleteObject = useCallback(() => {";

let hasDup = false;
let hasKd = false;
if (code.includes(target1) && !code.includes('handleDuplicateObject')) {
    code = code.replace(target1, replace1);
    hasDup = true;
}

const keyTarget = "        // Ctrl/Cmd+S: Save\n" +
"        if (isModKey && key === 's') {";

const keyReplace = "        // Ctrl/Cmd+D: Duplicate\n" +
"        if (isModKey && key === 'd') {\n" +
"          event.preventDefault();\n" +
"          handleDuplicateObject();\n" +
"          return;\n" +
"        }\n\n" +
"        // Ctrl/Cmd+S: Save\n" +
"        if (isModKey && key === 's') {";

if (code.includes(keyTarget) && !code.includes('key === \\'d\\'')) {
    code = code.replace(keyTarget, keyReplace);
    hasKd = true;
} else if (!hasKd) {
    // Regex fallback
    code = code.replace(/(\/\/ Ctrl\/Cmd\+S: Save\s+if \(isModKey && key === 's'\) {)/g, "        // Ctrl/Cmd+D: Duplicate\n        if (isModKey && key === 'd') {\n          event.preventDefault();\n          handleDuplicateObject();\n          return;\n        }\n\n");
    hasKd = true;
}

code = code.replace(/handleDeleteObject, selectedObjectId, selectedKeyframeFrame/g, 'handleDuplicateObject, handleDeleteObject, selectedObjectId, selectedKeyframeFrame');

fs.writeFileSync('src/App.tsx', code);
console.log('App patched for duplicates: ', hasDup, hasKd);
