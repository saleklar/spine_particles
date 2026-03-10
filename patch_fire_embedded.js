const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(
    "<div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#1e1e1e', color: '#fff' }}>",
    "<div style={embeddedUI ? { display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'transparent', color: 'inherit' } : { display: 'flex', width: '100%', height: '100vh', backgroundColor: '#1e1e1e', color: '#fff' }}>"
);

code = code.replace(
    "<div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', borderRight: '1px solid #333', overflowY: 'auto' }}>",
    "<div style={embeddedUI ? { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding: '0', borderRight: 'none', overflowY: 'visible' } : { width: '300px', display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', borderRight: '1px solid #333', overflowY: 'auto' }}>"
);

code = code.replace(
    "<h3 style={{ margin: 0 }}>Fire Shader Generator</h3>",
    "{!embeddedUI && <h3 style={{ margin: 0 }}>Fire Shader Generator</h3>}"
);

code = code.replace(
    "<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'radial-gradient(circle at center, #333 0%, #111 100%)' }}>",
    "<div style={embeddedUI ? { width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'radial-gradient(circle at center, #333 0%, #111 100%)', marginTop: '15px', borderRadius: '4px', overflow: 'hidden' } : { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'radial-gradient(circle at center, #333 0%, #111 100%)' }}>"
);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('FireGenerator UI patched for embedded mode');
