import test from 'ava'
import {ActionHandler, determineUpdates} from './actionProcessor';
import {IMapAction, Keypresses, NullError} from './actionProcessor.interfaces';
import {IMapInteractionState} from '../interfaces';

test('default test', t => {
	t.pass();
});

test('nulls', t => {
	try {
		determineUpdates(null, null)
	} catch (e) {
		t.true(e instanceof NullError)
	}
	// t.pass();
});
test('SHIFT ENTER on NO other card open, FRONT HOVER EDIT', t => {

	const mapInteractionState: IMapInteractionState = {
		hoverCardIsSomething: true,
		editCardIsSomething: true,
		twoCardsAreSame: true,
		hoverCardFlipped: false,
		editCardFlipped: false,
	}

	const action: IMapAction = {type: Keypresses.SHIFT_ENTER}
	const actionHandler = new ActionHandler();

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
