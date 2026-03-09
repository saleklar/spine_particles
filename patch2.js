const fs = require('fs');
let txt = fs.readFileSync('src/Animator3D.tsx', 'utf8');
const pTabsStart = txt.indexOf('{/* Panel Tabs */}');
let tempStr = '↺ Reset All Settings\n          </button>\n        </div>';
let rIdx = txt.indexOf(tempStr);
if (rIdx < 0) {
  tempStr = '↺ Reset All Settings\r\n          </button>\r\n        </div>';
  rIdx = txt.indexOf(tempStr);
}
if (pTabsStart > 0 && rIdx > 0) {
  let sub = txt.substring(pTabsStart, rIdx + tempStr.length);
  txt = txt.replace(sub, '{!embedded && (\n          <>\n          ' + sub + '\n          </>\n        )}');
}
const panels = ['object', 'material', 'animation', 'effects', 'lighting', 'render'];
panels.forEach(p => {
  const cap = p.charAt(0).toUpperCase() + p.slice(1);
  txt = txt.replace('{activePanel === \'' + p + '\' && (\n            <div>', '{(embedded || activePanel === \'' + p + '\') && (\n            <div style={{ marginBottom: embedded ? \'24px\' : \'0\' }}>\n              {embedded && <h3 style={{ margin: \'0 0 12px 0\', paddingBottom: \'8px\', borderBottom: \'1px solid #333\', fontSize: \'14px\', color: \'#a9b5ca\' }}>' + cap + '</h3>}');
  txt = txt.replace('{activePanel === \'' + p + '\' && (\r\n            <div>', '{(embedded || activePanel === \'' + p + '\') && (\r\n            <div style={{ marginBottom: embedded ? \'24px\' : \'0\' }}>\r\n              {embedded && <h3 style={{ margin: \'0 0 12px 0\', paddingBottom: \'8px\', borderBottom: \'1px solid #333\', fontSize: \'14px\', color: \'#a9b5ca\' }}>' + cap + '</h3>}');
});
fs.writeFileSync('src/Animator3D.tsx', txt);
