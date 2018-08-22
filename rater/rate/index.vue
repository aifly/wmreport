<template>
	<div class="wm-rater-main-ui">
		<Split v-model='scale'>
			<div slot='left'>
				<header class="wm-rater-header">
					<div>2018年公益广告</div>
					<div class="wm-rate-tabs">
						<ul>
							<li @click='getRateDataById(0)' :class="{'active':currentType === 0}">全部(12)</li>
							<li @click='getRateDataById(1)' :class="{'active':currentType === 1}">待评</li>
							<li @click='getRateDataById(2)' :class="{'active':currentType === 2}">已评</li>
						</ul>
					</div>
				</header>
			</div>
			<div slot='right'>
				aaa
			</div>
		</Split>
		
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				scale:.8,
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentType:0,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,
				currentRateid:-1,

				formAdmin:{
					raterpwd:'111111'
				},
			
				raterList:[],

				
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
			
			this.getRaterlist();
		},
		
		methods:{

			modifyPass(){
				if(!this.showPass){
					this.showPass = true;
					this.$refs['pass'].focus();

				}else{
					if(!this.formAdmin.raterpwd){
						this.$Message.error('密码不能为空');
						return;
					}
					var s = this;
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadadmin/updatereviewpwd',
						data:{
							admintoken:s.userinfo.admintoken,
							adminusername:s.userinfo.adminusername,
							raterid:s.formAdmin.raterid,
							raterpwd:s.formAdmin.raterpwd
						},
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
						}
					})
				}
			},

			getRateDataById(index){

				this.currentType = index;


			},

		 

			getRaterlist(){
				var s = this;

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmreview/checkgradingwork/',
					//validate:s.validate,
					data:{
						ratername:s.userinfo.ratername,
						accesstoken:s.userinfo.accesstoken
					},success(data){
						console.log(data);
						if(data.getret === 0){
							s.raterList = data.list;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},
			delRater(raterid){
				
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/delreview/',
					validate:s.validate,
					data:{
						raterid,
						deltype:0,
						admintoken:s.userinfo.admintoken,
						adminusername:s.userinfo.adminusername
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getRaterlist();
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},
			
			ok(){

				
				var s = this;

				if(s.currentRateid<=-1){

					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadadmin/addreview/',
						validate:s.validate,
						data:{
							ratername:s.formAdmin.ratername,
							raterpwd:s.formAdmin.raterpwd,
							admintoken:s.userinfo.admintoken,
							adminusername:s.userinfo.adminusername
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadadmin/editreview/',
						validate:s.validate,
						data:{
							ratername:s.formAdmin.ratername,
							nickname:s.formAdmin.nickname,
							mobile:s.formAdmin.mobile,
							raterid:s.currentRateid,
							admintoken:s.userinfo.admintoken,
							adminusername:s.userinfo.adminusername
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}
			},
			cancel(){
				this.formUser = {};
			}
		}
	}
</script>
 