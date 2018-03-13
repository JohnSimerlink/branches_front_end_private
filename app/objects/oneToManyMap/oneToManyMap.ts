import {inject, injectable} from 'inversify';
import {IMap, IOneToManyMap} from '../interfaces';
import {TYPES} from '../types';
let md5 = require('md5').default;
if (!md5) {
    md5 = require('md5')
}

@injectable()
export class OneToManyMap<T> implements IOneToManyMap<T> {
    private sourceMap: object;
    private usedHashesMap: object;
    constructor(@inject(TYPES.OneToManyMapArgs) {
        sourceMap,
        usedHashesMap
    }: OneToManyMapArgs) {
        this.sourceMap = sourceMap;
        this.usedHashesMap = usedHashesMap
    }
    public get(id: string): T[] {
        return this.sourceMap[id] || []
    }

    public set(id: string, item: T) {
        if (!this.sourceMap[id]) {
            this.sourceMap[id] = [];
            this.usedHashesMap[id] = {}
        }
        const hash = md5(item);
        if (!this.usedHashesMap[id][hash]) {
            this.sourceMap[id].push(item)
        }
    }

}
@injectable()
export class OneToManyMapArgs {
    @inject(TYPES.Object) public sourceMap: object;
    @inject(TYPES.Object) public usedHashesMap: object
}
