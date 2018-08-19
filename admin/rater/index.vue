<template>
	<div class="wm-rater-main-ui">
		<header>
			<div>评委管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addRater">新增评委</Button>
			</section>
		</header>
		<Modal
			v-model="visible"
			:title="currentRateid === -1? '新增评委':'编辑评委'"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="72" >
				<FormItem label="账号：" prop="ratername">
					<Input style="width:310px;" v-model="formAdmin.ratername" placeholder="账号" autocomplete="off" />
					<RadioGroup v-model="formAdmin.sex">
						<Radio :label="1">
							<span>男</span>
						</Radio>
						<Radio :label="0">
							<span>女</span>
						</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="密码：" prop="raterpwd">
					<Input disabled v-model="formAdmin.raterpwd" placeholder="密码" autocomplete="off" />
				</FormItem>
				<FormItem label="昵称：" prop="nickname">
					<Input v-model="formAdmin.nickname" placeholder="昵称" autocomplete="off" />
				</FormItem>
				<FormItem label="电话：" prop="mobile">
					<Input v-model="formAdmin.mobile" placeholder="电话" autocomplete="off" />
				</FormItem>
			</Form>
		</Modal>
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
				visible:true,
				imgs:window.imgs,
				isLoading:false,
				split1: 0.8,
				currentRateid:-1,

				formAdmin:{
					raterpwd:'111111'
				},

				reportList:[
					{
						reportid:'1',
						reportname:'我的上报',
						status:2,
						thumi:"",
						type:'jpg',
						process:1,
						bulk:'1.2M',
						size:'1920*1080',
						remark:'说明',
						suffix:'jpg',
						labels:''
						
					}
				],

				
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

			addRater(){
				this.currentRateid = -1;
				this.visible = true;
			},
			
			ok(){

				
				var s = this;

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
				
			},
			cancel(){
				this.formUser = {};
			}
		}
	}
</script>
 