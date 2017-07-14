define(['exports', 'md5', './firebaseService.js', './config.js'], function (exports, _md5, _firebaseServiceJs, _configJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    exports.Tree = Tree;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _md52 = _interopRequireDefault(_md5);

    var _getFirebase = _interopRequireDefault(_firebaseServiceJs);

    var firebase = (0, _getFirebase['default'])();
    var treesRef = firebase.database().ref('trees');
    var trees = {};

    var OfflineTree = function OfflineTree(factId, parentId) {
        _classCallCheck(this, OfflineTree);

        this.factId = factId;
        this.parentId = parentId;
        this.children = [];
        this.id = (0, _md52['default'])(JSON.stringify({ factId: factId, parentId: parentId, children: this.children })); // id mechanism for trees may very well change
    };

    var OnlineTree = (function () {
        function OnlineTree(factId, parentId) {
            _classCallCheck(this, OnlineTree);

            this.factId = factId;
            this.parentId = parentId;
            this.children = [];

            var treeObj = { factId: factId, parentId: parentId, children: this.children };
            this.id = (0, _md52['default'])(JSON.stringify(treeObj));
            this.treeRef = treesRef.push({
                id: this.id,
                factId: factId,
                parentId: parentId,
                children: this.children
            });
        }

        //invoke like a constructor - new Tree(parentId, factId)

        _createClass(OnlineTree, [{
            key: 'addChild',
            value: function addChild(treeId) {
                this.treeRef.child('children').push(treeId);
            }
        }, {
            key: 'removeChild',
            value: function removeChild(treeId) {}
        }, {
            key: 'changeParent',
            value: function changeParent(newParentId) {
                this.treeRef.update({
                    parentId: newParentId
                });
            }
        }]);

        return OnlineTree;
    })();

    function Tree() {
        return _configJs.Config.offlineMode ? new OfflineTree(arguments) : new OnlineTree(arguments);
    }

    /*
    facts can have dependencies
    
    trees can have dependencies
    
    trees can have children
    
    */
});