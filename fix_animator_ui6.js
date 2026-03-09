const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// Replace standard active panels with subtabs if embedded is true
txt = txt.replace(/\{\(embedded \|\| activePanel ===/g, '{(activePanel ===');

// Instead of flattening, if embedded=true we will override the tabs UI layout at the top.
// Wait, the prompt says "borders between fx panel segments overall should be more visible so i can distinguish segments if needed they should be organized as sub tabs that should go for all panels that have segments".
// This means they DO want segments to be visually distinct perhaps with a tab structure when embedded instead of one giant column. Or maybe inside effect panel they want subtabs for standard effects (bloom, lens, sparkles).

// But let's check what the user said: "tab names should always be visible, so i can always switch to hierachy oe scene and back"
// This refers to App.tsx left panel tabs. We fixed the scrolling for these earlier.

// "they should be organized as sub tabs that should go for all panels that have segments"
// "borders between fx panel segments overall should be more visible"
// Right now in Animator3D they are fully flattened if embedded=true, which made it too long.
// If we just remove mbedded ||  from {(embedded || activePanel === '...' ) &&,
// then the panels *will* become sub-tabs in Animator3D! We just need to make sure the panel tabs are shown when embedded.
fs.writeFileSync('src/Animator3D.tsx', txt);
