Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var AB_1 = require("../app/objects/test/AB");
describe('Mixin decorator', function () {
    var x = 8;
    var y = 2;
    var z = 4;
    var w = 1;
    var ab = new AB_1.AB(x, y, z, w);
    it('Should copy over public methods on both classes', function () {
        chai_1.expect(typeof (ab.swim)).to.equal('function');
        chai_1.expect(typeof (ab.run)).to.equal('function');
        chai_1.expect(ab.swim()).to.equal(AB_1.SWIM);
        chai_1.expect(ab.run()).to.equal(AB_1.RUN);
    });
    it('Should copy over public properties on both classes', function () {
        chai_1.expect(ab.x).to.equal(x);
        chai_1.expect(ab.z).to.equal(z);
    });
});
