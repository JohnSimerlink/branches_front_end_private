import test from 'ava'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ITree2ComponentCreator, ITreeComponentCreator2} from '../../objects/interfaces';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {expect} from 'chai'
import {Tree2ComponentCreatorArgs} from './treeComponent';
import {TreeComponentCreator2} from '../tree/tree';
test('Tree component DI constructor should work', t => {
    const injects = injectionWorks<Tree2ComponentCreatorArgs, ITree2ComponentCreator>({
        container: myContainer,
        argsType: TYPES.Tree2ComponentCreatorArgs,
        interfaceType: TYPES.ITree2ComponentCreator,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('Tree component proficiecnyClicked', t => {
    const TreeComponentCreator: ITree2ComponentCreator
        = myContainer.get<ITree2ComponentCreator>(TYPES.ITree2ComponentCreator)
    t.pass()
})
