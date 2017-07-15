define(['exports', './trees.js', './tree.js', './facts.js', './globals.js', './redux.js'], function (exports, _treesJs, _treeJs, _factsJs, _globalsJs, _reduxJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.addTreeToGraph = addTreeToGraph;

    var initialized = false;
    var s,
        g = {
        nodes: [],
        edges: []
    };
    window.g = g;
    window.s = s;

    var newNodeXOffset = -100,
        newNodeYOffset = 100,
        newChildTreeSuffix = "__newChildTree";

    var numTreesLoaded = 0;
    loadTreeAndSubTrees(1).then(function (val) {
        console.log('loadTree has allegedly resolved. resolve val is ' + val);initSigma();
    } /*.then(initSigma)*/);
    // Instantiate sigma:
    function createTreeNodeFromTreeAndFact(tree, fact) {
        var node = {
            id: tree.id,
            parentId: tree.parentId,
            x: tree.x,
            y: tree.y,
            children: tree.children,
            label: fact.question + "  " + fact.answer,
            size: 1,
            color: _globalsJs.Globals.existingColor,
            type: 'tree'
        };
        return node;
    }
    function connectTreeToParent(tree, g) {
        console.log('Connect tree ' + tree.id + ' to parent ' + tree.parentId + ' called');
        if (tree.parentId) {
            console.log('Connect tree to parent called - tree has parentId');
            var edge = {
                id: tree.parentId + "__" + tree.id,
                source: tree.parentId,
                target: tree.id,
                size: 1,
                color: _globalsJs.Globals.existingColor
            };
            console.log('L55:TREESGRAPH.JS Edge before push is', edge);
            g.edges.push(edge);
        }
    }
    function onGetFact(tree, fact) {
        var node = createTreeNodeFromTreeAndFact(tree, fact);
        g.nodes.push(node);
        addShadowNodeToTree(node);
        tree.parentId && connectTreeToParent(tree, g);
        return fact.id;
    }
    function onGetTree(tree) {
        var factsPromise = _factsJs.Facts.get(tree.factId).then(function (fact) {
            return onGetFact(tree, fact);
        }).then(function (factId) {
            console.log('onGetTree fact id is', factId);return factId;
        })['catch'](function (err) {
            return console.log('facts get err for treeid of  ' + tree.id + ' with factid of ' + tree.factId + ' is ', err);
        });

        var childTreesPromises = tree.children ? tree.children.map(loadTreeAndSubTrees) : [];
        var promises = childTreesPromises;
        promises.push(factsPromise);

        return Promise.all(promises).then(function (resultsArray) {
            console.log('promise results array is', resultsArray);
            var factIdPrettyString = resultsArray.shift();
            var treeIdsPrettyStrings = resultsArray.join(', ');
            console.log('tree with id', tree.id, ' and children of', tree.children, ' has finished loading');
            var treePrettyString = "( " + factIdPrettyString + " : [ " + treeIdsPrettyStrings + " ] )";
            console.log('its pretty string is', treePrettyString);
            return treePrettyString;
        }); //promise should only resolve when the tree's fact and all the subtrees are loaded
    }
    //returns a promise whose resolved value will be a stringified representation of the tree's fact and subtrees
    function loadTreeAndSubTrees(treeId) {
        //todo: load nodes concurrently, without waiting to connect the nodes or add the fact's informations/labels to the nodes
        numTreesLoaded++;
        return _treesJs.Trees.get(treeId).then(onGetTree)['catch'](function (err) {
            return console.log('trees get err is', err);
        });
    }

    function addShadowNodeToTree(tree) {
        if (tree.children) {}
        var shadowNode = {
            id: tree.id + newChildTreeSuffix, //"_newChildTree",
            parentId: tree.id,
            x: parseInt(tree.x) + newNodeXOffset,
            y: parseInt(tree.y) + newNodeYOffset,
            label: 'Create a new Fact',
            size: 1,
            color: _globalsJs.Globals.newColor,
            type: 'newChildTree'
        };
        var shadowEdge = {
            id: tree.id + "__" + shadowNode.id,
            source: tree.id,
            target: shadowNode.id,
            size: 1,
            color: _globalsJs.Globals.newColor
        };
        if (!initialized) {
            g.nodes.push(shadowNode);
            g.edges.push(shadowEdge);
        } else {
            s.graph.addNode(shadowNode);
            s.graph.addEdge(shadowEdge);
        }
        if (initialized) {
            s.refresh();
        }
    }
    function calculateNewChildNodeCoordinates(treeId) {
        return _treesJs.Trees.get(treeId).then(function (tree) {});
    }
    function initSigma() {
        if (!initialized) {
            sigma.renderers.def = sigma.renderers.canvas;
            s = new sigma({
                graph: g,
                container: 'graph-container'
            });
            window.s = s;
            var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
            s.refresh();

            s.bind('clickNode', clickNode);
            s.bind('outNode', updateTreePosition);
            initialized = true;
        }
    }
    window.initSigma = initSigma;
    function updateTreePosition(e) {
        var x = e.data.node.x;
        var y = e.data.node.y;
        var treeId = e.data.node.id;
        _treesJs.Trees.get(treeId).then(function (tree) {
            if (Math.abs(tree.x - x) > 20) {
                tree.set('x', x);
            }
            if (Math.abs(tree.y - y) > 20) {
                tree.set('y', y);
            }
        });
    }
    function logEvent(e) {
        var x = e.data.node.x;
        var y = e.data.node.y;
        var treeId = e.data.node.id;
        _treesJs.Trees.get(treeId).then(function (tree) {
            if (Math.abs(tree.x - x) > 20) {
                tree.set('x', x);
            }
            if (Math.abs(tree.y - y) > 20) {
                tree.set('y', y);
            }
        });
        console.log(e.data.node.id, e.data.node.x, e.data.node.y);
    }
    function clickNode(e) {
        // console.log(e.type,e, e.data.node, e.data.node.label, e.data.captor);
        var parentId = e.data.node.parentId;
        if (e.data.node.type == 'tree') {}
        // let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
        document.querySelector("#parentTreeId").value = parentId;
        _globalsJs.Globals.currentTreeSelected = parentId;
    }
    function dragNode(e) {
        console.log('drag Node', e, e.type, e.data.node, e.data.node.label, e.data.captor);
        var parentId = e.data.node.parentId;
        if (e.data.node.type == 'tree') {}
        // let parentTreeId = e.data.node.id.substring(0,e.data.node.id.indexOf("_"));
    }

    //returns sigma tree node

    function addTreeToGraph(parentTreeId, fact) {
        //1. delete current addNewNode button
        var currentNewChildTree = s.graph.nodes(parentTreeId + newChildTreeSuffix);
        var newChildTreeX = currentNewChildTree.x;
        var newChildTreeY = currentNewChildTree.y;
        var tree = new _treeJs.Tree(fact.id, parentTreeId);
        //2. add new node to parent tree
        var newTree = {
            id: tree.id,
            parentId: parentTreeId,
            x: parseInt(currentNewChildTree.x),
            y: parseInt(currentNewChildTree.y),
            children: tree.children,
            label: fact.question + ' ' + fact.answer,
            size: 1,
            color: _globalsJs.Globals.existingColor,
            type: 'tree'
        };

        s.graph.dropNode(currentNewChildTree.id);
        s.graph.addNode(newTree);
        //3. add edge between new node and parent tree
        var newEdge = {
            id: parentTreeId + "__" + newTree.id,
            source: parentTreeId,
            target: newTree.id,
            size: 1,
            color: _globalsJs.Globals.existingColor
        };
        s.graph.addEdge(newEdge);
        //4. add shadow node
        addShadowNodeToTree(newTree);
        //5. Re add shadow node to parent
        _treesJs.Trees.get(parentTreeId).then(addShadowNodeToTree);

        s.refresh();
        return newTree;
    }
});