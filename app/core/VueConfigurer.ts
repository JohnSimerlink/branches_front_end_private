import {
	inject,
	injectable, tagged
} from 'inversify';
import {TYPES} from '../objects/types';
import {
	ICardMainCreator,
	IKnawledgeMapCreator,
	IMainMenuCreator,
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
import SignUpStep3
	from '../components/signUpStep3/signUpStep3';
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
import {MainMenuCreator}
	from '../components/mainMenu/mainMenu';
import Persuasion
	from '../components/persuasion/persuasion';
import MapChooser
	from '../components/mapChooser/mapChooser';
import {Store} from 'vuex';
import {StripeCheckout} from '../../other_imports/vue-stripe';
import BranchesStripe
	from '../components/stripe/branches-stripe';
import '../components/global.less';
import {TAGS} from '../objects/tags';
import {PATHS} from '../components/paths';
import {log} from './log';

let Vue = require('vue').default || require('vue');
// import VueRouter from 'vue-router'
let VueRouter = require('vue-router').default || require('vue-router');
let AsyncComputed = require('vue-async-computed').default || require('vue-async-computed');

@injectable()
export class VueConfigurer implements IVueConfigurer {
	public cardMainComponentCreator: ICardMainCreator;
	public mainMenuCreator: IMainMenuCreator;
	public nodeHoverIconsCreator: IVueComponentCreator;
	public knawledgeMapCreator: IKnawledgeMapCreator;
	public store: Store<any>;

	constructor(@inject(TYPES.VueConfigurerArgs){
		treeComponentCreator,
		nodeHoverIconsCreator,
		knawledgeMapCreator,
		mainMenuCreator,
		store,
	}: VueConfigurerArgs) {
		this.cardMainComponentCreator = treeComponentCreator;
		this.nodeHoverIconsCreator = nodeHoverIconsCreator;
		this.knawledgeMapCreator = knawledgeMapCreator;
		this.mainMenuCreator = mainMenuCreator;
		this.store = store;
	}

	public configure() {
		console.log('VueConfigurer.ts. configure internal first line called')
		// const cardMainComponentCreator: ICardMainCreator =
		//     new CardMainCreator({store})
		const CardMain = this.cardMainComponentCreator.create();
		const KnawledgeMap = this.knawledgeMapCreator.create();
		const NodeHoverIcons = this.nodeHoverIconsCreator.create();
		const MainMenu = this.mainMenuCreator.create();

		const Buy = {template: require('../components/stripe/branches-stripe.html')};

		Vue.component('knawledgeMap', KnawledgeMap);
		Vue.component('nodeHoverIcons', NodeHoverIcons);
		Vue.component('cardMain', CardMain);
		Vue.component('cardEdit', CardEdit);
		Vue.component('cardAdd', CardAdd);
		Vue.component('proficiencySelector', ProficiencySelector);
		Vue.component('checkbox', Checkbox);
		Vue.component('auth', Auth);
		Vue.component('createAccount', CreateAccount);
		Vue.component('signUpFlow', SignUpFlow);
		Vue.component('signUpPayment', SignUpStep3);
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
		Vue.component('mainMenu', MainMenu);
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
										component: SignUpStep3,
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

		function browserHasLoggedInBefore() {
			return false
		}
		function tellUserToAuthenticate(to, next) {
			if (browserHasLoggedInBefore()) {
				next({
					path: PATHS.LOGIN,
					params: { nextUrl: to.fullPath }
				})
			} else {
				next({
					path: PATHS.SIGNUP_1,
					params: { nextUrl: to.fullPath }
				})
			}
		}
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
		const router = new VueRouter({
			routes, // short for `routes: routes`
			mode: 'history',
		});
		router.beforeEach((to, from, next) => {
			console.log('router beforeEach called', to, from, next)
			if (to.path === '/index.html' || to.path === '/android_asset/www/index.html') {
				console.log('router matched /index.html')
				next({path: PATHS.ROOT});
			}
			if (to.matched.some(record => record.meta.requiresAuth)) {
				if (this.store.getters.loggedIn) {
					next()
				} else {
					tellUserToAuthenticate(to, next)
				}

			} else if (to.meta.blocked) {
				tellUserToAuthenticate(to, next)
				if (browserHasLoggedInBefore()) {
					next({
						path: PATHS.LOGIN,
						params: { nextUrl: to.fullPath }
					})
				} else {
					next({
						path: PATHS.SIGNUP_1,
						params: { nextUrl: to.fullPath }
					})
				}
			} else {
				next()
			}
		})

		const vm = new Vue({
			el: '#branches-app',
			created() {
				log('Vue instance created', this.store, router)
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
	@inject(TYPES.IMainMenuCreator) public mainMenuCreator: IMainMenuCreator;
	@inject(TYPES.IKnawledgeMapCreator) public knawledgeMapCreator: IKnawledgeMapCreator;
	@inject(TYPES.IVueComponentCreator)
	@tagged(TAGS.NODE_HOVER_ICONS_CREATOR, true)
	public nodeHoverIconsCreator: IVueComponentCreator;
	@inject(TYPES.BranchesStore) public store: Store<any>;
}
