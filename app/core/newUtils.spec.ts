import {injectFakeDom} from '../testHelpers/injectFakeDom';
import test from 'ava';
import {expect} from 'chai';
import {setToStringArray, stringArrayToSet, stripTrailingSlash} from './newUtils';

injectFakeDom();

test('stripTrailingSlash::::should return falsey for blank inputs', (t) => {
	let falsey = !stripTrailingSlash('');
	expect(falsey).to.equal(true);
	falsey = !stripTrailingSlash(null);
	expect(falsey).to.equal(true);
	t.pass();
});
test('stripTrailingSlash::::should return blank for /', (t) => {
	const result = stripTrailingSlash('/');
	expect(result).to.equal('');
	t.pass();
});
test('stripTrailingSlash::::should strip slashes for other values', (t) => {
	let result = stripTrailingSlash('people/tai/');
	expect(result).to.equal('people/tai');
	result = stripTrailingSlash('books/goodbooks/thethirdwave/');
	expect(result).to.equal('books/goodbooks/thethirdwave');
	t.pass();
});
test('stripTrailingSlash::::should keep the same when no trailing slash', (t) => {
	let result = stripTrailingSlash('people/tai');
	expect(result).to.equal('people/tai');
	result = stripTrailingSlash('books/goodbooks/thethirdwave');
	expect(result).to.equal('books/goodbooks/thethirdwave');
	t.pass();
});

test('stringArrayToSet::::should return {} for []', (t) => {
	const set = stringArrayToSet([]);
	expect(set).to.deep.equal({});
	t.pass();
});
test('stringArrayToSet::::should return {a: true, b: true} for ["a",b"]', (t) => {
	const set = stringArrayToSet(['a', 'b']);
	expect(set).to.deep.equal({a: true, b: true});
	t.pass();
});
test('set to string array::::should return ["a",b"] for {a: true, b: true} ', (t) => {
	const array: string[] = setToStringArray({a: true, b: true});
	expect(array).to.deep.equal(['a', 'b']);
	t.pass();
});
test('set to string array::::should return [] for {} ', (t) => {
	const array: string[] = setToStringArray({});
	expect(array).to.deep.equal([]);
	t.pass();
});
test('set to string array::::should return ["a"] for {a: true, b: false} ', (t) => {
	const array: string[] = setToStringArray({a: true, b: false});
	expect(array).to.deep.equal(['a']);
	t.pass();
});
