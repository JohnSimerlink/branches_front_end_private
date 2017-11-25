Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var FirebaseSyncer_1 = require("../app/objects/dbSync/FirebaseSyncer");
describe('firebaseSync', function () {
    var firebaseRef = 'path/subpath/prop';
    var firebaseSyncer = new FirebaseSyncer_1.FirebaseSyncer({ firebaseRef: firebaseRef });
    /* so i need to test if subscribe works
    todo that I could 1) check if numSubscribers on the ISubscribable increases after subscribe.
     But that would be inspecting on a different object, making this an integration, not a unit test.
     And numSubscribers is a privated variable. Actually it doesn't even exist.
      2) call callCallbacks on the Subscribable and see if that calls firebaseSyncer's private save method . . .
      but that would be unit testing a private method . . .
    */
    var objectToKeepSynced = {
        onUpdate: function () { return void 0; }
    };
    it("subscribe should call ISubscribable onUpdate method to add the subscriber's\n     callback method to the Subscribable's callback list", function () {
        var onUpdateSpy = sinon.spy(objectToKeepSynced, 'onUpdate');
        firebaseSyncer.subscribe(objectToKeepSynced);
        // expect(JSON.stringify(sinon)).to.equal('hi')
        chai_1.expect(onUpdateSpy.callCount).to.equal(1);
    });
});
