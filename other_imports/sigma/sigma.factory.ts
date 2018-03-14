import Sigma from './sigma.core.js';
import {ISigmaFactory, ISigmaPlugins} from '../../app/objects/interfaces';
import {injectable} from 'inversify';

@injectable()
class SigmaFactory implements ISigmaFactory {
    public get plugins(): ISigmaPlugins {
        const SigmaAny: any = Sigma;
        // Sigma does come with a plugins property
        return SigmaAny.plugins;
    }

    public create(args) {
        // const env = process.env.NODE_ENV
        // if (env === envs.TEST) {
        //     return new MockSigma
        // }
        return new Sigma(args) as any;
    }

}
export default SigmaFactory;
