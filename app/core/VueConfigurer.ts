import {
	inject,
	injectable
} from 'inversify';
import {TYPES} from '../objects/types';
import {
	ICardMainCreator,
	IKnawledgeMapCreator,
	IVueConfigurer
} from '../objects/interfaces';
import PlayButton
	from '../components/playButton/playButton';
import {ComponentOptions} from 'vue';
import Main
	from '../components/main/main';
import CardAdd
	from '../components/cardAdd/cardAdd';
import CardEdit
	from '../components/cardEdit/cardEdit';
import NodeHoverIcons
	from '../components/node-hover-icons/node-hover-icons';
import SignUp
	from '../components/signUp/signUp';
import SignUpBirds
	from '../components/signUp/signUpBirds';
import SignUpClouds
	from '../components/signUp/signUpClouds';
import BranchesFooter
	from '../components/footer/branchesFooter';
import ProficiencySelector
	from '../components/proficiencySelector/proficiencySelector';
import Ebbinghaus
	from '../components/ebbinghaus/ebbinghaus';
import Coordinates
	from '../components/coordinates/coordinates';
import Points
	from '../components/points/points';
import MapChooser
	from '../components/mapChooser/mapChooser';
import {Store} from 'vuex';
import {StripeCheckout} from 'vue-stripe';
import BranchesStripe
	from '../components/stripe/branches-stripe';
import '../components/global.less';

let Vue = require('vue').default || require('vue');
// import VueRouter from 'vue-router'
let VueRouter = require('vue-router').default || require('vue-router');
let AsyncComputed = require('vue-async-computed').default || require('vue-async-computed');

@injectable()
export class VueConfigurer implements IVueConfigurer {
	public cardMainComponentCreator: ICardMainCreator;
	public knawledgeMapCreator: IKnawledgeMapCreator;
	public store: Store<any>;

	constructor(@inject(TYPES.VueConfigurerArgs){
		treeComponentCreator,
		knawledgeMapCreator,
		store,
	}: VueConfigurerArgs) {
		this.cardMainComponentCreator = treeComponentCreator;
		this.knawledgeMapCreator = knawledgeMapCreator;
		this.store = store;
	}

	public configure() {
		// const cardMainComponentCreator: ICardMainCreator =
		//     new CardMainCreator({store})
		const Tree = this.cardMainComponentCreator.create();
		const KnawledgeMap = this.knawledgeMapCreator.create();

		const Buy = {template: require('../components/stripe/branches-stripe.html')};

		Vue.component('knawledgeMap', KnawledgeMap);
		Vue.component('tree', Tree);
		Vue.component('nodeHoverIcons', NodeHoverIcons);
		Vue.component('cardEdit', CardEdit);
		Vue.component('cardAdd', CardAdd);
		Vue.component('proficiencySelector', ProficiencySelector);
		Vue.component('signUp', SignUp);
		Vue.component('signUpClouds', SignUpClouds);
		Vue.component('signUpBirds', SignUpBirds);
		Vue.component('stripeCheckout', StripeCheckout);
		Vue.component('playButton', PlayButton);
		Vue.component('branchesFooter', BranchesFooter);
		Vue.component('branchesStripe', BranchesStripe);
		Vue.component('points', Points);
		Vue.component('mapChooser', MapChooser);

		Vue.use(VueRouter);
		Vue.use(AsyncComputed);
		const routes = [
			{
				path: '/',
				component: Main,
				props: true
			},
			{
				path: '/buy',
				component: BranchesStripe,
				props: true
			},
			{
				path: '/ebbinghaus',
				component: Ebbinghaus,
				props: true
			},
			{
				path: '/coordinates',
				component: Coordinates,
				props: true
			},
		];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
		const router = new VueRouter({
			routes, // short for `routes: routes`
			mode: 'history',
		});

		const vm = new Vue({
			el: '#branches-app',
			created() {
				// log('Vue instance created')
				return void 0;
			},
			store: this.store,
			router
		} as ComponentOptions<any> /*TODO: should be ComponentOptions<Vue>*/);
	}
}

@injectable()
export class VueConfigurerArgs {
	@inject(TYPES.ICardMainCreator) public treeComponentCreator: ICardMainCreator;
	@inject(TYPES.IKnawledgeMapCreator) public knawledgeMapCreator: IKnawledgeMapCreator;
	@inject(TYPES.BranchesStore) public store: Store<any>;
}
