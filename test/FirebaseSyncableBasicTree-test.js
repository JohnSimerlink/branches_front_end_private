Object.defineProperty(exports, "__esModule", { value: true });
var inversify_config_1 = require("../inversify.config");
var types_1 = require("../app/objects/types");
describe('FirebaseSyncableBasicTree', function () {
    it('constructor should have firebase syncers subscribe to all the subscribable properties', function () {
        var contentId = inversify_config_1.myContainer.get(types_1.TYPES.ISubscribableMutableId);
        var TREE_ID = 'efa123';
        // const firebaseSyncableBasicTree = new FirebaseSyncerBasicTree(TREE_ID)
    });
});
