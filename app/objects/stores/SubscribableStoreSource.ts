import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {
    entry,
    IHash, IMutableSubscribableContent, IMutableSubscribableContentUser, IMutableSubscribableTree,
    IMutableSubscribableTreeLocation, ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource,
    ISubscribableStoreSource, ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableContentUser, ITypeAndIdAndValAndObjUpdates,
    ITypeAndIdAndValUpdates, IValable,
    ObjectDataTypes,
} from '../interfaces';
import {IMutableSubscribableTreeUser} from '../interfaces';
import {ISubscribableTreeUserStoreSource} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {log} from '../../core/log'
if (!Object.entries) {
    entries.shim()
}

@injectable()
export class SubscribableStoreSource<T> extends
    SubscribableCore<ITypeAndIdAndValUpdates> implements ISubscribableStoreSource<T> {
    private update: ITypeAndIdAndValAndObjUpdates
    private type: ObjectDataTypes
    private hashmap: IHash<T>
    constructor(@inject(TYPES.SubscribableStoreSourceArgs){hashmap, type, updatesCallbacks}) {
        super({updatesCallbacks})
        this.type = type
        this.hashmap = hashmap
    }
    protected callbackArguments(): ITypeAndIdAndValAndObjUpdates {
        return this.update
    }
    public get(id: string): T {
        return this.hashmap[id]
    }

    public set(id: string, obj: T & IValable) {
        this.hashmap[id] = obj
        this.update = {id, val: obj.val(), obj, type: this.type}
        // log('storeSource set just called', this.update)
        this.callCallbacks()
    }
    public entries(): Array<entry<T>> {
        return Object.entries(this.hashmap)
    }
}

@injectable()
export class SubscribableStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.String) private type: ObjectDataTypes
}
@injectable()
export class SubscribableTreeStoreSource extends SubscribableStoreSource<IMutableSubscribableTree>
    implements ISubscribableTreeStoreSource {
    constructor(@inject(TYPES.SubscribableTreeStoreSourceArgs){hashmap, updatesCallbacks, type}) {
        super({hashmap, updatesCallbacks, type})
    }
}
@injectable()
export class SubscribableTreeLocationStoreSource
    extends SubscribableStoreSource<IMutableSubscribableTreeLocation> implements ISubscribableTreeLocationStoreSource {
    constructor(@inject(TYPES.SubscribableTreeLocationStoreSourceArgs){hashmap, updatesCallbacks, type}) {
        super({hashmap, updatesCallbacks, type})
    }
}
@injectable()
export class SubscribableTreeUserStoreSource
    extends SubscribableStoreSource<IMutableSubscribableTreeUser> implements ISubscribableTreeUserStoreSource {
    constructor(@inject(TYPES.SubscribableTreeUserStoreSourceArgs){hashmap, updatesCallbacks, type}) {
        super({hashmap, updatesCallbacks, type})
    }
}
@injectable()
export class SubscribableContentStoreSource
    extends SubscribableStoreSource<IMutableSubscribableContent> implements ISubscribableContentStoreSource {
    constructor(@inject(TYPES.SubscribableContentStoreSourceArgs){hashmap, updatesCallbacks, type}) {
        super({hashmap, updatesCallbacks, type})
    }
}
@injectable()
export class SubscribableContentUserStoreSource
    extends SubscribableStoreSource<ISyncableMutableSubscribableContentUser>
    implements ISubscribableContentUserStoreSource {
    constructor(@inject(TYPES.SubscribableContentUserStoreSourceArgs){hashmap, updatesCallbacks, type}) {
        super({hashmap, updatesCallbacks, type})
    }
}
@injectable()
export class SubscribableTreeStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.ObjectDataTypes) private type: ObjectDataTypes
}
@injectable()
export class SubscribableTreeLocationStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.ObjectDataTypes) private type: ObjectDataTypes
}
@injectable()
export class SubscribableTreeUserStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.ObjectDataTypes) private type: ObjectDataTypes
}
@injectable()
export class SubscribableContentStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.ObjectDataTypes) private type: ObjectDataTypes
}
@injectable()
export class SubscribableContentUserStoreSourceArgs {
    @inject(TYPES.Object) public hashmap
    @inject(TYPES.Array) public updatesCalbacks: any[]
    @inject(TYPES.ObjectDataTypes) private type: ObjectDataTypes
}
