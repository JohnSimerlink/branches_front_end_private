import {login} from '../../core/login'
export function HeaderController() {
    this.loggedIn = false;
    this.login = function(){
      login()
      this.loggedIn = true;
    }
}