// tslint:disable max-classes-per-file
import {Mixin} from '../Mixin';

const DRINK = 'drink';
const SWIM = 'swim';
const EAT = 'eat';
const RUN = 'run';
interface IA {
    x;
    swim();
}
interface IB {
    z;
    run();
}
class A {
    public x;
    private y;
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    private drink() { return DRINK }
    public swim() { return SWIM }
}
class B {
    public z;
    private w;
    constructor(z, w) {
        this.w = w;
        this.z = z
    }
    private eat() { return EAT }
    public run() { return RUN }
}
@Mixin(A, B)
class AB implements IA, IB {
    public x;
    public z;
    constructor(x, y, z, w) {
        const a = new A(x, y);
        const b = new B(z, w);
        const me = this
        ;
        [a, b].forEach(o => {
            Object.getOwnPropertyNames(o).forEach(p => {
                me[p] = o[p]
            })
        })
    }
    public swim(): string {
        return undefined;
    }
    public run(): string {
        return undefined;
    }

}

export {SWIM, RUN, AB}
