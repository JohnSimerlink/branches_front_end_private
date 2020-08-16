import test from 'ava'
import 'reflect-metadata'
import {InteractionStateActionProcessor} from './interactionStateProcessor';
import {IMapAction, Keypresses, MouseNodeEvents, NullError} from './interactionStateProcessor.interfaces';
import {IMapInteractionState, ISigmaNode, ISigmaNodes, ISigmaNodesUpdater} from '../interfaces';
import {Store} from 'vuex';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {expect} from 'chai'


test.skip('nulls', t => {

	const interactionStateActionProcessor = new InteractionStateActionProcessor({
		sigmaNodesUpdater: null as ISigmaNodesUpdater,
		store: null as Store<any>,
		sigmaNodes: null,
	});
	try {
		interactionStateActionProcessor.processAction(null)
	} catch (e) {
		t.true(e instanceof NullError)
	}
	t.pass();
});
test('Hovering on a card when no cards are edited or hovered', t => {

	const mapInteractionState: IMapInteractionState = {
		hoverCardIsSomething: false,
		editCardIsSomething: false,
		editAndHoverCardsExistAndAreSame: false,
		hoverCardExistsAndIsFlipped: false,
		editCardExistsAndIsFlipped: false,

		hoveringCardId: null,
		editingCardId: null
	}

	const nodeId = '12345'
	const action: IMapAction = {type: MouseNodeEvents.HOVER_SIGMA_NODE, nodeId}
	const sigmaNodes: ISigmaNodes = {
		[nodeId]: {
			flipped: false,
			hovering: false,
			editing: true
		} as ISigmaNode
	};
	const interactionStateActionProcessor = new InteractionStateActionProcessor({
		sigmaNodesUpdater: null as ISigmaNodesUpdater,
		store: null as Store<any>,
		sigmaNodes,
	});
	const expectedGlobalMutations = [
	]
	const expectedCardMutations = {
		[nodeId]: {
			flipped: false,
			hovering: true,
			editing: false
		}
	}
	const expectedMapInteractionState = {
		...mapInteractionState,
		hoveringCardId: nodeId
	}
	const updates = interactionStateActionProcessor._determineUpdates(action, mapInteractionState, sigmaNodes)
	expect(updates.globalMutations).to.deep.equal(expectedGlobalMutations, 'Global Mutations dont match')
	expect(updates.cardUpdates).to.deep.equal(expectedCardMutations, 'Card Mutations dont match')
	expect(updates.mapInteractionState).to.deep.equal(expectedMapInteractionState, 'Map Interaction State doesn\'t match')
	t.pass();

});
test.skip('SHIFT ENTER on NO other card open, FRONT HOVER EDIT', t => {

	// const mapInteractionState: IMapInteractionState = {
	// 	hoverCardIsSomething: true,
	// 	editCardIsSomething: true,
	// 	twoCardsExistAndAreSame: true,
	// 	hoverCardExistsAndIsFlipped: false,
	// 	editCardExistsAndIsFlipped: false,
	// }
	//
	// const action: IMapAction = {type: Keypresses.SHIFT_ENTER}
	// const nodeId = '12345'
	// const sigmaNodes: ISigmaNodes = {
	// 	[nodeId]: {
	// 		flipped: false,
	// 		hovering: true,
	// 		editing: true
	// 	} as ISigmaNode
	// };
	// const InteractionStateActionProcessor = new InteractionStateActionProcessor({
	// 	sigmaNodesUpdater: null as ISigmaNodesUpdater,
	// 	store: null as Store<any>,
	// 	sigmaNodes
	// });
	// const expectedGlobalMutations = [
	// 	{
	// 		name: MUTATION_NAMES.SAVE_LOCAL_CARD_EDIT
	// 	}
	// ]
	// const expectedCardMutations = {
	// 	[nodeId]: {
	// 		flipped: false,
	// 		hovering: true,
	// 		editing: false
	// 	}
	// }
	// const updates = InteractionStateActionProcessor.determineUpdates(action, mapInteractionState, sigmaNodes)
	// expect(updates.globalMutations).to.deep.equal(expectedGlobalMutations)
	// expect(updates.cardUpdates).to.deep.equal(expectedCardMutations)
	// t.pass();

});
// test ('matches example 1', t => {
// 	// matches(5, 6) (
// 	//
// 	// )
//
// 	const person = { name: 'Maria' }
// 	// const result = matches(person)(
// 	// 	(x = { name: 'John' }) => 'John you are not welcome!',
// 	// 	(x)                    => `Hey ${x.name}, you are welcome!`
// 	// );
// 	// console.log("result is", result)
// 	// t.is(!!result, true)
//
// 	matches(person)(
// 		(x = { name: 'John' }) => console.log('John you are not welcome!'),
// 		(x)                    => console.log(`Hey ${x.name}, you are welcome!`)
// 	)
//
// 	const result = matches(1)(
// 		(x = 2)      => 'number 2 is the best!!!',
// 		(x = Number) => `number ${x} is not that good`,
// 		(x = Date)   => 'blaa.. dates are awful!'
// 	)
//
// 	console.log(result) // output: number 1 is not that good
//
//
//
// 	// t.pass()
//
// })
