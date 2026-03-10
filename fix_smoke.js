const fs = require('fs');

let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const oldSmoke = `float smokeMask = smoothstep(0.4, 1.0, vUv.y) * smokeNoise * 0.8 * detail;`;
const newSmoke = `
    // Constrain smoke slightly wider than the flame, but not infinite
    float smokeBounds = 1.0;
    if (shapeType < 0.5) {
        float sWidth = mix(0.5, 0.2, vUv.y);
        smokeBounds = 1.0 - smoothstep(sWidth * 0.2, sWidth, abs(vUv.x - 0.5));
    }
    float smokeMask = smoothstep(0.3, 1.0, vUv.y) * smokeNoise * 0.8 * detail * smokeBounds;
`;

code = code.replace(oldSmoke, newSmoke);
fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fixed smoke bounding');
