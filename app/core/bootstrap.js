import "./objects";
import "./components";
import "./filters";
import "./utils";
import ContentList from "../components/contentList/contentList";
import TreeReviewContainer from "../components/treeReview/treeReviewContainer";
import ExerciseCreatorContainer from "../components/exerciseCreatorContainer/exerciseCreatorContainer";
import UserInfo from "../components/UserInfo/UserInfo";
import KnawledgeMap from "../components/knawledgeMap/knawledgeMap";
import Ebbinghaus from "../components/ebbinghaus/ebbinghaus";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import AsyncComputed from "vue-async-computed";
import {Tree} from "../objects/tree/tree";
import md5 from "../core/md5wrapper";
import store from "./store_OUTDATED.js";

console.log("1: bootstrap.js", Date.now(), calculateLoadTimeSoFar(Date.now()));
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(AsyncComputed);
window.sessionId = md5(Math.random() + Date.now() + Math.random());
// 1. Define route components.
// These can be imported from other files
const Foo = {template: "<div>foo</div>"};
const Bar = {template: "<div>bar</div>"};

const Buy = {template: "<div> Give us ur monee</div>"};
// 2. Define some routes
// Each route should sourceMap to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
	{path: "/buy", component: Buy},
	{path: "/foo", component: Foo},
	{path: "/bar", component: Bar},
	{path: "/study/:leafId", name: "study", component: TreeReviewContainer, props: true},
	{path: "/create", name: "create", component: ExerciseCreatorContainer, props: true},
	{path: "/user", name: "user", component: UserInfo, props: true},
	{path: "/ebbinghaus", name: "ebbinghaus", component: Ebbinghaus, props: true},
	{path: "/edit/:exerciseToReplaceId", name: "edit", component: ExerciseCreatorContainer, props: true},
	{path: "/contentList", name: "contentList", component: ContentList, props: true},
	// { path: '/:treeId', component: KnawledgeMap, props: true },
	{path: "/:contentUri", component: KnawledgeMap, props: true},
	{path: "/", component: KnawledgeMap, props: true},
	{path: "trees/:treeId/", component: Tree, props: true},
	{path: "/Everything/:contentUri/", component: Tree, props: true},
	// {path: '*/:path1/:path2/:path3/:path4/', component: KnawledgeMap, props: true },
	{path: "*/:path1", component: KnawledgeMap, props: true},
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
	routes, // short for `routes: routes`
	mode: "history",
});

var vm = new Vue({
	el: "#branches-app",
	created() {
		PubSub.subscribe("goToState.exerciseCreator", (eventName, data) => {
			this.goToExerciseCreator();
		});
		PubSub.subscribe("goToState.treeReview", (eventName, treeId) => {
			this.goToTreeReview();
		});
		PubSub.subscribe("goToState.home", (eventName, data) => {
			this.goBack();
		});
		// router.go('/83cbe6ea3fa874449982b645f04d14a1')
	},
	data() {
		return {
			state: "none",
			routing: true,
		};
	},
	computed: {
		home() {
			return this.state == "home";
		},
		exerciseCreator() {
			return this.state == "exerciseCreator";
		},
		treeReview() {
			return this.state == "treeReview";
		},
	},
	methods: {
		goBack() {
			window.location = window.location; //refresh the page lol - for some reason graph seems to malfunction when not doing this
			this.state = "home";
		},
		goToExerciseCreator() {
			this.state = "exerciseCreator";
		},
		goToTreeReview() {
			this.state = "treeReview";
		},
	},
	store,
	router,
});
