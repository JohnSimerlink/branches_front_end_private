import {fImportSigmaConstructor, ISigmaFactory, ISigmaPlugins} from '../../app/objects/interfaces';
import {injectable, inject} from 'inversify';
import {TYPES} from '../../app/objects/types';

@injectable()
export class SigmaFactory implements ISigmaFactory {
    private sigmaConstructor: new(...args: any[]) => any;
    private importSigma: fImportSigmaConstructor;
    constructor(@inject(TYPES.SigmaFactoryArgs){
        importSigma
    }: SigmaFactoryArgs) {
        this.importSigma = importSigma;
    }

    public init() {
        this.sigmaConstructor = this.importSigma()
    }
    public get plugins(): ISigmaPlugins {
        const SigmaConstructorAny: any = this.sigmaConstructor;
        // Sigma does come with a plugins property
        return SigmaConstructorAny.plugins;
    }

    public create(args) {
        const Sigma = this.sigmaConstructor;
        return new Sigma(args) as any;
    }

}
@injectable()
export class SigmaFactoryArgs {
    @inject(TYPES.fImportSigmaConstructor) public importSigma: fImportSigmaConstructor;
}
