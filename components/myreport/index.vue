<template>
	<div class="wm-user-ui">
		   <div class="demo-split">
		        <Split v-model="split1">
		            <div slot="left" class="demo-split-pane">
		                Left Pane
		            </div>
		            <div slot="right" class="demo-split-pane">
		                Right Pane
		            </div>
		        </Split>
		    </div>

	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';

	import $ from 'jquery';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				split1: 0.8,
				formUser:{
					oldpassword:'',
					newpassword:'',
					surepassword:''
				},
				userinfo:{}
			}
		},
		components:{
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			
		},
		
		methods:{
			ok(){
				if(this.formUser.newpassword  !== this.formUser.surepassword){
					this.$Message.error('新密码和确认密码不一致');
					return false;
				}
				var s = this;

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/modify_password',
					validate:s.validate,
					data:{
						oldpassword:s.formUser.oldpassword,
						password:s.formUser.newpassword,
						repassword:s.formUser.surepassword
					},success(data){

						if(data.getret === 0){
							s.$Message.warning('请重新登录');
							window.location.hash =  '/login';
						}else{
							s.$Message.error('修改密码失败');
						}
					}

				})
				
			},
			cancel(){
				this.formUser = {};
			}
		}
	}
</script>
 