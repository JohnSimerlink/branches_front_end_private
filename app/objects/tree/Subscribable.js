"use strict";
exports.__esModule = true;
var Subscribable = /** @class */ (function () {
    function Subscribable(_a) {
        var updatesCallbacks = (_a === void 0 ? { updatesCallbacks: [] } : _a).updatesCallbacks;
        this.updates = {};
        this.pushes = {};
        this.updatesCallbacks = updatesCallbacks; /* let updatesCallbacks be injected for
         1) modularity reasons
         2) if we want to cache the state of this entire object, we could load in the previous state
         of set, mutations, and updatesCallbacks easy-peasy
         */
    }
    Subscribable.prototype.onUpdate = function (func) {
        this.updatesCallbacks.push(func);
    };
    Subscribable.prototype.callCallbacks = function () {
        var me = this;
        this.updatesCallbacks.forEach(function (callback) {
            callback({
                pushes: me.pushes,
                updates: me.updates
            });
        });
        this.clearPushesAndUpdates();
    };
    Subscribable.prototype.clearPushesAndUpdates = function () {
        this.updates = {};
        this.pushes = {};
    };
    return Subscribable;
}());
exports.Subscribable = Subscribable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU3Vic2NyaWJhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUE7SUFJSSxzQkFBWSxFQUEyQztZQUExQyxtRkFBZ0I7UUFIbkIsWUFBTyxHQUFtQixFQUFFLENBQUE7UUFDNUIsV0FBTSxHQUFnRCxFQUFFLENBQUE7UUFHOUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBLENBQUM7Ozs7V0FJdEM7SUFDUCxDQUFDO0lBQ00sK0JBQVEsR0FBZixVQUFnQixJQUFxQjtRQUNqQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFDUyxvQ0FBYSxHQUF2QjtRQUNJLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQTtRQUNmLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRO1lBQ2xDLFFBQVEsQ0FBQztnQkFDTCxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU07Z0JBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTzthQUN0QixDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0lBQ2hDLENBQUM7SUFDTyw0Q0FBcUIsR0FBN0I7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNwQixDQUFDO0lBRUwsbUJBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBQ08sb0NBQVkifQ==