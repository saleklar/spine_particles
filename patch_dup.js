const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const s = \  const handleDeleteObject = useCallback(() => {\;

const r = \  const handleDuplicateObject = useCallback(() => {
    if (!selectedObjectId) return;
    const selectedObj = sceneObjects.find(obj => obj.id === selectedObjectId);
    if (!selectedObj) return;

    handlePushState(); // Undo step before duplicate

    const newId = \\\\_\\\\;
    const newObj = JSON.parse(JSON.stringify(selectedObj));
    newObj.id = newId;
    newObj.name = (newObj.name || selectedObj.type) + ' Copy';
    // slightly offset position so it's visible
    newObj.position.x += 0.5;
    newObj.position.y -= 0.5;

    let newShapeNode = null;
    if (newObj.type === 'Emitter') {
      // Create associated shape node if it's an emitter
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

if (code.includes(s)) {
    code = code.replace(s, r);
}

const keyStr = \        // Ctrl/Cmd+S: Save
        if (isModKey && key === 's') {
          event.preventDefault();
          if (event.shiftKey) {\;

const newKeyStr = \        // Ctrl/Cmd+D: Duplicate
        if (isModKey && key === 'd') {
          event.preventDefault();
          handleDuplicateObject();
          return;
        }

        // Ctrl/Cmd+S: Save
        if (isModKey && key === 's') {
          event.preventDefault();
          if (event.shiftKey) {\;

code = code.replace(keyStr, newKeyStr);

code = code.replace(/handleDeleteObject, selectedObjectId/g, 'handleDuplicateObject, handleDeleteObject, selectedObjectId');

fs.writeFileSync('src/App.tsx', code);
