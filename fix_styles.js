const fs = require('fs');
let css = fs.readFileSync('src/styles.css', 'utf8');

// remove all duplicates created by my script
css = css.replace(/\.panel h3,[\s\S]*?color: #4da6ff !important;\n}\n/gm, '');

// Append clean version
css += `
.panel h3,
.right-panel h3,
.left-panel h3 {
  color: #4da6ff !important;
}

.property-form label {
  color: #4da6ff !important;
}

.panel label {
  color: #4da6ff !important;
}
`;

fs.writeFileSync('src/styles.css', css);
