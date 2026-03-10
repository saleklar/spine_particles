const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const s1 = code.indexOf('if (shapeType < 0.5) {');
const s2 = code.indexOf('} else {', s1);

const oldPart = code.substring(s1, s2);
const newPart = `if (shapeType < 0.5) {
        float distX = abs(vUv.x - 0.5);
        
        // Taper the width of the mask as it goes up
        float powY = pow(vUv.y, 1.2);
        float width = mix(0.35, 0.02, powY);
        
        // Soft gradient from center to the boundary
        float shape = smoothstep(width, width * 0.1, distX);
        
        // Fade out at the very top
        float vFade = 1.0 - smoothstep(0.2, 0.95, vUv.y);
        
        // Pinch the bottom to create the root of the flame
        float bPinch = smoothstep(0.0, 0.15, vUv.y);
        
        gradient = shape * vFade * mix(0.3, 1.0, bPinch);
        
        // Pump up the density of the map slightly
        gradient = pow(gradient, 0.8);
    `;

code = code.replace(oldPart, newPart);
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed fire shape.');
