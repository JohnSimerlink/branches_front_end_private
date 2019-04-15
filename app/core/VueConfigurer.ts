import {
	inject,
	injectable, tagged
} from 'inversify';
import {TYPES} from '../objects/types';
import {
	ICardMainCreator,
	IKnawledgeMapCreator,
	IVueComponentCreator,
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
import {NodeHoverIconsCreator}
	from '../components/node-hover-icons/node-hover-icons';
import Login
	from '../components/login/login';
import CreateAccount
	from '../components/createAccount/createAccount';
import SignUpPayment
	from '../components/signUpPayment/signUpPayment';
import SignUpPackage
	from '../components/signUpPackage/signUpPackage';
import SignUpProgress
	from '../components/signUpProgress/signUpProgress';
import SignUpFlow
	from '../components/signUpFlow/signUpFlow';
import Auth
	from '../components/auth/auth';
import AuthBirds
	from '../components/auth/authBirds';
import AuthClouds
	from '../components/auth/authClouds';
import BranchesFooter
	from '../components/footer/branchesFooter';
import Checkbox
	from '../components/checkbox/checkbox';
import ProficiencySelector
	from '../components/proficiencySelector/proficiencySelector';
import Ebbinghaus
	from '../components/ebbinghaus/ebbinghaus';
import Coordinates
	from '../components/coordinates/coordinates';
import Points
	from '../components/points/points';
import Persuasion
	from '../components/persuasion/persuasion';
import MapChooser
	from '../components/mapChooser/mapChooser';
import {Store} from 'vuex';
import {StripeCheckout} from 'vue-stripe';
import BranchesStripe
	from '../components/stripe/branches-stripe';
import '../components/global.less';
import {TAGS} from '../objects/tags';
import {PATHS} from '../components/paths';

let Vue = require('vue').default || require('vue');
// import VueRouter from 'vue-router'
let VueRouter = require('vue-router').default || require('vue-router');
let AsyncComputed = require('vue-async-computed').default || require('vue-async-computed');

@injectable()
export class VueConfigurer implements IVueConfigurer {
	public cardMainComponentCreator: ICardMainCreator;
	public nodeHoverIconsCreator: IVueComponentCreator;
	public knawledgeMapCreator: IKnawledgeMapCreator;
	public store: Store<any>;

	constructor(@inject(TYPES.VueConfigurerArgs){
		treeComponentCreator,
		nodeHoverIconsCreator,
		knawledgeMapCreator,
		store,
	}: VueConfigurerArgs) {
		this.cardMainComponentCreator = treeComponentCreator;
		this.nodeHoverIconsCreator = nodeHoverIconsCreator;
		this.knawledgeMapCreator = knawledgeMapCreator;
		this.store = store;
	}

	public configure() {
		// const cardMainComponentCreator: ICardMainCreator =
		//     new CardMainCreator({store})
		const Tree = this.cardMainComponentCreator.create();
		const KnawledgeMap = this.knawledgeMapCreator.create();
		const NodeHoverIcons = this.nodeHoverIconsCreator.create();

		const Buy = {template: require('../components/stripe/branches-stripe.html')};

		Vue.component('knawledgeMap', KnawledgeMap);
		Vue.component('tree', Tree);
		Vue.component('nodeHoverIcons', NodeHoverIcons);
		Vue.component('cardEdit', CardEdit);
		Vue.component('cardAdd', CardAdd);
		Vue.component('proficiencySelector', ProficiencySelector);
		Vue.component('checkbox', Checkbox);
		Vue.component('auth', Auth);
		Vue.component('createAccount', CreateAccount);
		Vue.component('signUpFlow', SignUpFlow);
		Vue.component('signUpPayment', SignUpPayment);
		Vue.component('signUpPackage', SignUpPackage);
		Vue.component('signUpProgress', SignUpProgress);
		Vue.component('login', Login);
		Vue.component('authClouds', AuthClouds);
		Vue.component('authBirds', AuthBirds);
		Vue.component('persuasion', Persuasion);
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
				props: true,
				meta: {
					blocked: true
				},
				children: [
					{
						path: '/auth/', component: Auth,
						meta: {
							blocked: true
						},
						children: [
							{
								path: 'login',
								component: Login,
								meta: {
									guest: true
								}
							},
							{
								path: 'signup',
								component: SignUpFlow,
								meta: {
									blocked: true
								},
								children: [
									{
										path: '1',
										component: CreateAccount,
										meta: {
											guest: true
										}
									},
									{
										path: '2',
										component: SignUpPackage,
										meta: {
											requiresAuth: true
										}
									},
									{
										path: '3',
										component: SignUpPayment,
										meta: {
											requiresAuth: true
										}
									},
								]
							},
						]
					},
					{
						path: '/study',
						component: KnawledgeMap,
						meta: {
							requiresAuth: true
						}
					},
				]
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
		router.beforeEach((to, from, next) => {
			if (to.matched.some(record => record.meta.requiresAuth)) {
				if (this.store.getters.loggedIn) {
					next()
				} else {
					next({
						path: PATHS.LOGIN,
						params: { nextUrl: to.fullPath }
					})
				}

			} else if (to.meta.blocked) {
				next({
					path: PATHS.LOGIN,
					params: { nextUrl: to.fullPath }
				})
			} else {
				next()
			}
		})

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
	@inject(TYPES.IVueComponentCreator)
	@tagged(TAGS.NODE_HOVER_ICONS_CREATOR, true)
	public nodeHoverIconsCreator: IVueComponentCreator;
	@inject(TYPES.BranchesStore) public store: Store<any>;
}
