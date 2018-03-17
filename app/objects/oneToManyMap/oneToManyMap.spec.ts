import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava'
import {injectionWorks} from '../../testHelpers/testHelpers';
import {IOneToManyMap} from '../interfaces';
import {OneToManyMap, OneToManyMapArgs} from './oneToManyMap';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {TYPES} from '../types';
import {expect} from 'chai'
import {partialInject} from '../../testHelpers/partialInject';

injectFakeDom();
myContainerLoadAllModules({fakeSigma: true});
test('DI works', (t) => {
    const injects = injectionWorks<OneToManyMapArgs, IOneToManyMap<string>>({
        container: myContainer,
        argsType: TYPES.OneToManyMapArgs,
        interfaceType: TYPES.IOneToManyMap,
    });
    expect(injects).to.equal(true);
    t.pass();
});
test('get returns the item, as an array', (t) => {
    const expectedArray = ['alyssa'];
    const mapSource = {
        jeff: expectedArray
    };
    const map =
        partialInject<OneToManyMapArgs>({
            konstructor: OneToManyMap,
            constructorArgsType: TYPES.OneToManyMapArgs,
            injections: {
                sourceMap: mapSource,
            },
            container: myContainer
        });
        // new OneToManyMap({sourceMap: mapSource})
    const array = map.get('jeff');
    expect(array).to.deep.equal(expectedArray);
    t.pass();
});
test('get returns an empty array if item not found', (t) => {
    const expectedArray = [];
    const mapSource = {
    };
    const map =
    partialInject<OneToManyMapArgs>({
        konstructor: OneToManyMap,
        constructorArgsType: TYPES.OneToManyMapArgs,
        injections: {
            sourceMap: mapSource,
        },
        container: myContainer
    });


    const array = map.get('jeff');
    expect(array).to.deep.equal(expectedArray);
    t.pass();
});
test('get returns multiple items, as an array', (t) => {
    const expectedArray = ['kelsie', 'alyssa'];
    const mapSource = {
        jeff: expectedArray
    };

    const map =
        partialInject<OneToManyMapArgs>({
            konstructor: OneToManyMap,
            constructorArgsType: TYPES.OneToManyMapArgs,
            injections: {
                sourceMap: mapSource,
            },
            container: myContainer
        });

    const array = map.get('jeff');
    expect(array).to.deep.equal(expectedArray);
    t.pass();
});
test('set works', (t) => {
    const expected = ['kelsie'];
    const mapSource = {
    };
    const map =
        partialInject<OneToManyMapArgs>({
            konstructor: OneToManyMap,
            constructorArgsType: TYPES.OneToManyMapArgs,
            injections: {
                sourceMap: mapSource,
            },
            container: myContainer
        });
    map.set('mike', 'kelsie');
    const array = map.get('mike');
    expect(array).to.deep.equal(expected);
    t.pass();

});
