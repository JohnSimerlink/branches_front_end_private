Object.defineProperty(exports, "__esModule", { value: true });
var FirebaseSyncableBasicTree_1 = require("../app/objects/tree/FirebaseSyncableBasicTree");
describe('FirebaseSyncableBasicTree', function () {
    it('constructor should have firebase syncers subscribe to all the subscribable properties', function () {
        var TREE_ID = 'efa123';
        var firebaseSyncableBasicTree = new FirebaseSyncableBasicTree_1.FirebaseSyncableBasicTree(TREE_ID);
    });
});
