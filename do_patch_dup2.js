const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const strToFind = \  const handleDeleteObject = useCallback(() => {\;

if (code.includes(strToFind) && !code.includes('handleDuplicateObject')) {
    const replacement = \  const handleDuplicateObject = useCallback(() => {
    if (!selectedObjectId) return;
    const selectedObj = sceneObjects.find(obj => obj.id === selectedObjectId);
    if (!selectedObj) return;

    handlePushState(); // Undo step before duplicate

    const newId = selectedObj.type.toLowerCase() + '_' + Date.now();
    const newObj = JSON.parse(JSON.stringify(selectedObj));
    newObj.id = newId;
    newObj.name = (newObj.name || selectedObj.type) + ' Copy';
    // slightly offset position so it's visible
    newObj.position.x += 0.5;
    newObj.position.y -= 0.5;

    let newShapeNode = null;
    if (newObj.type === 'Emitter') {
      newShapeNode = createEmitterShapeNode(newId, newObj);
    }
    
    setSceneObjects(prev => {
       const next = [...prev, newObj];
       if (newShapeNode) next.push(newShapeNode);
       return next;
    });
    setSelectedObjectId(newId);
  }, [selectedObjectId, sceneObjects, handlePushState, createEmitterShapeNode]);

  const handleDeleteObject = useCallback(() => {\;
    
    code = code.replace(strToFind, replacement);
    console.log('Injected handleDuplicateObject');
} else {
    console.log('Failed to find handleDeleteObject block, or already has handleDuplicateObject');
}

const keyStrRegex = /        \/\/ Ctrl\/Cmd\+S: Save\s+if \(isModKey && key === 's'\) {/g;
if (keyStrRegex.test(code)) {
    code = code.replace(keyStrRegex, \        // Ctrl/Cmd+D: Duplicate
        if (isModKey && key === 'd') {
          event.preventDefault();
          handleDuplicateObject();
          return;
        }

        // Ctrl/Cmd+S: Save
        if (isModKey && key === 's') {\);
    console.log('Injected Ctrl+D hotkey.');
}

// Dep fix
code = code.replace(/handleDeleteObject, selectedObjectId, selectedKeyframeFrame/g, 'handleDuplicateObject, handleDeleteObject, selectedObjectId, selectedKeyframeFrame');

fs.writeFileSync('src/App.tsx', code);
