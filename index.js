import Vue from "vue";
import Obserable from './components/lib/obserable';
import Main from './components/main/index';
import Login from './components/login/index'
import Register from './components/register/index';
import MyReport from './components/myreport/index';
import User from './components/user/index';
import DownLoad from './download/index';
import MyDownload from './admin/download/index';
import iView from 'iview';
import VueRouter from 'vue-router'
import './components/css/index.css';
import './components/css/admin.less';

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
			props: true
		}, 
		{
			path:'/myreport/:id/',
			name:'myreport',
			component: MyReport,
			props:true
		}, {
			path: '/user/',
			name: 'user',
			component: User,
			props: true
		}, {
			path: '/download/:id',
			name: 'download',
			component: DownLoad,
			props: {
				isAdmin:true,
				isUser:true
			}
		}, {
			path: '/mydownload/',
			name: 'mydownload',
			component: MyDownload,
			props: {
				isUser:true
			}
		}
	]
});
router.beforeEach((to, from, next) => { //导航守卫。
	var loginObj = {};
	try {
		loginObj = JSON.parse(localStorage.getItem('login'));
	} catch (error) {
		window.location.hash = '/login';
	}
	if (loginObj === null) {
		window.location.hash = '/login';
	}else{
	}
	next();
});
new Vue({
	router,
	data: {
		obserable,
		imgs:window.imgs,
		viewH: document.documentElement.clientHeight,
	},
	el: '#app',
	template: `<div id="app1">
      <Main :obserable='obserable'></Main>
    </div>`,
	methods: {},
	components: {
		Main,
		Login
	},
	mounted() {

		this.$router.obserable = obserable;

		var s = this;

		window.addEventListener("online", function(e) {
			s.$Message.success('网络已链接');
		})

		window.addEventListener("offline", function(e) {
			s.$Message.success('网络已断开');
		})

	}
}).$mount('#app1')