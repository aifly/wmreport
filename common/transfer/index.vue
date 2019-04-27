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
		props:['obserable','moveType','checkedList','sourceid','id','isAdmin'],
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
                showDialog:true,
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
						this.destinationid1 = this.resourceList[0].resourceid;

						setTimeout(()=>{

							console.log(1);
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

			getResource(){
				
			},

			visibleChange(val){
				if(!val){
					this.$emit('closeClipDialog')
				}
			},

            ok(){
                var s = this;
                var ids = [];

               /*  s.checkedList.forEach((item)=>{
                    item.isDone = true;
                });
                var i = 0;
                var t = setInterval(() => {
                    if(s.checkedList[i]){
                        s.checkedList[i].isDone = true;
                        s.checkedList = s.checkedList.concat([]);
                    }else{
                        clearInterval(t);
                        s.checkedList = s.checkedList.concat([]);
                    }
                    i++;
                }, 600);
                
                setTimeout(() => {
                    this.showClipDialog = false;
                }, 3000);

				return; */
				
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
				console.log(s.userinfo,'userinfo')
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
								s.$emit('closeClipDialog')
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
 

