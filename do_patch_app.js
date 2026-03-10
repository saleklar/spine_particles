const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const tOld = "export type EmitterShapeProperties = {\n  emitterType: EmitterShapeType;\n  emissionMode: 'surface' | 'volume' | 'edge';\n  layerImageDataUrl?: string;\n};";
const tNew = "export type EmitterShapeProperties = {\n  emitterType: EmitterShapeType;\n  emissionMode: 'surface' | 'volume' | 'edge';\n  layerImageDataUrl?: string;\n  useFractalNoiseMap?: boolean;\n  fractalNoiseScale?: number;\n  fractalNoiseDetail?: number;\n  fractalNoiseSpeed?: number;\n  fractalNoiseThreshold?: number;\n};";

appCode = appCode.replace(tOld, tNew);

const objPropsOld = "emissionMode: String((selectedObject.properties as EmitterShapeProperties | undefined)?.emissionMode ?? 'volume') as EmitterShapeProperties['emissionMode'],\n      layerImageDataUrl: String((selectedObject.properties as EmitterShapeProperties | undefined)?.layerImageDataUrl ?? ''),";
const objPropsNew = objPropsOld + "\n      useFractalNoiseMap: Boolean((selectedObject.properties as EmitterShapeProperties | undefined)?.useFractalNoiseMap ?? false),\n      fractalNoiseScale: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseScale ?? 1),\n      fractalNoiseDetail: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseDetail ?? 3),\n      fractalNoiseSpeed: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseSpeed ?? 1),\n      fractalNoiseThreshold: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseThreshold ?? 0.5),";

if (appCode.includes(objPropsOld)) {
   appCode = appCode.replace(objPropsOld, objPropsNew);
   fs.writeFileSync('src/App.tsx', appCode);
   console.log('SUCCESS');
} else {
   console.log('FAIL to find prop mapping');
}
