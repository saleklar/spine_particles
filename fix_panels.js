const fs = require('fs');
let txt = fs.readFileSync('src/App.tsx', 'utf8');

const targetPatterns = [
  'showEmitterProperties && (',
  'showParentEmitter && (',
  'showTransformPosition && (',
  'showTransformRotation && (',
  'showTransformScale && (',
  'showParticleProperties && ('
];

let modified = false;

for (const pattern of targetPatterns) {
  let searchIdx = 0;
  while (true) {
    const idx = txt.indexOf(pattern, searchIdx);
    if (idx === -1) break;
    searchIdx = idx + pattern.length;

    // Look for the next '<>'
    const startFragIdx = txt.indexOf('<>', searchIdx);
    if (startFragIdx !== -1 && startFragIdx - searchIdx < 100) {
      // Find the balancing '</>'
      let openCount = 1;
      let currIdx = startFragIdx + 2;
      
      while (openCount > 0 && currIdx < txt.length) {
        const nextOpen = txt.indexOf('<>', currIdx);
        const nextClose = txt.indexOf('</>', currIdx);
        
        if (nextClose === -1) break; // Error
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
          openCount++;
          currIdx = nextOpen + 2;
        } else {
          openCount--;
          if (openCount === 0) {
            // We found the matching close!
            // Replace <> with string of same length temporarily ? No, just add the offset
            const lenDiff = '<div className="subpanel-content">'.length - 2;
            txt = txt.substring(0, startFragIdx) + '<div className="subpanel-content">' + txt.substring(startFragIdx + 2);
            
            const finalCloseIdx = nextClose + lenDiff;
            txt = txt.substring(0, finalCloseIdx) + '</div>' + txt.substring(finalCloseIdx + 3);
            
            modified = true;
            searchIdx = finalCloseIdx + 6; // Move after </div>
            break;
          }
          currIdx = nextClose + 3;
        }
      }
    }
  }
}

if (modified) {
  fs.writeFileSync('src/App.tsx', txt);
  console.log("Replaced successfully!");
} else {
  console.log("No replacements were made.");
}
