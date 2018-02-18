import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import * as firebase from 'firebase';
import {CreateUserOrLoginMutationArgs, IAuthListener} from '../interfaces';
import BranchesStore, {MUTATION_NAMES} from '../../core/store2';
import {Store} from 'vuex';

@injectable()

export class AuthListener implements IAuthListener {

    private store: Store<any>
    constructor(@inject(TYPES.AuthListenerArgs) {
        store
        }: AuthListenerArgs ) {
        this.store = store
    }
    public start() {
        firebase.auth().onAuthStateChanged((user) => {
            console.log('firebase auth state changed! ' , user)
            const mutationArgs: CreateUserOrLoginMutationArgs = {
                userId: user.uid
            }
            this.store.commit(MUTATION_NAMES.CREATE_USER_OR_LOGIN, mutationArgs)

        })

    }
}

@injectable()
export class AuthListenerArgs {
    @inject(TYPES.BranchesStore) public store: Store<any>
}
