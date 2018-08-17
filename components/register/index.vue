<template>
	<div  class="wm-reg-ui lt-full">
		<header>
			<div>
				<div><img :src="imgs.logo"  /></div>
				<div>
					已有账号：<a href='#/login'>去登录></a>
				</div>
			</div>
		</header>
		<section>
			<div class="wm-reg-C">
				<div class="wm-reg-form">
					<h2>公益广告上报系统,欢迎注册～</h2>
					<div class="wm-reg-form-item wm-require">
						<label for="">用户名：</label><input type="text" v-model='formUser.username'>
						<div class="wm-reg-error" v-if='userError'>{{userError}}</div>
					</div>
					<div class="wm-reg-form-item wm-require">
						<label for="">密码：</label><input type="password" v-model="formUser.password">
						<div class="wm-reg-error" v-if='passError'>{{passError}}</div>
					</div>
					<div class="wm-reg-form-item wm-require">
						<label for="">确认密码：</label><input type="password" v-model="formUser.repassword">
						<div class="wm-reg-error" v-if='repassError'>{{repassError}}</div>
					</div>
					<div class="wm-reg-form-item wm-require">
						<label for="">姓名：</label><input type="text" v-model="formUser.nickname">
						<div class="wm-reg-error" v-if='usernameError'>{{usernameError}}</div>
					</div>
					<div class="wm-reg-form-item wm-require">
						<label for="">手机：</label><input type="text" v-model="formUser.mobile">
						<div class="wm-reg-error" v-if='mobileError'>{{mobileError}}</div>
					</div>
					<div class="wm-reg-form-item wm-require">
						<label for="">单位：</label><input type="text" v-model="formUser.company">
						<div class="wm-reg-error" v-if='companyError'>{{companyError}}</div>
					</div>

					<div class="wm-reg-form-item " >
						<label for="">地址：</label>
						<Cascader :data='provinceList' v-model="formUser.address"></Cascader>
					</div>

					<div class="wm-reg-form-item ">
						<label for="">详细地址：</label><input type="text" v-model="formUser.detailaddress">
					</div>
					<div class="wm-reg-form-item ">
						<label for="">邮箱：</label><input type="text"  v-model="formUser.email">
					</div>
					<div class="wm-reg-form-item wx-reg-btn" @click="reg">
						注 册
					</div>
				</div>
				<div class="wm-copyright">
					中国文明网 &copy;版权所有
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import './index.css';
	import $ from 'jquery';
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
				checked:false,
				isLogined:false,
				isMove:false,
				showLoading:false,
				showError:false,
				errorMsg:'',
				provinceList:[
					{
						value:1,
						label:"北科"
					}
				],
				userError:"",
				companyError:"",
				usernameError:"",
				passError:"",
				repassError:"",
				mobileError:"",
				formUser:{},

				viewH:document.documentElement.clientHeight
			}
		},
		components:{
		},
		
		methods:{
			toastError(msg =  '用户名不能为空',type='userError'){
				this[type] = msg;
				setTimeout(() => {
					this[type] = '';
				}, 2000);
			},
			reg(){
				var _this = this;
				
				if(!this.formUser.username){
					this.toastError();
 					return;
				}
				if(!this.formUser.password){
					this.toastError('密码不能为空','passError');
 					return;
				}
				if(!this.formUser.repassword){
					this.toastError('确认密码不能为空','repassError');
 					return;
				}
				if(this.formUser.repassword !==this.formUser.password) {
					this.toastError('两次密码输入不一致','repassError');
 					return;
				}
				if(!this.formUser.nickname){
					this.toastError('姓名不能为空','usernameError');
 					return;
				}
				if(!this.formUser.mobile){
					this.toastError('手机不能为空','mobileError');
 					return;
				}
				if(!this.formUser.company){
					this.toastError('单位不能为空','companyError');
 					return;
				}

				return;

				this.showLoading = true;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/login/',
					data:{
						username:_this.username,
						userpwd:_this.password
					},
					fn(data){
						if(data.getret === 0){
							var param = data;
							delete param.getret;
							delete param.getmsg;
							
							if(data.userinfo.isinselect === 0 && data.userinfo.isadmin === 0){
								_this.showLoading = false;
								_this.toastError(_this.username+'不参与评分');
								return;
							}
							
							symbinUtil.clearCookie('login');
							symbinUtil.setCookie('login',JSON.stringify(param),1);

							if(_this.checked){
								window.localStorage.setItem('wm_username',_this.username);
								window.localStorage.setItem('wm_password',_this.password);
							}else{
								window.localStorage.setItem('wm_username','');
								window.localStorage.setItem('wm_password','');
							}
						
							if(data.isadmin){
								//window.location.hash = '/periods/';
								window.location.href = window.location.href.split('#')[0]+'#/periods/'
							}else{
								//window.location.hash = '/user/';
								window.location.href = window.location.href.split('#')[0]+'#/user/'
							}
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
 