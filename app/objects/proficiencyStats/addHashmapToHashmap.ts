import {IHash} from '../interfaces';

export function addHashmapToHashmap(baseHashmap: IHash<number>, deltaHashmap: IHash<number>) {
    const newHashmap: IHash<number> = {...baseHashmap};
    // Object.keys(deltaHashmap).forEach((key) => {
    //     newStats[key] = (newStats[key] || 0) + (deltaObj[key] || 0);
    // });
    for (const [key, value] of Object.entries(deltaHashmap)){
        const oldValue: number = newHashmap[key] || 0;
        const deltaValue: number = value || 0;

        newHashmap[key] = oldValue + deltaValue;
    }
    return newHashmap;
}
