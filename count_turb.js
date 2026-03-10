const fs = require('fs');
let code = fs.readFileSync('src/Scene3D.tsx', 'utf8');
const search = "case 'turbulence':";
let index = -1;
while ((index = code.indexOf(search, index + 1)) !== -1) {
    console.log("---- MATCH AT", index, "----");
    console.log(code.substring(index - 50, index + 400));
}
