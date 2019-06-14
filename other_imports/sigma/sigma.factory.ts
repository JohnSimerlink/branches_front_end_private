import {
	fImportSigma,
	ISigmaFactory,
	ISigmaPlugins
} from '../../app/objects/interfaces';
import {
	inject,
	injectable
} from 'inversify';
import {TYPES} from '../../app/objects/types';

@injectable()
export class SigmaFactory implements ISigmaFactory {
	private sigma: new(...args: any[]) => any;
	private importSigma: fImportSigma;

	constructor(@inject(TYPES.SigmaFactoryArgs){
		importSigma
	}: SigmaFactoryArgs) {
		this.importSigma = importSigma;
	}

	public get plugins(): ISigmaPlugins {
		const SigmaAny: any = this.sigma;
		// Sigma does come with a plugins property
		return SigmaAny.plugins;
	}

	public init() {
		this.sigma = this.importSigma();
	}

	public create(args) {
		const Sigma = this.sigma;
		return new Sigma(args) as any;
	}

}

@injectable()
export class SigmaFactoryArgs {
	@inject(TYPES.fImportSigma) public importSigma: fImportSigma;
}
