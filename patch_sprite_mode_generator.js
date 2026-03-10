const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// 1. Add boolean to GeneratorParams
code = code.replace("alphaThreshold: number;", "alphaThreshold: number;\n    evolveOverLife?: boolean;");

// 2. Add to uniform map
let t1 = `alphaThreshold: { value: params.alphaThreshold || 0.0 },`;
let r1 = `alphaThreshold: { value: params.alphaThreshold || 0.0 },\n          evolveOverLife: { value: params.evolveOverLife ? 1.0 : 0.0 },`;
code = code.replace(t1, r1);

// 3. Define uniform in shader
code = code.replace("uniform vec3 rotation;", "uniform vec3 rotation;\n  uniform float evolveOverLife;");

// 4. Transform main() in shader
let targetMain = `  void main() {
      float p1 = fract(loopProgress);
      float p2 = fract(loopProgress + 0.5);

      vec4 v1 = computeVolumetric(p1);
      vec4 v2 = computeVolumetric(p2);

      float w1 = sin(p1 * 3.14159265);
      float w2 = sin(p2 * 3.14159265);
      float w1_sq = w1 * w1;
      float w2_sq = w2 * w2;

      vec4 outColor = v1 * w1_sq + v2 * w2_sq;

      vec3 c = outColor.rgb * brightness;
      c = (c - 0.5) * contrast + 0.5;
      float lum = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(lum), c, saturation);

      // Smooth opacity mapping
      float baseAlpha = pow(clamp(outColor.a, 0.0, 1.0), mix(0.7, 0.8, clamp(outColor.a, 0.0, 1.0)));
      float a = baseAlpha * mix(1.5, 2.5, clamp(alphaThreshold, 0.0, 1.0));

      gl_FragColor = vec4(clamp(c, 0.0, 1.0), clamp(a, 0.0, 1.0));
  }`;

let replaceMain = `  void main() {
      vec4 outColor;
      float currentBrightness = brightness;
      float currentContrast = contrast;
      float currentAlphaThreshold = alphaThreshold;

      if (evolveOverLife > 0.5) {
          // Linear progression directly, no loop wave mixing
          float lp = loopProgress;
          
          // Evolve properties over the stroke of the sequence
          currentBrightness = mix(brightness * 2.0, brightness * 0.1, lp);
          currentContrast = mix(contrast * 1.5, contrast * 0.5, lp);
          
          // Erode pieces (more alpha eating threshold) towards the end
          currentAlphaThreshold = mix(alphaThreshold - 0.1, alphaThreshold + 0.6, pow(lp, 1.5));
          
          outColor = computeVolumetric(lp); // sweeps normally 0 to 1 without loop
      } else {
          float p1 = fract(loopProgress);
          float p2 = fract(loopProgress + 0.5);

          vec4 v1 = computeVolumetric(p1);
          vec4 v2 = computeVolumetric(p2);

          float w1 = sin(p1 * 3.14159265);
          float w2 = sin(p2 * 3.14159265);
          float w1_sq = w1 * w1;
          float w2_sq = w2 * w2;

          outColor = v1 * w1_sq + v2 * w2_sq;
      }

      vec3 c = outColor.rgb * currentBrightness;
      c = (c - 0.5) * currentContrast + 0.5;
      float lum = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(lum), c, saturation);

      // Smooth opacity mapping
      float baseAlpha = pow(clamp(outColor.a, 0.0, 1.0), mix(0.7, 0.8, clamp(outColor.a, 0.0, 1.0)));
      float a = baseAlpha * mix(1.5, 2.5, clamp(currentAlphaThreshold, 0.0, 1.0));

      gl_FragColor = vec4(clamp(c, 0.0, 1.0), clamp(a, 0.0, 1.0));
  }`;

code = code.replace(targetMain, replaceMain);

// 5. Add UI logic
let targetUI = `onChange={(e) => setParams(p => ({ ...p, alphaThreshold: parseFloat(e.target.value) }))}
          />
        </label>`;

let replaceUI = `onChange={(e) => setParams(p => ({ ...p, alphaThreshold: parseFloat(e.target.value) }))}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <input
            type="checkbox"
            checked={params.evolveOverLife ?? false}
            onChange={(e) => setParams(p => ({ ...p, evolveOverLife: e.target.checked }))}
            style={{ marginRight: '8px' }}
          />
          Evolve Shape Over Sequence
        </label>`;

code = code.replace(targetUI, replaceUI);

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log("Patched FireGenerator.tsx for sequence evolution");
