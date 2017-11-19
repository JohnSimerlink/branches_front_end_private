Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var MutableId_1 = require("../app/objects/tree/MutableId");
var TreeParentMutationTypes_1 = require("../app/objects/tree/TreeParentMutationTypes");
describe('MutableId', function () {
    // FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    var INIT_PARENT_ID = 'abc123';
    var NEW_PARENT_ID = 'def456';
    // const SECOND_NEW_PARENT_ID = 'df1abc123'
    // const THIRD_NEW_PARENT_ID = 'f31aabc123'
    // const FOURTH_NEW_PARENT_ID = '35dfabc123'
    var SECOND_SUCCESSFUL_MUTATION = {
        data: { id: NEW_PARENT_ID }, timestamp: Date.now(), type: TreeParentMutationTypes_1.TreeParentMutationTypes.SET_ID
    };
    // const THIRD_SUCCESSFUL_MUTATION = {
    //     data: {id: SECOND_NEW_PARENT_ID}, timestamp: Date.now(), type: TreeParentMutationTypes.SET_ID
    // }
    // const FOURTH_SUCCESSFUL_MUTATION = {
    //     data: {id: THIRD_NEW_PARENT_ID}, timestamp: Date.now(), type: TreeParentMutationTypes.SET_ID
    // }
    var id = new MutableId_1.MutableId({ id: INIT_PARENT_ID });
    // TESTS with empty mutation history
    it("INIT should setId\n    AND set mutations length to 0", function () {
        chai_1.expect(id.get()).to.equal(INIT_PARENT_ID);
        chai_1.expect(id.mutations().length).to.equal(0);
    });
    it('ADD MUTATION SET should change Id' +
        'and increment num mutations', function () {
        id.addMutation(SECOND_SUCCESSFUL_MUTATION);
        chai_1.expect(id.get()).to.deep.equal(NEW_PARENT_ID);
        chai_1.expect(id.mutations().length).to.equal(1);
    });
});
