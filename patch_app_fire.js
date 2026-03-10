const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('<option value="3d-model">Live 3D Model</option>', '<option value="3d-model">Live 3D Model</option>\n          <option value="volumetric-fire">Live Volumetric Fire</option>');

if(!code.includes('import FireGenerator from')) {
    code = code.replace("import Animator3D from './Animator3D';", "import FireGenerator from './FireGenerator';\nimport Animator3D from './Animator3D';");
}

let firePanel = `
{selectedEmitterProperties.particleType === 'volumetric-fire' && (
    <div style={{
    width: '100%',
    marginLeft: '-2px',
    border: '1px solid #444',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
    borderRadius: '4px',
    backgroundColor: '#1e1e1e',
    backgroundSize: '20px 20px',
    backgroundImage: 'linear-gradient(to right, #2a2a2a 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)',
    marginTop: '10px'
    }}>
    <h3 style={{ margin: '0', padding: '5px 10px', fontSize: '12px', background: '#333', color: '#aaa', borderBottom: '1px solid #444', cursor: 'grab' }} >Live Volumetric Fire Settings</h3>
    <div style={{ padding: '10px' }}>
        <FireGenerator
        embeddedUI={true}
        onExportToParticleSystem={(dataUrls, fps) => {
            const textureName = \`fire_gen_\${Date.now()}\`;
            handleUpdateEmitterProperty('texture', textureName);
            handleUpdateEmitterProperty('particleSpriteSequenceDataUrls', dataUrls);
            handleUpdateEmitterProperty('particleSpriteSequenceFps', fps || 30);
        }}
        onExport={() => {}}
        />
    </div>
    </div>
)}
`;

code = code.replace(/\{selectedEmitterProperties\.particleType === '3d-model' && \([\s\S]*?<div className="live-3d-model-container"[\s\S]*?<\/div>\s*\)\s*\}/, match => match + '\n' + firePanel);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
