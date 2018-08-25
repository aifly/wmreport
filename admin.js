import Vue from "vue";
import Obserable from './components/lib/obserable';
import Main from './admin/main/index';
import Login from './admin/login/index'
import Register from './admin/register/index';
import AdminUser from './admin/adminuser/index';
import User from './admin/user/index';
import Rater from './admin/rater/index';
import iView from 'iview';
import VueRouter from 'vue-router'
import './admin/css/index.css';
import './components/css/admin.less'
///import 'iview/dist/styles/iview.css';

Vue.use(VueRouter)
Vue.use(iView)
var obserable = new Obserable();

Vue.obserable = obserable;
const router = new VueRouter({
	routes: [
		//{path: '*', name: 'error', component: FError },
		{
			path: '/login/',
			name: 'login',
			component: Login,
			props: true
		},
		{
			path: '/',
			name: 'login',
			component: Login,
			props: true
		},
		{
			path: '/register/',
			name: 'register',
			component: Register,
			props:true
		}, {
			path: '/adminuser/',
			name: 'adminuser',
			component: AdminUser,
			props: true
		}, {
			path: '/rater/',
			name: 'rater',
			component: Rater,
			props: true
		}, {
			path: '/user/',
			name: 'user',
			component: User,
			props: true
		}
		
	]
});

new Vue({
	router,
	data: {
		obserable,
		imgs,
		viewH: document.documentElement.clientHeight,
	},
	el: '#app',
	template: `<div id="app1">
      <Main :obserable='obserable'></Main>
    </div>`,
	methods: {},
	components: {
		Main,
		Login,
		Register
	},
	mounted() {

		this.$router.obserable = obserable;


	}
}).$mount('#app1')