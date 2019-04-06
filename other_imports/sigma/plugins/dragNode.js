import sigma from '../sigma.core'

/**
 * This plugin provides a method to drag & drop nodes. Check the
 * sigma.plugins.dragNodes function doc or the examples/basic.html &
 * examples/api-candy.html code samples to know more.
 */
sigma.utils.pkg('sigma.plugins');
sigma.plugins = sigma.plugins || {}


/**
 * This function will add `mousedown`, `mouseup` & `mousemove` events to the
 * nodes in the `overNode`event to perform drag & drop operations. It uses
 * `linear interpolation` [http://en.wikipedia.org/wiki/Linear_interpolation]
 * and `rotation matrix` [http://en.wikipedia.org/wiki/Rotation_matrix] to
 * calculate the X and Y coordinates from the `cam` or `renderer` node
 * attributes. These attributes represent the coordinates of the nodes in
 * the real container, not in canvas.
 *
 * Fired events:
 * *************
 * startdrag  Fired at the beginning of the drag.
 * drag       Fired while the node is dragged.
 * drop       Fired at the end of the drag if the node has been dragged.
 * dragend    Fired at the end of the drag.
 *
 * Recognized parameters:
 * **********************
 * @param  {sigma}    s        The related sigma instance.
 * @param  {renderer} renderer The related renderer instance.
 */
function DragNodes(s, renderer) {
    sigma.classes.dispatcher.extend(this);

    // A quick hardcoded rule to prevent people from using this plugin with the
    // WebGL renderer (which is impossible at the moment):
    // if (
    //   sigma.renderers.webgl &&
    //   renderer instanceof sigma.renderers.webgl
    // )
    //   throw new Error(
    //     'The sigma.plugins.dragNodes is not compatible with the WebGL renderer'
    //   );

    // Init variables:
    var _self = this,
        _s = s,
        _body = document.body,
        _renderer = renderer,
        _mouse = renderer.container.lastChild,
        _camera = renderer.camera,
        _node = null,
        _prefix = '',
        _hoverStack = [],
        _hoverIndex = {},
        _isMouseDown = false,
        _isMouseOverCanvas = false,
        _drag = false,
        _wasJustBeingDragged = false,
        _wasJustBeingDraggedTimeout = null;

    // if (renderer instanceof sigma.renderers.svg) {
    //     _mouse = renderer.container.firstChild;
    // }

    // It removes the initial substring ('read_') if it's a WegGL renderer.
    // if (renderer instanceof sigma.renderers.webgl) {
    //     _prefix = renderer.options.prefix.substr(5);
    // } else {
    //     _prefix = renderer.options.prefix;
    // }

    renderer.bind('overNode', nodeMouseOver);
    renderer.bind('outNode', treatOutNode);
    renderer.bind('click', click);

    _s.bind('kill', function () {
        _self.unbindAll();
    });

    /**
     * Unbind all event listeners.
     */
    this.unbindAll = function () {

        _mouse.removeEventListener('mousedown', nodeMouseDown);
        _body.removeEventListener('mousemove', nodeMouseMove);
        _body.removeEventListener('mouseup', nodeMouseUp);
        _renderer.unbind('overNode', nodeMouseOver);
        _renderer.unbind('outNode', treatOutNode);
    }

    // Calculates the global offset of the given element more accurately than
    // element.offsetTop and element.offsetLeft.
    function calculateOffset(element) {
        var style = window.getComputedStyle(element);
        var getCssProperty = function (prop) {
            return parseInt(style.getPropertyValue(prop).replace('px', '')) || 0;
        };
        return {
            left: element.getBoundingClientRect().left + getCssProperty('padding-left'),
            top: element.getBoundingClientRect().top + getCssProperty('padding-top')
        };
    };

    function click(event) {
        //console.log("Click " + _isMouseDown);
        // event triggered at the end of the click
        _isMouseDown = false;
        _body.removeEventListener('mousemove', nodeMouseMove);
        _body.removeEventListener('mouseup', nodeMouseUp);

        if (!_hoverStack.length) {
            _node = null;
        }
    };

    function nodeMouseOver(event) {
        // Don't treat the node if it is already registered
        //console.log("nodemouseover w " + event.data.node.id);
        if (_hoverIndex[event.data.node.id]) {
            //console.log(_hoverIndex);
            //console.log("nodemouseover duplicate ");

            return;
        }

        // Add node to array of current nodes over
        _hoverStack.push(event.data.node);
        _hoverIndex[event.data.node.id] = true;

        if (_hoverStack.length && !_isMouseDown) {
            // Set the current node to be the last one in the array
            _node = _hoverStack[_hoverStack.length - 1];
            //console.log("SET NODE!");
            _mouse.addEventListener('mousedown', nodeMouseDown);
        }
    };

    function treatOutNode(event) {
        //console.log("Treat out node");
        // Remove the node from the array
        var indexCheck = _hoverStack.map(function (e) {
            return e;
        }).indexOf(event.data.node);
        if (indexCheck > -1) {
            let node = _hoverStack.splice(indexCheck, 1);
            delete _hoverIndex[event.data.node.id];
            //console.log("Node deleted from stacks");
        }

        if (_hoverStack.length && !_isMouseDown) {
            // On out, set the current node to be the next stated in array
            //console.log("outnode set node" + (_node == null));
            _node = _hoverStack[_hoverStack.length - 1];
        } else {
            _mouse.removeEventListener('mousedown', nodeMouseDown);
        }
    };

    function nodeMouseDown(event) {
        //console.log("MOUSEDOWN ", event);
        // if (_node) PubSub.publish('canvas.startDraggingNode', _node, _node.x, _node.y)
        _isMouseDown = true;
        var size = _s.graph.nodes().length;

        // when there is only node in the graph, the plugin cannot apply
        // linear interpolation. So treat it as if a user is dragging
        // the graph
        if (_node && size > 1) {
            //console.log("In mousedown w node");
            _mouse.removeEventListener('mousedown', nodeMouseDown);
            _body.addEventListener('mousemove', nodeMouseMove);
            _body.addEventListener('mouseup', nodeMouseUp);

            // Do not refresh edgequadtree during drag:
            var k,
                c;
            for (k in _s.cameras) {
                c = _s.cameras[k];
                if (c.edgequadtree !== undefined) {
                    c.edgequadtree._enabled = false;
                }
            }

            // Deactivate drag graph.
            _renderer.settings({mouseEnabled: false, enableHovering: false});
            _s.refresh();

            _self.dispatchEvent('startdrag', {
                node: _node,
                captor: event,
                renderer: _renderer
            });
        }
    };

    function nodeMouseUp(event) {
        // if (_wasJustBeingDragged) {
        //     PubSub.publish('canvas.stopDraggingNode', _node)
        // } else {
        //     PubSub.publish('canvas.nodeMouseUp', _node)
        // }
        _isMouseDown = false;
        _mouse.addEventListener('mousedown', nodeMouseDown);
        _body.removeEventListener('mousemove', nodeMouseMove);
        _body.removeEventListener('mouseup', nodeMouseUp);

        // Allow to refresh edgequadtree:
        var k,
            c;
        for (k in _s.cameras) {
            c = _s.cameras[k];
            if (c.edgequadtree !== undefined) {
                c.edgequadtree._enabled = true;
            }
        }

        // Activate drag graph.
        _renderer.settings({mouseEnabled: true, enableHovering: true});
        _s.refresh();

        if (_drag) {
            _self.dispatchEvent('drop', {
                node: _node,
                captor: event,
                renderer: _renderer
            });
        }
        // debugger
        _self.dispatchEvent('dragend', {
            node: _node,
            captor: event,
            renderer: _renderer
        });

        _drag = false;
        _node = null;
    };

    function nodeMouseMove(event) {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            clearTimeout(timeOut);
            var timeOut = setTimeout(executeNodeMouseMove, 0);
        } else {
            executeNodeMouseMove();
        }

        function executeNodeMouseMove() {
            clearTimeout(_wasJustBeingDraggedTimeout)
            // window.nodeBeingDragged = true
            // PubSub.publish('canvas.startDraggingNode', _node, _node.x, _node.y)
            var offset = calculateOffset(_renderer.container),
                x = event.clientX - offset.left,
                y = event.clientY - offset.top,
                cos = Math.cos(_camera.angle),
                sin = Math.sin(_camera.angle),
                nodes = _s.graph.nodes(),
                ref = [];

            console.log("event.clientX, event.clientY, offset.left, offset.right, x, y , cos, sin,", event.clientX, event.clientY, offset.left, offset.top, x, y, cos, sin, )

            // Getting and derotating the reference coordinates.
            for (var i = 0; i < 2; i++) {
                var n = nodes[i];
                var aux = {
                    x: n.x * cos + n.y * sin,
                    y: n.y * cos - n.x * sin,
                    renX: n[_prefix + 'x'],
                    renY: n[_prefix + 'y'],
                };
                console.log(`aux ${i} x y renX renY is `, aux.x, aux.y, aux.renX, aux.renY)
                ref.push(aux);
            }

            // Applying linear interpolation.
            // if the nodes are on top of each other, we use the camera ratio to interpolate
            if (ref[0].x === ref[1].x && ref[0].y === ref[1].y) {
                var xRatio = (ref[0].renX === 0) ? 1 : ref[0].renX;
                var yRatio = (ref[0].renY === 0) ? 1 : ref[0].renY;
                x = (ref[0].x / xRatio) * (x - ref[0].renX) + ref[0].x;
                y = (ref[0].y / yRatio) * (y - ref[0].renY) + ref[0].y;
                console.log(`if true. xRatio, yRatio, x, `, xRatio, yRatio, x, y,)
            } else {
                var xRatio = (ref[1].renX - ref[0].renX) / (ref[1].x - ref[0].x);
                var yRatio = (ref[1].renY - ref[0].renY) / (ref[1].y - ref[0].y);

                // if the coordinates are the same, we use the other ratio to interpolate
                if (ref[1].x === ref[0].x) {
                    xRatio = yRatio;
                }

                if (ref[1].y === ref[0].y) {
                    yRatio = xRatio;
                }

                x = (x - ref[0].renX) / xRatio + ref[0].x;
                y = (y - ref[0].renY) / yRatio + ref[0].y;
                console.log(`if false. xRatio, yRatio, x, `, xRatio, yRatio, x, y,)
            }

            console.log(`START node.x, node.y, x, cos, y, sin`, _node.x, _node.y)
            // Rotating the coordinates.
            _node.x = x * cos - y * sin;
            _node.y = y * cos + x * sin;
            console.log(`END node.x, node.y, x, cos, y, sin`, _node.x, _node.y, x, cos, y, sin)

            _s.refresh();

            _drag = true;
            _self.dispatchEvent('drag', {
                node: _node,
                captor: event,
                renderer: _renderer
            });
            _wasJustBeingDragged = true
            _wasJustBeingDraggedTimeout = setTimeout(() => {
                _wasJustBeingDragged = false
            }, 800)
        }
    };
};

/**
 * Interface
 * ------------------
 *
 * > var dragNodesListener = sigma.plugins.dragNodes(s, s.renderers[0]);
 */
var _instance = {};

/**
 * @param  {sigma} s The related sigma instance.
 * @param  {renderer} renderer The related renderer instance.
 */
sigma.plugins.dragNodes = function (s, renderer) {
    // Create branchesMap if undefined
    if (!_instance[s.id]) {
        _instance[s.id] = new DragNodes(s, renderer);
    }

    s.bind('kill', function () {
        sigma.plugins.killDragNodes(s);
    });

    return _instance[s.id];
};

/**
 * This method removes the event listeners and kills the dragNodes instance.
 *
 * @param  {sigma} s The related sigma instance.
 */
sigma.plugins.killDragNodes = function (s) {
    if (_instance[s.id] instanceof DragNodes) {
        _instance[s.id].unbindAll();
        delete _instance[s.id];
    }
};
