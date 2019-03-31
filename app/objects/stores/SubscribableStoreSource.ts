import {
	inject,
	injectable,
	tagged
} from 'inversify';
import * as entries
	from 'object.entries'; // TODO: why cant i get this working natively with TS es2017?
// TODO: why cant i get this working natively with TS es2017?
import {
	CustomStoreDataTypes,
	entry,
	IHash,
	IStoreObjectUpdate,
	ISubscribableContentStoreSource,
	ISubscribableContentUserStoreSource,
	ISubscribableStoreSource,
	ISubscribableTreeLocationStoreSource,
	ISubscribableTreeStoreSource,
	ISubscribableTreeUserStoreSource,
	ISyncableMutableSubscribableContent,
	ISyncableMutableSubscribableContentUser,
	ISyncableMutableSubscribableTree,
	ISyncableMutableSubscribableTreeLocation,
	ISyncableMutableSubscribableTreeUser,
	ITypeAndIdAndValAndObjUpdate,
	ITypeAndIdAndValUpdate,
	IValable,
} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {TAGS} from '../tags';
import {log} from '../../core/log';

if (!Object.entries) {
	entries.shim();
}

@injectable()
export class SubscribableStoreSource<T> extends SubscribableCore<ITypeAndIdAndValUpdate> implements ISubscribableStoreSource<T> {
	private update: IStoreObjectUpdate;
	private type: CustomStoreDataTypes;
	private hashmap: IHash<T>;

	constructor(@inject(TYPES.SubscribableStoreSourceArgs){
		hashmap, type, updatesCallbacks
	}: SubscribableStoreSourceArgs) {
		super({updatesCallbacks});
		this.type = type;
		this.hashmap = hashmap;
	}

	public get(id: string): T {
		return this.hashmap[id];
	}

	public set(id: string, obj: T & IValable) {
		this.hashmap[id] = obj;
		this.update = {
			id,
			val: obj.val(),
			obj,
			type: this.type
		};
		this.callCallbacks();
	}

	public entries(): Array<entry<T>> {
		return Object.entries(this.hashmap);
	}

	protected callbackArguments(): ITypeAndIdAndValAndObjUpdate {
		return this.update;
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
	}: SubscribableStoreSourceArgs) {
		super({
			hashmap,
			updatesCallbacks,
			type
		});
	}
}

@injectable()
export class SubscribableTreeLocationStoreSource
	extends SubscribableStoreSource<ISyncableMutableSubscribableTreeLocation>
	implements ISubscribableTreeLocationStoreSource {
	constructor(@inject(TYPES.SubscribableTreeLocationStoreSourceArgs){
		hashmap, updatesCallbacks, type
	}: SubscribableStoreSourceArgs) {
		super({
			hashmap,
			updatesCallbacks,
			type
		});
	}
}

@injectable()
export class SubscribableTreeUserStoreSource
	extends SubscribableStoreSource<ISyncableMutableSubscribableTreeUser> implements ISubscribableTreeUserStoreSource {
	constructor(@inject(TYPES.SubscribableTreeUserStoreSourceArgs){
		hashmap, updatesCallbacks, type
	}: SubscribableStoreSourceArgs) {
		super({
			hashmap,
			updatesCallbacks,
			type
		});
	}
}

@injectable()
export class SubscribableContentStoreSource
	extends SubscribableStoreSource<ISyncableMutableSubscribableContent> implements ISubscribableContentStoreSource {
	constructor(@inject(TYPES.SubscribableContentStoreSourceArgs){
		hashmap, updatesCallbacks, type
	}: SubscribableStoreSourceArgs) {
		super({
			hashmap,
			updatesCallbacks,
			type
		});
	}
}

@injectable()
export class SubscribableContentUserStoreSource
	extends SubscribableStoreSource<ISyncableMutableSubscribableContentUser>
	implements ISubscribableContentUserStoreSource {
	constructor(@inject(TYPES.SubscribableContentUserStoreSourceArgs){
		hashmap, updatesCallbacks, type
	}: SubscribableStoreSourceArgs) {
		super({
			hashmap,
			updatesCallbacks,
			type
		});
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
