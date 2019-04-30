<template>
	<div class="wm-clip-main-ui">
			<Modal
			@on-visible-change = 'visibleChange'
			v-model="showClipDialog"
			title="编辑作品信息"
            :loading='showDialog'
			@on-ok="ok"
			width='600'
			@on-cancel="cancel">
			<div class='wm-report-move-C'>
				<div class='wm-report-checked-work-ui'>
					<header>我要{{moveType===1?'复制':'剪切'}}的内容</header>
					<div class='wm-report-checked-work-list' ref='list'>
						<ul>
							<li v-for='(report,i) in myCheckedList' :key="i">
								<div class='wm-report-work-ico'><img :src="imgs.imgIco" alt=""></div>
								<div class='wm-report-work-name' :class='{"active":report.isDone}'>
									{{report.filetitle}}
									<Icon :style="{color:report.isDone?'green':'#333'}" class='wm-report-work-staus' :type="report.isDone?'ios-checkmark-circle':'ios-close-circle'" />
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class='wm-report-move-ico'>
					<img :src="imgs.move" alt="">
				</div>
				<div class='wm-report-resource-ui'>
					<header>目标库</header>
					<div class='wm-report-resource-C'>
						<ol>
							<li @click='destinationid = resource.resourceid' v-for='(resource,i) in resourceList' :key="i" :class="{'active':destinationid === resource.resourceid}">
								<div>
									<img :style="{background:WmColors[i]}" :src="resource.resourceicopath" alt="">
								</div>
								<div>
									{{resource.resourcecnname}}
								</div>
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Modal>

		<Modal v-model="showRepeatModal" width="360" :transfer='false'>

			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-information-circle"></Icon>
				<span>替换或者跳过</span>
			</p>
			<div style="text-align:center" v-if='repeatList.length'>
				<div>目录中 {{repeatList[0].filetitle}}文件同名</div>
				<Button class='wm-repeat-action-btn' icon='md-checkmark-circle' long >替换</Button>
				<Button icon='md-return-left' long @click="skip">跳过</Button>
			</div>
			<div slot="footer" class='wm-repeat-footer'>
				<div>
					<Checkbox>全部都按此方式执行</Checkbox>
				</div>
				<div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	import symbinUtil from '../../components/lib/util';
	import {symbinAdminUtil} from '../../admin/lib/util';
	import Vue from 'vue';

	 

    import WmColors from '../../components/lib/color';
	import IScroll from 'iscroll';
	import './index.css';
	export default {
		props:['obserable','moveType','checkedList','sourceid','id','isAdmin','input','currentType','menus'],
		name:'zmitiindex',
		data(){
			return{
                imgs:window.imgs,
                showClipDialog:true,
				destinationid:-1,
				myCheckedList:[],
                resourceList:[],
                userinfo:{},
				WmColors,
				showRepeatModal:false,
				destinationList:[],
				showDialog:true,
				repeatList:[],//复制的时候，有重复的数据列表。
				
			}
		},
		components:{
		},

		beforeCreate(){
			window.s = this;
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		watch:{

			showClipDialog:{
                immediate: true,
				handler(val){
					if(val){

						console.log( Vue.obserable.trigger({type:'getResourceList'}))
                        this.resourceList =  Vue.obserable.trigger({type:'getResourceList'}).filter((item=>{
							
                            return this.sourceid !== item.resourceid;
						}));
						this.destinationid = this.resourceList[0].resourceid;

						setTimeout(()=>{

							this.scroll.refresh();
						},1000)
						
					}
				}
			},

			showContextMenu(val){
				if(!val){
					this.curentReport  = {};
				}
			},
			selectAll(val){

				var len = this.reportList.length;
				this.reportList.forEach((item)=>{
					item.checked = val;
					
					if(val){
						this.checkedList.push(item);
					}
					else{
						this.checkedList.length = 0;
					}
				});

			},
		
		},
		mounted(){
			var util = {
				symbinUtil,
				symbinAdminUtil
			}
			this.userinfo =  util[this.isAdmin?'symbinAdminUtil':'symbinUtil'].getUserInfo();
			this.myCheckedList = this.checkedList;
			console.log(this.userinfo,'userinfo')
			this.scroll = new IScroll(this.$refs['list'],{
				scrollbars:true,
				mouseWheel:true
			});
		},
		
		methods:{

			skip(){//跳过
				this.repeatList.shift();
				if(this.repeatList.length<=0){
					this.showRepeatModal = false;
				}else{
					this.showRepeatModal = false;
					setTimeout(() => {
						this.showRepeatModal = true;
					}, 500);
				}


			},

			getResource(){
				
			},

			visibleChange(val){
				if(!val){
					//this.$emit('update:transferShow',false);
					this.$emit('input',false);
				}
			},

			getReportList(fn){
				var util = {
					symbinUtil,
					symbinAdminUtil
				}
				this.showRepeatModal = true;
				var url = window.config.baseUrl+"/wmadvuser/getmyreportdata";
				if(this.isAdmin){
					url = window.config.baseUrl+'/wmadadmin/getresouredetaillist/'
				}
				
                util[this.isAdmin?'symbinAdminUtil':'symbinUtil'].ajax({
					url,
					data:{
						username:s.userinfo.username,
						accesstoken:s.userinfo.accesstoken,
						adminusername:s.userinfo[s.isAdmin?'adminusername':'username'],
						admintoken:s.userinfo[s.isAdmin?'admintoken':'accesstoken'],
						resourceid:s.destinationid
					},
					success(data){
						if(data.getret === 0){
							s.destinationList = data.list.concat([]).filter((item)=>{
								return item.publicadtype === s.menus[s.currentType] || s.currentType <= -1;
							});
							fn && fn(s.destinationList);
						}
					}
				});
			},

            ok(){
				var s = this;
				



                var ids = [];

				
				if(s.destinationid<=-1){
					s.$Message.error('请先选择一个要复制的目标库');
					s.showDialog = false;
					return;
				}
                
                this.checkedList.map((item)=>{
                    ids.push(item.id);
				});
				
				if(!ids.length){
					s.$Message.error('请选择一个要复制的资源');
					s.showDialog = false;
					return;
				}
                var util = {
					symbinUtil,
					symbinAdminUtil
				}

				 s.getReportList(()=>{
					s.destinationList.forEach(dest=>{
						s.myCheckedList.forEach(check=>{
							if(dest.id === check.id){
								s.repeatList.push(dest);
							}
						})
					})

					/* s.$Modal.confirm({
						title:"替换或者跳过文件", 
						render:(h)=>{
							return h('div',{},[
								h('div',{},'目标中'+ s.repeatList[0].filetitle + '文件同名'),
								h('Button',{
									props:{
										long:true,
										type:'primary',
										icon:'md-checkmark-circle'
									},
									style:{
										margin:'10px 0'
									}
								},'替换'),
								h('Button',{
									props:{
										long:true,
										icon:'md-return-left'
									}
								},'跳过')
							]) 
						}
					}); */

					

				});

				return;
				
			     
				
                util[this.isAdmin?'symbinAdminUtil':'symbinUtil'].ajax({
                    url:window.config.baseUrl+ '/wmadvuser/operasourcedata/',
                    data:{
						username:s.userinfo[s.isAdmin?'adminusername':'username'],
						usertoken:s.userinfo[s.isAdmin?'admintoken':'accesstoken'],
                        fileids:ids.join(','),
                        operatype:s.moveType,
                        sourceid:s.sourceid,
                        destinationid:s.destinationid
                    },
                    success(data){


                        if(data.getret === 0){
							var arr = [];
							
                           

							
						}

						return;
						var iNow = 0 
						var t = setInterval(() => {
							if(s.myCheckedList[iNow]){
								s.myCheckedList[iNow].isDone = true;
								s.myCheckedList = s.myCheckedList.concat([]);
							}
							else{
								clearInterval(t);
								s.$Message.success(data.getmsg);
								//s.$emit('update:transferShow',false);
								s.$emit('input',false);
								setTimeout(() => {
									s.myCheckedList.forEach((item)=>{
										item.isDone = false;
									})
								}, 100);
							}
							iNow++;
						}, 300);
						//
                    }
                })
            },
            cancel(){

            }
		}
	}
</script>
 

