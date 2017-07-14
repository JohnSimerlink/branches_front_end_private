class Example {

    constructor() {
        Object.assign(this, this._default);
    }

    get _default() {
        return {
            foo: 'bar'
        };
    }
}

export { Example };