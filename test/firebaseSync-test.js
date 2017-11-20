Object.defineProperty(exports, "__esModule", { value: true });
var FirebaseSyncer_1 = require("../app/objects/dbSync/FirebaseSyncer");
describe('firebaseSync', function () {
    var firebaseRef = 'path/subpath/prop';
    var firebaseSyncer = new FirebaseSyncer_1.FirebaseSyncer({ firebaseRef: firebaseRef });
    /* so i need to test if subscribe works
    todo that I could 1) check if numSubscribers on the ISubscribable increases after subscribe.
     But that would be inspecting on a different object, making this an integration, not a unit test.
      2) call callCallbacks on the Subscribable and see if that calls firebaseSyncer's private save method . . .
      but that would be unit testing a private method . . .
    */
    var objectToKeepSynced = {
        onUpdate: function () { return void 0; }
    };
});
