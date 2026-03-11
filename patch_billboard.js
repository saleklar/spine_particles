const fs = require('fs');

function patch(file) {
    console.log("Patching", file);
    let code = fs.readFileSync(file, 'utf8');

    // 1. Geometry replacement
    code = code.replace(/new THREE\.BoxGeometry\(SPACING\s*\*\s*0\.9,\s*SPACING\s*\*\s*0\.9,\s*SPACING\s*\*\s*0\.9\)/g, "new THREE.PlaneGeometry(SPACING * 1.5, SPACING * 1.5)");

    // 2. Vertex Shader -> Add varying
    let vertexRegex = /varying vec3 vColor;/g;
    code = code.replace(vertexRegex, "varying vec2 vUv;\nvarying vec3 vColor;");

    // 3. Vertex Shader -> vUv = uv
    let mainRegex = /void main\(\) \{/g;
    // in UI visualizer it occurs a couple times (in vertex and frag)
    // we only want inside vertex shader. 
    // Wait, let's just make it replace the first void main() if vertex is first, or we can just replace all void main() if they don't break.
    // Let's replace the one in vertex shader specifically by finding the block:
    let vertexInstanceStart = "    vec3 instancePos = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;";
    code = code.replace(vertexInstanceStart, "    vUv = uv;\n" + vertexInstanceStart);

    // 4. Vertex Shader -> Billboarding
    const oldVEnd1 = "vec3 scalePos = position * clamp(local_den * 1.5, 0.2, 1.0);";
    const oldVEnd2 = "vec4 worldPos = modelMatrix * instanceMatrix * vec4(scalePos, 1.0);";
    const oldVEnd3 = "gl_Position = projectionMatrix * viewMatrix * worldPos;";
    
    // We can do a string replace
    if (code.includes(oldVEnd2)) {
        code = code.replace(oldVEnd2, "    vec4 mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n    mvPosition.xyz += vec3(scalePos.xy, 0.0);");
        code = code.replace(oldVEnd3, "    gl_Position = projectionMatrix * mvPosition;");
    }

    // 5. Fragment Shader -> Add softly fading dot
    // Current fragment end:
    // gl_FragColor = vec4(clamp(col, 0.0, 1.0), vAlpha * 0.8);
    let oldFragEndRegex = /gl_FragColor = vec4\(clamp\(col, 0\.0, 1\.0\), vAlpha \* 0\.8\);/g;
    let newFragEnd = `
    // Soft circle mask
    float d = distance(vUv, vec2(0.5));
    float softMask = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), vAlpha * 0.8 * softMask);
    `;
    code = code.replace(oldFragEndRegex, newFragEnd);

    // If it's FireHeadless it might just have varying applied correctly if we use this replace
    fs.writeFileSync(file, code);
}

patch('src/FireGenerator.tsx');
patch('src/FireHeadless.ts');
console.log('DONE');
