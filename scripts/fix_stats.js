const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const oldPart = `      const stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '10px';
      stats.dom.style.right = '10px';
      stats.dom.style.left = '';
      containerRef.current.appendChild(stats.dom);

      const statsDisplay = document.createElement('div');
      statsDisplay.style.position = 'absolute';
      statsDisplay.style.top = '60px';
      statsDisplay.style.right = '10px';
      statsDisplay.style.left = '';
      statsDisplay.style.color = '#0f0';
      statsDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
      statsDisplay.style.padding = '4px 8px';
      statsDisplay.style.fontFamily = 'monospace';
      statsDisplay.style.fontSize = '12px';
      statsDisplay.style.borderRadius = '4px';
      statsDisplay.style.pointerEvents = 'none';
      statsDisplay.style.zIndex = '1000';
      statsDisplay.style.border = '1px solid #0f0';
      statsDisplay.innerText = 'Particles: 0\\nEmitters: 0';
      containerRef.current.appendChild(statsDisplay);`;

const newPart = `      const stats = new Stats();

      const statsDisplay = document.createElement('div');
      statsDisplay.style.position = 'absolute';
      statsDisplay.style.top = '10px';
      statsDisplay.style.right = '10px';
      statsDisplay.style.color = 'rgba(255, 255, 255, 0.6)';
      statsDisplay.style.backgroundColor = 'transparent';
      statsDisplay.style.fontFamily = 'monospace';
      statsDisplay.style.fontSize = '12px';
      statsDisplay.style.pointerEvents = 'none';
      statsDisplay.style.zIndex = '1000';
      statsDisplay.style.textShadow = '1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000';
      statsDisplay.innerText = 'Particles: 0 | Emitters: 0';
      containerRef.current.appendChild(statsDisplay);`;

// Convert CRLF to LF in match string just in case
const fixNewline = (str) => str.replace(/\\r\\n/g, '\\n');

if (c.indexOf(oldPart) !== -1) {
    c = c.replace(oldPart, newPart);
} else {
    // Try relaxing whitespace if exact match fails
    const startIdx = c.indexOf('const stats = new Stats();');
    const endIdx = c.indexOf('containerRef.current.appendChild(statsDisplay);') + 'containerRef.current.appendChild(statsDisplay);'.length;
    if (startIdx !== -1 && endIdx !== -1) {
        c = c.substring(0, startIdx) + newPart + c.substring(endIdx);
    } else {
        console.log('Failed to find replace boundaries');
    }
}
fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Done replacement');
