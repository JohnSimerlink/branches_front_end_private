
import {inject, injectable} from 'inversify';
import {IMap, IOneToManyMap} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class OneToManyMap<T> implements IOneToManyMap<T> {
    private map: object
    constructor(@inject(TYPES.OneToManyMapArgs) {
        map
    }) {
        this.map = map
    }
    public get(id: string): T[] {
        return this.map[id]
    }

    public set(id: string, item: T) {
        if (!this.map[id]) {
            this.map[id] = []
        }
        this.map[id].push(item)
    }

}
@injectable()
export class OneToManyMapArgs {
    @inject(TYPES.Object) public map: object
}
