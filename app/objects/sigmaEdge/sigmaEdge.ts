import {id, ISigmaEdgeData} from '../interfaces';
import {COMBINED_ID_SEPARATOR} from '../../core/globals';
import {UIColor} from '../uiColor';
import {EDGE_TYPES} from './edgeTypes';

function createEdgeId({parentId, treeId}: {parentId: id, treeId: id}): id {
    const id = parentId + COMBINED_ID_SEPARATOR + treeId
    return id
}

export function createParentSigmaEdge({parentId, treeId, color}: {parentId: id, treeId: id, color: UIColor}): ISigmaEdgeData {
    const id = createEdgeId({parentId, treeId})
    const edge: ISigmaEdgeData = {
        id,
        source: parentId,
        target: treeId,
        size: 2,
        color,
        type: EDGE_TYPES.HIERARCHICAL
    }

    return edge
}
