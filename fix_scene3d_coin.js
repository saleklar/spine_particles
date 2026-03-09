const fs = require('fs');
const file = 'src/Scene3DAnimator.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('BufferGeometryUtils')) {
  content = content.replace(
    /import \* as THREE from 'three';/,
    "import * as THREE from 'three';\nimport * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';"
  );
}

const coinLog = "case 'coin':\n" +
  "  {\n" +
  "    const radius = params.radiusTop ?? 50;\n" +
  "    const fw = params.coinFrameWidth ?? 10;\n" +
  "    const fh = params.coinFrameHeight ?? 20;\n" +
  "    const size = params.coinInnerShapeSize ?? 20;\n" +
  "    const depth = params.coinInnerShapeDepth ?? 10;\n" +
  "    const pts = params.coinInnerShapePoints ?? 5;\n" +
  "    const type = params.coinInnerShapePattern ?? 'star';\n" +
  "    \n" +
  "    const geometries = [];\n" +
  "    const plateThickness = Math.max(1, depth * 0.5);\n" +
  "    const plateGeo = new THREE.CylinderGeometry(radius - fw/2, radius - fw/2, plateThickness, 64);\n" +
  "    plateGeo.rotateX(Math.PI / 2);\n" +
  "    geometries.push(plateGeo);\n" +
  "    \n" +
  "    const rimShape = new THREE.Shape();\n" +
  "    rimShape.absarc(0, 0, radius, 0, Math.PI * 2, false);\n" +
  "    const rimHole = new THREE.Path();\n" +
  "    rimHole.absarc(0, 0, radius - fw, 0, Math.PI * 2, true);\n" +
  "    rimShape.holes.push(rimHole);\n" +
  "    const rimExtrude = new THREE.ExtrudeGeometry(rimShape, {\n" +
  "        depth: fh,\n" +
  "        bevelEnabled: (params.edgeBevel ?? 0) > 0,\n" +
  "        bevelThickness: params.edgeBevel ?? 1,\n" +
  "        bevelSize: params.edgeBevel ?? 1,\n" +
  "        bevelSegments: 2,\n" +
  "        curveSegments: 64\n" +
  "    });\n" +
  "    rimExtrude.translate(0, 0, -fh/2);\n" +
  "    geometries.push(rimExtrude);\n" +
  "    \n" +
  "    if (type !== 'none') {\n" +
  "        const shape = new THREE.Shape();\n" +
  "        if (type === 'circle') {\n" +
  "            shape.absarc(0, 0, size, 0, Math.PI*2, false);\n" +
  "        } else if (type === 'polygon') {\n" +
  "            for(let i=0; i<pts; i++){\n" +
  "                const a = (i/pts)*Math.PI*2 - Math.PI/2;\n" +
  "                if(i===0) shape.moveTo(Math.cos(a)*size, Math.sin(a)*size);\n" +
  "                else shape.lineTo(Math.cos(a)*size, Math.sin(a)*size);\n" +
  "            }\n" +
  "        } else if (type === 'star') {\n" +
  "            for(let i=0; i<pts*2; i++){\n" +
  "                const a = (i/(pts*2))*Math.PI*2 - Math.PI/2;\n" +
  "                const r = i%2===0 ? size : size*0.4;\n" +
  "                if(i===0) shape.moveTo(Math.cos(a)*r, Math.sin(a)*r);\n" +
  "                else shape.lineTo(Math.cos(a)*r, Math.sin(a)*r);\n" +
  "            }\n" +
  "        }\n" +
  "        const shapeGeo = new THREE.ExtrudeGeometry(shape, {\n" +
  "            depth: depth,\n" +
  "            bevelEnabled: (params.edgeBevel ?? 0) > 0,\n" +
  "            bevelThickness: (params.edgeBevel ?? 1) * 0.5,\n" +
  "            bevelSize: (params.edgeBevel ?? 1) * 0.5,\n" +
  "            bevelSegments: 2\n" +
  "        });\n" +
  "        shapeGeo.translate(0, 0, -depth/2);\n" +
  "        geometries.push(shapeGeo);\n" +
  "    }\n" +
  "    \n" +
  "    geometry = BufferGeometryUtils.mergeGeometries(geometries, false);\n" +
  "  }\n" +
  "  break;\n";

if (!content.includes("case 'coin':")) {
  content = content.replace(
    /switch\s*\(objData\.geometry\)\s*\{/,
    "switch (objData.geometry) {\n" + coinLog
  );
}

fs.writeFileSync(file, content);
