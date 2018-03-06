import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
// only to be run on 2018-Mar-05 as admin

import {
    id, ISyncableMutableSubscribableTree, ISyncableMutableSubscribableTreeLocation, ITreeDataWithoutId, ITreeLoader,
    TreeLocationPropertyNames
} from '../objects/interfaces';
import {myContainer, myContainerLoadAllModules, treeLocationsRef} from '../../inversify.config';
import {GLOBAL_MAP_ID, GLOBAL_MAP_ROOT_TREE_ID} from '../core/globals';
import {TYPES} from '../objects/types';

myContainerLoadAllModules()
const treeLoader = myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
async function updateTreeLocationToHaveRootMapId(treeId: id) {
    const treeLocationRef = treeLocationsRef.child(treeId)
    const treeLocationMapIdRef = treeLocationRef.child(TreeLocationPropertyNames.MAP_ID)
    const treeLocationMapIdValRef = treeLocationRef.child(TreeLocationPropertyNames.MAP_ID)
    treeLocationMapIdValRef.update({val: GLOBAL_MAP_ID})
    console.log(treeId, ' just updated location ref to have map id val of', GLOBAL_MAP_ID)
    try {
        const treeDataWithoutId: ITreeDataWithoutId = await treeLoader.downloadData(treeId)
        const children = treeDataWithoutId.children
        children.forEach((childId: id) => {
            console.log('about to call updateTreelocationMap id for tree with id of ', childId)
            updateTreeLocationToHaveRootMapId(childId)
        })
    } catch (e) {
        console.error(treeId, ' YOO DIS TREE\'S DATA WUZ INVALID', e, 'BUT IT COOL YO YA KNOW')
    }
}
(async () => {

    await updateTreeLocationToHaveRootMapId(GLOBAL_MAP_ROOT_TREE_ID)
    console.log('UPDATES finished invoking. but probly not done running!')
})()
