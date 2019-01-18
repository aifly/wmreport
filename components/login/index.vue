<template>
	<div  class="wm-login-ui lt-full">
		<header>
			<div>
				<div>
					<img :src="imgs.logo"  />
				</div>
				<div>
					<a href='#/register'>用户注册></a>
				</div>
			</div>
		</header>
		<section :style="{background:'url('+imgs.loginBg+') no-repeat center bottom',backgroundSize:'cover'}" > 
			<div class="wm-login-C" v-show='!isLowIE'>
				<h2>公益广告上报系统</h2>
				<div class="wm-login-form">
					<div>
						<label>
							<img :src="imgs.loginPerson" alt="">
							<input type="text" v-model="username" placeholder="请输入账号">
						</label>
						<div class='wm-login-error' v-if='loginError'>{{loginError}}</div>
					</div>
					<div>
						<label>
							<img :src="imgs.loginLock" alt="">
							<input @keydown.13='login' type="password" v-model="password" placeholder="请输入密码">
						</label>
					</div>
					<div>
						<div @click="login">登录 <Icon v-if='showLoading' type="ios-loading" class="demo-spin-icon-load"></Icon></div>
						<label><Checkbox v-model="checked">记住密码</Checkbox></label>
					</div>
				</div>
				<div class='wm-browner-tip' v-if='isNotChrome'>
					<img draggable="false" :src="imgs.brower" alt="">
				</div>
			</div>
			<div class="wm-copyright">
				中国文明网 &copy;版权所有
			</div>
		</section>
	</div>
</template>

<script>
	import './index.css';
	import symbinUtil from '../lib/util';

	import Vue from "vue";

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
				username:'',
				password:'',
				loginError:'',
				checked:false,
				isLogined:false,
				isMove:false,
				showLoading:false,
				isNotChrome:false,
				isLowIE:false,
				showError:false,
				errorMsg:'',
				loginType:"员工登录",
				viewH:document.documentElement.clientHeight
			}
		},
		components:{
		},

		beforeCreate(){
			 
		},
		
		methods:{
			toastError(msg =  '用户名不能为空'){
				this.loginError = msg;
 				setTimeout(()=>{
 					this.loginError = '';
 				},2000)
			},
			login(){
				var _this = this;


				if(!this.username){
					this.toastError();
 					return;
				}
				if(!this.password){
					this.toastError('密码不能为空');
 					return;
				}

				this.showLoading = true;
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/login/',
					data:{
						username:_this.username,
						userpwd:_this.password
					},
					success(data){
						if(data.getret === 0){
							var param = data;
							delete param.getret;
							delete param.getmsg;

							var p = param.list;
							window.localStorage.setItem('login',JSON.stringify(p));

							if(_this.checked){
								window.localStorage.setItem('wm_username',_this.username);
								window.localStorage.setItem('wm_password',_this.password);
							}else{
								window.localStorage.setItem('wm_username','');
								window.localStorage.setItem('wm_password','');
							}
							
							window.location.hash = '#/myreport/1';
							
							_this.$Message.success('登录成功~');
							
							window.location.reload();
							_this.isLogined = true;
							
						}else{
							_this.toastError(data.getmsg);
						}
					}
				})
				
			},
			checkCache(){
				var username = window.localStorage.getItem('wm_username'),
					password = window.localStorage.getItem('wm_password');
				
				if(username && password){
					this.username = username;
					this.password = password;
					this.checked = true;
				}
			}
		
			

		},
		mounted(){
			this.checkCache();
			
			var ua = navigator.userAgent.toLowerCase();
			this.isNotChrome = !ua.match(/chrome\/([\d.]+)/)
			
			var nav = navigator.userAgent;
			this.isLowIE = /MSIE 9/.test(nav) || /MSIE 8/.test(nav)||/MSIE 7/.test(nav)||/MSIE 6/.test(nav)||/MSIE 7/.test(nav)
			if(this.isLowIE){
				$('#zmiti-error').show();
			}
			
		}
	}
</script>
 <style>
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

 </style>
 