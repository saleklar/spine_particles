const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');

// I replaced {!embedded && ( with {true && ( earlier which broke the layout logic since it was used for the tabs wrapper 
// {!embedded && ( was correctly hiding the tabs but then I changed it. Now {!embedded && ( is used correctly because I reverted it in fix_animator_ui12.js.
// Wait.. the user is using mbedded=true when in the overall app.
// If Panel Tabs has {!embedded && ( wrapper, then the tabs are hidden!
// So they don't see the tabs. And since we removed the || embedded from the panels, only ONE panel renders at a time, but they have no way to switch panels!
// That's why they don't see fx or other panels!

txt = txt.replace(/\{\!embedded && \(\n          <>\n          \{\/\* Panel Tabs \*\/\}/g, '{true && (\n          <>\n          {/* Panel Tabs */}');

fs.writeFileSync('src/Animator3D.tsx', txt);
