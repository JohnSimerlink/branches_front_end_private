define(['exports', './facts.js', './tree.js', './config.js', './firebaseService.js'], function (exports, _factsJs, _treeJs, _configJs, _firebaseServiceJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _getFirebase = _interopRequireDefault(_firebaseServiceJs);

    var firebase = (0, _getFirebase['default'])();
    console.log('trees.js imported');
    var trees = {};
    var offlineTreesData = {
        //LAST UPDATED 6/28 9am
        "1": {
            "factId": "24",
            "id": "1",
            "treeId": "1",
            "x": "0",
            "y": "0",
            "children": ["075d07593a01ae43d7e045e7effadfb2", "35d917de5c0bd13a49d6e86bb7c540c1"]
        },
        "075d07593a01ae43d7e045e7effadfb2": {
            "factId": "c8d26306d29ff13f0c1010ee0467d47a",
            "id": "075d07593a01ae43d7e045e7effadfb2",
            "parentId": "1",
            "treeId": "075d07593a01ae43d7e045e7effadfb2",
            "x": "300",
            "y": "300"
        },
        "35d917de5c0bd13a49d6e86bb7c540c1": // the more you learn the more you earn
        {
            "factId": "bc62641cfd029c281b8ce6135d8991e0",
            "id": "35d917de5c0bd13a49d6e86bb7c540c1",
            "parentId": "1",
            "treeId": "35d917de5c0bd13a49d6e86bb7c540c1",
            "x": "500",
            "y": "400"
        }
    };

    //
    // Facts.getAll((facts) => {
    //    var i = 0;
    //    Object.keys(facts).forEach((factId) => {
    //        const tree = new Tree(factId, null)
    //        tree.x = 100 * i;
    //        tree.y = 100 * i;
    //        trees[tree.id] = tree;
    //        i++;
    //    })
    // })

    var Trees = (function () {
        function Trees() {
            _classCallCheck(this, Trees);
        }

        _createClass(Trees, null, [{
            key: 'getAll',
            value: function getAll(success) {
                if (_configJs.Config.offlineMode) {
                    success(trees);
                }
            }

            // static get(treeId, success){
            //     let tree;
            //     if (Config.offlineMode){
            //         tree = offlineTreesData[treeId]
            //         success(tree)
            //     } else {
            //        firebase.database().ref('trees/' + treeId).on("value", function(snapshot){
            //            tree = snapshot.val()
            //            success(tree)
            //        })
            //     }
            // }
            //returns promise
            //TODO: make resolve "null" or something if fact not found
        }, {
            key: 'get',
            value: function get(treeId) {
                return new Promise(function (resolve, reject) {
                    var tree = undefined;
                    if (_configJs.Config.offlineMode) {
                        tree = offlineTreesData[treeId];
                        resolve(tree);
                    } else {
                        firebase.database().ref('trees/' + treeId).on("value", function (snapshot) {
                            tree = snapshot.val();
                            resolve(tree);
                        });
                    }
                });
            }
        }]);

        return Trees;
    })();

    exports.Trees = Trees;
});