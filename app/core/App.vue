<style>
    #facts, #trees-graph {
        flex: 50;
    }
    .header-plan {
        margin-left: 8px;
        margin-right: 8px;
        display: inline;
    }

</style>
<template>
   <div id="header">
       <span class="header-version"> Version: {{version}}</span>
       <span class="header-plan"><a href="https://docs.google.com/presentation/d/101sNSVZnh-olwaRi4hRR5u6KcFKF78LoV5FXYWGlIT4/edit?usp=sharing">The Plan</a></span>
       <span class="header-hire"><a href="mailto:john@branches-app.com">Work for Branches</a></span>
       <button class="login-button"  v-on:click="login"> Login via Facebook </button>
       <span class="login-user-name"></span>
   </div>
    <toolbar></toolbar>
</template>

<script>
import {Config} from './config.js'
import {login} from './login.js'
import user from '../objects/user.js'

export default {
  name: 'app',
    created() {
     this.home = true
    },
  data () {
    return {
        version: Config.version,
        home: this.home,
    }
  },
    methods: {
      login
    }
}
</script>
