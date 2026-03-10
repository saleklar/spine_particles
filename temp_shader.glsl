
  uniform float loopProgress;
  uniform float speed;
  uniform float scale;
  uniform float coreBottom;
uniform float coreTop;
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
uniform float alphaThreshold;
uniform vec3 flowDirection;
uniform vec3 rotation;
  uniform vec3 rotationSpeed;

varying vec2 vUv;


mat3 getRotationMatrix(vec3 rot) {
    float cx = cos(rot.x), sx = sin(rot.x);
    float cy = cos(rot.y), sy = sin(rot.y);
    float cz = cos(rot.z), sz = sin(rot.z);

    mat3 rx = mat3(
        1.0, 0.0, 0.0,
        0.0, cx, -sx,
        0.0, sx, cx
    );

    mat3 ry = mat3(
        cy, 0.0, sy,
        0.0, 1.0, 0.0,
        -sy, 0.0, cy
    );

    mat3 rz = mat3(
        cz, -sz, 0.0,
        sz, cz, 0.0,
        0.0, 0.0, 1.0
    );

    return rz * ry * rx;
}

// --- 3D Simplex Noise ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise3(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for(int i=0; i<4; i++) {
        f += w * snoise3(p);
        p *= 2.0;
        w *= 0.5;
    }
    return f;
}

float getDensity(vec3 p, float t) {
    vec3 np = p * scale * 0.5;
    np -= flowDirection * t * 1.5;
    np = getRotationMatrix(rotation + rotationSpeed * t) * np;

    
    np.x += snoise3(np * 2.0 + vec3(0.0, -t, 0.0)) * distortion * 0.5;
    np.z += snoise3(np * 2.0 + vec3(0.0, -t, t)) * distortion * 0.5;
    
    float n = fbm(np);
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
vec3 shapeDist = p;
          shapeDist.x += snoise3(vec3(p.y * 3.0, t * 2.0, 0.0)) * distortion * 0.2;
          shapeDist.z += snoise3(vec3(0.0, t * 2.0, p.y * 3.0)) * distortion * 0.2;
          float distFromCenter = abs(shapeDist.x) + abs(shapeDist.z)*0.5; // flatten it a bit
        
        mask = 1.0 - smoothstep(width * 0.05, width + 0.2, distFromCenter);
        mask *= taper;

    } else if (shapeType > 0.5) { // fireball
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
          mask *= topFade * mix(0.2, 1.0, bottomPinch);
      }

      // Add a bottom fade to all
      mask *= smoothstep(-1.0, -0.6, p.y);

      float density = (n * 0.5 + 0.5) * mask;
    return pow(max(0.0, density), mix(coreBottom, coreTop, p.y * 0.5 + 0.5));
}

vec4 computeVolumetric(float timePhase) {
    float t = timePhase * speed * 2.0;
    
    vec2 uv = (vUv - 0.5) * 2.0;
    
    // Shoot ray inward
    vec3 rayOrigin = vec3(uv.x, uv.y, 1.0);
    vec3 rayDir = vec3(0.0, 0.0, -1.0);
    
    float tStep = 0.04;
    float tMax = 2.0;
    float currentT = 0.0;
    
    float T = 1.0; 
    vec3 finalColor = vec3(0.0);
    
    for(int i=0; i < 50; i++) {
        vec3 p = rayOrigin + rayDir * currentT;
        
        if (abs(p.x) > 1.0 || abs(p.y) > 1.0 || abs(p.z) > 1.0) {
            currentT += tStep;
            continue;
        }
        
        float density = getDensity(p, t);
        
        if(density > 0.01) {
            vec3 fireColor = mix(color1, color2, smoothstep(0.1, 0.5, density));
            fireColor = mix(fireColor, color3, smoothstep(0.5, 0.9, density));
            
            float hot = pow(density, 6.0) * detail;
            fireColor += vec3(1.0, 0.8, 0.4) * hot;
            
            float smokeMask = smoothstep(0.3, 0.0, density) * smoothstep(0.0, 1.0, p.y+0.5) * 0.5;
            fireColor = mix(fireColor, vec3(0.02), smokeMask);
            
            float erosionNoise = snoise3(p * scale * 2.0 - vec3(0.0, t*1.5, 0.0));
              if (noiseType > 0.5) erosionNoise = abs(erosionNoise); // pseudo-voronoi for crispness
              float erosionThreshold = alphaThreshold * mix(1.0, erosionNoise * 0.5 + 0.5, clamp(distortion * 0.5, 0.0, 1.0));
              
              float stepAlpha = max(0.0, density - erosionThreshold) * mix(8.0, 30.0, clamp(alphaThreshold, 0.0, 1.0));
              stepAlpha = pow(stepAlpha, mix(0.7, 1.5, clamp(alphaThreshold, 0.0, 1.0))); 
            
            finalColor += T * fireColor * stepAlpha * tStep;
            T *= exp(-stepAlpha * tStep * mix(1.0, 8.0, smokeMask)); 
            
            if(T < 0.01) break; 
        }
        
        currentT += tStep;
        if(currentT > tMax) break;
    }
    
    float alpha = 1.0 - T;
    return vec4(finalColor, alpha);
}

void main() {
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
}
