<template>
	<div class="wm-rater-main-ui">
		<Split v-model='scale'>
			<div slot='left'>
				<header class="wm-rater-header">
					<div>{{resourceName}}</div>
					<div class="wm-rate-tabs">
						<ul>
							<li @click='getRateDataById(0)' :class="{'active':currentType === 0}">全部({{totalnum}})</li>
							<li @click='getRateDataById(1)' :class="{'active':currentType === 1}">待评({{unratenum}})</li>
							<li @click='getRateDataById(2)' :class="{'active':currentType === 2}">已评({{ratenum}})</li>
						</ul>
					</div>
				</header>
				<header class="wm-rater-search-where">
					<span>筛选条件：</span>
					<ul>
						<li @click="publictype ='全部'" :class="{'active':publictype === '全部'}">全部</li>
						<li @click="publictype =condition" :class="{'active':publictype === condition}" v-for="(condition , i ) in conditions" :key="i">
							{{condition.split('-')[0]}}
						</li>
					</ul>
				</header>
				<header class="wm-report-list-title">
					<div>介绍</div>
					<div>点评</div>
				</header>
				<section class='wm-scroll' :style="{height:viewH - 230+'px',overflow:'auto'}">
					<div class="wm-report-list">
						<transition-group name="reportitem" tag='ul'>
							<li @dblclick="previewReport(report)" :class="{'active':currentReportIndex === i}" v-for="(report,i) in reportList "  @click.prevent='showDetail(report,i)' :key="i">
								<div class="wm-report-item">
									<div class="wm-report-detail">
										<div class="wm-report-pcbilethum">
											<div>
												<img :src="report.pcbilethum" alt="">
											</div>
										</div>
										<div class="wm-report-detail-content">
											<div  v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc"||item.fieldname === "userlabel"' class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
												<div v-if='item.fieldname !== "userlabel"'>{{item.name}}：</div>
												<div  class="zmiti-text-overflow" v-if='item.fieldname !== "userlabel"' :class="item.fieldname">
													<span :title="report[item.fieldname]">{{report[item.fieldname]}}</span>
												</div>
												<div v-if='item.fieldname === "userlabel"'>标签：</div>
												<div class="wm-tag-list" v-if='item.fieldname === "userlabel"'>
													<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (report[item.fieldname]||'').split(',')">{{tag}}</Tag>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="wm-report-rate-C">
									<div class="wm-report-rate-input">
										<Input :disabled='!!report.raterid' type='textarea' v-model='report.comments' placeholder='请输入您的评价' />
									</div>
									<div class="wm-report-rate-btns">
										<div>
											<transition name='pass'>
												<div :class='{"pass":report.score === 100}' v-if='!report.raterid || report.score === 100' class="wm-report-adopt" @click='checkReport(report,100,i)'>
													<span>{{report.score === 100 ? '已':''}}通过</span>
												</div>
											</transition>
											<transition name="reject">
												<div :class='{"reject":report.score === 0}'   v-if='!report.raterid  || report.score === 0' class="wm-report-reject" @click='checkReport(report,0,i)'>
													<span>{{report.score === 0 ? '已':''}}拒绝</span>
												</div>
											</transition>
										</div>
									</div>
								</div>
							</li>
						</transition-group>
						<div class="wm-load-more" @click="loadMoreReport">
							<span v-if='reportList.length<( currentType === 0 ? totalnum : currentType === 1 ? unratenum : ratenum )'>
								{{isLoading?'加载中...':'加载更多>>'}}
							</span>
							<span v-else>
								{{reportList.length<=0?'暂无数据':'数据已全加载完成'}}
							</span>
							<Icon v-if='isLoading' type="ios-loading" />
						</div>
					</div>
				</section>
			</div>
			<div slot='right' v-if='reportList.length>0' class="wm-myreport-right wm-scroll">
				<div   class="wm-right-thumb">
					<div>
						<img :src='reportList[currentReportIndex].pcbilethum||imgs.poster' />	
					</div>
				</div>
				<div class="wmmyreport-title wm-myreport-item">
					<div>大小：</div>
					<div>{{reportList[currentReportIndex].filesize}}{{reportList[currentReportIndex].filesizeunit}}</div>
				</div>
				<div class="wmmyreport-title wm-myreport-item">
					<div>时间：</div>
					<div>{{(reportList[currentReportIndex].createtime||'').substring(0,10)}}</div>
				</div>
				<div class="wmmyreport-title wm-myreport-item">
					<div>格式：</div>
					<div>{{reportList[currentReportIndex].fileextname}}</div>
				</div>
				<div class="wmmyreport-title wm-myreport-item">
					<div>尺寸：</div>
					<div>{{reportList[currentReportIndex].fileattr}}</div>
				</div>
				<div class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
					<div v-if='item.type === "text" ||item.type === "textarea"  ||item.type === "select"'>{{item.name}} :</div>
					<div v-if='item.type === "text" ||item.type === "textarea"' >
						<span v-if='!item.canedit'>{{reportList[currentReportIndex][item.fieldname]}}</span>
					</div>

					<div  v-if='item.type === "select"'>
						{{reportList[currentReportIndex][item.fieldname]&& reportList[currentReportIndex][item.fieldname].split('-')[0]}}
					</div>

					<div class="wm-tag-list" v-if='item.fieldname === "userlabel"'>
						标签：
					</div>
					<div class="wm-tag-list" v-if='item.fieldname === "userlabel"'>
						<Tag  :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i' closable v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
					</div>
					
				</div>
			</div>
		</Split>
		

		<div class="lt-full wm-report-C" v-if='showPreview'>
			<span class="wm-report-close" @click="closePreview"></span>
			<div :class='{"original":showOriginalImg}'  v-if='reportList[currentReportIndex].fileextname !== "mp3" &&reportList[currentReportIndex].fileextname!== "webm" &&reportList[currentReportIndex].fileextname !== "mp4" && reportList[currentReportIndex].fileextname!== "aac"&&reportList[currentReportIndex].fileextname!== "wma"&&reportList[currentReportIndex].fileextname!== "ogg"'>
				<img @dblclick.stop="showOriginalImg = !showOriginalImg" :class="reportList[currentReportIndex].fileextname" :src="reportList[currentReportIndex].pcbilethum||imgs.poster" alt="" />
				<div class="wm-report-detail"  :class="{'hide':showMaskDetail,[reportList[currentReportIndex].fileextname]:1}" >
					<span v-if='"xlsx doc pdf ppt xls docx html css scss js vb shtml zip dmg".indexOf(reportList[currentReportIndex].fileextname)<=-1 '  @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc" ||item.fieldname === "userlabel"'  class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc"'>{{item.name}} :</div>
						<div v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
						<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
							<div>标签：</div>
							<div class="wm-tag-list">
								<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
							</div>
						</section>
					</div>
				</div>
			</div>
			<div v-if='reportList[currentReportIndex].fileextname=== "mp4" ||reportList[currentReportIndex].fileextname=== "webm" '>
				<video autoplay controls :src='reportList[currentReportIndex].filepath'></video>
				<div class="wm-report-detail wm-video-detail" :class="{'hide':showMaskDetail}" >
					<span @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div  v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc" ||item.fieldname === "userlabel"' class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc" '>{{item.name}} :</div>
						<div v-if='item.fieldname === "filetitle"||item.fieldname === "filedesc" ' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
						<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
							<div>标签：</div>
							<div class="wm-tag-list">
								<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
							</div>
						</section>
					</div>
				</div>
			</div>
			<div v-if='reportList[currentReportIndex].fileextname=== "mp3" ||reportList[currentReportIndex].fileextname=== "ogg"||reportList[currentReportIndex].fileextname=== "aac"||reportList[currentReportIndex].fileextname=== "wma" '>
				<audio autoplay controls :src='reportList[currentReportIndex].filepath'></audio>
				<div class="wm-report-detail wm-audio" :class="{'wm-audio':showMaskDetail}"  >
					<div class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.type === "text" ||item.type === "textarea"  ||item.type === "select"'>{{item.name}} :</div>
						<div v-if='item.type === "text" ||item.type === "textarea"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
						<div v-if='item.type === "select"'>
							{{formAdmin[item.fieldname]&& formAdmin[item.fieldname].split('-')[0]}}
						</div>
						<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
							<div>标签：</div>
							<div class="wm-tag-list">
								<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
							</div>
						</section>
					</div>
				</div>
			</div>

			<section class="wm-report-check-in-mask" :class="{'hide':nextReport}">
				<div>
					<Input placeholder="请输入您的评价" :disabled='!!reportList[currentReportIndex].raterid' type="textarea" v-model="reportList[currentReportIndex].comments"/>
				</div>
				<div>
					<div  v-if='!reportList[currentReportIndex].raterid || reportList[currentReportIndex].score === 100' :class='{"pass":reportList[currentReportIndex].score === 100}'  class="wm-report-adopt" @click='checkReport(reportList[currentReportIndex],100,currentReportIndex)'>
						<span>{{reportList[currentReportIndex].score === 100 ? '已':''}}通过</span>
					</div>
					<div  v-if='!reportList[currentReportIndex].raterid  || reportList[currentReportIndex].score === 0' :class='{"reject":reportList[currentReportIndex].score === 0}'  class="wm-report-reject" @click='checkReport(reportList[currentReportIndex],100,currentReportIndex)'>
						<span>{{reportList[currentReportIndex].score === 0 ? '已':''}}拒绝</span>
					</div>
				</div>
			</section>
		</div>
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
				publictype:'全部',
				isLoading:true,
				showOriginalImg:false,//是否显示原始图片。
				showMaskDetail:true,
				showPreview:false,
				nextReport:false,
				currentType:0,
				currentReportIndex:0,
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
				totalnum:0,
				unratenum:0,
				ratenum:0,
				page:1,
				pagenum:20,
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
			
			window.s = this;

			var t = setInterval(()=>{
				var configList = Vue.obserable.trigger({
					type:'getFeildList'
				});
				console.log(1)
				if(configList){
					clearInterval(t);
					this.configList = configList;
					this.conditions = this.configList.filter((item)=>{
						return item.fieldname === 'publicadtype'
					})[0].data;

					var data = Vue.obserable.trigger({
						type:'getCurrentSource'
					});
					this.resourceName  = data.resourcecnname;
					this.resourceid  = data.resourceid;
					this.getRaterlist();
				}
			},30);

			Vue.obserable.on('searchReportByKw',(kw)=>{
				s.reportList = [];
				if(kw.trim()){
					s.getRaterlist(kw);
				}else{
					s.getRaterlist();
				}
			});

			window.onkeydown = (e)=>{
				if(e.keyCode === 27 ){
					this.closePreview();
				}
				if(this.showPreview){
					if(e.keyCode === 37 ){
						this.currentReportIndex--;
						this.currentReportIndex %= this.reportList.length;
						
					}
					else if(e.keyCode === 39){
						this.currentReportIndex++;
						this.currentReportIndex %= this.reportList.length;
					}
				}
			}
		},
		watch:{
			publictype(val){
				this.currentType  = 0;
				this.reportList = [];
				if(val === '全部'){
					this.getRaterlist();
				}
				else{
					this.getRaterlist('',val);
				}
			}
		},
		methods:{

			closePreview(){
				this.showPreview = false;
				this.showMaskDetail = false;
				this.showOriginalImg = false;//显示原始图片
			},

			previewReport(){//双击预览作品、
			   this.showMaskDetail = true;
			   this.showPreview = true;
			},

			showDetail(report,index){
				this.currentReportIndex = index;
				this.formAdmin = report;
				this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
				//this.currentReport = report;
			},
			checkReport(report,score,i){
				var s = this;
				if(report.raterid){
					//s.$Message.error('当前作品已评');
					return;
				}

				symbinUtil.ajax({

					url:window.config.baseUrl+"/wmreview/gradingwork",
					data:{
						ratername:s.userinfo.ratername,
						accesstoken:s.userinfo.accesstoken,
						worksid:report.id,
						score,
						resourceid:s.resourceid,
						comments:report.comments
					},
					success(data){
						s.$Message[data.getret === 0?'success':'error'](data.getmsg);
						if(data.getret === 0){

							if(s.currentType === 0){
								s.reportList[i].score = score;
								s.reportList[i].raterid = s.userinfo.raterid; 
							}else{
								s.reportList.splice(i,1);
							}
							if(s.showPreview){
								s.currentReportIndex++;
								s.currentReportIndex %= s.reportList.length;
								s.nextReport = true;
								setTimeout(() => {
									s.nextReport = false;
								}, 400);

							}else{
								s.currentReportIndex = 0;

							}
						
						}
					}

				})				
			},
			loadMoreReport(){

				if(this.reportList.length<( this.currentType === 0 ? this.totalnum : this.currentType === 1 ? this.unratenum : this.ratenum )){
					this.page++;
					this.getRaterlist();
				}

			},
			getRateDataById(index){
				this.currentType = index;
				this.reportList = [];
				this.page = 1;

				this.getRaterlist();
			},
			getRaterlist(kw='',publictype=''){
				var s = this;

				this.isLoading = true;

				var p = {
						username:s.userinfo.ratername,
						usertoken:s.userinfo.accesstoken,
						resourceid:s.resourceid,
						status:s.currentType,
						page:s.page,
						pagenum:s.pagenum
					}

				if(kw){
					p.searchkey = kw;
					this.page = 1;
				}
				if(this.publictype !== '全部'){
					this.page = 1;
					p.publictype = this.publictype;
				}

				
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmrateruser/getresourcelist',
					//validate:s.validate,
					data:p,
					success(data){
						s.isLoading = false;
						if(data.getret === 0){
							s.reportList = s.reportList.concat( data.list);
							s.totalnum = data.totalnum;
							s.unratenum = data.nohavescorenum||0;
							s.ratenum = data.havescorenum||0;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			}
		 
		}
	}
</script>
 
 <style>
	.wm-load-more i{
		-webkit-animation:1s rotate infinite linear;		
	}
 </style>
 