import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';
import 'reflect-metadata';
import {
    myContainer, myContainerLoadAllModules, myContainerLoadAllModulesExceptFirebaseRefs,
    myContainerLoadMockFirebaseReferences
} from '../../../inversify.config';
import {
    IKnawledgeMapCreator,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from './KnawledgeMap';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {log} from '../../core/log';
import {partialInject} from '../../testHelpers/partialInject';
import {Store} from 'vuex';

let Vue = require('vue').default || require('vue'); // for webpack
myContainerLoadMockFirebaseReferences()
myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma: true})
test('knawledeMap DI constructor should work', t => {
    const injects = injectionWorks<KnawledgeMapCreatorArgs, KnawledgeMapCreator >({
        container: myContainer,
        argsType: TYPES.KnawledgeMapCreatorArgs,
        interfaceType: TYPES.IKnawledgeMapCreator,
    });
    expect(injects).to.equal(true);
    t.pass();
});
test('KnawledgeMap::::create knawledgeMap should work', (t) => {
    const store = {
        commit() {}
    } as any as Store<any>
    const knawledgeMapCreator: IKnawledgeMapCreator =
        partialInject<KnawledgeMapCreatorArgs>({
            konstructor: KnawledgeMapCreator,
            constructorArgsType: TYPES.KnawledgeMapCreatorArgs,
            injections: {
                store,
            },
            container: myContainer,
        })
    const knawledgeMap = knawledgeMapCreator.create();

    knawledgeMap.mounted();

    t.pass();
});
test('KnawledgeMap::::trying to create and mount component VueJS style', (t) => {
    const store = {
        commit() {}
    } as any as Store<any>
    const knawledgeMapCreator: IKnawledgeMapCreator =
        partialInject<KnawledgeMapCreatorArgs>({
            konstructor: KnawledgeMapCreator,
            constructorArgsType: TYPES.KnawledgeMapCreatorArgs,
            injections: {
                store,
            },
            container: myContainer,
        })
    const KnawledgeMapComponent = knawledgeMapCreator.create();
    const Constructor = Vue.extend(KnawledgeMapComponent);
    const instance = new Constructor();
    instance.$mount();
    log('instance in knawldegMapSPEC is', instance);

    t.pass();
});
