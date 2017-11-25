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
var inversify_2 = require("inversify");
var Mixin_1 = require("../Mixin");
var Subscribable_1 = require("../tree/Subscribable");
var types_1 = require("../types");
var MutableId_1 = require("./MutableId");
inversify_2.decorate(inversify_1.injectable(), Array);
var SubscribableMutableId = /** @class */ (function () {
    function SubscribableMutableId(_a) {
        var _b = _a.updatesCallbacks, updatesCallbacks = _b === void 0 ? [] : _b, id = _a.id, _c = _a.mutations, mutations = _c === void 0 ? [] : _c;
        var _this = this;
        var subscribable = new Subscribable_1.Subscribable({ updatesCallbacks: updatesCallbacks });
        Object.getOwnPropertyNames(subscribable).forEach(function (prop) {
            _this[prop] = subscribable[prop];
        });
        var mutableId = new MutableId_1.MutableId({ id: id, mutations: mutations });
        Object.getOwnPropertyNames(mutableId).forEach(function (prop) {
            _this[prop] = mutableId[prop];
        });
    }
    SubscribableMutableId.prototype.onUpdate = function (func) { return null; };
    SubscribableMutableId.prototype.get = function () { return null; };
    SubscribableMutableId.prototype.addMutation = function (mutation) { return null; };
    SubscribableMutableId.prototype.mutations = function () { return null; };
    SubscribableMutableId = __decorate([
        Mixin_1.Mixin(Subscribable_1.Subscribable, MutableId_1.MutableId),
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ISubscribableMutableIdArgs))
    ], SubscribableMutableId);
    return SubscribableMutableId;
}());
exports.SubscribableMutableId = SubscribableMutableId;
var SubscribableMutableIdArgs = /** @class */ (function () {
    function SubscribableMutableIdArgs() {
        this.updatesCallbacks = [];
        this.id = null;
        this.mutations = [];
    }
    __decorate([
        inversify_1.inject(types_1.TYPES.Array)
    ], SubscribableMutableIdArgs.prototype, "updatesCallbacks");
    __decorate([
        inversify_1.inject(types_1.TYPES.String)
    ], SubscribableMutableIdArgs.prototype, "id");
    __decorate([
        inversify_1.inject(types_1.TYPES.Array)
    ], SubscribableMutableIdArgs.prototype, "mutations");
    SubscribableMutableIdArgs = __decorate([
        inversify_1.injectable()
    ], SubscribableMutableIdArgs);
    return SubscribableMutableIdArgs;
}());
exports.SubscribableMutableIdArgs = SubscribableMutableIdArgs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJhYmxlTXV0YWJsZUlkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU3Vic2NyaWJhYmxlTXV0YWJsZUlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLHVDQUE2QztBQUM3Qyx1Q0FBa0M7QUFFbEMsa0NBQStCO0FBRS9CLHFEQUFrRDtBQUNsRCxrQ0FBK0I7QUFHL0IseUNBQWtEO0FBQ2xELG9CQUFRLENBQUMsc0JBQVUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBSTdCO0lBS0ksK0JBQXNELEVBQTJDO1lBQTFDLHdCQUFxQixFQUFyQiwwQ0FBcUIsRUFBRSxVQUFFLEVBQUUsaUJBQWMsRUFBZCxtQ0FBYztRQUFoRyxpQkFVQztRQVRHLElBQU0sWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQyxFQUFDLGdCQUFnQixrQkFBQSxFQUFDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNqRCxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLEVBQUMsRUFBRSxJQUFBLEVBQUUsU0FBUyxXQUFBLEVBQUMsQ0FBQyxDQUFBO1FBQ2hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQzlDLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFFTixDQUFDO0lBZE0sd0NBQVEsR0FBZixVQUFnQixJQUFxQixJQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUEsQ0FBQSxDQUFDO0lBQzdDLG1DQUFHLEdBQVYsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQSxDQUFFLENBQUM7SUFDOUIsMkNBQVcsR0FBbEIsVUFBbUIsUUFBeUMsSUFBVSxNQUFNLENBQUMsSUFBSSxDQUFBLENBQUEsQ0FBQztJQUMzRSx5Q0FBUyxHQUFoQixjQUE2RCxNQUFNLENBQUMsSUFBSSxDQUFBLENBQUEsQ0FBQztJQUp2RSxxQkFBcUI7UUFGMUIsYUFBSyxDQUFDLDJCQUFZLEVBQUUscUJBQVMsQ0FBQztRQUM5QixzQkFBVSxFQUFFO1FBTUksV0FBQSxrQkFBTSxDQUFDLGFBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO09BTG5ELHFCQUFxQixDQWdCMUI7SUFBRCw0QkFBQztDQUFBLEFBaEJELElBZ0JDO0FBWU8sc0RBQXFCO0FBTDdCO0lBREE7UUFFZ0MscUJBQWdCLEdBQUcsRUFBRSxDQUFBO1FBQ3BCLE9BQUUsR0FBRyxJQUFJLENBQUE7UUFDVixjQUFTLEdBQUcsRUFBRSxDQUFBO0lBQzlDLENBQUM7SUFId0I7UUFBcEIsa0JBQU0sQ0FBQyxhQUFLLENBQUMsS0FBSyxDQUFDOytEQUE2QjtJQUMzQjtRQUFyQixrQkFBTSxDQUFDLGFBQUssQ0FBQyxNQUFNLENBQUM7aURBQWlCO0lBQ2pCO1FBQXBCLGtCQUFNLENBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQzt3REFBc0I7SUFIeEMseUJBQXlCO1FBRDlCLHNCQUFVLEVBQUU7T0FDUCx5QkFBeUIsQ0FJOUI7SUFBRCxnQ0FBQztDQUFBLEFBSkQsSUFJQztBQUM4Qiw4REFBeUIifQ==