import {myContainer} from '../../inversify.config';
import {interfaces} from 'inversify';
import Container = interfaces.Container;

const TREE_ID = '12334'
const TREE_ID2 = '1252334'
const TREE_ID3 = 'efa12345'
const CONTENT_ID = '5982347'
const CONTENT_ID2 = 'bcafd5982347'
const CONTENT_ID3 = 'afd5982347'
const SIGMA_ID1 = TREE_ID
const SIGMA_ID2 = TREE_ID2
function getSigmaIdsForContentId(contentId) {
    switch (contentId) {
        case CONTENT_ID:
            return [SIGMA_ID1, SIGMA_ID2]
    }
}

function injectionWorks<argsInterface, classInterface>(
    {container, argsType, classType}: {container: Container, argsType: symbol, classType: symbol }) {
    const expectedProperties = Object.getOwnPropertyNames
    (container.get<argsInterface>(argsType))
    const obj: classInterface = myContainer.get<classInterface>(classType)
    const propertiesExist = expectedProperties.every(property =>  obj[property] !== undefined
    )
    return propertiesExist
}

export {
    TREE_ID, TREE_ID2, TREE_ID3,
    SIGMA_ID1, SIGMA_ID2,
    CONTENT_ID, CONTENT_ID2, CONTENT_ID3, getSigmaIdsForContentId, injectionWorks
}
