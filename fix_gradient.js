
const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const s1 = code.indexOf('if (shapeType < 0.5) {');
const s2 = code.indexOf('} else {', s1);

const oldPart = code.substring(s1, s2);
const newPart = \if (shapeType < 0.5) {
        // Soft vertical fade
        gradient = 1.0 - smoothstep(0.0, 1.0, vUv.y);
        
        // Taper width for flame shape but with very soft horizontal dropoff
        // This avoids the hard cone edges and lets the noise shape the fire naturally
        float width = mix(0.4, 0.05, vUv.y);
        float distX = abs(vUv.x - 0.5);
        // Using a smooth gradient from center outward
        gradient *= smoothstep(width, 0.0, distX);
        
        // Softly pinch the base
        float bottomPinch = smoothstep(0.0, 0.15, vUv.y);
        gradient *= mix(0.5, 1.0, bottomPinch);
        
        // To make it feel more voluminous and less harsh, just slightly boost output
        gradient = pow(gradient, 0.9);
    \;

code = code.replace(oldPart, newPart);
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Update complete.');

