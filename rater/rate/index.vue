<template>
	<div class="wm-rater-main-ui">
		<Split v-model='scale'>
			<div slot='left'>
				<header class="wm-rater-header">
					<div>{{resourceName}}</div>
					<div class="wm-rate-tabs">
						<ul>
							<li @click='getRateDataById(0)' :class="{'active':currentType === 0}">全部(12)</li>
							<li @click='getRateDataById(1)' :class="{'active':currentType === 1}">待评</li>
							<li @click='getRateDataById(2)' :class="{'active':currentType === 2}">已评</li>
						</ul>
					</div>
				</header>
				<header class="wm-rater-search-where">
					<span>筛选条件：</span>
					<ul>
						<li v-for="(condition , i ) in conditions" :key="i">
							{{condition.split('-')[0]}}
						</li>
					</ul>
				</header>
				<section class='wm-scroll' :style="{height:viewH - 200+'px',overflow:'auto'}">
					<ul class="wm-report-list">
						<li v-for="(report,i) in reportList " :key="i">
							<div class="wm-report-item">
								<div class="wm-report-detail">
									<div class="wm-report-pcbilethum">
										<div>
											<img :src="report.pcbilethum" alt="">
										</div>
									</div>
									<div>
										<div  v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc"||item.fieldname === "userlabel"' class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
											<div v-if='item.fieldname !== "userlabel"'>{{item.name}}：</div>
											<div  v-if='item.fieldname !== "userlabel"' :class="item.fieldname">
												<span>{{report[item.fieldname]}}</span>
											</div>
											<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
												<div style="width:60px;text-align:center">标签：</div>
												<div class="wm-tag-list">
													<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (report[item.fieldname]||'').split(',')">{{tag}}</Tag>
												</div>
											</section>
										</div>
									</div>
								</div>
							</div>
							<div class="wm-report-rate-C">
							</div>
						</li>
					</ul>
				</section>
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
	import Vue from 'vue';
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
				colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				showPass:false,
				viewH:window.innerHeight,
				currentRateid:-1,
				resourceName:'',
				conditions:[],


				formAdmin:{
					raterpwd:'111111'
				},
			
				reportList:[],
				configList:[],

				
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
			window.s = this;

			var t = setInterval(()=>{
				var configList = Vue.obserable.trigger({
					type:'getFeildList'
				});
				if(configList){
					clearInterval(t);
					this.configList = configList;
					this.conditions = this.configList.filter((item)=>{
						return item.fieldname === 'publicadtype'
					})[0].data;

					this.resourceName = Vue.obserable.trigger({
						type:'getCurrentSource'
					}).resourcecnname;
				}
			},30);
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
					url:window.config.baseUrl+'/wmreview/getresourcesall/',
					//validate:s.validate,
					data:{
						ratername:s.userinfo.ratername,
						accesstoken:s.userinfo.accesstoken,
						resourceid:1
					},success(data){
						if(data.getret === 0){
							s.reportList = data.list;
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
 