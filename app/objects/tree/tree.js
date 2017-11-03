"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable object-literal-sort-keys */
var md5_1 = require("md5");
var log_1 = require("../../core/log");
var store_1 = require("../../core/store");
var contentItems_1 = require("../contentItems");
var firebaseService_js_1 = require("../firebaseService.js");
var IMutable_1 = require("../mutations/IMutable");
var trees_js_1 = require("../trees.js");
var user_1 = require("../user");
var proficiencyStats_1 = require("./proficiencyStats");
function syncGraphWithNode(treeId) {
    store_1.default.commit('syncGraphWithNode', treeId);
    // PubSub.publish('syncGraphWithNode', treeId)
}
function loadObject(treeObj, self) {
    Object.keys(treeObj).forEach(function (key) { return self[key] = treeObj[key]; });
}
var blankProficiencyStats = {
    UNKNOWN: 0,
    ONE: 0,
    TWO: 0,
    THREE: 0,
    FOUR: 0,
};
var unknownProficiencyStats = {
    UNKNOWN: 1,
    ONE: 0,
    TWO: 0,
    THREE: 0,
    FOUR: 0,
};
// interface ITree {
//
// }
var Tree = /** @class */ (function () {
    function Tree(contentId, contentType, parentId, parentDegree, x, y) {
        this.leaves = [];
        var treeObj;
        if (arguments[0] && typeof arguments[0] === 'object') {
            treeObj = arguments[0];
            this._loadExistingTreeFromDB(treeObj);
            return;
        }
        this.contentId = contentId;
        this.contentType = contentType;
        this.parentId = parentId;
        this.children = {};
        this.mutations = [];
        this.userProficiencyStatsMap = {};
        this.userAggregationTimerMap = {};
        this.userNumOverdueMap = {};
        this.proficiencyStats = this.userProficiencyStatsMap
            && this.userProficiencyStatsMap[user_1.user.getId()] || unknownProficiencyStats;
        this.aggregationTimer = this.userAggregationTimerMap && this.userAggregationTimerMap[user_1.user.getId()] || 0;
        this.userNumOverdueMap = this.userNumOverdueMap && this.userNumOverdueMap[user_1.user.getId()] || 0;
        this.x = x;
        this.y = y;
        treeObj = { contentType: this.contentType, contentId: this.contentId, parentId: parentId, children: this.children };
        this.id = md5_1.default(JSON.stringify(treeObj));
        if (typeof arguments[0] === 'object') {
            /*
         TODO: use a boolean to determine if the tree already exists.
         or use Trees.get() and Trees.create() separate methods,
          so we aren't getting confused by the same constructor
        */
            return;
        }
        var updates = {
            id: this.id,
            contentId: contentId,
            contentType: contentType,
            parentId: parentId,
            x: x,
            y: y,
        };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
    }
    Tree.prototype._loadExistingTreeFromDB = function (treeObj) {
        loadObject(treeObj, this);
        this.proficiencyStats = this.userProficiencyStatsMap
            && this.userProficiencyStatsMap[user_1.user.getId()] || unknownProficiencyStats;
        this.aggregationTimer = this.userAggregationTimerMap && this.userAggregationTimerMap[user_1.user.getId()] || 0;
        this.numOverdue = this.userNumOverdueMap && this.userNumOverdueMap[user_1.user.getId()] || 0;
    };
    Tree.prototype.getChildIds = function () {
        if (!this.children) {
            return [];
        }
        return Object.keys(this.children).filter(function (childKey) {
            return childKey;
        });
    };
    Tree.prototype.getChildTreePromises = function () {
        return this.getChildIds().map(trees_js_1.Trees.get); // childId => {
    };
    Tree.prototype.getChildTrees = function () {
        var _this = this;
        return Promise.all(this.getChildTreePromises().map(function (childPromise) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, childPromise];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }));
    };
    /**
     * Add a child tree to this tree
     * @param treeId
     */
    Tree.prototype.addChild = function (treeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._addChildLocal(treeId);
                this._addChildDB();
                this.recalculateProficiencyAggregation();
                this.calculateAggregationTimer();
                this.calculateNumOverdueAggregation();
                this.updatePrimaryParentTreeContentURI();
                return [2 /*return*/];
            });
        });
    };
    Tree.prototype._addChildLocal = function (treeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.children = this.children || {};
                this.children[treeId] = true;
                return [2 /*return*/];
            });
        });
    };
    Tree.prototype._addChildDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var updates, lookupKey, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = {
                            children: this.children,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        lookupKey = 'trees/' + this.id;
                        return [4 /*yield*/, firebaseService_js_1.default.database().ref(lookupKey).update(updates)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        log_1.error(' error for addChild firebase call', err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tree.prototype.removeAndDisconnectFromParent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var me, parentTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        me = this;
                        return [4 /*yield*/, trees_js_1.Trees.get(this.parentId)];
                    case 1:
                        parentTree = _a.sent();
                        parentTree.removeChild(me.id);
                        this.remove();
                        return [2 /*return*/];
                }
            });
        });
    };
    Tree.prototype.remove = function () {
        var _this = this;
        log_1.log(this.id, 'remove called!');
        var me = this;
        contentItems_1.default.remove(this.contentId);
        trees_js_1.Trees.remove(this.id);
        log_1.log(this.id, 'remove about to be called for', JSON.stringify(this.children));
        var removeChildPromises = this.children ?
            Object.keys(this.children)
                .map(trees_js_1.Trees.get)
                .map(function (childPromise) { return __awaiter(_this, void 0, void 0, function () {
                var child;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, childPromise];
                        case 1:
                            child = _a.sent();
                            log_1.log(this.id, 'child just received is ', child, child.id);
                            child.remove();
                            return [2 /*return*/];
                    }
                });
            }); })
            : [];
        return Promise.all(removeChildPromises);
    };
    Tree.prototype.removeChild = function (childId) {
        if (!this.children || !this.children[childId]) {
            return;
        }
        delete this.children[childId];
        var updates = { children: this.children };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
    };
    Tree.prototype.changeParent = function (newParentId) {
        this.parentId = newParentId;
        var updates = { parentId: newParentId };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
        this.updatePrimaryParentTreeContentURI();
        this.recalculateProficiencyAggregation();
        this.calculateAggregationTimer();
    };
    // async sync
    Tree.prototype.updatePrimaryParentTreeContentURI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, parentTree, contentItem, parentTreeContentItem, childUpdatePromises;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([trees_js_1.Trees.get(this.parentId), contentItems_1.default.get(this.contentId)])];
                    case 1:
                        _a = _b.sent(), parentTree = _a[0], contentItem = _a[1];
                        return [4 /*yield*/, contentItems_1.default.get(parentTree.contentId)
                            // return ContentItems.get(parentTree.contentId).then(parentTreeContentItem => {
                        ];
                    case 2:
                        parentTreeContentItem = _b.sent();
                        // return ContentItems.get(parentTree.contentId).then(parentTreeContentItem => {
                        contentItem.set('primaryParentTreeContentURI', parentTreeContentItem.uri);
                        contentItem.calculateURIBasedOnParentTreeContentURI();
                        childUpdatePromises = this.children ? Object.keys(this.children).map(function (childId) { return __awaiter(_this, void 0, void 0, function () {
                            var childTree;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trees_js_1.Trees.get(childId)];
                                    case 1:
                                        childTree = _a.sent();
                                        return [2 /*return*/, childTree.updatePrimaryParentTreeContentURI()];
                                }
                            });
                        }); }) : [];
                        return [2 /*return*/, Promise.all(childUpdatePromises)];
                }
            });
        });
    };
    Tree.prototype.clearChildrenInteractions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.log(this.id, 'clearChildrenInteractions called');
                        return [4 /*yield*/, this.isLeaf()];
                    case 1:
                        // const isLeaf = await this.isLeaf()
                        if (_a.sent()) {
                            log_1.log(this.id, 'clearChildrenInteractions THIS IS LEAF');
                            user_1.user.addMutation('clearInteractions', { timestamp: Date.now(), contentId: this.contentId });
                        }
                        else {
                            this.getChildTreePromises()
                                .map(function (treePromise) { return __awaiter(_this, void 0, void 0, function () {
                                var tree;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, treePromise];
                                        case 1:
                                            tree = _a.sent();
                                            tree.clearChildrenInteractions();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Tree.prototype.setProficiencyStats = function (proficiencyStats, addChangeToDB) {
        this.proficiencyStats = proficiencyStats;
        this.userProficiencyStatsMap = this.userProficiencyStatsMap || {};
        this.userProficiencyStatsMap[user_1.user.getId()] = this.proficiencyStats;
        if (!addChangeToDB) {
            return;
        }
        var updates = {
            userProficiencyStatsMap: this.userProficiencyStatsMap,
        };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
    };
    Tree.prototype.setAggregationTimer = function (timer, addChangeToDB) {
        this.aggregationTimer = timer;
        this.userAggregationTimerMap = this.userAggregationTimerMap || {};
        this.userAggregationTimerMap[user_1.user.getId()] = this.aggregationTimer;
        if (!addChangeToDB) {
            return;
        }
        var updates = {
            userAggregationTimerMap: this.userAggregationTimerMap,
        };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
    };
    Tree.prototype.setNumOverdue = function (numOverdue, addChangeToDB) {
        this.numOverdue = numOverdue;
        this.userNumOverdueMap = this.userNumOverdueMap || {};
        this.userNumOverdueMap[user_1.user.getId()] = this.numOverdue;
        if (!addChangeToDB) {
            return;
        }
        var updates = {
            userNumOverdueMap: this.userNumOverdueMap,
        };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
    };
    /**
     * Change the content of a given node ("Tree")
     * Available content types currently header and fact
     */
    Tree.prototype.changeContent = function (contentId, contentType) {
        this.contentId = contentId;
        this.contentType = contentType;
        var updates = {
            contentId: contentId,
            contentType: contentType,
        };
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
    };
    /**
     * Used to update tree X and Y coordinates
     * @param prop
     * @param val
     */
    Tree.prototype.set = function (prop, val) {
        if (this[prop] === val) {
            return;
        }
        var updates = {};
        updates[prop] = val;
        // this.treeRef.update(updates)
        var lookupKey = 'trees/' + this.id;
        firebaseService_js_1.default.database().ref(lookupKey).update(updates);
        this[prop] = val;
    };
    Tree.prototype.setLocal = function (prop, val) {
        this[prop] = val;
    };
    Tree.prototype.addToX = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? { recursion: false, deltaX: 0 } : _a, recursion = _b.recursion, deltaX = _b.deltaX;
        var newX = this.x + deltaX;
        this.set('x', newX);
        syncGraphWithNode(this.id);
        if (!recursion) {
            return;
        }
        this.getChildIds().forEach(function (childId) { return __awaiter(_this, void 0, void 0, function () {
            var child;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trees_js_1.Trees.get(childId)];
                    case 1:
                        child = _a.sent();
                        child.addToX({ recursion: true, deltaX: deltaX });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Tree.prototype.addToY = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? { recursion: false, deltaY: 0 } : _a, recursion = _b.recursion, deltaY = _b.deltaY;
        var newY = this.y + deltaY;
        this.set('y', newY);
        syncGraphWithNode(this.id);
        if (!recursion) {
            return;
        }
        this.getChildIds().forEach(function (childId) { return __awaiter(_this, void 0, void 0, function () {
            var child;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trees_js_1.Trees.get(childId)];
                    case 1:
                        child = _a.sent();
                        child.addToY({ recursion: true, deltaY: deltaY });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Tree.prototype.isLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentItems_1.default.get(this.contentId)];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, content.isLeafType()];
                }
            });
        });
    };
    Tree.prototype.calculateProficiencyAggregationForLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proficiencyStats, contentItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proficiencyStats = __assign({}, blankProficiencyStats);
                        return [4 /*yield*/, contentItems_1.default.get(this.contentId)];
                    case 1:
                        contentItem = _a.sent();
                        proficiencyStats = proficiencyStats_1.incrementProficiencyStatsCategory(proficiencyStats, contentItem.proficiency);
                        return [2 /*return*/, proficiencyStats];
                }
            });
        });
    };
    Tree.prototype.calculateProficiencyAggregationForNotLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var proficiencyStats, children;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proficiencyStats = __assign({}, blankProficiencyStats);
                        if (!this.children || !Object.keys(this.children).length) {
                            return [2 /*return*/, proficiencyStats];
                        }
                        return [4 /*yield*/, Promise.all(Object.keys(this.children)
                                .map(trees_js_1.Trees.get)
                                .map(function (childPromise) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, childPromise];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 1:
                        children = _a.sent();
                        children.forEach(function (child) {
                            proficiencyStats = proficiencyStats_1.addObjToProficiencyStats(proficiencyStats, child.proficiencyStats);
                        });
                        return [2 /*return*/, proficiencyStats];
                }
            });
        });
    };
    Tree.prototype.recalculateProficiencyAggregation = function (addChangeToDB) {
        if (addChangeToDB === void 0) { addChangeToDB = false; }
        return __awaiter(this, void 0, void 0, function () {
            var proficiencyStats, isLeaf, parent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isLeaf()];
                    case 1:
                        isLeaf = _a.sent();
                        if (!isLeaf) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.calculateProficiencyAggregationForLeaf()];
                    case 2:
                        proficiencyStats = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.calculateProficiencyAggregationForNotLeaf()];
                    case 4:
                        proficiencyStats = _a.sent();
                        _a.label = 5;
                    case 5:
                        this.setProficiencyStats(proficiencyStats, addChangeToDB);
                        store_1.default.commit('syncGraphWithNode', this.id);
                        // PubSub.publish('syncGraphWithNode', this.id)
                        if (!this.parentId) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, trees_js_1.Trees.get(this.parentId)];
                    case 6:
                        parent = _a.sent();
                        return [2 /*return*/, parent.recalculateProficiencyAggregation(addChangeToDB)];
                }
            });
        });
    };
    Tree.prototype.calculateAggregationTimerForLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentItems_1.default.get(this.contentId)];
                    case 1:
                        contentItem = _a.sent();
                        return [2 /*return*/, contentItem.timer];
                }
            });
        });
    };
    Tree.prototype.calculateAggregationTimerForNotLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var me, timer, children;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        me = this;
                        timer = 0;
                        if (!this.children || !Object.keys(this.children).length) {
                            return [2 /*return*/, timer];
                        }
                        return [4 /*yield*/, Promise.all(Object.keys(this.children)
                                .map(trees_js_1.Trees.get)
                                .map(function (childPromise) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, childPromise];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 1:
                        children = _a.sent();
                        children.forEach(function (child) {
                            timer += +child.aggregationTimer;
                        });
                        return [2 /*return*/, timer];
                }
            });
        });
    };
    Tree.prototype.calculateAggregationTimer = function (addChangeToDB) {
        if (addChangeToDB === void 0) { addChangeToDB = false; }
        return __awaiter(this, void 0, void 0, function () {
            var timer, isLeaf, parent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isLeaf()];
                    case 1:
                        isLeaf = _a.sent();
                        if (!isLeaf) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.calculateAggregationTimerForLeaf()];
                    case 2:
                        timer = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.calculateAggregationTimerForNotLeaf()];
                    case 4:
                        timer = _a.sent();
                        _a.label = 5;
                    case 5:
                        this.setAggregationTimer(timer, addChangeToDB);
                        if (!this.parentId) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, trees_js_1.Trees.get(this.parentId)];
                    case 6:
                        parent = _a.sent();
                        return [2 /*return*/, parent.calculateAggregationTimer()];
                }
            });
        });
    };
    Tree.prototype.calculateNumOverdueAggregationLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentItem, overdue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentItems_1.default.get(this.contentId)];
                    case 1:
                        contentItem = _a.sent();
                        overdue = contentItem.overdue ? 1 : 0;
                        return [2 /*return*/, overdue];
                }
            });
        });
    };
    Tree.prototype.calculateNumOverdueAggregationNotLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var children, numOverdue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getChildTrees()]; // await Promise.all(
                    case 1:
                        children = _a.sent() // await Promise.all(
                        ;
                        numOverdue = children.reduce(function (sum, child) { return sum + (+child.numOverdue || 0); }, 0);
                        return [2 /*return*/, numOverdue
                            // TODO start storing numOverdue in db - the way we do with the other aggregations
                        ];
                }
            });
        });
    };
    Tree.prototype.calculateNumOverdueAggregation = function (addChangeToDB) {
        if (addChangeToDB === void 0) { addChangeToDB = false; }
        return __awaiter(this, void 0, void 0, function () {
            var numOverdue, isLeaf, err_2, parent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isLeaf()];
                    case 1:
                        isLeaf = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!isLeaf) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.calculateNumOverdueAggregationLeaf()];
                    case 3:
                        numOverdue = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.calculateNumOverdueAggregationNotLeaf()];
                    case 5:
                        numOverdue = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_2 = _a.sent();
                        log_1.error('calcNumOverdue promise err is', err_2);
                        return [3 /*break*/, 8];
                    case 8:
                        this.setNumOverdue(numOverdue, addChangeToDB);
                        if (!this.parentId) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, trees_js_1.Trees.get(this.parentId)];
                    case 9:
                        parent = _a.sent();
                        return [2 /*return*/, parent.calculateNumOverdueAggregation(addChangeToDB)];
                }
            });
        });
    };
    // returns a list of contentItems that are all on leaf nodes
    Tree.prototype.getLeaves = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.leaves.length) return [3 /*break*/, 2];
                        // log(this.id, " 2: getLeaves. this.leaves has no length, this.leaves is ", this.leaves)
                        return [4 /*yield*/, this.recalculateLeaves()];
                    case 1:
                        // log(this.id, " 2: getLeaves. this.leaves has no length, this.leaves is ", this.leaves)
                        _a.sent();
                        _a.label = 2;
                    case 2: 
                    // log(this.id, " 3: getLeaves. this.leaves after recalculateLeaves is", this.leaves)
                    return [2 /*return*/, this.leaves];
                }
            });
        });
    };
    Tree.prototype.recalculateLeavesLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var leaves, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        leaves = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!this.contentId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getContentItem()];
                    case 2:
                        leaves = [_a.sent()];
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        log_1.error(err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, leaves];
                }
            });
        });
    };
    Tree.prototype.recalculateLeavesNotLeaf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var leaves;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        leaves = [];
                        return [4 /*yield*/, Promise.all(this.getChildIds().map(function (childId) { return __awaiter(_this, void 0, void 0, function () {
                                var child, _a, _b, _c, err_4;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 3, , 4]);
                                            return [4 /*yield*/, trees_js_1.Trees.get(childId)];
                                        case 1:
                                            child = _d.sent();
                                            _b = (_a = leaves.push).apply;
                                            _c = [leaves];
                                            return [4 /*yield*/, child.getLeaves()];
                                        case 2:
                                            _b.apply(_a, _c.concat([_d.sent()]));
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_4 = _d.sent();
                                            log_1.error(err_4);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, leaves];
                }
            });
        });
    };
    /* TODO: FIX: this can get called multiple times
     simultaneously if like
    three children simultaneously call parent.recalculateLeaves()
    */
    Tree.prototype.recalculateLeaves = function () {
        return __awaiter(this, void 0, void 0, function () {
            var leaves, isLeaf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        leaves = [];
                        return [4 /*yield*/, this.isLeaf()];
                    case 1:
                        isLeaf = _a.sent();
                        if (!isLeaf) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.recalculateLeavesLeaf()];
                    case 2:
                        leaves = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.recalculateLeavesNotLeaf()];
                    case 4:
                        leaves = _a.sent();
                        _a.label = 5;
                    case 5:
                        this.leaves = leaves;
                        return [2 /*return*/];
                }
            });
        });
    };
    Tree.prototype.sortLeavesByStudiedAndStrength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var leaves, studiedLeaves, overdueLeaves, notOverdueLeaves, notStudiedLeaves, parent_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLeaves()];
                    case 1:
                        leaves = _a.sent();
                        studiedLeaves = leaves
                            .filter(function (leaf) { return leaf.hasInteractions; })
                            .sort(function (a, b) {
                            // lowest decibels first
                            return a.lastRecordedStrength.value > b.lastRecordedStrength.value ? 1
                                : a.lastRecordedStrength.value < b.lastRecordedStrength.value ? -1 : 0;
                        });
                        overdueLeaves = studiedLeaves.filter(function (leaf) { return leaf.overdue; });
                        notOverdueLeaves = studiedLeaves.filter(function (leaf) { return !leaf.overdue; });
                        notStudiedLeaves = this.leaves.filter(function (leaf) { return !leaf.hasInteractions; });
                        this.leaves = overdueLeaves.concat(notStudiedLeaves, notOverdueLeaves);
                        this.leaves = removeDuplicatesById(this.leaves);
                        // log(this.id, " sortLeavesByStudiedAndStrength, this sortedLeaves are", this.sortedLeaves)
                        this.leaves.forEach(function (leaf) {
                            // log(this.id, " has a leaf ", leaf.id, " with strength of ", leaf.lastRecordedStrength.value)
                        });
                        if (!this.parentId) return [3 /*break*/, 3];
                        return [4 /*yield*/, trees_js_1.Trees.get(this.parentId)];
                    case 2:
                        parent_1 = _a.sent();
                        parent_1.sortLeavesByStudiedAndStrength();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tree.prototype.getContentItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contentItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contentId) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, contentItems_1.default.get(this.contentId)];
                    case 1:
                        contentItem = _a.sent();
                        return [2 /*return*/, contentItem];
                }
            });
        });
    };
    Tree.prototype.areItemsToStudy = function () {
        return this.leaves.length;
    };
    /*should only be called after sorted*/
    Tree.prototype.areNewOrOverdueItems = function () {
        if (!this.areItemsToStudy()) {
            return false;
        }
        var firstItem = this.leaves[0];
        return firstItem.isNew() || firstItem.overdue;
    };
    Tree.prototype.getNextItemIdToStudy = function () {
        return this.leaves[0].id;
    };
    Tree.prototype.setActive = function () {
        this.active = true;
        this.syncGraphWithNode();
    };
    Tree.prototype.setInactive = function () {
        this.active = false;
        this.syncGraphWithNode();
    };
    Tree.prototype.syncGraphWithNode = function () {
        syncGraphWithNode(this.id);
    };
    Tree.prototype.addMutation = function (mutation) {
        return;
    };
    Tree.prototype._isMutationRedundant = function (mutation) {
        switch (mutation.type) {
            case IMutable_1.TreeMutationTypes.ADD_CHILD: {
                var leafId = mutation.data.leafId;
                var leafAlreadyExists = this.children[leafId];
                return leafAlreadyExists;
            }
            case IMutable_1.TreeMutationTypes.REMOVE_CHILD: {
                var leafId = mutation.data.leafId;
                var leafExists = this.children[leafId];
                return !leafExists;
            }
        }
    };
    Tree.prototype.subscribeToMutations = function () {
        return;
    };
    return Tree;
}());
exports.Tree = Tree;
// TODO: get typeScript so we can have a schema for treeObj
// treeObj  example
/*
 parentId: parentTreeId,
 factId: fact.id,
 x: parseInt(currentNewChildTree.x),
 y: parseInt(currentNewChildTree.y),
 children: {},
 label: fact.question + ' ' + fact.answer,
 size: 1,
 color: Globals.existingColor,
 type: 'tree'
 */
// invoke like a constructor - new Tree(parentId, factId)
function removeDuplicatesById(list) {
    var newList = [];
    var usedIds = [];
    list.forEach(function (item) {
        if (usedIds.indexOf(item.id) > -1) {
            return;
        }
        newList.push(item);
        usedIds.push(item.id);
    });
    return newList;
}
