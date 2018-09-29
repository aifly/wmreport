<template>
	<div class="wm-adminuser-main-ui">
		<header>
			<div>我的下载</div>
			<section>
				<Button v-if='false' type="primary" icon='md-add-circle' @click="addNewAduser">新增用户</Button>
			</section>
		</header>
		<Table ref='scorelist'  :height='viewH - 64- 70 ' :data='downloadList' :columns='columns'   stripe></Table>

	
		 
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
				
				imgs:window.imgs,
				isLoading:false,
				currentUserId:-1,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,
				
				downloadList:[],
				columns:[
					{
						title:"名称",
						key:'tasktitle',
						align:'center'
						
					},
					{
						title:"状态",
						key:'taskstatus',
						align:'center',
						render:(h,params)=>{
							var status = '等待打包中';
							switch(params.row.taskstatus){
								case 0:
								break;
								case 1:
								status = '正在打包';
								break;
								case 2:
								status = '打包成功';
								break;
								case 4:
								status = '打包失败';
								break;
							}
							return h('div',{},status);
						}
							
					},
					{
						title:"创建时间",
						key:'createtime',
						align:'center'
					},{
						title:'操作',
						key:"action",
						align:'center',
						render:(h,params)=>{
							return h('div', [
                               /* h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									on:{
										'on-ok':()=>{
											this.delAdUser(params.row.userid);
										},
										
									}
								},[
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										on: {
											click: () => {
												
												//this.remove(params.index,params.row.employeeid)
											}
										}
									}, '删除')
								]),*/ h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:params.row.taskstatus !== 2
                                    },
                                    style: {
										margin: '2px 5px',
										border:'none',
										//	background:params.row.status*1 === 0 ? 'rgb(2, 29, 236)':'#b20000',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px',

                                    },
                                    on: {
                                        click: () => {
											/*this.currentUserId = params.row.userid;
											this.formAdmin = params.row;
											this.visible = true;*/
											window.location.href = params.row.taskresult;
                                        }
                                    }
                                },'下载'),
                            ]);
						}
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
			//this.addadUser();
			this.getDownloadlist();

			var s = this;


			
			/*symbinUtil.ajax({
				url:'http://api.symbin.cn/v1/wmadadmin/getuserziplist/',
				data:{
					admintoken:s.userinfo.admintoken,
					adminusername:s.userinfo.adminusername,
					usertype:2,
				},
				success(data){
					console.log(data,' =======');
				}
			})
			/* var s = this;
			symbinUtil.ajax({
				url:window.config.baseUrl+'/wmadadmin/createzip/',
				data:{
					admintoken:s.userinfo.admintoken,
					adminusername:s.userinfo.adminusername,
					urls:'http://api.symbin.cn/wmpublicadupload/2018/3021678740.jpg,http://api.symbin.cn/wmpublicadupload/2018/1039108971.jpg'
				},
				success(data){
					console.log('111111111111111111')
					console.log(data,' ----------- ');
				}
			}) */

		},
		
		methods:{

			onEditorBlur(){//失去焦点事件
            },
            onEditorFocus(){//获得焦点事件
            },
            onEditorChange(){//内容改变事件
            },

			checkUser(params){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadadmin/checkregistuser?t=1',
					data:{
						admintoken:s.userinfo.admintoken,
						adminusername:s.userinfo.adminusername,
						userids:params.row.userid,
						status:params.row.status === 1 ? 0 : 1,
					},
					success(data){
						console.log(data);
						s.$Message[data.getret === 0 ? "success":"error"](data.getmsg);
						s.getDownloadlist();
					}

				})
			},

			modifyPass(){
				if(!this.showPass){
					this.showPass = true;
					this.$refs['pass'].focus();

				}else{
					if(!this.formAdmin.userpwd){
						this.$Message.error('密码不能为空');
						return;
					}
					var s = this;
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/wmadadmin/updateuserpwd',
						data:{
							admintoken:s.userinfo.admintoken,
							adminusername:s.userinfo.adminusername,
							userid:s.formAdmin.userid,
							userpwd:s.formAdmin.userpwd
						},
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
						}
					})
				}
			},
			delAdUser(userid){
					var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadadmin/deladuser/',
					validate:s.validate,
					data:{
						userid,
						admintoken:s.userinfo.admintoken,
						adminusername:s.userinfo.adminusername
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getDownloadlist();
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},

			addNewAduser(){
				this.currentUserId = -1;
				this.formAdmin = {
					userpwd:'111111'
				};
				this.visible = true;
			},
			getDownloadlist(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadadmin/getuserziplist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.admintoken,
						adminusername:s.userinfo.adminusername,
						pagenum:1000,
						usertype:2
						//status:-1,//查询全部
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.downloadList = data.list;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},


		}
	}
</script>
 