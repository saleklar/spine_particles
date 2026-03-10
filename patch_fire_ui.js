const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

code = code.replace(
    /export const FireGenerator: React\.FC<FireGeneratorProps> = \(\{ onExport, onAttachToEmitter \}\) => \{/,
    "export const FireGenerator: React.FC<FireGeneratorProps> = ({ onExport, onAttachToEmitter, embeddedUI, onExportToParticleSystem, autoRenderOnChange }) => {"
);

// If there's an embeddedUI check we do something minimal.
let generateSeqBtnStr = '<button onClick={handleExportSequence} style={buttonStyle}>Export Sequence (ZIP)</button>';
let autoExportCbStr = `
        {embeddedUI && onExportToParticleSystem && (
          <button onClick={async () => {
            const dataUrls = await generateSequenceDataUrls(params);
            onExportToParticleSystem(dataUrls, params.fps);
          }} style={{...buttonStyle, background: '#4CAF50'}}>Update Particle Emitter</button>
        )}
`;
code = code.replace(generateSeqBtnStr, generateSeqBtnStr + autoExportCbStr);

let renderFuncPatch = `
  const generateSequenceDataUrls = async (currentParams: GeneratorParams): Promise<string[]> => {
    return new Promise((resolve) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) {
        resolve([]);
        return;
      }

      const renderer = rendererRef.current;
      const originalCanvas = renderer.domElement;
      
      const targetSize = currentParams.resolution;
      
      const renderTarget = new THREE.WebGLRenderTarget(targetSize, targetSize, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter
      });
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetSize;
      tempCanvas.height = targetSize;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) { resolve([]); return; }

      const dataUrls: string[] = [];
      
      for (let i = 0; i < currentParams.frames; i++) {
        const progress = i / currentParams.frames;
        materialRef.current.uniforms.loopProgress.value = progress;
        
        renderer.setRenderTarget(renderTarget);
        renderer.render(sceneRef.current, cameraRef.current);
        renderer.setRenderTarget(null);
        
        const pixels = new Uint8Array(targetSize * targetSize * 4);
        renderer.readRenderTargetPixels(renderTarget, 0, 0, targetSize, targetSize, pixels);
        
        const imageData = new ImageData(new Uint8ClampedArray(pixels), targetSize, targetSize);
        ctx.putImageData(imageData, 0, 0);
        
        ctx.save();
        ctx.globalCompositeOperation = 'copy';
        ctx.scale(1, -1);
        ctx.translate(0, -targetSize);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.restore();
        
        dataUrls.push(tempCanvas.toDataURL('image/png'));
      }
      
      renderTarget.dispose();
      
      // restore normal loop state
      materialRef.current.uniforms.loopProgress.value = (Date.now() / (1000 / currentParams.speed)) % 1;
      
      resolve(dataUrls);
    });
  };
`;
if (!code.includes('generateSequenceDataUrls')) {
    code = code.replace('const handleExportSequence = async () => {', renderFuncPatch + '\n  const handleExportSequence = async () => {');
}

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Fire generator patched');
