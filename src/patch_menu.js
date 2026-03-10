const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
    "const [showCreateMenu, setShowCreateMenu] = useState(false);", 
    "const [showCreateMenu, setShowCreateMenu] = useState(false);\n  const [showPresetsMenu, setShowPresetsMenu] = useState(false);"
);

// We need to remove presets from the create menu.
const presetsCodeToReplace = `<div className="menu-separator"></div>
              <button
                className="menu-option has-submenu"
                onMouseEnter={() => setShowCreateSubmenu('Presets')}
                type="button"
              >
                <span>Presets</span>
                <span className="submenu-arrow">▶</span>
              </button>
              {showCreateSubmenu === 'Presets' && (
                <div className="menu-submenu" style={{ top: '120px' }}>
                  <button
                    className="menu-option"
                    onClick={() => handleCreateFirePreset('campfire')}
                    type="button"
                  >
                    <span>Campfire</span>
                  </button>
                  <button
                    className="menu-option"
                    onClick={() => handleCreateFirePreset('torch')}
                    type="button"
                  >
                    <span>Torch</span>
                  </button>
                </div>
              )}`;

code = code.replace(presetsCodeToReplace, "");

const newPresetsMenu = `
        <div className="menu-item">
          <button
            className="menu-button"
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            type="button"
            style={{ backgroundColor: '#2a9d8f', color: '#fff', fontWeight: 'bold' }}
          >
            Presets
          </button>
          {showPresetsMenu && (
            <div className="menu-dropdown">
              <button
                className="menu-option"
                onClick={() => {
                  handleCreateFirePreset('campfire');
                  setShowPresetsMenu(false);
                }}
                type="button"
              >
                <span>Campfire</span>
              </button>
              <button
                className="menu-option"
                onClick={() => {
                  handleCreateFirePreset('torch');
                  setShowPresetsMenu(false);
                }}
                type="button"
              >
                <span>Torch</span>
              </button>
            </div>
          )}
        </div>
`;

code = code.replace(
    '<div className="menu-item">\n          <button\n            className="menu-button"\n            onClick={() => setShowPhysicsPanel(!showPhysicsPanel)}',
    newPresetsMenu + '\n        <div className="menu-item">\n          <button\n            className="menu-button"\n            onClick={() => setShowPhysicsPanel(!showPhysicsPanel)}'
);

// Close menu event
code = code.replace("setShowCreateMenu(false);", "setShowCreateMenu(false);\n          setShowPresetsMenu(false);");

fs.writeFileSync('src/App.tsx', code);
console.log('Moved presets to main menu');
