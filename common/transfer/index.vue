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
					<div class='wm-report-checked-work-list'>
						<ul>
							<li v-for='(report,i) in checkedList' :key="i">
								<div class='wm-report-work-ico'><img :src="imgs.imgIco" alt=""></div>
								<div class='wm-report-work-name' :class='{"active":report.isDone}'>
									{{report.filetitle}}
									<Icon class='wm-report-work-staus' :type="report.isDone?'ios-checkmark-circle':'ios-close-circle'" />
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
    import Vue from 'vue';
    import WmColors from '../../components/lib/color';
	export default {
		props:['obserable','moveType','checkedList','sourceid','id'],
		name:'zmitiindex',
		data(){
			return{
                imgs:window.imgs,
                showClipDialog:true,
                destinationid:-1,
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
                        this.resourceList =  Vue.obserable.trigger({type:'getResourceList'}).filter((item=>{
                            return this.sourceid !== item.resourceid;
                        }));
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
			this.userinfo = symbinUtil.getUserInfo();
		},
		
		methods:{

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
                
                this.checkedList.map((item)=>{
                    ids.push(item.id);
                });

                ids = [this.id];
                symbinUtil.ajax({
                    url:window.config.baseUrl+ '/wmadvuser/operasourcedata/',
                    data:{
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
                        fileids:ids.join(','),
                        operatype:s.moveType,
                        sourceid:s.sourceid,
                        destinationid:s.destinationid
                    },
                    success(data){
                        if(data.getret === 0){
                            s.$Message.success(data.getmsg);
							s.$emit('closeClipDialog')

                        }
                    }
                })
            },
            cancel(){

            }
		}
	}
</script>
 

