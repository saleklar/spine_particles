const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const regex = /if \(shapeType > 1\.5\) \{[\s\S]*?\/\/ Add a bottom fade to all\r?\n\s+mask \*= smoothstep\(-1\.0, -0\.[67], p\.y\);/;

const repl = `if (shapeType > 1.5) { // wisp
          // extremely thin, wispy shape
          float r = length(p.xz);
          float ny = p.y; // -1 to 1

          // domain warp for extra stringy details
          vec3 warp = vec3(fbm(np * 2.0 + t), fbm(np * 2.5 - t), fbm(np * 2.0));
          np += warp * (detail * 0.4);
          n = fbm(np);

          float taper = smoothstep(1.0, 0.2, abs(ny)); // tapers at ends
          float width = 0.6 * taper; // CHANGED: Wider wisp
  vec3 shapeDist = p;
            shapeDist.x += snoise3(vec3(p.y * 3.0, t * 2.0, 0.0)) * distortion * 0.2;
            shapeDist.z += snoise3(vec3(0.0, t * 2.0, p.y * 3.0)) * distortion * 0.2;
            float distFromCenter = abs(shapeDist.x) + abs(shapeDist.z)*0.5; // flatten it a bit

          mask = 1.0 - smoothstep(width * 0.05, width + 0.2, distFromCenter);
          mask *= taper;

      } else if (shapeType > 0.5) { // fireball
          float d = length(p);
          mask = 1.0 - smoothstep(0.4, 0.9, d); // CHANGED: Bigger fireball
      } else { // ground
          float r = length(p.xz);
          // Shift and stretch to fill more box
          float ny = (p.y + 0.9) * 0.52; // CHANGED: Stretches taller
          float powY = pow(max(0.0, ny), 1.2);
          float width = mix(0.7, 0.05, powY); // CHANGED: wider base
          mask = 1.0 - smoothstep(width * 0.1, width, r);
          float topFade = 1.0 - smoothstep(0.55, 1.0, ny);
          float bottomPinch = smoothstep(0.0, 0.2, ny);
          mask *= topFade * mix(0.4, 1.0, bottomPinch);
      }

      // Add a bottom fade to all
      mask *= smoothstep(-1.0, -0.7, p.y);`;

if(code.match(regex)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/FireGenerator.tsx', code);
    console.log("Shape bounds patched successfully!");
} else {
    console.log("REGEX FAILED TO MATCH");
}
