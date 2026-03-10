const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

c = c.replace(
  /animations: \{ animation: \{ slots: \{\} as any, bones: \{\} as any \} \}/, 
  'animations: { animation: { slots: {} as any, bones: {} as any, attachments: {"default": {}} as any } }'
);

const oldBlock = `        const boneAnim = { translate: [] as any[], scale: [] as any[] };
        const slotAnim: any = { rgba: [] as any[] };
        if (seqInfo && seqInfo.count > 0) {
            slotAnim.sequence = [] as any[];
        }`;

const newBlock = `        const boneAnim = { translate: [] as any[], scale: [] as any[] };
        const slotAnim: any = { rgba: [] as any[] };
        let sequenceAnim: any = null;
        if (seqInfo && seqInfo.count > 0) {
            sequenceAnim = [] as any[];
            if (!spineData.animations.animation.attachments["default"][slotName]) {
                spineData.animations.animation.attachments["default"][slotName] = {};
            }
            spineData.animations.animation.attachments["default"][slotName]["particle"] = { sequence: sequenceAnim };
        }`;

c = c.replace(oldBlock, newBlock);

c = c.replace(
  /slotAnim\.sequence\.push/g, 
  'sequenceAnim!.push'
);

fs.writeFileSync('src/Scene3D.tsx', c);
