const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');

const sIdx = code.indexOf('const generateSequenceDataUrls = async');
const eMatch = code.match(/resolve\(dataUrls\);[\s\S]*?\};\s+/);

if (sIdx !== -1 && eMatch) {
  const eIdx = eMatch.index + eMatch[0].length;
  
  // Refactor to use async/await properly
  let newFuncCode = `  const generateSequenceDataUrls = async (currentParams: GeneratorParams): Promise<string[]> => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) {
        return [];
      }

      const renderer = rendererRef.current;
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
      if (!ctx) { return []; }

      const dataUrls: string[] = [];

      for (let i = 0; i < currentParams.frames; i++) {
        const progress = i / currentParams.frames;
        materialRef.current.uniforms.loopProgress.value = progress;

        renderer.setRenderTarget(renderTarget);
        renderer.render(sceneRef.current, cameraRef.current);
        renderer.setRenderTarget(null);

        const pixels = new Uint8Array(targetSize * targetSize * 4);
        renderer.readRenderTargetPixels(renderTarget, 0, 0, targetSize, targetSize, pixels);
        
        const imageData = new ImageData(targetSize, targetSize);
        // Correcting image data flip
        const data = imageData.data;
        for (let y = 0; y < targetSize; y++) {
            for (let x = 0; x < targetSize; x++) {
                const srcIdx = ((targetSize - 1 - y) * targetSize + x) * 4;
                const destIdx = (y * targetSize + x) * 4;
                data[destIdx] = pixels[srcIdx];
                data[destIdx+1] = pixels[srcIdx+1];
                data[destIdx+2] = pixels[srcIdx+2];
                data[destIdx+3] = pixels[srcIdx+3];
            }
        }

        const offCanvas = document.createElement('canvas');
        offCanvas.width = targetSize;
        offCanvas.height = targetSize;
        const offCtx = offCanvas.getContext('2d');

        if (offCtx) {
          offCtx.putImageData(imageData, 0, 0);

          ctx.clearRect(0, 0, targetSize, targetSize);
          ctx.globalCompositeOperation = 'source-over';
          ctx.filter = 'none';
          ctx.drawImage(offCanvas, 0, 0);

          // First glow pass
          ctx.globalCompositeOperation = 'screen';
          ctx.filter = 'blur(4px)';
          ctx.globalAlpha = 0.6;
          ctx.drawImage(offCanvas, 0, 0);

          // Second glow pass
          ctx.filter = 'blur(12px)';
          ctx.globalAlpha = 0.3;
          ctx.drawImage(offCanvas, 0, 0);
        } else {
          ctx.putImageData(imageData, 0, 0);
        }

        dataUrls.push(tempCanvas.toDataURL('image/png'));
        
        // Yield to browser event loop to prevent freezing!
        await new Promise(r => setTimeout(r, 10));
      }

      renderTarget.dispose();
      return dataUrls;
  };

`;

  code = code.substring(0, sIdx) + newFuncCode + code.substring(eIdx);
  fs.writeFileSync('src/FireGenerator.tsx', code);
  console.log('Successfully patched generateSequenceDataUrls!');
} else {
  console.log('Could not find block', sIdx, !!eMatch);
}
