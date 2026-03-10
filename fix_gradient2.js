const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const s1 = code.indexOf('if (shapeType < 0.5) {');
const s2 = code.indexOf('} else {', s1);

const oldPart = code.substring(s1, s2);
const newPart = `if (shapeType < 0.5) {
        // Soft vertical fade
        gradient = 1.0 - smoothstep(0.0, 1.0, vUv.y);
        
        // Taper width for flame shape but with very soft horizontal dropoff
        // This avoids the hard cone edges and lets the noise shape the fire naturally
        float width = mix(0.4, 0.05, vUv.y);
        float distX = abs(vUv.x - 0.5);
        
        // Using a completely smooth power-based falloff rather than sharp smoothstep
        // We calculate normalized distance from center to edge (distX / width)
        float normalizedDist = clamp(distX / width, 0.0, 1.0);
        gradient *= pow(1.0 - normalizedDist, 1.5);
        
        // Softly pinch the base
        float bottomPinch = smoothstep(0.0, 0.15, vUv.y);
        gradient *= mix(0.4, 1.0, bottomPinch);
        
    `;

code = code.replace(oldPart, newPart);
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Update complete!');
