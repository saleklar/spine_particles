const fs = require('fs');

const path = 'src/FireGenerator.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace uniforms
code = code.replace(/time: \{ value: 0 \}/g, 'loopProgress: { value: 0 }');

// We need to replace the fragmentShader first
let s1 = `const fragmentShader = \``;
let s2 = `\`;`;

let fragStart = code.indexOf(s1);
let fragEnd = code.indexOf(s2, fragStart) + s2.length;

let newFrag = s1 + `
uniform float loopProgress;
uniform float speed;
uniform float scale;
uniform float core;
uniform float shapeType;
uniform float brightness;
uniform float contrast;
uniform float saturation;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float noiseType;
uniform float distortion;
uniform float detail;

varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi(vec2 x, float t) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float min_dist = 1.0;
    for(int j=-1; j<=1; j++)
    for(int i=-1; i<=1; i++) {
        vec2 g = vec2(float(i),float(j));
        vec2 o = random2(n + g);
        o = 0.5 + 0.5*sin(t + 6.2831*o);
        vec2 r = g + o - f;
        float d = dot(r,r);
        if(d < min_dist) min_dist = d;
    }
    return min_dist;
}

float getNoise(vec2 pos, float t) {
    if (noiseType > 0.5) {
        return pow(1.0 - voronoi(pos, t), 2.0);
    } else {
        return snoise(pos) * 0.5 + 0.5;
    }
}

vec4 renderFire(float p_base, vec2 uv) {
    float t = p_base * speed * 2.0; // multiply by 2 for standard pace
    vec2 pos = uv * scale;
    
    vec2 flowPos = pos;
    flowPos.y -= t * 1.5;
    
    vec2 warpedPos = flowPos;
    warpedPos.x += snoise(pos * 1.5 + vec2(0.0, -t)) * distortion;
    warpedPos.y += snoise(pos * 2.0 + vec2(0.0, -t * 1.2)) * distortion * 0.5;
    float n1 = getNoise(warpedPos * 1.0, t * 1.0);
    float n2 = getNoise(warpedPos * 2.0 + vec2(snoise(vec2(t*0.5)), -t * 0.5), t * 1.5);
    float n3 = getNoise(warpedPos * 4.0 + vec2(0.0, -t * 1.0), t * 2.0);
    float baseNoise = mix(n1, (n1 * 0.5 + n2 * 0.3 + n3 * 0.2), detail);
    
    float streaks = snoise(vec2(pos.x * 2.0 + snoise(pos * 0.5), pos.y * 2.0 - t * 2.5)) * 0.5 + 0.5;
    float n = mix(baseNoise, baseNoise * streaks, 0.4);
    
    float gradient = 1.0;
    if (shapeType < 0.5) {
        gradient = smoothstep(1.0, 0.05, uv.y);
        gradient *= smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
    } else {
        float dist = distance(uv, vec2(0.5, 0.5));
        gradient = smoothstep(0.5, 0.1, dist);
    }
    
    n = pow(n * gradient, core);
    vec3 col = mix(color1, color2, smoothstep(0.0, 0.4, n));
    col = mix(col, color3, smoothstep(0.4, 0.8, n));
    float alpha = smoothstep(0.05, 0.5, n);
    
    float blurAmt = speed * 0.02;
    vec2 blurPos = warpedPos;
    blurPos.y += blurAmt;
    float bn1 = getNoise(blurPos * 1.0, t - 0.1);
    float bn = pow(mix(bn1, (bn1 * 0.5 + n2 * 0.3 + n3 * 0.2), detail) * gradient, core);
    
    vec3 bcol = mix(color1, color2, smoothstep(0.0, 0.4, bn));
    bcol = mix(bcol, color3, smoothstep(0.4, 0.8, bn));
    float balpha = smoothstep(0.05, 0.5, bn);
    
    col = mix(col, bcol, 0.6);
    alpha = max(alpha, balpha * 0.6);
    
    float emberNoise = snoise(pos * 10.0 + vec2(0.0, -t*2.5));
    float embers = pow(max(0.0, emberNoise), 12.0) * gradient * detail;
    col += embers * vec3(1.0, 0.8, 0.3);
    alpha += embers * 0.5;
    float smokeNoise = smoothstep(0.3, 0.7, snoise(pos * 2.0 + vec2(0.0, -t*1.5)));
    float smokeMask = smoothstep(0.4, 1.0, uv.y) * smokeNoise * 0.8 * detail;
    col = mix(col, vec3(0.05, 0.05, 0.05), smokeMask);
    alpha = max(alpha, smokeMask * 0.5);
    
    return vec4(col, alpha);
}

void main() {
    float p = loopProgress;
    vec4 f1 = renderFire(p, vUv);
    // crossfade with phase offset by 1.0
    vec4 f2 = renderFire(p - 1.0, vUv);
    
    vec4 blended = mix(f2, f1, p);
    
    // Apply contrast, brightness, saturation
    vec3 outCol = blended.rgb * brightness;
    outCol = (outCol - 0.5) * contrast + 0.5;
    float luminance = dot(outCol, vec3(0.299, 0.587, 0.114));
    outCol = mix(vec3(luminance), outCol, saturation);
    
    gl_FragColor = vec4(clamp(outCol, 0.0, 1.0), clamp(blended.a, 0.0, 1.0));
}
` + s2;

code = code.substring(0, fragStart) + newFrag + code.substring(fragEnd);

// Replace render loop code
const targetRender1 = `materialRef.current.uniforms.time.value = clock.getElapsedTime();`;
const newRender1 = `const loopDuration = params.frames / params.fps;
        const pg = (clock.getElapsedTime() % loopDuration) / loopDuration;
        materialRef.current.uniforms.loopProgress.value = pg;`;
code = code.replace(targetRender1, newRender1);

const targetRender2 = `const render = () => {
      animationId = requestAnimationFrame(render);
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
    };`;

if (code.includes(targetRender2)) {
    const rx = `const render = () => {
      animationId = requestAnimationFrame(render);
      if (materialRef.current) {
        const loopDuration = params.frames / params.fps;
        const progress = (clock.getElapsedTime() % loopDuration) / loopDuration;
        materialRef.current.uniforms.loopProgress.value = progress;
      }
      renderer.render(scene, camera);
    };`;
    code = code.replace(targetRender2, rx);
}

const targetExportLoop1 = `const time = (i / params.frames) * duration;
        materialRef.current.uniforms.time.value = time * 2.0;`;
const newExportLoop1 = `const progress = i / params.frames;
        materialRef.current.uniforms.loopProgress.value = progress;`;
code = code.replace(targetExportLoop1, newExportLoop1); // may match attach one too

const exportLoop2 = `        const time = (i / params.frames) * duration;
        materialRef.current.uniforms.time.value = time * 2.0; // scale time to make loop feel right`;
code = code.replace(exportLoop2, newExportLoop1);

fs.writeFileSync(path, code);
console.log('Shader patching applied successfully!');
