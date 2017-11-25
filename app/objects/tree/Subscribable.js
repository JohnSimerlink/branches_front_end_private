"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
// tslint:disable max-classes-per-file
var inversify_1 = require("inversify");
var types_1 = require("../types");
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
    Subscribable = __decorate([
        inversify_1.injectable()
        // TODO: make abstract?
        ,
        __param(0, inversify_1.inject(types_1.TYPES.SubscribableArgs))
    ], Subscribable);
    return Subscribable;
}());
exports.Subscribable = Subscribable;
var SubscribableArgs = /** @class */ (function () {
    function SubscribableArgs() {
    }
    __decorate([
        inversify_1.inject(types_1.TYPES.Array)
    ], SubscribableArgs.prototype, "updatesCallbacks");
    SubscribableArgs = __decorate([
        inversify_1.injectable()
    ], SubscribableArgs);
    return SubscribableArgs;
}());
exports.SubscribableArgs = SubscribableArgs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU3Vic2NyaWJhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLHVDQUE2QztBQUk3QyxrQ0FBK0I7QUFJL0I7SUFJSSxzQkFBMkMsRUFBMkM7WUFBMUMsbUZBQWdCO1FBSGxELFlBQU8sR0FBbUIsRUFBRSxDQUFBO1FBQzVCLFdBQU0sR0FBZ0QsRUFBRSxDQUFBO1FBRzlELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQSxDQUFDOzs7O1dBSXRDO0lBQ1AsQ0FBQztJQUNNLCtCQUFRLEdBQWYsVUFBZ0IsSUFBcUI7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBQ1Msb0NBQWEsR0FBdkI7UUFDSSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDZixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtZQUNsQyxRQUFRLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNO2dCQUNqQixPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU87YUFDdEIsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtJQUNoQyxDQUFDO0lBQ08sNENBQXFCLEdBQTdCO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQTNCQyxZQUFZO1FBRmpCLHNCQUFVLEVBQUU7UUFDVCx1QkFBdUI7O1FBS1YsV0FBQSxrQkFBTSxDQUFDLGFBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BSnpDLFlBQVksQ0E0QmpCO0lBQUQsbUJBQUM7Q0FBQSxBQTVCRCxJQTRCQztBQUtPLG9DQUFZO0FBSHBCO0lBQUE7SUFFQSxDQUFDO0lBRHdCO1FBQXBCLGtCQUFNLENBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQztzREFBeUI7SUFEM0MsZ0JBQWdCO1FBRHJCLHNCQUFVLEVBQUU7T0FDUCxnQkFBZ0IsQ0FFckI7SUFBRCx1QkFBQztDQUFBLEFBRkQsSUFFQztBQUNxQiw0Q0FBZ0IifQ==