import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {
    entry,
    IHash, ISubscribableStoreSource, ITypeAndIdAndValUpdates,
    ObjectDataTypes
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
if (!Object.entries) {
    entries.shim()
}

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
    public entries(): Array<entry<T>> {
        return Object.entries(this.hashmap)
    }
}

@injectable()
class SubscribableStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.String) private type: ObjectDataTypes
}
export {SubscribableStoreSource, SubscribableStoreSourceArgs}
