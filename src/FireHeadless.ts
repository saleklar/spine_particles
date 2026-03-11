import * as THREE from 'three';
import { vertexShader, fragmentShader, GeneratorParams } from './FireGenerator';

export const defaultTorchParams: GeneratorParams = {
  shapeType: 'ground',
  color1: '#ff0000',
  color2: '#ff6600',
  color3: '#ffff00',
  speed: 1.0,
  scale: 4.0,
  coreBottom: 1.5,
  coreTop: 0.1,
  brightness: 1.5,
  contrast: 1.2,
  saturation: 1.0,
  frames: 30, // 30 frames
  fps: 30,    // 30 fps -> 1 second duration
  resolution: 128,
  noiseType: 'voronoi',
  distortion: 0.8,
  detail: 1.0, alphaThreshold: 0.0, flowX: 0, flowY: 1, flowZ: 0, rotX: 0, rotY: 0, rotZ: 0,
  baseBlur: 0.0, baseOpacity: 1.0, glow1Blur: 4.0, glow1Opacity: 0.6, glow2Blur: 12.0, glow2Opacity: 0.3
};

export const defaultCampfireParams: GeneratorParams = {
  shapeType: 'ground',
  color1: '#ff0000',
  color2: '#ff6600',
  color3: '#ffff00',
  speed: 0.5,
  scale: 2.0,
  coreBottom: 1.5,
  coreTop: 0.8,
  brightness: 1.5,
  contrast: 1.0,
  saturation: 1.0,
  frames: 40, 
  fps: 20, 
  resolution: 128,
  noiseType: 'voronoi',
  distortion: 0.5,
  detail: 1.0, alphaThreshold: 0.0, flowX: 0, flowY: 1, flowZ: 0, rotX: 0, rotY: 0, rotZ: 0,
  baseBlur: 0.0, baseOpacity: 1.0, glow1Blur: 4.0, glow1Opacity: 0.6, glow2Blur: 12.0, glow2Opacity: 0.3
};

export const generateFireSequenceHeadless = async (params: GeneratorParams): Promise<string[]> => {
  return new Promise((resolve) => {
    // Create offscreen renderer
    const canvas = document.createElement('canvas');
    canvas.width = params.resolution;
    canvas.height = params.resolution;

    // Use WebGL1 for best compat outside DOM
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(params.resolution, params.resolution);
    renderer.setPixelRatio(1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Convert hex to THREE.Color
    const parseColor = (hex: string) => {
      const c = new THREE.Color(hex);
      // Ensure color is linear
      return c;
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        loopProgress: { value: 0 },
        speed: { value: params.speed },
        scale: { value: params.scale },
        coreBottom: { value: params.coreBottom ?? 1.5 },
        coreTop: { value: params.coreTop ?? 1.0 },
        shapeType: { value: params.shapeType === 'fireball' ? 1.0 : 0.0 },
        brightness: { value: params.brightness },
        contrast: { value: params.contrast },
        saturation: { value: params.saturation },
        color1: { value: parseColor(params.color1) },
        color2: { value: parseColor(params.color2) },
        color3: { value: parseColor(params.color3) },
        noiseType: { value: params.noiseType === 'voronoi' ? 1.0 : 0.0 },
        distortion: { value: params.distortion },
        detail: { value: params.detail }
      },
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const dataUrls: string[] = [];

    // Render loop
    for (let i = 0; i < params.frames; i++) {
        const progress = i / params.frames;
        mesh.material.uniforms.loopProgress.value = progress;
        renderer.render(scene, camera);
        dataUrls.push(canvas.toDataURL('image/png'));
    }

    // Cleanup
    geometry.dispose();
    material.dispose();
    renderer.dispose();

    resolve(dataUrls);
  });
};