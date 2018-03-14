import {inject, injectable} from 'inversify';
import * as entries from 'object.entries'; // TODO: why cant i get this working natively with TS es2017?
import {
    entry,
    IHash,
    ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource,
    ISubscribableStoreSource, ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableContentUser, ITypeAndIdAndValAndObjUpdates,
    ITypeAndIdAndValUpdates, IValable,
    GlobalStoreObjectDataTypes,
    ISyncableMutableSubscribableTree,
    ISyncableMutableSubscribableTreeLocation,
    ISyncableMutableSubscribableContent,
} from '../interfaces';
import {ISyncableMutableSubscribableTreeUser} from '../interfaces';
import {ISubscribableTreeUserStoreSource} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {log} from '../../core/log';
if (!Object.entries) {
    entries.shim();
}

@injectable()
export class SubscribableStoreSource<T> extends
    SubscribableCore<ITypeAndIdAndValUpdates> implements ISubscribableStoreSource<T> {
    private update: ITypeAndIdAndValAndObjUpdates;
    private type: GlobalStoreObjectDataTypes;
    private hashmap: IHash<T>;
    private _id;
    constructor(@inject(TYPES.SubscribableStoreSourceArgs){
        hashmap, type, updatesCallbacks
    }: SubscribableStoreSourceArgs ) {
        super({updatesCallbacks});
        this._id = Math.random();
        // log('SubscribableStoreSource created! with type of', type, ' and id of ', this._id)
        this.type = type;
        this.hashmap = hashmap;
    }
    protected callbackArguments(): ITypeAndIdAndValAndObjUpdates {
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
    @inject(TYPES.String) public type: GlobalStoreObjectDataTypes;
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
    @inject(TYPES.ObjectDataTypes) private type: GlobalStoreObjectDataTypes;
}
@injectable()
export class SubscribableTreeLocationStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes) private type: GlobalStoreObjectDataTypes;
}
@injectable()
export class SubscribableTreeUserStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes) private type: GlobalStoreObjectDataTypes;
}
@injectable()
export class SubscribableContentStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes) private type: GlobalStoreObjectDataTypes;
}
@injectable()
export class SubscribableContentUserStoreSourceArgs {
    @inject(TYPES.Object) public hashmap;
    @inject(TYPES.Array) public updatesCalbacks: any[];
    @inject(TYPES.ObjectDataTypes) private type: GlobalStoreObjectDataTypes;
}
