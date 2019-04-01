async function establishURIs() {
    console.log("establish URIs called");
    const tree = await Trees.get(1);
    console.log("tree gotten for id 1 is", tree, tree.contentId);

    const contentItem = await ContentItems.get(tree.contentId);
    console.log("contentItem gotten is", contentItem);

    contentItem.set("uri", "content/" + contentItem.title);
    contentItem.set("primaryParentTreeId", null);
    contentItem.set("primaryParentTreeContentURI", null);

    tree.getIds().forEach(establishURIForContentAndThenAllChildren);
}

window.establishURIs = establishURIs;

async function establishURIForContentAndThenAllChildren(treeId) {
    console.log("establish URI called for", treeId);
    const tree = await Trees.get(treeId);
    if (!tree.treeDataFromDB.parentId) {
        return;
    }
    const parentTree = await Trees.get(tree.treeDataFromDB.parentId);
    const contentItem = await ContentItems.get(tree.treeDataFromDB.contentId);
    const parentContentItem = await ContentItems.get(parentTree.treeDataFromDB.contentId);
    console.log(treeId + ": contentItem is ", contentItem);
    console.log(treeId + ": parent contentItem URI is ", parentContentItem.uri);
    let uri = parentContentItem.uri + "/" + contentItem.getURIAddition();
    console.log(treeId + ": URI is ", uri);
    console.log(treeId + ": children are ", tree.treeDataFromDB.children && Object.keys(tree.children));
    contentItem.set("uri", uri);
    contentItem.set("primaryParentTreeId", parentTree.id);
    contentItem.set("primaryParentTreeContentURI", parentContentItem.uri);
    tree.getIds().forEach(establishURIForContentAndThenAllChildren);
}
