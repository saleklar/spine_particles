const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// remove old button
const oldButtonRegex = /\s*<button[^\n]*?onClick=\{handleExportSpine\}[^\n]*?>\s*Export Cached Animation[^<]*?<\/button>\s*/s;
c = c.replace(oldButtonRegex, '');

// calculate where to insert the new button
// we want it inside menu-bar
const snapToolbarIdx = c.indexOf('<div className="snap-toolbar"');

if (snapToolbarIdx !== -1) {
  const newButton = `
        <div className="menu-item">
          <button
            className="menu-button"
            onClick={handleExportSpine}
            style={{ 
              backgroundColor: '#eeb868', 
              color: '#1a1a1a', 
              fontWeight: 'bold', 
              whiteSpace: 'nowrap'
            }}
          >
            Export Cached Animation
          </button>
        </div>
        `;
  c = c.slice(0, snapToolbarIdx) + newButton + c.slice(snapToolbarIdx);
}

fs.writeFileSync('src/App.tsx', c);
console.log("Moved export button to top shelf");
