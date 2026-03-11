
const fs = require('fs');
let c = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const replacement = \loat getDensity(vec3 p, float t) {
    p.y += 0.8;
    float sx = stretchX > 0.01 ? stretchX : 1.0;
    float sy = stretchY > 0.01 ? stretchY : 1.0;
    p.x /= sx;
    p.y /= sy;
    p.z /= sx;

    // THERMAL BUOYANCY: Geometrically lift the central core higher
    // Pull the sampling coordinate DOWN in the center so the physical shape goes UP
    float centerProximity = smoothstep(1.5, 0.0, length(p.xz));
    float lift = centerProximity * max(0.5, thermalBuoyancy * 2.5);
    float liftedY = p.y - (lift * 1.5); 

    // Convert to volume shape distance using lifted coordinate
    // Cone tapers much slower in the center so it reaches high into the air
    float coneTaper = mix(0.4, 0.15, centerProximity);
    float radius = max(0.01, 1.2 - max(0.0, liftedY) * coneTaper);
    float d = length(p.xz) - radius;

    // Central parts also move upward significantly faster
    float currentSpeed = speed * (1.0 + lift * 1.2) * 2.5;

    // Use lifted coordinates for sampling noise so turbulence follows the flame up
    vec3 np = vec3(p.x, liftedY, p.z) * scale * 0.5;

    // Pass 1: current time
    float disp1 = t * currentSpeed;
    vec3 np1 = np - vec3(0.0, disp1, 0.0);
    float n1_1 = fbm(np1);
    float n2_1 = fbm(np1 * 2.0 - vec3(0.0, disp1 * 2.0, 0.0));
    float noise1 = n1_1 * 0.7 + n2_1 * 0.35;

    // Pass 2: time wrapped to loop around
    float disp2 = (t - 1.0) * currentSpeed;
    vec3 np2 = np - vec3(0.0, disp2, 0.0);
    float n1_2 = fbm(np2);
    float n2_2 = fbm(np2 * 2.0 - vec3(0.0, disp2 * 2.0, 0.0));
    float noise2 = n1_2 * 0.7 + n2_2 * 0.35;

    // Blend them based on time to create a perfect loop
    float noiseBlended = mix(noise1, noise2, t);

    // Dynamic displacement using distortion
    float nSigned = (noiseBlended - 0.5) * 2.0;
    d += nSigned * max(0.5, distortion) * smoothstep(0.0, 1.5, p.y + 0.5);

    // DETACHED EMBERS: Pockets of fire breaking off near the top
    float emberSpeed = currentSpeed * 1.5; 
    float eDisp1 = t * emberSpeed;
    float eDisp2 = (t - 1.0) * emberSpeed;
    vec3 eNp1 = np * 3.5 - vec3(0.0, eDisp1, 0.0);
    vec3 eNp2 = np * 3.5 - vec3(0.0, eDisp2, 0.0);
    float eNoise = mix(fbm(eNp1), fbm(eNp2), t);
    
    // Threshold to create distinct small blobs
    float emberMask = smoothstep(0.65, 0.85, eNoise);
    emberMask *= smoothstep(0.5, 3.5, p.y) * smoothstep(2.0, 0.5, d);
    d -= emberMask * 0.9;

    // Ethereal thinning
    float shellThickness = mix(0.35, 0.05, clamp(detail / 5.0, 0.0, 1.0)); 
    float shell = 1.0 - smoothstep(0.0, shellThickness, abs(d));

    // High frequency textural cutouts for a wispy, stringy look
    vec3 hfNp1 = np * 2.5 - vec3(0.0, disp1 * 1.8, 0.0);
    vec3 hfNp2 = np * 2.5 - vec3(0.0, disp2 * 1.8, 0.0);
    float hfN = mix(fbm(hfNp1), fbm(hfNp2), t);

    shell *= smoothstep(0.1, 0.9, hfN + (detail * 0.15));

    float coreAmt = smoothstep(0.2, -0.4, d) * 0.02;  
    float den = shell + coreAmt;

    // Let the center and embers fade out much higher up!
    float topFadeStart = mix(1.2, 4.0, centerProximity);
    float topFadeEnd = mix(3.5, 6.5, centerProximity);

    den *= smoothstep(-0.3, 0.5, p.y);
    den *= smoothstep(topFadeEnd, topFadeStart, p.y);

    float emDisp1_turb = t * emitterSpeed * 2.5;
    float emDisp2_turb = (t - 1.0) * emitterSpeed * 2.5;

    vec3 emNp1_t = vec3(p.x * 2.0, p.z * 2.0, emDisp1_turb);
    vec3 emNp2_t = vec3(p.x * 2.0, p.z * 2.0, emDisp2_turb);
    float emN1_t = fbm(emNp1_t);
    float emN2_t = fbm(emNp2_t);
    float emN_t = mix(emN1_t, emN2_t, t);

    float emMaskTurb = mix(1.0, smoothstep(0.1, 0.9, emN_t), emitterTurbulence);      
    den *= mix(emMaskTurb, 1.0, smoothstep(-0.5, 1.5, p.y));

    return den;
}\;

const startIdx = c.indexOf('float getDensity(vec3 p, float t) {');
const endIdx = c.indexOf('    return den;\\r\\n}') !== -1 ? c.indexOf('    return den;\\r\\n}') + 18 : c.indexOf('    return den;\\n}') + 17;
if(startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    c = c.substring(0, startIdx) + replacement + c.substring(endIdx);
    fs.writeFileSync('src/FireGenerator.tsx', c);
    console.log('INDEX REPLACEMENT SUCCESSFUL');
} else {
    console.log('INDEX REPLACEMENT FAILED', startIdx, endIdx);
}

