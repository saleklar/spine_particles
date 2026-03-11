const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = \{(force.type === 'attractor' || force.type === 'repulsor' || force.type === 'tornado' || force.type === 'vortex') && (
                          <>
                            <label htmlFor=\\\
force-radius\\\>
                              Radius: {force.radius?.toFixed(1) ?? 50}
                            </label>\;

const replacement1 = \{(force.type === 'attractor' ; force.type === 'repulsor' ; force.type === 'tornado' ; force.type === 'vortex' ; force.type === 'turbulence') && (
                          <>
                            <label htmlFor=\\\force-radius\\\>
                              {force.type === 'turbulence' ? 'Size (Deformation Map)' : 'Radius'}: {force.radius?.toFixed(1) ?? 50}
                            </label>\;

if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
    fs.writeFileSync(path, content);
    console.log('App.tsx patched successfully.');
} else {
    console.log('Target block not found!');
}\n
