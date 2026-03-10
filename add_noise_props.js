const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const tOld = \xport type EmitterShapeProperties = {
  emitterType: EmitterShapeType;
  emissionMode: 'surface' | 'volume' | 'edge';
  layerImageDataUrl?: string;
};\;

const tNew = \xport type EmitterShapeProperties = {
  emitterType: EmitterShapeType;
  emissionMode: 'surface' | 'volume' | 'edge';
  layerImageDataUrl?: string;
  useFractalNoiseMap?: boolean;
  fractalNoiseScale?: number;
  fractalNoiseDetail?: number;
  fractalNoiseSpeed?: number;
  fractalNoiseThreshold?: number;
};\;

appCode = appCode.replace(tOld, tNew);

const objPropsOld = \missionMode: String((selectedObject.properties as EmitterShapeProperties | undefined)?.emissionMode ?? 'volume') as EmitterShapeProperties['emissionMode'],
      layerImageDataUrl: String((selectedObject.properties as EmitterShapeProperties | undefined)?.layerImageDataUrl ?? ''),\;

const objPropsNew = objPropsOld + \
      useFractalNoiseMap: Boolean((selectedObject.properties as EmitterShapeProperties | undefined)?.useFractalNoiseMap ?? false),
      fractalNoiseScale: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseScale ?? 1),
      fractalNoiseDetail: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseDetail ?? 3),
      fractalNoiseSpeed: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseSpeed ?? 1),
      fractalNoiseThreshold: Number((selectedObject.properties as EmitterShapeProperties | undefined)?.fractalNoiseThreshold ?? 0.5),\;

appCode = appCode.replace(objPropsOld, objPropsNew);

fs.writeFileSync('src/App.tsx', appCode);
console.log('App.tsx properties patched');
