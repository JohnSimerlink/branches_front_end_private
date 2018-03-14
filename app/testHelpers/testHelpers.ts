import {interfaces} from 'inversify';
import {myContainer} from '../../inversify.config';
import {log} from '../core/log';
import Container = interfaces.Container;

export const TREE_ID = '12334';
export const TREE_ID2 = '1252334';
export const TREE_ID3 = 'efa12345';
export const CONTENT_ID = '5982347';
export const CONTENT_ID2 = 'bcafd5982347';
export const CONTENT_ID3 = 'afd5982347';
export const SIGMA_ID1 = TREE_ID;
export const SIGMA_ID2 = TREE_ID2;
export function getSigmaIdsForContentId(contentId) {
    switch (contentId) {
        case CONTENT_ID:
            return [SIGMA_ID1, SIGMA_ID2];
    }
}
export function inRenderedSetf({treeId, store}) {
    const sigmaInstance = store.state.sigmaInstance;
    return !!(sigmaInstance && sigmaInstance.graph.nodes(treeId));
}

export function injectionWorks<argsInterface, classInterface>(
    {container, argsType, interfaceType}: {container: Container, argsType: symbol, interfaceType: symbol }) {
    const expectedProperties = Object.getOwnPropertyNames
    (container.get<argsInterface>(argsType));
    const obj: classInterface = myContainer.get<classInterface>(interfaceType);
    const propertiesExist = expectedProperties.every(property =>  obj[property] !== undefined
    );
    // TODO: this doesn't check
    return propertiesExist;
}

function ObjectFactory() {
    return {};
}
