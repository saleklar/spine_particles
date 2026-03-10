const fs = require('fs');
let code = fs.readFileSync('src/FireGenerator.tsx', 'utf8');


const fbmReplacer = `float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for(int i=0; i<4; i++) {
        float n = snoise3(p);
        if (noiseType > 0.5) {
            n = 1.0 - abs(n);
            n = n * n; // sharper ridges for liquid/crisp look
        }
        f += w * n * mix(1.0, float(i+1)*0.5, detail);
        
        p *= 2.0;
        w *= 0.5;
    }
    return f;
}

float getDensity(vec3 p, float t) {
    vec3 np = p * scale * 0.5;
    np.y -= t * 1.5;

    np.x += snoise3(np * 2.0 + vec3(0.0, -t, 0.0)) * distortion;
    np.z += snoise3(np * 2.0 + vec3(0.0, -t, t)) * distortion;

    float n = fbm(np);`;

code = code.replace(/float fbm\(vec3 p\) \{[\s\S]*?float n = fbm\(np\);/, fbmReplacer);


const autoExportPatch = `
  // We use a ref to prevent racing or overlapping renders
  const isAutoRenderingRef = useRef(false);

  const generateSequenceDataUrls = async (currentParams: GeneratorParams): Promise<string[]> => {
    return new Promise((resolve) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) {
        resolve([]);
        return;
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

        ctx.putImageData(imageData, 0, 0);
        dataUrls.push(tempCanvas.toDataURL('image/png'));
      }
      
      renderTarget.dispose();
      
      resolve(dataUrls);
    });
  };

  // Auto-Update logic debounce
  useEffect(() => {
    if (!embeddedUI || !onExportToParticleSystem) return;

    const timerId = setTimeout(async () => {
      if (isAutoRenderingRef.current) return;
      isAutoRenderingRef.current = true;
      try {
        const dataUrls = await generateSequenceDataUrls(params);
        if (dataUrls.length > 0) {
            onExportToParticleSystem(dataUrls, params.fps);
        }
      } catch(err) {
        console.error(err);
      } finally {
         isAutoRenderingRef.current = false;
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timerId);
  }, [params, embeddedUI, onExportToParticleSystem]);

  const handleExport = async () => {`;

if (!code.includes('isAutoRenderingRef')) {
    code = code.replace("const handleExport = async () => {", autoExportPatch);
}

fs.writeFileSync('src/FireGenerator.tsx', code);
console.log('Shader updated and auto-export added');
