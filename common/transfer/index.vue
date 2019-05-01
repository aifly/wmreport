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
				<Button class='wm-repeat-action-btn' icon='md-checkmark-circle' long @click='replace' >替换</Button>
				<Button icon='md-return-left' long @click="skip">跳过</Button>
			</div>
			<div slot="footer" class='wm-repeat-footer'>
				<div>
					<Checkbox v-model='isSelectAll'>全部都按此方式执行</Checkbox>
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
				unRepeatList:[],
				isSelectAll:false,
				
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
			this.scroll = new IScroll(this.$refs['list'],{
				scrollbars:true,
				mouseWheel:true
			});
		},
		
		methods:{

			skip(){//跳过
				this.operatorType = 0;//跳过
				if(this.isSelectAll){
					this.repeatList = this.repeatList.slice(0,0);
					this.showRepeatModal = false;
					this.$emit('input',false);
				}else{
					this.repeatList.shift();

					if(this.repeatList.length<=0){
						this.showRepeatModal = false;
						this.$emit('input',false);
					}else{
						this.showRepeatModal = false;
						setTimeout(() => {
							this.showRepeatModal = true;
						}, 500);
					}
				}

			},
			replace(){
				this.operatorType = 1;//替换
				if(this.isSelectAll){
					var fileid = this.checkedList;
					this.operasourcedata(fileid);				
				}else{
					var fileid = [this.checkedList.shift()];
					if(this.checkedList.length){

						this.operasourcedata(fileid);
						this.showRepeatModal = false;

						setTimeout(()=>{
							this.showRepeatModal = true;
						},500)
					}else{
						this.operasourcedata(fileid,true);
					}
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


			operasourcedata(checkedList,isDone=false){

				var ids = [];

				
				if(s.destinationid<=-1){
					s.$Message.error('请先选择一个要复制的目标库');
					s.showDialog = false;
					return;
				}
                
               	checkedList.map((item)=>{
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

				 util[this.isAdmin?'symbinAdminUtil':'symbinUtil'].ajax({
                    url:window.config.baseUrl+ '/wmadvuser/operasourcedata/',
                    data:{
						username:s.userinfo[s.isAdmin?'adminusername':'username'],
						usertoken:s.userinfo[s.isAdmin?'admintoken':'accesstoken'],
                        fileids:ids.join(','),
                        isreplace:s.operatorType,
                        operatype:s.moveType,
                        sourceid:s.sourceid,
                        destinationid:s.destinationid
                    },
                    success(data){


                        if(data.getret === 0){
							var arr = [];
						}
						if(!isDone){
							return;
						}
						
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

            ok(){
				var s = this;
				
				 s.getReportList(()=>{
				 	
					s.destinationList.forEach(dest=>{
						var isRepeat = false;
						s.myCheckedList.forEach(check=>{
							if(dest.id === check.id){
								s.repeatList.push(dest);
								isRepeat = true;
							}
						});
						if(!isRepeat){
							s.unRepeatList.push(dest);
						}
					});

					if(s.repeatList.length){
						s.showRepeatModal = true;
					}

					if(!s.destinationList.length){//目库里面的文件没有
						s.operasourcedata(s.checkedList);//未重复的时候，直接复制过去。
					}else{
						if(s.unRepeatList.length){
							s.operasourcedata(s.unRepeatList);//未重复的时候，直接复制过去。
						}
					}



				});

				
			     
				
               
            },
            cancel(){

            }
		}
	}
</script>
 

