"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MutationTypes;
(function (MutationTypes) {
    // Tree Mutation Types
    MutationTypes[MutationTypes["ADD_LEAF"] = 0] = "ADD_LEAF";
    MutationTypes[MutationTypes["REMOVE_LEAF"] = 1] = "REMOVE_LEAF";
})(MutationTypes = exports.MutationTypes || (exports.MutationTypes = {}));
// TODO: make the above generic, where we can statically separate TREE vs USER MUTATION TYPES ETC.
