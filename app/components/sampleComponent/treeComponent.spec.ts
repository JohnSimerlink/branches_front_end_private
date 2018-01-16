import test from 'ava'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ITree2ComponentCreator, ITreeComponentCreator2} from '../../objects/interfaces';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {expect} from 'chai'
import {Tree2ComponentCreatorArgs} from './treeComponent';
let Vue = require('vue').default // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
test('Tree component DI constructor should work', t => {
    const injects = injectionWorks<Tree2ComponentCreatorArgs, ITree2ComponentCreator>({
        container: myContainer,
        argsType: TYPES.Tree2ComponentCreatorArgs,
        interfaceType: TYPES.ITree2ComponentCreator,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('Tree component proficiencyClicked', t => {
    const TreeComponentCreator: ITree2ComponentCreator
        = myContainer.get<ITree2ComponentCreator>(TYPES.ITree2ComponentCreator)
    const TreeComponent = TreeComponentCreator.create()
    const Constructor = Vue.extend(TreeComponent)
    const contentId = 'abc123'
    const userId = 'bdd123'
    const propsData = {
        contentId,
        userId,
    }
    const instance = new Constructor({propsData}).$mount()
    instance.methods.proficiencyClicked()
    t.pass()
})
