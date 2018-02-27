import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {treeLocationsRef, treesRef} from '../../../inversify.config';
import {id, ITreeDataFromDB, ITreeDataWithoutId} from '../interfaces';
import {TreeDeserializer} from '../../loaders/tree/TreeDeserializer';

function setLevel({treeId, level}: {treeId: id, level: number}) {
    const treeRef = treesRef.child(treeId)
    const treeLocationRef = treeLocationsRef.child(treeId)
    const treeLocationRefLevel = treeLocationRef.child('level')
    treeLocationRefLevel.update({val: level})
    console.log('just seltLevel for treeid of ', treeId, ' with val of ', level)
    treeRef.on('value', snapshot => {
        const treeDataFromDB: ITreeDataFromDB = snapshot.val()
        const treeData: ITreeDataWithoutId = TreeDeserializer.convertFromDBToData({treeDataFromDB})
        const children = treeData.children
        children.forEach(childId => {
            setLevel({treeId: childId, level: level + 1})
        })
    })

}
setLevel({treeId: '1', level: 1})
