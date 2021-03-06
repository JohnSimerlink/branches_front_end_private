import {Constructor} from '../objects/interfaces';
// import {myContainer, state} from '../../inversify.config';
// import {TYPES} from '../objects/types';
import {Container} from 'inversify';
// import BranchesStore, {BranchesStoreArgs} from '../core/store2';
// import clonedeep = require('lodash.clonedeep')

export function partialInject<constructorArgsClass>(
	{
		konstructor,
		constructorArgsType,
		injections,
		container,
	}: IPartialInjectArgs) {

	// const args = {...injections}
	const args = container.get<constructorArgsClass>(constructorArgsType);
	for (const [key, value] of Object.entries(injections)) {
		args[key] = value;
	}

	const obj = new konstructor(args);
	return obj;
}

export interface IPartialInjectArgs {
	konstructor: Constructor;
	constructorArgsType: symbol;
	injections: object;
	container: Container;
}

// /*
//
// example
//
//  Normal non-injection
//  */
// {
//     const stateClone = clonedeep(state)
//     const globalDataStore: IMutableSubscribableGlobalStore
//         = myContainer.get<IMutableSubscribableGlobalStore>
//     (TYPES.IMutableSubscribableGlobalStore) // TODO: WRITE the partial DEPENDENCY INJECTION THING RIGHT NOW
//     const store = new BranchesStore({globalDataStore, state: stateClone})
// }
//
// /*
// example - partial injection
//  */
//
// {
//     const stateClone = clonedeep(state)
//     const store = partialInject<BranchesStoreArgs>(
//         {
//             konstructor: BranchesStore,
//             constructorArgsType: TYPES.BranchesStoreArgs,
//             injections: {state: stateClone},
//             container: myContainer
//         })
// }
