var i,
    s,
    N = 3,
    E = 2,
    g = {
        nodes: [],
        edges: []
    };

// Generate a random graph:
for (i = 0; i < N; i++){
    g.nodes.push({
        id: 'n' + i,
        label: 'Node ' + i,
        x: 100 * i,
        y: 100 * i,
        size: 10,
        color: '#666'
    });
    console.log(g.nodes)
}

// for (i = 0; i < E; i++)
// g.edges.push({
//   id: 'e' + i,
//   source: 'n' + (Math.random() * N | 0),
//   target: 'n' + (Math.random() * N | 0),
//   size: 10,
//   color: '#ccc'
// });

// Instantiate sigma:
s = new sigma({
    graph: g,
    container: 'graph-container'
});
// globalS = s
var c = s.camera;
var dom = document.querySelector('#graph-container canvas:last-child');
var nId = 0;
var addNode = false;
var goTo = false;
dom.addEventListener('click', function(e) {
    // Find neighbors:
    var x,
        y,
        p,
        id,
        neighbors;
    console.log('event is ', e)
    var sigmaX = sigma.utils.getX(e);
    var subX = dom.offsetWidth / 2;
    var sigmaY = sigma.utils.getY(e);
    var subY = dom.offsetHeight / 2;

    x = sigmaX - subX
    console.log('x: = ', sigmaX, ' - ', subX, ' = ', x)
    y = sigmaY - subY
    console.log('y: = ', sigmaY, ' - ', subY, ' = ', y)

    console.log('calced? x and y are', x, y)
    p = c.graphPosition(x, y);
    console.log('graph x and y are', p.x, p.y)

    p = c.cameraPosition(x,y);
    console.log('camera x and y are', p.x, p.y)

    if (addNode){
        var node = {
            id: ++nId + '',
            size: 10,
            x: x,
            y: y,
            type: 'def'
        };
        s.graph.addNode(node);
        s.refresh();
        console.log('node is ',node)
    }
    if (goTo){
        c.goTo({x: x, y: y, ratio: 1, angle: 0})
        s.refresh()
    }
    s.refresh()
}, false);
