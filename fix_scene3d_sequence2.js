const fs = require('fs');
let c = fs.readFileSync('src/Scene3D.tsx', 'utf8');

c = c.replace(/const boneAnim = \{ translate: \[\] as any\[\], scale: \[\] as any\[\] \};\s*const slotAnim: any = \{ rgba: \[\] as any\[\] \};\s*if \(seqInfo && seqInfo\.count > 0\) \{\s*slotAnim\.sequence = \[\] as any\[\];\s*\}/, 
`const boneAnim = { translate: [] as any[], scale: [] as any[] };
        const slotAnim: any = { rgba: [] as any[] };
        let sequenceAnim: any = null;
        if (seqInfo && seqInfo.count > 0) {
            sequenceAnim = [] as any[];
            if (!spineData.animations.animation.attachments["default"][slotName]) {
                spineData.animations.animation.attachments["default"][slotName] = {};
            }
            spineData.animations.animation.attachments["default"][slotName]["particle"] = { sequence: sequenceAnim };
        }`);

fs.writeFileSync('src/Scene3D.tsx', c);
