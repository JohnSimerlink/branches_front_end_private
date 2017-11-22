Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var SubscribableMutableStringSet_1 = require("../app/objects/set/SubscribableMutableStringSet");
var SetMutationTypes_1 = require("../app/objects/set/SetMutationTypes");
describe('Subscribable:SubscribableMutableStringSet', function () {
    var updatesCallbacks = [];
    var set = new SubscribableMutableStringSet_1.SubscribableMutableStringSet({ updatesCallbacks: updatesCallbacks });
    // const firebaseRef = 'path/subpath/prop'
    // const firebaseSyncer = new FirebaseSyncer({firebaseRef})
    var callback1 = sinon.spy(); // () => void 0
    var callback2 = sinon.spy(); // () => void 0
    it('Subscribable:mutableStringSet onUpdate func should add func to callback list', function () {
        set.onUpdate(callback1); // TODO: why doesn't typescript complain that func is not of type updatesCallback?
        chai_1.expect(updatesCallbacks).to.deep.equal([callback1]);
    });
    it("Subscribable:mutableStringSet addMutation should call\n     all the callbacks with the expected published updates", function () {
        set.onUpdate(callback2); // TODO: why doesn't typescript complain that func is not of type updatesCallback?
        var ADDED_KEY = '123';
        var mutation = {
            data: ADDED_KEY,
            timestamp: Date.now(),
            type: SetMutationTypes_1.SetMutationTypes.ADD,
        };
        set.addMutation(mutation);
        var val = {};
        val[ADDED_KEY] = true;
        var expectedPublishedUpdates = {
            pushes: {
                mutations: mutation
            },
            updates: {
                val: val
            }
        };
        chai_1.expect(callback1.callCount).to.equal(1);
        chai_1.expect(callback2.callCount).to.equal(1);
        chai_1.expect(callback1.firstCall.args[0]).to.deep.equal(expectedPublishedUpdates);
        chai_1.expect(callback2.firstCall.args[0]).to.deep.equal(expectedPublishedUpdates);
    });
    // firebaseSyncer.subscribe(set)
    // const saveSpy = sinon.spy(firebaseSyncer._test_save
    // const mutation = {}
    // set.addMutation()
});
