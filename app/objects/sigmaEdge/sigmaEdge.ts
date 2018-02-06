import {id, ISigmaEdge, ISigmaEdgeData} from '../interfaces';
import {COMBINED_ID_SEPARATOR} from '../../core/globals';
import {UIColor} from '../uiColor';
import {EDGE_TYPES} from './edgeTypes';

export function createEdgeId({parentId, treeId}: {parentId: id, treeId: id}): id {
    const id = parentId + COMBINED_ID_SEPARATOR + treeId
    return id
}

export function getSourceId({edgeId}: {edgeId: id}): id {
    const sourceId = edgeId.substring(0, edgeId.indexOf(COMBINED_ID_SEPARATOR))
    return sourceId
}

export function getTargetId({edgeId}: {edgeId: id}): id {
    const start = edgeId.indexOf(COMBINED_ID_SEPARATOR) + COMBINED_ID_SEPARATOR.length
    const end = edgeId.length
    const targetId = edgeId.substring(start, end)
    return targetId
}

export const defaultEdgeSize = 2
export function createParentSigmaEdge(
    {parentId, treeId, color}: {parentId: id, treeId: id, color: UIColor}): ISigmaEdge {
    const id = createEdgeId({parentId, treeId})
    const edge: ISigmaEdgeData = {
        id,
        source: parentId,
        target: treeId,
        size: defaultEdgeSize,
        color,
        type: EDGE_TYPES.HIERARCHICAL
    }

    return edge
}
