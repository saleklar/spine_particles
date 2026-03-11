const fs = require('fs');
const diff = require('diff');

const patchText = fs.readFileSync('clean_diff_node.txt', 'utf8');
const originalText = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const patched = diff.applyPatch(originalText, patchText, { fuzzFactor: 2 });
if (patched) {
    fs.writeFileSync('src/Scene3D.tsx', patched);
    console.log('Patch applied successfully!');
} else {
    console.log('Patch failed to apply.');
}
