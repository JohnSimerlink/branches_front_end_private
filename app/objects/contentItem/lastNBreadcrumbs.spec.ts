import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import {getLastNBreadcrumbsStringFromList} from './uriParser';
let list;
let expectedBreadcrumbs;
let n;
list = ['a', 'b' , 'c'];
expectedBreadcrumbs = 'b > c';
n = 2;
test('Last N BreadCrumbs String From List:::should' +
    ' convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});
list = ['a', 'b', 'c'];
expectedBreadcrumbs = 'a > b > c';
n = 4;
test('Last N BreadCrumbs String From List:::should' +
    ' convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = ['a', 'b', 'c'];
expectedBreadcrumbs = 'c';
n = 1;
test('Last N BreadCrumbs String From List:::should' +
    ' convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = ['a', 'b', 'c'];
expectedBreadcrumbs = '';
n =  0;
test('Last N BreadCrumbs String From List:::should' +
    ' convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = ['Everything', 'Spanish', 'Vocab', 'amar : to love'];
expectedBreadcrumbs = 'Everything > Spanish > Vocab > amar : to love';
n =  4;
test('Last N BreadCrumbs String From List:::should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = ['Everything', 'Spanish', 'Vocab', 'amar : to love'];
expectedBreadcrumbs = 'Spanish > Vocab > amar : to love';
n =  3;
test('Last N BreadCrumbs String From List:::should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = [];
expectedBreadcrumbs = '';
test('Last N BreadCrumbs String From List:::should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});
