
export async function convertTreeDataForATree(treeId) {
    if (typeof treeId === 'undefined' || !treeId) {
        return
    }
    console.log("CONVERT: START ", treeId)
    const tree = await Trees.get(treeId)
    const treeData = {
        x: tree.x,
        y: tree.y,
        id: tree.id,
        level: tree.level,
        contentId: tree.contentId,
        parentId: tree.parentId,
    }
    tree.set('treeData', treeData)
}
window.convertTreeDataForATree = convertTreeDataForATree
