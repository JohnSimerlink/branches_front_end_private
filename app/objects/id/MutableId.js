"use strict";
exports.__esModule = true;
var IdMutationTypes_1 = require("./IdMutationTypes");
var MutableId = /** @class */ (function () {
    function MutableId(_a) {
        var id = _a.id, _b = _a.mutations, mutations = _b === void 0 ? [] : _b;
        this.id = id;
        this._mutations = mutations;
    }
    MutableId.prototype.get = function () {
        return this.id;
    };
    MutableId.prototype.set = function (id) {
        this.id = id;
    };
    MutableId.prototype.addMutation = function (mutation) {
        switch (mutation.type) {
            case IdMutationTypes_1.IdMutationTypes.SET:
                this.set(mutation.data.id); // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(IdMutationTypes_1.IdMutationTypes));
        }
        this._mutations.push(mutation);
    };
    MutableId.prototype.mutations = function () {
        return this._mutations;
    };
    return MutableId;
}());
exports.MutableId = MutableId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXV0YWJsZUlkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTXV0YWJsZUlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEscURBQWtEO0FBU2xEO0lBU0ksbUJBQVksRUFBb0I7WUFBbkIsVUFBRSxFQUFFLGlCQUFjLEVBQWQsbUNBQWM7UUFDM0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7UUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQTtJQUMvQixDQUFDO0lBVE0sdUJBQUcsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBQ2xCLENBQUM7SUFDTyx1QkFBRyxHQUFYLFVBQVksRUFBRTtRQUNWLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLENBQUM7SUFLTSwrQkFBVyxHQUFsQixVQUFtQixRQUF5QztRQUN4RCxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwQixLQUFLLGlDQUFlLENBQUMsR0FBRztnQkFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUMsOENBQThDO2dCQUN6RSxLQUFLLENBQUM7WUFDVjtnQkFDSSxNQUFNLElBQUksU0FBUyxDQUFDLHNEQUFzRDtzQkFDcEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBZSxDQUFDLENBQUMsQ0FBQTtRQUM5QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVNLDZCQUFTLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVMLGdCQUFDO0FBQUQsQ0FBQyxBQTdCRCxJQTZCQztBQUVPLDhCQUFTIn0=