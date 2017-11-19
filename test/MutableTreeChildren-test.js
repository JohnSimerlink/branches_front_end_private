Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var MutableTreeChildren_1 = require("../app/objects/tree/MutableTreeChildren");
var TreeMutationTypes_1 = require("../app/objects/tree/TreeMutationTypes");
describe('MutableTreeChildren', function () {
    // FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    var FIRST_CHILD_ID = 'abc123';
    var SECOND_CHILD_ID = 'dfabc123';
    var THIRD_CHILD_ID = 'gfabc123';
    var FOURTH_CHILD_ID = 'hgabc123';
    var NONEXISTENT_CHILD_ID = 'nonexistentid';
    var INIT_CHILDREN_VALUE = [];
    var FIRST_SUCCESSFUL_MUTATION = {
        data: { childId: FIRST_CHILD_ID }, timestamp: Date.now(), type: TreeMutationTypes_1.TreeMutationTypes.ADD_CHILD
    };
    var FIRST_CHILDREN_VALUE = INIT_CHILDREN_VALUE.concat([FIRST_CHILD_ID]);
    var SECOND_SUCCESSFUL_MUTATION = {
        data: { childId: FIRST_CHILD_ID }, timestamp: Date.now(), type: TreeMutationTypes_1.TreeMutationTypes.REMOVE_CHILD
    };
    var THIRD_SUCCESSFUL_MUTATION = FIRST_SUCCESSFUL_MUTATION;
    THIRD_SUCCESSFUL_MUTATION.timestamp = Date.now();
    var FOURTH_SUCCESSFUL_MUTATION = {
        data: { childId: SECOND_CHILD_ID }, timestamp: Date.now(), type: TreeMutationTypes_1.TreeMutationTypes.ADD_CHILD
    };
    var FIFTH_SUCCESSFUL_MUTATION = {
        data: { childId: THIRD_CHILD_ID }, timestamp: Date.now(), type: TreeMutationTypes_1.TreeMutationTypes.ADD_CHILD
    };
    var SIXTH_SUCCESSFUL_MUTATION = {
        data: { childId: FOURTH_CHILD_ID }, timestamp: Date.now(), type: TreeMutationTypes_1.TreeMutationTypes.ADD_CHILD
    };
    var SEVENTH_SUCCESSFUL_MUTATION = {
        data: { childId: THIRD_CHILD_ID }, timestamp: Date.now(), type: TreeMutationTypes_1.TreeMutationTypes.REMOVE_CHILD
    };
    var childrenAfterSixthSuccessfulMutation = FIRST_CHILDREN_VALUE.concat([
        SECOND_CHILD_ID,
        THIRD_CHILD_ID,
        FOURTH_CHILD_ID
    ]);
    var childrenAfterSeventhSuccessfulMutation = FIRST_CHILDREN_VALUE.concat([
        SECOND_CHILD_ID,
        FOURTH_CHILD_ID
    ]);
    var firstAndFourthIds = [
        FIRST_CHILD_ID, FOURTH_CHILD_ID
    ];
    // ,SECOND_CHILD_ID, THIRD_CHILD_ID, FOURTH_CHILD_ID]
    var treeChildren = new MutableTreeChildren_1.MutableTreeChildren();
    var FIRST_MUTATION_INDEX = 0;
    var SECOND_MUTATION_INDEX = 1;
    var THIRD_MUTATION_INDEX = 2;
    var FOURTH_MUTATION_INDEX = 3;
    var FIFTH_MUTATION_INDEX = 4;
    it('INIT should have no children after constructor', function () {
        chai_1.expect(treeChildren.getIds()).to.deep.equal(INIT_CHILDREN_VALUE);
    });
    it('INIT should return history of mutations on the point after creation', function () {
        chai_1.expect(treeChildren.mutations().length).to.equal(0);
        // TODO: ^^ Fix Violation of Law of Demeter
    });
    it('GOOD ADD_CHILD mutation should add childId to children array and add entry to mutation history', function () {
        treeChildren.addMutation(FIRST_SUCCESSFUL_MUTATION);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(FIRST_CHILDREN_VALUE);
        chai_1.expect(treeChildren.mutations().length).to.equal(1);
    });
    it("BAD ADD_CHILD mutation that tries adding a childId that already exists should throw a RangeError\n    and keep the data and mutation values the same", function () {
        var disallowedRedundantMutation = FIRST_SUCCESSFUL_MUTATION;
        disallowedRedundantMutation.timestamp = Date.now();
        chai_1.expect(function () { return treeChildren.addMutation(disallowedRedundantMutation); }).to.throw(RangeError);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(FIRST_CHILDREN_VALUE);
        chai_1.expect(treeChildren.mutations().length).to.equal(1);
    });
    it("BAD REMOVE_CHILD mutation on non-existent childId will throw range error\n    and should keep data and mutations the same", function () {
        var badRemoveMutation = {
            data: { childId: NONEXISTENT_CHILD_ID },
            timestamp: Date.now(),
            type: TreeMutationTypes_1.TreeMutationTypes.REMOVE_CHILD
        };
        chai_1.expect(function () { treeChildren.addMutation(badRemoveMutation); }).to.throw(RangeError);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(FIRST_CHILDREN_VALUE);
        chai_1.expect(treeChildren.mutations().length).to.equal(1);
    });
    it("GOOD REMOVE_CHILD mutation on existing childId will remove childId\n    and should add another mutation", function () {
        var goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION;
        treeChildren.addMutation(goodRemoveMutation);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(INIT_CHILDREN_VALUE);
        chai_1.expect(treeChildren.mutations().length).to.equal(2);
    });
    it("BAD REMOVE_CHILD (2) mutation on non-existent childId will throw range error\n    and should keep data and mutations the same", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        var badRemoveMutation = {
            data: { childId: FIRST_CHILD_ID },
            timestamp: Date.now(),
            type: TreeMutationTypes_1.TreeMutationTypes.REMOVE_CHILD
        };
        chai_1.expect(function () { return treeChildren.addMutation(badRemoveMutation); }).to.throw(RangeError);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(INIT_CHILDREN_VALUE);
        chai_1.expect(treeChildren.mutations().length).to.equal(2);
    });
    it("GOOD ADD_CHILD mutation on a childId that has been removed by another mutation\n    will simply append another ADD CHILD mutation\n    and should increment mutations length", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        treeChildren.addMutation(THIRD_SUCCESSFUL_MUTATION);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(FIRST_CHILDREN_VALUE);
        chai_1.expect(treeChildren.mutations().length).to.equal(3);
    });
    it("3 GOOD ADD_CHILD mutations should increase the num children to 4,\n    and num mutations to 6", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        treeChildren.addMutation(FOURTH_SUCCESSFUL_MUTATION);
        treeChildren.addMutation(FIFTH_SUCCESSFUL_MUTATION);
        treeChildren.addMutation(SIXTH_SUCCESSFUL_MUTATION);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(childrenAfterSixthSuccessfulMutation);
        chai_1.expect(treeChildren.mutations().length).to.equal(6);
    });
    it("GOOD REMOVE_CHILD mutation should decrease the num children to 3,\n    and num mutations to 7", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        treeChildren.addMutation(SEVENTH_SUCCESSFUL_MUTATION);
        chai_1.expect(treeChildren.getIds()).to.deep.equal(childrenAfterSeventhSuccessfulMutation);
        chai_1.expect(treeChildren.mutations().length).to.equal(7);
    });
    // TODO: do tests with injecting a mutations array that is not empty
});
