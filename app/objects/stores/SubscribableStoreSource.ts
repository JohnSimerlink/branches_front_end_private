import {inject, injectable, tagged} from 'inversify';
import * as entries from 'object.entries'; // TODO: why cant i get this working natively with TS es2017?
import {
    entry,
    IHash,
    ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource,
    ISubscribableStoreSource, ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableContentUser, IStoreObjectUpdate,
    ITypeAndIdAndValUpdate, IValable,
    CustomStoreDataTypes,
    ISubscribableTreeUserStoreSource,
    ISyncableMutableSubscribableContent,
    ISyncableMutableSubscribableTree,
    ISyncableMutableSubscribableTreeLocation,
    ISyncableMutableSubscribableTreeUser, ITypeAndIdAndValAndObjUpdate,
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {log} from '../../core/log';
import {TAGS} from '../tags';

if (!Object.entries) {
    entries.shim();
}

@injectable()
export class SubscribableStoreSource<T> extends
    SubscribableCore<ITypeAndIdAndValUpdate> implements ISubscribableStoreSource<T> {
    private update: IStoreObjectUpdate;
    private type: CustomStoreDataTypes;
    private hashmap: IHash<T>;
    constructor(@inject(TYPES.SubscribableStoreSourceArgs){
        hashmap, type, updatesCallbacks
    }: SubscribableStoreSourceArgs ) {
        super({updatesCallbacks});
        this.type = type;
        this.hashmap = hashmap;
    }
    protected callbackArguments(): ITypeAndIdAndValAndObjUpdate {
        return this.update;
    }
    public get(id: string): T {
        return this.hashmap[id];
    }

    public set(id: string, obj: T & IValable) {
        this.hashmap[id] = obj;
        this.update = {id, val: obj.val(), obj, type: this.type};
        this.callCallbacks();
    }
    public entries(): Array<entry<T>> {
        return Object.entries(this.hashmap);
    }
}

@injectable()
export class SubscribableStoreSourceArgs {
    @inject(TYPES.Object) public hashmap: IHash<any>;
    @inject(TYPES.Array) public updatesCallbacks: any[];
    @inject(TYPES.String) public type: CustomStoreDataTypes;
}
@injectable()
export class SubscribableTreeStoreSource extends SubscribableStoreSource<ISyncableMutableSubscribableTree>
    implements ISubscribableTreeStoreSource {
    constructor(@inject(TYPES.SubscribableTreeStoreSourceArgs){
        hashmap, updatesCallbacks, type
    }: SubscribableStoreSourceArgs ) {
        super({hashmap, updatesCallbacks, type});
    }
}
@injectable()
export class SubscribableTreeLocationStoreSource
    extends SubscribableStoreSource<ISyncableMutableSubscribableTreeLocation>
    implements ISubscribableTreeLocationStoreSource {
    constructor(@inject(TYPES.SubscribableTreeLocationStoreSourceArgs){
        hashmap, updatesCallbacks, type
    }: SubscribableStoreSourceArgs) {
        super({hashmap, updatesCallbacks, type});
    }
}
@injectable()
export class SubscribableTreeUserStoreSource
    extends SubscribableStoreSource<ISyncableMutableSubscribableTreeUser> implements ISubscribableTreeUserStoreSource {
    constructor(@inject(TYPES.SubscribableTreeUserStoreSourceArgs){
        hashmap, updatesCallbacks, type
    }: SubscribableStoreSourceArgs) {
        super({hashmap, updatesCallbacks, type});
    }
}
@injectable()
export class SubscribableContentStoreSource
    extends SubscribableStoreSource<ISyncableMutableSubscribableContent> implements ISubscribableContentStoreSource {
    constructor(@inject(TYPES.SubscribableContentStoreSourceArgs){
        hashmap, updatesCallbacks, type
    }: SubscribableStoreSourceArgs ) {
        super({hashmap, updatesCallbacks, type});
    }
}
@injectable()
export class SubscribableContentUserStoreSource
    extends SubscribableStoreSource<ISyncableMutableSubscribableContentUser>
    implements ISubscribableContentUserStoreSource {
    constructor(@inject(TYPES.SubscribableContentUserStoreSourceArgs){
        hashmap, updatesCallbacks, type}: SubscribableStoreSourceArgs ) {
        super({hashmap, updatesCallbacks, type});
    }
}
@injectable()
export class SubscribableTreeStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes)
    @tagged(TAGS.TREE_DATA, true)
        private type: CustomStoreDataTypes;
}
@injectable()
export class SubscribableTreeLocationStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes)
    @tagged(TAGS.TREE_LOCATIONS_DATA, true)
        private type: CustomStoreDataTypes;
}
@injectable()
export class SubscribableTreeUserStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes)
    @tagged(TAGS.TREE_USERS_DATA, true)
        private type: CustomStoreDataTypes;
}
@injectable()
export class SubscribableContentStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes)
    @tagged(TAGS.CONTENT_DATA, true)
        private type: CustomStoreDataTypes;
}
@injectable()
export class SubscribableContentUserStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes)
    @tagged(TAGS.CONTENT_USERS_DATA, true)
        private type: CustomStoreDataTypes;
}
