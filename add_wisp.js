const fs = require('fs');

const file = 'src/FireGenerator.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update interface
code = code.replace(/shapeType: 'ground' \| 'fireball';/, "shapeType: 'ground' | 'fireball' | 'wisp';");

// 2. Add wisp preset
const presetToInsert = `
      {
        name: 'Plasma Wisp (Details)',
        params: {
          shapeType: 'wisp',
          color1: '#550000', color2: '#ff3300', color3: '#ffffff',
          speed: 4.0, scale: 3.5, coreBottom: 1.0, coreTop: 1.0,
          brightness: 1.8, contrast: 1.4, saturation: 1.2,
          frames: 64, fps: 30, resolution: 128,
          noiseType: 'simplex', distortion: 3.5, detail: 1.8, alphaThreshold: 0.2
        }
      },
`;
if (!code.includes('Plasma Wisp')) {
  code = code.replace(/name: 'Magic Blue Fire',/, presetToInsert + "      { name: 'Magic Blue Fire',");
}

// 3. Update uniform passing
code = code.replace(/shapeType: \{ value: params\.shapeType === 'fireball' \? 1\.0 : 0\.0 \}/, "shapeType: { value: params.shapeType === 'fireball' ? 1.0 : (params.shapeType === 'wisp' ? 2.0 : 0.0) }");
code = code.replace(/materialRef\.current\.uniforms\.shapeType\.value = params\.shapeType === 'fireball' \? 1\.0 : 0\.0;/, "materialRef.current.uniforms.shapeType.value = params.shapeType === 'fireball' ? 1.0 : (params.shapeType === 'wisp' ? 2.0 : 0.0);");

// 4. Update UI select
const selectHTML = `<select
            value={params.shapeType}
            onChange={e => setParams({...params, shapeType: e.target.value as 'ground' | 'fireball' | 'wisp'})}`;
code = code.replace(/<select\s+value=\{params\.shapeType\}\s+onChange=\{e => setParams\(\{\.\.\.params, shapeType: e\.target\.value as 'ground' \| 'fireball'\}\)\}/m, selectHTML);

if (!code.includes('<option value="wisp">Wisp / Ribbon</option>')) {
  code = code.replace(/<option value="fireball">Fireball<\/option>/, '<option value="fireball">Fireball</option>\n            <option value="wisp">Wisp / Ribbon</option>');
}

// 5. Update shader getDensity
const shaderReplacement = `
    float mask = 0.0;
    if (shapeType > 1.5) { // wisp
        // extremely thin, wispy shape
        float r = length(p.xz);
        float ny = p.y; // -1 to 1
        
        // domain warp for extra stringy details
        vec3 warp = vec3(fbm(np * 2.0 + t), fbm(np * 2.5 - t), fbm(np * 2.0));
        np += warp * (detail * 0.4);
        n = fbm(np);
        
        float taper = smoothstep(1.0, 0.2, abs(ny)); // tapers at ends
        float width = 0.3 * taper;
        float distFromCenter = abs(p.x) + abs(p.z)*0.5; // flatten it a bit
        
        mask = 1.0 - smoothstep(width * 0.05, width + 0.2, distFromCenter);
        mask *= taper;

    } else if (shapeType > 0.5) { // fireball
`;

if (!code.includes('if (shapeType > 1.5) { // wisp')) {
  code = code.replace(/if \(shapeType < 0\.5\) \{[\s\S]*?\} else \{/, shaderReplacement);
  // Re-add the ground branch at the end of the if-else
  code = code.replace(/\} else if \(shapeType > 0\.5\) \{ \/\/ fireball/, `} else if (shapeType > 0.5) { // fireball
        float d = length(p);
        mask = 1.0 - smoothstep(0.2, 0.6, d);
    } else { // ground
        float r = length(p.xz);
        // Map y from [-1, 1] to [0, 1]
        float ny = (p.y + 0.8) * 0.6;
        float powY = pow(max(0.0, ny), 1.2);
        float width = mix(0.4, 0.02, powY);
        mask = 1.0 - smoothstep(width * 0.2, width, r);
        float topFade = 1.0 - smoothstep(0.5, 1.0, ny);
        float bottomPinch = smoothstep(0.0, 0.2, ny);
        mask *= topFade * mix(0.2, 1.0, bottomPinch);`);
}

fs.writeFileSync(file, code);
console.log('Added Wisp feature');
