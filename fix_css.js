const fs = require('fs');
let css = fs.readFileSync('src/styles.css', 'utf8');

// Find where \n.subpanel-content is
const badStart = css.indexOf('\\n.subpanel-content {');

if (badStart !== -1) {
  css = css.substring(0, badStart) + `
.subpanel-content {
  background: #242424;
  border-left: 2px solid #5a5a5a;
  padding: 0.2rem 0.4rem 0.5rem;
  margin-top: -1px;
  margin-bottom: 4px;
  border-radius: 0 2px 2px 0;
  display: flex;
  flex-direction: column;
}
`;
  fs.writeFileSync('src/styles.css', css);
  console.log("Fixed CSS!!");
} else {
  console.log("Could not find the bad css block.");
}
