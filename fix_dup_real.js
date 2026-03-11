const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const keyTarget = "        // Alt+S: Save\n" +
"        if (event.altKey && !event.shiftKey && key === 's') {";

const keyReplace = "        // Ctrl/Cmd+D: Duplicate\n" +
"        if (isModKey && key === 'd') {\n" +
"          event.preventDefault();\n" +
"          handleDuplicateObject();\n" +
"          return;\n" +
"        }\n\n" +
"        // Alt+S: Save\n" +
"        if (event.altKey && !event.shiftKey && key === 's') {";

if (code.includes(keyTarget)) {
    code = code.replace(keyTarget, keyReplace);
    console.log('Injected Ctrl+D into key handler');
} else {
    code = code.replace(/(\/\/ Alt\+S: Save\s+if \(event\.altKey && !event\.shiftKey && key === 's'\) {)/g, "        // Ctrl/Cmd+D: Duplicate\n        if (isModKey && key === 'd') {\n          event.preventDefault();\n          handleDuplicateObject();\n          return;\n        }\n\n");
    // try CR-LF
    code = code.replace(/(\/\/ Alt\+S: Save\r\n\s+if \(event\.altKey && !event\.shiftKey && key === 's'\) {)/g, "        // Ctrl/Cmd+D: Duplicate\n        if (isModKey && key === 'd') {\n          event.preventDefault();\n          handleDuplicateObject();\n          return;\n        }\n\n");
    
    console.log('Fallback regex for key handler used.');
}

const functionTarget = "  const handleDeleteObject = useCallback(() => {\n" +
"    if (!selectedObjectId) return;\n";

const functionReplace = "  const handleDuplicateObject = useCallback(() => {\n" +
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
"  const handleDeleteObject = useCallback(() => {\n" +
"    if (!selectedObjectId) return;\n";

if (!code.includes('handleDuplicateObject')) {
    if (code.includes(functionTarget)) {
        code = code.replace(functionTarget, functionReplace);
        console.log('Injected handleDuplicateObject method via string replace.');
    } else {
        const regex2 = /(const handleDeleteObject = useCallback\(\(\) => \{\r?\n\s*if \(!selectedObjectId\) return;)/;
        code = code.replace(regex2, functionReplace.replace("  const handleDeleteObject = useCallback(() => {\n    if (!selectedObjectId) return;\n", ""));
        console.log('Injected handleDuplicateObject method via regex.');
    }
}

code = code.replace(/handleDeleteObject,\s*selectedObjectId,\s*selectedKeyframeFrame/g, 'handleDuplicateObject, handleDeleteObject, selectedObjectId, selectedKeyframeFrame');

fs.writeFileSync('src/App.tsx', code);
