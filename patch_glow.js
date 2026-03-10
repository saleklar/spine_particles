const fs = require('fs');
let content = fs.readFileSync('src/FireGenerator.tsx', 'utf-8');

const oldStr =           }

          ctx.putImageData(imageData, 0, 0);
          dataUrls.push(tempCanvas.toDataURL('image/png'));
        };

const newStr =           }

          // Apply glow and blur
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
            
            // Reset state
            ctx.globalCompositeOperation = 'source-over';
            ctx.filter = 'none';
            ctx.globalAlpha = 1.0;
          } else {
            ctx.putImageData(imageData, 0, 0);
          }
          
          dataUrls.push(tempCanvas.toDataURL('image/png'));
        };

if(content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync('src/FireGenerator.tsx', content);
  console.log("Patched!");
} else {
  console.error("Pattern not found!");
}
