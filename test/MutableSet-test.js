Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var MutableStringSet_1 = require("../app/objects/set/MutableStringSet");
var SetMutationTypes_1 = require("../app/objects/set/SetMutationTypes");
describe('MutableSet:string', function () {
    // FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    var FIRST_MEMBER_ID = 'abc123';
    var SECOND_MEMBER_ID = 'dfabc123';
    var THIRD_MEMBER_ID = 'gfabc123';
    var FOURTH_MEMBER_ID = 'hgabc123';
    var NONEXISTENT_MEMBER_ID = 'nonexistentid';
    var INIT_MEMBER_VALUE = [];
    var FIRST_SUCCESSFUL_MUTATION = {
        data: FIRST_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes_1.SetMutationTypes.ADD
    };
    var FIRST_MEMBER_VALUE = INIT_MEMBER_VALUE.concat([FIRST_MEMBER_ID]);
    var SECOND_SUCCESSFUL_MUTATION = {
        data: FIRST_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes_1.SetMutationTypes.REMOVE
    };
    var THIRD_SUCCESSFUL_MUTATION = FIRST_SUCCESSFUL_MUTATION;
    THIRD_SUCCESSFUL_MUTATION.timestamp = Date.now();
    var FOURTH_SUCCESSFUL_MUTATION = {
        data: SECOND_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes_1.SetMutationTypes.ADD
    };
    var FIFTH_SUCCESSFUL_MUTATION = {
        data: THIRD_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes_1.SetMutationTypes.ADD
    };
    var SIXTH_SUCCESSFUL_MUTATION = {
        data: FOURTH_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes_1.SetMutationTypes.ADD
    };
    var SEVENTH_SUCCESSFUL_MUTATION = {
        data: THIRD_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes_1.SetMutationTypes.REMOVE
    };
    var membersAfterSixthSuccessfulMutation = FIRST_MEMBER_VALUE.concat([
        SECOND_MEMBER_ID,
        THIRD_MEMBER_ID,
        FOURTH_MEMBER_ID
    ]);
    var membersAfterSeventhSuccessfulMutation = FIRST_MEMBER_VALUE.concat([
        SECOND_MEMBER_ID,
        FOURTH_MEMBER_ID
    ]);
    var firstAndFourthIds = [
        FIRST_MEMBER_ID, FOURTH_MEMBER_ID
    ];
    // ,SECOND_MEMBER_ID, THIRD_MEMBER_ID, FOURTH_MEMBER_ID]
    var stringSet = new MutableStringSet_1.MutableStringSet();
    var FIRST_MUTATION_INDEX = 0;
    var SECOND_MUTATION_INDEX = 1;
    var THIRD_MUTATION_INDEX = 2;
    var FOURTH_MUTATION_INDEX = 3;
    var FIFTH_MUTATION_INDEX = 4;
    it('INIT should have no members after constructor', function () {
        chai_1.expect(stringSet.getMembers()).to.deep.equal(INIT_MEMBER_VALUE);
    });
    it('INIT should return history of mutations on the point after creation', function () {
        chai_1.expect(stringSet.mutations().length).to.equal(0);
        // TODO: ^^ Fix Violation of Law of Demeter
    });
    it('GOOD ADD mutation should add member to members array and add entry to mutation history', function () {
        stringSet.addMutation(FIRST_SUCCESSFUL_MUTATION);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE);
        chai_1.expect(stringSet.mutations().length).to.equal(1);
    });
    it("BAD ADD mutation that tries adding a member that already exists should throw a RangeError\n    and keep the data and mutation values the same", function () {
        var disallowedRedundantMutation = FIRST_SUCCESSFUL_MUTATION;
        disallowedRedundantMutation.timestamp = Date.now();
        chai_1.expect(function () { return stringSet.addMutation(disallowedRedundantMutation); }).to.throw(RangeError);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE);
        chai_1.expect(stringSet.mutations().length).to.equal(1);
    });
    it("BAD REMOVE mutation on non-existent member will throw range error\n    and should keep data and mutations the same", function () {
        var badRemoveMutation = {
            data: NONEXISTENT_MEMBER_ID,
            timestamp: Date.now(),
            type: SetMutationTypes_1.SetMutationTypes.REMOVE
        };
        chai_1.expect(function () { stringSet.addMutation(badRemoveMutation); }).to.throw(RangeError);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE);
        chai_1.expect(stringSet.mutations().length).to.equal(1);
    });
    it("GOOD REMOVE mutation on existing member will remove member\n    and should add another mutation", function () {
        var goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION;
        stringSet.addMutation(goodRemoveMutation);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(INIT_MEMBER_VALUE);
        chai_1.expect(stringSet.mutations().length).to.equal(2);
    });
    it("BAD REMOVE (2) mutation on non-existent member will throw range error\n    and should keep data and mutations the same", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        var badRemoveMutation = {
            data: FIRST_MEMBER_ID,
            timestamp: Date.now(),
            type: SetMutationTypes_1.SetMutationTypes.REMOVE
        };
        chai_1.expect(function () { return stringSet.addMutation(badRemoveMutation); }).to.throw(RangeError);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(INIT_MEMBER_VALUE);
        chai_1.expect(stringSet.mutations().length).to.equal(2);
    });
    it("GOOD ADD mutation on a member that has been removed by another mutation\n    will simply append another ADD MEMBER mutation\n    and should increment mutations length", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        stringSet.addMutation(THIRD_SUCCESSFUL_MUTATION);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE);
        chai_1.expect(stringSet.mutations().length).to.equal(3);
    });
    it("3 GOOD ADD mutations should increase the num members to 4,\n    and num mutations to 6", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        stringSet.addMutation(FOURTH_SUCCESSFUL_MUTATION);
        stringSet.addMutation(FIFTH_SUCCESSFUL_MUTATION);
        stringSet.addMutation(SIXTH_SUCCESSFUL_MUTATION);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(membersAfterSixthSuccessfulMutation);
        chai_1.expect(stringSet.mutations().length).to.equal(6);
    });
    it("GOOD REMOVE mutation should decrease the num members to 3,\n    and num mutations to 7", function () {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        stringSet.addMutation(SEVENTH_SUCCESSFUL_MUTATION);
        chai_1.expect(stringSet.getMembers()).to.deep.equal(membersAfterSeventhSuccessfulMutation);
        chai_1.expect(stringSet.mutations().length).to.equal(7);
    });
    // TODO: do tests with injecting a mutations array that is not empty
});
