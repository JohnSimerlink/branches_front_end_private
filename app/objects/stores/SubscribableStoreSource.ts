import {inject, injectable} from 'inversify';
import {IHash, IIdAndValUpdates, ISubscribableStoreSource} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
class SubscribableStoreSource<T> extends SubscribableCore<IIdAndValUpdates> implements ISubscribableStoreSource<T> {
    private update
    private hashmap: IHash<T>
    constructor(@inject(TYPES.SubscribableStoreSourceArgs){hashmap, updatesCallbacks}) {
        super({updatesCallbacks})
        this.hashmap = hashmap
    }
    protected callbackArguments() {
        return this.update
    }
    public get(id: string): T {
        return this.hashmap[id]
    }

    public set(id: string, val: T) {
        this.hashmap[id] = val
        this.update = {id, val}
        this.callCallbacks()
    }
}

@injectable()
class SubscribableStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
}
export {SubscribableStoreSource, SubscribableStoreSourceArgs}
