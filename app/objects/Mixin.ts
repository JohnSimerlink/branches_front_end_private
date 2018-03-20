import {ConstructorFunction} from './tstypes';

function Mixin(...classes/*: Function[]*/) {
    return (combinedConstructor: ConstructorFunction) => {
        classes.forEach(constructor => {
            Object.getOwnPropertyNames(constructor.prototype).forEach(name => {
                const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);

                if (name === 'constructor') {
                    return;
                }

                if (descriptor &&
                    (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable
                        || descriptor.get || descriptor.set)) {
                    Object.defineProperty(combinedConstructor.prototype, name, descriptor);
                } else {
                    combinedConstructor.prototype[name] = constructor.prototype[name];
                }

            });
        });
    };
}

export {Mixin};
