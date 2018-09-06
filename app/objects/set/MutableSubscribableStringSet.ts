/* tslint:disable max-classes-per-file */
/* tslint:disable variable-name */
// import {log} from '../../core/log'
import {inject, injectable} from 'inversify';
import {IDatedMutation, IDetailedUpdates, IHash, IMutable, ISet, SetMutationTypes} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';
import {log} from '../../core/log';
import clonedeep = require('lodash.clonedeep');

/*
Decided to not implement IUndoable on this class, because undo/redo add/remove aren't
 as commutative as they seem . . . at least for the complicated specs I was setting for myself . . .
 See the commit history for the commit before this file was created to see what I mean.
 */

@injectable()
export class MutableSubscribableStringSet extends Subscribable<IDetailedUpdates>
	implements IMutable<IDatedMutation<SetMutationTypes>>, ISet<string> {

	/* TODO: maybe this and the above should be inherited protected properties from a base class */
	private _mutations: Array<IDatedMutation<SetMutationTypes>>;
	private set: IHash<boolean>;

	constructor(@inject(TYPES.MutableSubscribableStringSetArgs)
		            {
			            set = {},
			            mutations = [],
			            updatesCallbacks = []
		            }: MutableSubscribableStringSetArgs = {
		set: {},
		mutations: [],
		updatesCallbacks: []
	}) {
		super({updatesCallbacks});
		this.set = set;
		this._mutations = mutations;
	}

	public val(): string[] {
		return Object.keys(this.set);
	}

	public dbVal(): IHash<boolean> {
		return this.set;
	}

	// TODO: factor out these private methods into a separate testable class
	private add(member: string) {
		if (this.set[member]) {
			throw new RangeError(
				member + ' is already a member. The members are' + JSON.stringify(this.val())
			);
		}
		this.set[member] = true;
		const valPartOfUpdates = clonedeep(this.set);
		this.updates.val = valPartOfUpdates;
		// this.updates.val[member] = true
		// TODO: Fix Violation of Law of Demeter ^^
	}

	private remove(member: string) {
		if (!this.set[member]) {
			throw new RangeError(member + ' is not a member. The members are' + JSON.stringify(this.val()));
		}
		delete this.set[member];
		this.updates.val = this.set;
		// this.updates.val[member] = false;
		// TODO: Fix Violation of Law of Demeter ^^
	}

	public hasMember(member: string): boolean {
		return this.set[member];
	}

	public addMutation(mutation: IDatedMutation<SetMutationTypes>) {
		switch (mutation.type) {
			case SetMutationTypes.ADD:
				this.add(mutation.data);
				break;
			case SetMutationTypes.REMOVE:
				this.remove(mutation.data);
				break;
			default:
				throw new TypeError('Mutation Type needs to be one of the following types'
					+ JSON.stringify(SetMutationTypes) +
					`. ${mutation.type} is invalid`);
		}
		this._mutations.push(mutation);
		this.pushes = {mutations: mutation};
		this.callCallbacks();
	}

	public mutations(): Array<IDatedMutation<SetMutationTypes>> {
		return this._mutations;
	}

}

@injectable()
export class MutableSubscribableStringSetArgs {
	@inject(TYPES.Object) public set?: IHash<boolean>;
	@inject(TYPES.Array) public mutations?;
	@inject(TYPES.Array) public updatesCallbacks?;
}
