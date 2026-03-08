const fs = require('fs');

let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

c = c.replace(
  /export interface Scene3DRef \{[\s\S]*?\}/,
  `export interface Scene3DRef {
  exportSpineData: () => any;
  getParticleTextureBlob: () => Promise<Blob | null>;
}`
);

c = c.replace(
  /exportSpineData: \(\) => \{/,
  `getParticleTextureBlob: async () => {
        // Generate a generic particle sprite data url
        return new Promise<Blob | null>((resolve) => {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(null);
            
            ctx.clearRect(0, 0, size, size);
            const center = size / 2;
            const radius = size * 0.4;
            
            const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius * 1.2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.25, 'rgba(255,255,255,0.95)');
            gradient.addColorStop(0.6, 'rgba(255,255,255,0.5)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    },
    exportSpineData: () => {`
);

fs.writeFileSync('src/Scene3D.tsx', c);
console.log('Added texture exporter method');
