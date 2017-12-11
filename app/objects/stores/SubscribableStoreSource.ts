import {inject, injectable} from 'inversify';
import {
    IHash, IIdAndValUpdates, ISubscribableStoreSource, ITypeAndIdAndValUpdates,
    ObjectDataTypes
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
class SubscribableStoreSource<T> extends
    SubscribableCore<ITypeAndIdAndValUpdates> implements ISubscribableStoreSource<T> {
    private update: ITypeAndIdAndValUpdates
    private type: ObjectDataTypes
    private hashmap: IHash<T>
    constructor(@inject(TYPES.SubscribableStoreSourceArgs){hashmap, type, updatesCallbacks}) {
        super({updatesCallbacks})
        this.type = type
        this.hashmap = hashmap
    }
    protected callbackArguments(): ITypeAndIdAndValUpdates {
        return this.update
    }
    public get(id: string): T {
        return this.hashmap[id]
    }

    public set(id: string, val: T) {
        this.hashmap[id] = val
        this.update = {id, val, type: this.type}
        this.callCallbacks()
    }
}

@injectable()
class SubscribableStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.String) private type: ObjectDataTypes
}
export {SubscribableStoreSource, SubscribableStoreSourceArgs}
