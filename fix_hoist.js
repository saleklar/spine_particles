const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

const regex1 = /const resampleSequence = \([\s\S]*?return resampled;\s*?\n\s*};\s*/;
const regex2 = /const getResampledSequenceProps = \([\s\S]*?return \{ urls: resampledUrls, fps \};\s*?\n\s*};\s*/;

c = c.replace(regex1, '');
c = c.replace(regex2, '');

const toInsert = `
const resampleSequence = (urls: string[], budget: number | undefined) => {
  if (!budget || budget <= 0 || urls.length <= budget) return urls;
  const step = urls.length / budget;
  const resampled = [];
  for(let i=0; i<budget; i++) {
      resampled.push(urls[Math.floor(i * step)]);
  }
  return resampled;
};

const getResampledSequenceProps = (props: any, budget?: number, loop?: boolean) => {
    let urls = Array.isArray(props?.particleSpriteSequenceDataUrls) ? props.particleSpriteSequenceDataUrls : [];
    let fps = Number(props?.particleSpriteSequenceFps ?? 12);
    const originalLength = urls.length;
    const resampledUrls = resampleSequence(urls, budget);
    if (!loop && originalLength > resampledUrls.length && resampledUrls.length > 0) {
        fps = fps * (resampledUrls.length / originalLength);
    }
    return { urls: resampledUrls, fps };
};
`;

const insertPos = c.indexOf('export const Scene3D = forwardRef');
c = c.slice(0, insertPos) + toInsert + '\n' + c.slice(insertPos);

fs.writeFileSync('src/Scene3D.tsx', c);
