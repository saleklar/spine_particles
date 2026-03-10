const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = \                <button
                  className="menu-option"
                  onClick={() => {
                    handleAddPhysicsForce('turbulence');
                    setShowPhysicsPanel(false);
                  }}
                  type="button"
                >
                  <span>Add Turbulence</span>
                </button>
              </div>
            )}\;

const r = \                <button
                  className="menu-option"
                  onClick={() => {
                    handleAddPhysicsForce('turbulence');
                    setShowPhysicsPanel(false);
                  }}
                  type="button"
                >
                  <span>Add Turbulence</span>
                </button>
                <button
                  className="menu-option"
                  onClick={() => {
                    handleAddPhysicsForce('thermal-updraft');
                    setShowPhysicsPanel(false);
                  }}
                  type="button"
                >
                  <span>Add Thermal Updraft</span>
                </button>
              </div>
            )}\;

code = code.replace(t, r);
fs.writeFileSync('src/App.tsx', code);
console.log('Done');
