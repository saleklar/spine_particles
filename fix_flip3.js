const fs = require('fs');

let code = fs.readFileSync('src/Scene3D.tsx', 'utf-8');

const s = "scene.add(replacementMesh);\r\n                    particle.mesh = replacementMesh;\r\n                  }";
const s2 = "scene.add(replacementMesh);\n                    particle.mesh = replacementMesh;\n                  }";

const replacement = "scene.add(replacementMesh);\n                    particle.mesh = replacementMesh;\n                    setParticleSize(particle.mesh, getPreviewedParticleSize(particle.baseSize ?? 3), particle.flipX);\n                  }";

if (code.includes(s)) {
    code = code.replace(s, replacement);
    console.log('CRLF match');
} else if (code.includes(s2)) {
    code = code.replace(s2, replacement);
    console.log('LF match');
} else {
    // maybe try to replace split by regex over just the last statement
    code = code.replace(/particle\.mesh = replacementMesh;\s*\}/, "particle.mesh = replacementMesh;\n                    setParticleSize(particle.mesh, getPreviewedParticleSize(particle.baseSize ?? 3), particle.flipX);\n                  }");
    console.log('Regex fallback');
}

fs.writeFileSync('src/Scene3D.tsx', code);
