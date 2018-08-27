<template>
	<div class="wm-collection-ui lt-full" @click.stop='showCondition = false;showCheckAction = false'>
		<div  class="wm-collection-left-pannel" :style="{height:viewH -   64+'px'}">
			<h2 class="zmiti-text-overflow">{{resourcecnname}}</h2>
			<ul>
				<li @click='mainType = 1' :class="{'active':mainType === 1}">评分管理</li>
				<li @click='mainType = 0' :class="{'active':mainType === 0}">上报管理</li>
			</ul>
		</div>
		<Result  v-if='mainType  === 1'></Result>

		<Split v-model='scale' v-if='mainType === 0'> 
			<div slot='left' class="wm-collection-left-main-ui">
					<header class='wm-collection-left-header'>
						<div class="wm-collection-title">
							<div>征集管理 > {{resourcecnname}}</div>
						</div>
						<div class="wm-collection-search-content">
							<div class="wm-collection-search-input-C">
								<div>
									<img :src='imgs.search'/>
									<div @click.stop='showCondition = true' class="wm-collection-search-condition">
										{{kwType}}
										<ul v-if='showCondition'>
											<li @click.stop='changeKwType("关键字")'>关键字</li>
											<li @click.stop='changeKwType("用户名")'>用户名</li>
										</ul>
									</div>
									<input v-model="keyword" @keydown='searchReport' placeholder="查询关键字"/>
								</div>
							</div>
							<div class="wm-collection-check-action">
								<Checkbox v-model="selectAll">全选</Checkbox>
								<Button type="primary" size='small' @click.stop='showCheckAction = true'>审核 <Icon type="ios-arrow-up" /></Button>
								<ul v-if='showCheckAction'>
									<li @click.stop="checkAction(1)">
										<Icon type="ios-checkmark-circle-outline" />
										通过
									</li>
									<li @click.stop="checkAction(2)">
										<Icon type="ios-close-circle-outline" />
										拒绝
									</li>
								</ul>
							</div>
						</div>
					</header>
					<header class="wm-collection-left-search-condition-header">
						<div>分类：<span @click.stop='searchByClassic("全部")'  :class="{'active':classicType == '全部'}">全部</span> <span @click.stop='searchByClassic(menu)' :class="{'active':classicType == menu}" v-for='(menu,i) in menus' :key="i">{{menu.split('-')[0]}}</span> </div>
						<div>状态：<span @click.stop='searchByStatus("全部")' :class="{'active':statusType == '全部'}">全部</span>
							<span @click.stop='searchByStatus("待审核")' :class="{'active':statusType == '待审核'}">待审核</span>
							<span :class="{'active':statusType == '已通过'}" @click.stop='searchByStatus("已通过")'>已通过</span>
							<span :class="{'active':statusType == '已拒绝'}" @click.stop='searchByStatus("已拒绝")'>已拒绝</span> </div>
					</header>
					<div class="wm-scroll wm-collection-report-list" :style="{height:viewH - 230+'px'}">
						<ul>
							<li @dblclick="previewReport(report)" @click='showDetail(report,i)'  class="wm-collection-report-item" v-for='(report,i) in reportList' :key="i">
								<div :class="{'active':i === currentReportIndex}" class='wm-report-item-bg' :style="{background:'url('+(report.pcbilethum||imgs.poster)+') no-repeat center',backgroundSize:report.fileextname ==='jpg'||report.fileextname==='jpeg'||report.fileextname==='png'||report.fileextname==='gif'?'cover':'none'}"></div>
								<div class="wm-collection-report-status">
									<img v-if='report.status===1' :src="imgs.pass" alt="">
									<img  v-if='report.status===2' :src="imgs.reject" alt="">
								</div>
								<div class="wm-collection-check">
									<Checkbox v-model="report.checked"></Checkbox>
								</div>
								<div class="wm-report-action" v-if='report.isLoaded'>
									<div class="wm-report-action-icon"></div>
								</div>
								<div v-if='report' :title='report.filetitle' class="wm-report-item-name zmiti-text-overflow">{{report.filetitle}}</div>
							</li>	
						</ul>
						<div class="wm-collection-pagetion">
							<Page :current='currentPage' @on-page-size-change='pagesizeChange' show-elevator show-sizer  @on-change='loadMoreReport' :total="totalnum" show-total :page-size='pagenum' />
						</div>
					</div>
				 
			</div>
			<div slot="right" class="wm-collection-right wm-scroll" v-if='reportList[currentReportIndex]'>
				<h1 style="height:30px"></h1>
				<div   class="wm-right-thumb">
					<div>
						<img :src='reportList[currentReportIndex].pcbilethum||imgs.poster' />	
					</div>
				</div>
				
				<div v-if='item.loading' class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
					<div v-if='item.fieldname!=="userlabel" && item.fieldname!=="filesize"&&(item.type === "text" ||item.type === "textarea"  ||item.type === "select")'>{{item.name}}：</div>
					<div v-if='item.fieldname!=="userlabel" && item.fieldname!=="filesize"&&(item.type === "text" ||item.type === "textarea")' @dblclick="editItem(item)" >
						<span v-if='!item.canedit'>{{reportList[currentReportIndex][item.fieldname]}}</span>
						<input autofocus @blur='modifyReport(reportList[currentReportIndex][item.fieldname],item.fieldname)' v-if='item.canedit' type="text" v-model="reportList[currentReportIndex][item.fieldname]">
					</div>

					<div v-if='item.fieldname ==="filesize" &&(item.type === "text" ||item.type === "textarea"  ||item.type === "select")'>{{item.name}}：</div>
					<div v-if='item.fieldname ==="filesize" &&(item.type === "text" ||item.type === "textarea")' @dblclick="editItem(item)" >
						<span v-if='!item.canedit'>{{reportList[currentReportIndex][item.fieldname]+ ' ' +reportList[currentReportIndex]['filesizeunit']}}</span>
					</div>

					<div  v-if='item.type ===  "select" && item.canedit'>
						<Select @on-change='modifyPublicadtype(item.fieldname)'   v-model="formAdmin[item.fieldname]" size='small'  style="width:100px">
							<Option v-for="(dt,k) in item.data" :value="dt" :key="k">{{ dt.split('-')[0] }}</Option>
						</Select>
					</div>
					
					<div @dblclick="editItem(item)" v-if='item.type === "select" && !item.canedit'>
						{{formAdmin[item.fieldname]&& formAdmin[item.fieldname].split('-')[0]}}
					</div>
					
					<div v-if='item.fieldname === "userlabel"'>标签：</div>
					<div class="wm-tag-list"  v-if='item.fieldname === "userlabel"'>
						<Tag  :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
					</div>

					<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
						<!-- <div class="wm-userlabel-header">
							<div>标签</div>
							<div><input type="text" placeholder="输入标签名" v-model="detailtag" @keydown.13='addTagByDetail(item)' /></div>
							<div>
								<div class="wm-add-label" @click='addTagByDetail(item)'>

								</div>
							</div>
							
						</div> -->
						<div class="wm-tag-list">
							<Tag  :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i'  v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
						</div>
					</section>
				</div>


			</div>
		</Split>


		<div class="lt-full wm-collection-report-C" v-if='showPreview'>
			<span class="wm-report-close" @click="closePreview"></span>
			<div  v-if='reportList[currentReportIndex].fileextname !== "mp3" &&reportList[currentReportIndex].fileextname!== "webm" &&reportList[currentReportIndex].fileextname !== "mp4" && reportList[currentReportIndex].fileextname!== "aac"&&reportList[currentReportIndex].fileextname!== "wma"&&reportList[currentReportIndex].fileextname!== "ogg"'>
				<img :class="reportList[currentReportIndex].fileextname" :src="reportList[currentReportIndex].pcbilethum||imgs.poster" alt="" />
				<div class="wm-report-detail"  :class="{'hide':showMaskDetail,[reportList[currentReportIndex].fileextname]:1}" >
					<span v-if='"xlsx doc docx pdf dmg txt ppt pptx xls rar html css scss js vb shtml zip m4a".indexOf(reportList[currentReportIndex].fileextname)<=-1 '  @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div  class="wm-myreport-title wm-myreport-field-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"'>{{item.name}}：</div>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if='reportList[currentReportIndex].fileextname=== "mp4" ||reportList[currentReportIndex].fileextname=== "webm" '>
				<video autoplay controls :src='reportList[currentReportIndex].filepath'></video>
				<div class="wm-report-detail wm-video-detail" :class="{'hide':showMaskDetail}" >
					<span @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div class="wm-myreport-title wm-myreport-field-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"'>{{item.name}}：</div>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if='reportList[currentReportIndex].fileextname=== "mp3" ||reportList[currentReportIndex].fileextname=== "ogg"||reportList[currentReportIndex].fileextname=== "aac"||reportList[currentReportIndex].fileextname=== "wma" '>
				<audio autoplay controls :src='reportList[currentReportIndex].filepath'></audio>
				<div class="wm-report-detail wm-audio" :class="{'wm-audio':showMaskDetail}"  >
					<div class="wm-myreport-title wm-myreport-field-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"'>{{item.name}}：</div>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
					</div>
				</div>
			</div>

			<section class="wm-report-check-in-mask" :class="{'hide':nextReport}">
				<div>
					<div  v-if='!reportList[currentReportIndex].raterid || reportList[currentReportIndex].score === 100' :class='{"pass":reportList[currentReportIndex].score === 100}'  class="wm-report-adopt" @click='checkReportById(reportList[currentReportIndex],1,currentReportIndex)'>
						<span>通过</span>
					</div>
					<div  v-if='!reportList[currentReportIndex].raterid  || reportList[currentReportIndex].score === 0' :class='{"reject":reportList[currentReportIndex].score === 0}'  class="wm-report-reject" @click='checkReportById(reportList[currentReportIndex],2,currentReportIndex)'>
						<span>拒绝</span>
					</div>
				</div>
				<div>
					<Input placeholder="请输入拒绝的原因(非必填)" :disabled='!!reportList[currentReportIndex].raterid' type="textarea" v-model="reportList[currentReportIndex].remark"/>
					<span v-if='!reportList[currentReportIndex].remark' class="wm-collection-placeholder">请输入拒绝的原因(非必填)</span>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import symbinUtil from '../lib/util';
	import Result from '../result/index';

	import Vue from "vue";

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				isLoading:false,
				selectAll:false,
				scale:.8,
				imgs:window.imgs,
				viewH:document.documentElement.clientHeight,
				resourcecnname:'',
				kwType:'关键字',
				showCondition:false,
				keyword:'',
				fieldname:-1,
				nextReport:false,
				reportList:[],
				showPreview:false,
				showMaskDetail:true,
				mainType:1,
				showCheckAction:false,
				configList:[],
				currentReportIndex:0,
				menus:[],
				classicType:'全部',
				statusType:'全部',
				publicadtype:-1,
				totalnum:0,
				status:-1,
				currentPage:0,
				classic:-1,
				page:1,
				pagenum:20,
				raterReportList:[],

			}
		},
		components:{
			Result
		},
		watch:{
			selectAll(val){
				this.reportList.forEach((item)=>{
					item.checked = val;
				})
			},
			mainType(val){
				
			}
		},
		methods:{

			searchReport(){
				if(this.keyword){
					clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						if(!this.keyword){
							this.fieldname = -1;
							this.getReportList();
							return;
						}
						this.fieldname = this.kwType ===  '用户名' ? 'username' : this.kwType ===  '关键字'? 'searchkey' : -1;
						this.page = 1;
						this.getReportList();

					}, 400);
				}
			},
			checkReportById(report,status,index){
				var  s = this;
				s.check(status,report.id, status === 2 ? report.remark : '');
			},

			loadMoreRaterReport(){

			},

			loadMoreReport(num){
				this.page = num;
				this.getReportList();
				
			},
			pagesizeChange(size){
				this.page = 1;
				this.pagenum = size;
				this.getReportList();
			},
			closePreview(){
				this.showPreview = false;
				this.showMaskDetail = false;
			},

			previewReport(){//双击预览作品、
				clearTimeout(this.clickTimer);
				this.showPreview = true;
			},

			showDetail(report,index){
				clearTimeout(this.clickTimer);
				this.clickTimer = setTimeout(() => {
					report.checked = !report.checked;
					this.currentReportIndex = index;
					this.formAdmin = report;
					this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
					//this.currentReport = report;
					this.reportList = this.reportList.concat([]);
				},200);
			},

			check(status,ids,remark=''){
				var s = this;
				var id = this.$route.params.id;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/checkresource/',
					data:{
						admintoken:s.userinfo.admintoken,
						adminusername:s.userinfo.adminusername,
						resourceid:id,
						status,
						ids:ids.join?ids.join(','):ids,
						remark
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.selectAll = false;
							s.getReportList();
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

			checkAction(status){
				this.showCheckAction = false;
				var s = this;
			
				var ids =  [];
				s.reportList.map((item)=>{
					if(item.checked){
						ids.push(item.id)
					}
				});
				if(!ids.length){
					s.$Message.error('请至少选择一个要审核的作品');
					return;
				}
				this.check(status,ids);
				
			},
			changeKwType(type){
				this.kwType = type;
				this.showCondition = false;
			},
			searchByClassic(type){
				this.classicType  = type;
				//this.statusType  = '全部';
				//publicadtype
				if(type !== '全部'){
					this.menus.map((menu)=>{
						if(type === menu){
							this.publicadtype = type;
						}
					})
				}else{
					this.publicadtype = -1;
				}
				this.page = 1;
				this.getReportList();

				
			},
			searchByStatus(type){
				this.statusType  = type;
				if(type !== '全部'){
					this.status = type === '待审核'? 0 : type === '已通过'? 1 : 2
				}else{
					this.status = -1;
				}
				this.page = 1;
				this.getReportList();
				//this.classicType  = '全部';
			},
			getReportList(){
				var id = this.$route.params.id;
				var s = this;

				var  p  ={
					admintoken:s.userinfo.admintoken,
					adminusername:s.userinfo.adminusername,
					resourceid:id,
					pagenum:s.pagenum,
					page:s.page
				};
				if(this.status !== -1){
					p.status = this.status;
				}
				if(this.publicadtype !== -1){
					p.publicadtype = this.publicadtype;
				}
				if(this.fieldname !== -1){
					p[this.fieldname] = this.keyword;
				}
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/getresouredetaillist/',
					data:p,
					success(data){
						
						var t = setInterval(()=>{
							var  resourceList = Vue.obserable.trigger({
								type:"getResource",
							});
							if(resourceList){
								clearInterval(t);
								console.log(resourceList);
								if(data.getret === 0){
									s.currentPage = 1;
									s.reportList = data.list;
									s.totalnum = data.totalnum;
									s.reportList.forEach((item)=>{
										item.checked = false;
									});
									
									if(s.reportList.length){
										s.currentReportIndex = 0;
										s.formAdmin = s.reportList[s.currentReportIndex];
										if(this.formAdmin && this.formAdmin.userlabel){
											this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
										}
									}
									resourceList.map((item)=>{
										if(item.resourceid === id){
											s.resourcecnname = item.resourcecnname;
											s.configList = JSON.parse(item.tablefield).fieldlist;
											s.configList.map((item)=>{
												if(item.fieldname === 'publicadtype'){
													s.menus = item.data;
												}
											})
										}
									})
								}
							}
						},30)
					}
				});
			}
			
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			this.getReportList();
			
			window.s = this;

			window.onkeydown = (e)=>{
				if(e.keyCode === 27 ){
					this.closePreview();
				}
				if(this.showPreview){
					if(e.keyCode === 37 ){
						this.currentReportIndex--;
						if(this.currentReportIndex<=-1){
							this.currentReportIndex = this.reportList.length -1;
						}
						this.currentReportIndex %= this.reportList.length;
						
					}
					else if(e.keyCode === 39){
						this.currentReportIndex++;
						this.currentReportIndex %= this.reportList.length;
					}
				}
			}
		}
	}
</script>
 <style>
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

 </style>
 