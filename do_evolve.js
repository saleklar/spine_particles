const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

// The original AI failed because of spacing. Let's use regex to replace main()
const targetMainRegex = /void main\(\) \{[\s\S]*?gl_FragColor = vec4\(clamp\(c, 0\.0, 1\.0\), clamp\(a, 0\.0, 1\.0\)\);\s*\}/;

const replaceMain = \oid main() {
    vec4 outColor;
    float currentBrightness = brightness;
    float currentContrast = contrast;
    float currentAlphaThreshold = alphaThreshold;

    if (evolveOverLife > 0.5) {
        // Map 0 -> 1 directly instead of loop looping
        float lp = loopProgress;
        
        currentBrightness = mix(brightness * 2.0, brightness * 0.1, lp);
        currentContrast = mix(contrast * 1.5, contrast * 0.5, lp);
        
        // If there is no turbulence (distortion is low), fade out opacity smoothly instead of aggressively eating holes
        // This prevents particles from looking scattered as dots at the end
        if (distortion < 0.1) {
             currentAlphaThreshold = mix(alphaThreshold, alphaThreshold + 0.1, lp); // gentle fade
        } else {
             currentAlphaThreshold = mix(alphaThreshold - 0.1, alphaThreshold + 0.6, pow(lp, 1.5));
        }

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
    
    // Smooth opacity fade toward very end of life if low turbulence to avoid scattered pixels
    if (evolveOverLife > 0.5 && distortion < 0.1) {
        a *= (1.0 - pow(loopProgress, 4.0)); // Fade out entirely at the end
    }

    gl_FragColor = vec4(clamp(c, 0.0, 1.0), clamp(a, 0.0, 1.0));
}\;

code = code.replace(targetMainRegex, replaceMain);

if (code.includes('if (evolveOverLife > 0.5)')) {
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log('SUCCESS: main replaced');
} else {
    console.log('FAILED to replace main');
}
