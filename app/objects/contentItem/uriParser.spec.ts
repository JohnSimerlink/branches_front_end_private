import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import {convertBreadcrumbListToString} from './uriParser';
let list;
let expectedBreadcrumbs;
list = ['a', 'b', 'c'];
expectedBreadcrumbs = 'a > b > c';
test('Convert Breadcrumbs List to String::::should convert '
    + list.toString() + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = convertBreadcrumbListToString(list);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = ['Everything', 'Spanish', 'Vocab', 'amar : to love'];
expectedBreadcrumbs = 'Everything > Spanish > Vocab > amar : to love';
test('Convert Breadcrumbs List to String::::should convert '
    + list.toString() + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = convertBreadcrumbListToString(list);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});

list = [];
expectedBreadcrumbs = '';
test('Convert Breadcrumbs List to String::::should convert '
    + list.toString() + ' to ' + expectedBreadcrumbs, (t) => {
    const breadcrumbs = convertBreadcrumbListToString(list);
    expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    t.pass()
});
