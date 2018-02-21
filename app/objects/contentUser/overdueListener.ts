import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {IMutable, IMutableSubscribableContentUser, IOverdueListener} from '../interfaces';

@injectable()
export class OverdueListener  implements IOverdueListener {
    public contentUser: IMutableSubscribableContentUser
    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.OverdueListenerArgs) {
        contentUser
   }: OverdueListenerArgs ) {
        this.contentUser = contentUser

    }
    public start() {

    }
}
@injectable()
export class OverdueListenerArgs {
    @inject(TYPES.IMutableSubscribableContentUser) public contentUser:
        IMutableSubscribableContentUser
}
