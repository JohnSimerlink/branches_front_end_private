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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0NBQWtDO0FBQ2xDLHVDQUEwRDtBQU8xRCwyREFBd0Q7QUFFeEQ7O0dBRUc7QUFDSDs7Ozs7RUFLRTtBQUVGO0lBSUksc0RBQXNEO0lBRXREOzs7TUFHRTtJQUNGLGVBQVksRUFBc0I7WUFBckIsUUFBQyxFQUFFLFFBQUMsRUFBRSxpQkFBYyxFQUFkLG1DQUFjO1FBVHpCLE1BQUMsR0FBRyxDQUFDLENBQUM7UUFDTixNQUFDLEdBQUcsQ0FBQyxDQUFDO1FBU1YsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUE7UUFDM0IsSUFBTSxRQUFRLEdBQUc7WUFDYixJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBQyxFQUFDO1lBQ3JCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3JCLElBQUksRUFBRSx1Q0FBa0IsQ0FBQyxLQUFLO1NBQ2pDLENBQUE7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFDTSxtQkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBRU0scUJBQUssR0FBWixVQUFhLEtBQWtCO1FBQzNCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNyQixDQUFDO0lBRU8sdUJBQU8sR0FBZixVQUFnQixLQUFrQjtRQUM5QixJQUFJLENBQUMsQ0FB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