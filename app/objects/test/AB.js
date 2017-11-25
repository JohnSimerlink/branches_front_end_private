"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
// tslint:disable max-classes-per-file
var Mixin_1 = require("../Mixin");
var DRINK = 'drink';
var SWIM = 'swim';
exports.SWIM = SWIM;
var EAT = 'eat';
var RUN = 'run';
exports.RUN = RUN;
var A = /** @class */ (function () {
    function A(x, y) {
        this.x = x;
        this.y = y;
    }
    A.prototype.drink = function () { return DRINK; };
    A.prototype.swim = function () { return SWIM; };
    return A;
}());
var B = /** @class */ (function () {
    function B(z, w) {
        this.w = w;
        this.z = z;
    }
    B.prototype.eat = function () { return EAT; };
    B.prototype.run = function () { return RUN; };
    return B;
}());
var AB = /** @class */ (function () {
    function AB(x, y, z, w) {
        var a = new A(x, y);
        var b = new B(z, w);
        var me = this;
        [a, b].forEach(function (o) {
            Object.getOwnPropertyNames(o).forEach(function (p) {
                me[p] = o[p];
            });
        });
    }
    AB.prototype.swim = function () {
        return undefined;
    };
    AB.prototype.run = function () {
        return undefined;
    };
    AB = __decorate([
        Mixin_1.Mixin(A, B)
    ], AB);
    return AB;
}());
exports.AB = AB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQUIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJBQi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxrQ0FBK0I7QUFFL0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFBO0FBQ3JCLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQTtBQXVEWCxvQkFBSTtBQXREWixJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUE7QUFDakIsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFBO0FBcURILGtCQUFHO0FBNUNqQjtJQUdJLFdBQVksQ0FBQyxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNWLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztJQUNPLGlCQUFLLEdBQWIsY0FBa0IsTUFBTSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7SUFDekIsZ0JBQUksR0FBWCxjQUFnQixNQUFNLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQztJQUNqQyxRQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFDRDtJQUdJLFdBQVksQ0FBQyxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNWLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztJQUNPLGVBQUcsR0FBWCxjQUFnQixNQUFNLENBQUMsR0FBRyxDQUFBLENBQUMsQ0FBQztJQUNyQixlQUFHLEdBQVYsY0FBZSxNQUFNLENBQUMsR0FBRyxDQUFBLENBQUMsQ0FBQztJQUMvQixRQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFFRDtJQUdJLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNsQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDckIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FDZDtRQUNELENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDWixNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoQixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUNNLGlCQUFJLEdBQVg7UUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDTSxnQkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBbkJDLEVBQUU7UUFEUCxhQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUNOLEVBQUUsQ0FxQlA7SUFBRCxTQUFDO0NBQUEsQUFyQkQsSUFxQkM7QUFFa0IsZ0JBQUUifQ==