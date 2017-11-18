"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
/* tslint:disable variable-name */
var inversify_1 = require("inversify");
var log_1 = require("../../core/log");
var PointMutationTypes_1 = require("./PointMutationTypes");
/* TODO: Maybe split into  Point and PointMutator classes?

 */
/* TODO: Am I violating the Law of Demeter (SVLOD or WVLOD)
 by accessing the mutation list, and looking at properties on each mutation?
 Should I handle mutations as a separate class, rather than a duck type?
 IMO yes. I should create a generalized mutation module.
 Will do that after I have 1 to 2 modules using Mutations
*/
var Point = /** @class */ (function () {
    // @multiInject("IActivatableDatedMutation") mutations
    /* NOTE: yes, this isn't the best obeyance of Dependency Inversion standards,
    because I am doing some processing in the constructor,
    rather than just assignment . . .
    */
    function Point(_a) {
        var x = _a.x, y = _a.y, _b = _a.mutations, mutations = _b === void 0 ? [] : _b;
        this.x = 0;
        this.y = 0;
        this._mutations = mutations;
        log_1.log('CONSTRUCTOR mutations is ' + JSON.stringify(this._mutations));
        var mutation = {
            data: { delta: { x: x, y: y } },
            timestamp: Date.now(),
            type: PointMutationTypes_1.PointMutationTypes.SHIFT
        };
        this.addMutation(mutation);
    }
    Point.prototype.val = function () {
        return { x: this.x, y: this.y };
    };
    Point.prototype.shift = function (delta) {
        this.x += delta.x;
        this.y += delta.y;
        return this.val();
    };
    Point.prototype.unshift = function (delta) {
        this.x -= delta.x;
        this.y -= delta.y;
        return this.val();
    };
    Point.prototype.addMutation = function (mutation) {
        this.doMutation(mutation);
        var activatedMutation = __assign({}, mutation, { active: true });
        this._mutations.push(activatedMutation);
    };
    /* NOTE: if we had a non-commutative mutation type (SHIFT is commutative),
     we'd need methods different from just doMutation and undoMutation
    */
    Point.prototype.doMutation = function (mutation) {
        switch (mutation.type) {
            case PointMutationTypes_1.PointMutationTypes.SHIFT:
                this.shift(mutation.data.delta); // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes_1.PointMutationTypes));
        }
    };
    Point.prototype.undoMutation = function (mutation) {
        switch (mutation.type) {
            case PointMutationTypes_1.PointMutationTypes.SHIFT:
                this.unshift(mutation.data.delta); // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes_1.PointMutationTypes));
        }
    };
    Point.prototype.mutations = function () {
        return this._mutations;
    };
    // private getMutation(index: number): IDatedMutation {
    //     if (index >= this._mutations.length) {
    //         throw new RangeError(index + ' invalid! There are only ' + this._mutations.length + ' mutations.')
    //     }  /* Is accessing a length property violating Law of Demeter */
    //     else {
    //         return this._mutations
    //     }
    // }
    /* TODO: Add unit tests for mutation list
    While testing this undo method . . I found that the previousTime
    addMutation was called, the mutation list didn't actually add an element ...
     */
    Point.prototype.undo = function (mutationListIndex) {
        var mutation = this._mutations[mutationListIndex];
        if (!mutation.active || mutationListIndex === 0) {
            var activeMutations = this.getActiveMutations();
            throw new RangeError('Mutation ' + JSON.stringify(mutation)
                + " is already not active and thus cannot be undone.\n             The current mutations that are active are "
                + JSON.stringify(activeMutations) + '. Also the first mutation can\'t be undone.');
        }
        this.undoMutation(mutation);
        mutation.active = false;
        return this;
    };
    Point.prototype.redo = function (mutationListIndex) {
        // log('redo called for ' + index + ' out of ' + JSON.stringify(this._mutations))
        var mutation = this._mutations[mutationListIndex];
        if (mutation.active) {
            var inactiveMutations = this.getInactiveMutations();
            throw new RangeError('Mutation' + JSON.stringify(mutation)
                + "is already active and thus cannot be currently redone.\n             The current mutations that are inactive are "
                + JSON.stringify(inactiveMutations));
        }
        this.doMutation(mutation);
        // log('END redo called for ' + index + ' out of ' + JSON.stringify(this._mutations))
        mutation.active = true;
        /* TODO: again is modifying mutations directly
        violating law of Demeter? I feel like i should
        separate mutations into its own class */
        return this;
    };
    Point.prototype.getActiveMutations = function () {
        return this._mutations.filter(function (mutation) { return mutation.active; });
    };
    Point.prototype.getInactiveMutations = function () {
        return this._mutations.filter(function (mutation) { return !mutation.active; });
    };
    Point = __decorate([
        inversify_1.injectable()
    ], Point);
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0NBQWtDO0FBQ2xDLHVDQUEwRDtBQUMxRCxzQ0FBbUM7QUFNbkMsMkRBQXdEO0FBRXhEOztHQUVHO0FBQ0g7Ozs7O0VBS0U7QUFFRjtJQUlJLHNEQUFzRDtJQUV0RDs7O01BR0U7SUFDRixlQUFZLEVBQXNCO1lBQXJCLFFBQUMsRUFBRSxRQUFDLEVBQUUsaUJBQWMsRUFBZCxtQ0FBYztRQVR6QixNQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ04sTUFBQyxHQUFHLENBQUMsQ0FBQztRQVNWLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO1FBQzNCLFNBQUcsQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLElBQU0sUUFBUSxHQUFHO1lBQ2IsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUMsRUFBQztZQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNyQixJQUFJLEVBQUUsdUNBQWtCLENBQUMsS0FBSztTQUNqQyxDQUFBO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lBQ00sbUJBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUE7SUFDakMsQ0FBQztJQUVNLHFCQUFLLEdBQVosVUFBYSxLQUFrQjtRQUMzQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDakIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ2pCLE1B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