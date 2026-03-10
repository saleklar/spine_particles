const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(
  'rotSpeedZ?: number;',
  'rotSpeedZ?: number;\n  thermalBuoyancy?: number;\n  vorticityConfinement?: number;'
);

code = code.replace(
  "noiseType: 'voronoi' as 'simplex' | 'voronoi',",
  "noiseType: 'voronoi' as 'simplex' | 'voronoi',\n      thermalBuoyancy: 1.0,\n      vorticityConfinement: 1.0,"
);

code = code.replace(
  'rotationSpeed: { value: new THREE.Vector3(params.rotSpeedX || 0, params.rotSpeedY || 0, params.rotSpeedZ || 0) }',
  'rotationSpeed: { value: new THREE.Vector3(params.rotSpeedX || 0, params.rotSpeedY || 0, params.rotSpeedZ || 0) },\n          thermalBuoyancy: { value: params.thermalBuoyancy !== undefined ? params.thermalBuoyancy : 1.0 },\n          vorticityConfinement: { value: params.vorticityConfinement !== undefined ? params.vorticityConfinement : 1.0 }'
);

code = code.replace(
  'materialRef.current.uniforms.detail.value = params.detail;',
  'materialRef.current.uniforms.detail.value = params.detail;\n      if(materialRef.current.uniforms.thermalBuoyancy) materialRef.current.uniforms.thermalBuoyancy.value = params.thermalBuoyancy !== undefined ? params.thermalBuoyancy : 1.0;\n      if(materialRef.current.uniforms.vorticityConfinement) materialRef.current.uniforms.vorticityConfinement.value = params.vorticityConfinement !== undefined ? params.vorticityConfinement : 1.0;'
);

code = code.replace('uniform vec3 rotationSpeed;', 'uniform vec3 rotationSpeed;\nuniform float thermalBuoyancy;\nuniform float vorticityConfinement;');

code = code.replace(
  'np -= flowDirection * t * 1.5;',
  '// FDS Thermodynamics Approximation: Buoyancy causes vertical velocity to increase with height (temperature gradient)\n    vec3 advection = flowDirection * t * 1.5;\n    advection.y += (p.y + 1.0) * thermalBuoyancy * t * 2.0;\n    np -= advection;'
);

code = code.replace(
  'np.x += snoise3(np * 2.0 + vec3(0.0, -t, 0.0)) * distortion * 0.5;\n    np.z += snoise3(np * 2.0 + vec3(0.0, -t, t)) * distortion * 0.5;',
  '// FDS Vorticity Confinement: Adds high-frequency rolling eddies\n    vec3 curl = vec3(\n        snoise3(np * 2.0 + vec3(0.0, -t, 0.0)),\n        snoise3(np * 2.0 + vec3(t, 0.0, -t)),\n        snoise3(np * 2.0 + vec3(0.0, -t, t))\n    ) * distortion * 0.5 * vorticityConfinement;\n    np += curl;'
);

const sliderHtml = `          <div className="control-group">
            <label>Thermal Buoyancy:</label>
            <input type="range" min="0" max="5" step="0.1" value={params.thermalBuoyancy ?? 1.0} onChange={e => setParams({...params, thermalBuoyancy: parseFloat(e.target.value)})} />
            <input type="number" value={params.thermalBuoyancy ?? 1.0} onChange={e => setParams({...params, thermalBuoyancy: parseFloat(e.target.value)})} />
          </div>
          <div className="control-group">
            <label>Vorticity Confinement:</label>
            <input type="range" min="0" max="5" step="0.1" value={params.vorticityConfinement ?? 1.0} onChange={e => setParams({...params, vorticityConfinement: parseFloat(e.target.value)})} />
            <input type="number" value={params.vorticityConfinement ?? 1.0} onChange={e => setParams({...params, vorticityConfinement: parseFloat(e.target.value)})} />
          </div>`;

code = code.replace(
  '<label>Detail (Sub-noise):</label>',
  sliderHtml + '\n          <label>Detail (Sub-noise):</label>'
);

const oldPresets = "{ name: 'Magic Blue Fire',";
const fdsPreset = `{
        name: 'Scientific FDS Fire',
        params: {
          shapeType: 'ground',
          color1: '#050000', // Blackbody core start
          color2: '#e64000', // Heat transition
          color3: '#ffe173', // Superheated core
          speed: 2.0, scale: 4.0, coreBottom: 1.8, coreTop: 0.8,
          brightness: 1.5, contrast: 1.2, saturation: 1.0,
          frames: 64, fps: 30, resolution: 128,
          noiseType: 'voronoi', distortion: 3.0, detail: 1.5, alphaThreshold: 0.1, thermalBuoyancy: 3.5, vorticityConfinement: 2.5
        }
      },
      {
        name: 'ForeFire Real-Time Simulation',
        params: {
          shapeType: 'ground',
          color1: '#110000', color2: '#ff2200', color3: '#fff0aa',
          speed: 1.2, scale: 2.5, coreBottom: 2.0, coreTop: 0.9,
          brightness: 1.3, contrast: 1.1, saturation: 0.9,
          frames: 64, fps: 60, resolution: 256,
          noiseType: 'simplex', distortion: 4.0, detail: 2.0, alphaThreshold: 0.2, thermalBuoyancy: 1.2, vorticityConfinement: 4.0
        }
      },
      `;
      
code = code.replace(oldPresets, fdsPreset + oldPresets);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('FDS attributes patched into FireGenerator.tsx');
