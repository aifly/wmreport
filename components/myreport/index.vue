<template>
	<div class="wm-myreport-main-ui">


		

		 <Split v-model="split1">
			<div slot="left" class="wm-myreport-left">
				<div class="wm-myreport-upload-C lt-full">

				</div>
				<header > 
					 <span>我的上报 </span><span style='font-size:12px;color:#f5a420;left:70px;'>(双击打开浏览)</span>
					 <ul>
						 <li @click='changeCurrentType(i)' v-for='(menu,i) in menus' :key="i" :class="{'active':currentType === i}">
							 <img v-if='i===0' :src="imgs.imgIco" alt="">
							 <img v-if='i===1' :src="imgs.videoIco" alt="">
							 <img v-if='i===2' :src="imgs.audioIco" alt="">
							 <img v-if='i===3' :src="imgs.dongmanIco" alt="">
							 <img v-if='i===4' :src="imgs.h5Ico" alt="">
							 上报{{menu.split('-')[0]}}
						 </li>
					 </ul>
					 <div class='wm-report-operator-btns'>
						 <div><Checkbox v-model="selectAll">全选</Checkbox></div>
						 <div size='small' class='wm-report-copy'>复制到其它库</div>
						 <div size='small' class='wm-report-copy'>剪切到其它库</div>
						 <div size='small' class='wm-report-del' >
							 <Poptip	
								style="color:#000"
								confirm
								title="确定要删除此作品吗?"
								@on-ok="deleteReport('all')"
								>
								<div class="wm-del-ico">删除</div>
							</Poptip>
						 </div>
					 </div>
					 <a :href="'#/download/'+$route.params.id">查看全部>></a>
				</header>
				<section>
					<div class="wm-myreport-list-C">
						<div v-show='reportList.length<=0 && hasAuth' class="wm-no-report">
							<div >
								<img :src="imgs['upload'+(currentType+1)]" alt="">
								<Button type="primary" size='large'>点我上报</Button>
								<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
								<div class="wm-upload-tip" style="color:#f5a420;font-size:16px;font-weight:bold;" v-html='"支持上传格式："+accepts[currentType].extensions'></div>
								<div class="wm-upload"  @click='showUploadDialog = true' ></div>
							</div>
						</div>
						<div v-if='reportList.length>0' class="wm-report-list" :style="{height:viewH - 60-70-20- 80+'px'}">
							<ul>
								<li @dblclick="previewReport(report)" @contextmenu.prevent='showContextMenuDialog(report,$event)' @click.prevent='showDetail(report,i)'  class="wm-report-item" v-for='(report,i) in reportList' :key="i">
									<div class="wm-report-status" v-if='report.status === 0'>
										<img :src="imgs.uncheck1" alt="">
									</div>
									<div class="wm-report-check" @click="toggleChecked(i)">
										<Checkbox v-model="report.checked"></Checkbox>
									</div>
									<div  class="wm-report-status" v-if='report.status === 1'>
										<img :src="imgs.pass1" alt="">
									</div>
									<div :class="{'active':i === currentReportIndex}" class='wm-report-item-bg' >
										<img :src="report.mobilethum||imgs.poster" alt="">
									</div>
									<span v-if='!report.isLoaded' class="wm-file-progress">{{report.process}}</span>
									
									<div v-if='!report.isLoaded' class="wm-uploading"></div>
									<div class="wm-report-disabled-mask" v-if='report.status===2'></div>
									<span class="wm-file-disabled" v-if='report.status === 2'>
										<span>
										</span>
										被管理员发回，不可用
									</span>
									<div class="wm-report-action" v-if='report.isLoaded && !isUpLoading && false'>
										<div class="wm-report-action-icon"></div>
										<ul>
											<li @click='showReportDetail(report)'>
												<Icon type="ios-create" /> 编辑
											</li>
											<li>

												<Poptip	
													style="color:#000"
													confirm
													title="确定要删除此作品吗?"
													@on-ok="deleteReport(i)"
													>
													<div class="wm-del-ico"><Icon type="ios-trash-outline" /> 删除</div>
												</Poptip>
												
											</li>
										</ul>
									</div>
									<div v-if='report' :title='report.filetitle' class="wm-report-item-name zmiti-text-overflow">{{report.filetitle}}</div>
								</li>	
							</ul>
						</div>
					</div>
					<footer class="wm-report-footer" v-show='hasAuth'>
						<div v-show='currentType === 0 && reportList.length>0' >
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加图片</span>
							</div>
							<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
						</div>
						<div v-show='currentType === 1 && reportList.length>0' class="wm-uplad-add-video">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加视频</span>
							</div>
							<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
						</div>
						<div v-show='currentType === 2 && reportList.length>0' class="wm-uplad-add-audio">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加音频</span>
								<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
							</div>
						</div>
						<div v-show='currentType === 3 && reportList.length>0' class="wm-uplad-add-dongman">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加动漫</span>
								<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
							</div>
						</div>
						<div v-show='currentType === 4 && reportList.length>0' class="wm-uplad-add-h5">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加h5</span>
								
							</div>
						</div>
					</footer>
				</section>
			</div>
			<div slot="right" class="wm-myreport-right wm-scroll" v-if='reportList[currentReportIndex]'>
				<div   class="wm-right-thumb">
					<img :src='reportList[currentReportIndex].mobilethum||imgs.poster' />	
				</div>
				
				<div v-if='item.loading' class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
					<div v-if='item.fieldname!=="userlabel" && (item.type === "text" ||item.type === "textarea"  ||item.type === "select")'>{{item.name}}：</div>
					<div v-if='item.fieldname!=="userlabel" && item.fieldname!=="filesize"&&(item.type === "text" ||item.type === "textarea")' >
						<span v-if='!item.edit'>{{reportList[currentReportIndex][item.fieldname]}}</span>

						<input :placeholder="item.placeholder" @blur='modifyReport(reportList[currentReportIndex][item.fieldname],item.fieldname)' v-else type="text" v-model="reportList[currentReportIndex][item.fieldname]">
					</div>

					<div v-if='item.fieldname ==="filesize && false" &&(item.type === "text" ||item.type === "textarea"  ||item.type === "select")'>{{item.name}}：</div>
					<div v-if='item.fieldname ==="filesize" &&(item.type === "text" ||item.type === "textarea")' @dblclick="editItem(item)" >
						<span v-if='!item.canedit'>{{(reportList[currentReportIndex][item.fieldname]||'')}} {{(reportList[currentReportIndex]['filesizeunit']||'')}}</span>
					</div>

					<div  v-if='item.type ===  "select"'>
						<Select @on-change='modifyPublicadtype(item.fieldname)'   v-model="formAdmin[item.fieldname]" size='small'  style="width:100px">
							<Option v-for="(dt,k) in item.data" :value="dt" :key="k">{{ dt.split('-')[0] }}</Option>
						</Select>
					</div>
					
					<div @dblclick="editItem(item)" v-if='false && item.type === "select" && !item.canedit '>
						{{formAdmin[item.fieldname]&& formAdmin[item.fieldname].split('-')[0]}}
					</div>

					<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
						<div class="wm-userlabel-header">
							<div>标签</div>
							<div><input type="text" placeholder="输入标签名" v-model="detailtag" @keydown.13='addTagByDetail(item)' /></div>
							<div>
								<div class="wm-add-label" @click='addTagByDetail(item)'>

								</div>
							</div>
							
						</div>
						<div class="wm-tag-list">
							<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i' closable v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
						</div>
					</section>
				</div>


			</div>
		</Split>


		<Modal
			v-model="visible"
			title="编辑作品信息"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="72" :rules="ruleValidate">
				<FormItem v-if='item.edit' :label="item.name+'：'" :prop="item.field" v-for='(item,i) in configList' :key='i'> 
					<Input v-if='item.type === "text"'  v-model="formAdmin[item.fieldname]" :placeholder="item.name" autocomplete="off" />
					<Input v-if='item.type === "textarea" ' :type="item.type"  v-model="formAdmin[item.fieldname]" :placeholder="item.placeholder||item.name" autocomplete="off"/>
					<Select v-model="formAdmin[item.fieldname]" v-if='item.type === "select"'>
						<Option v-for="(dt,k) in item.data" :value="dt" :key="dt">{{ dt.split('-')[0] }}</Option>
					</Select>

					<div class="wm-tags" v-if='item.type === "label"'>
						<input placeholder="按回车添加标签" type="text" v-model="tag" @keydown.13='addTag' />
						<Tag @on-close="deltag(tag)" closable :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" v-for="(tag,i) in formAdmin.tagList" :key='i'>{{tag}}</Tag>
					</div>
				</FormItem>
				 
			</Form>
		</Modal>

		<div class='wm-report-context-menu-ui'  v-if='showContextMenu' >
			<div class='lt-full' @mousedown= 'showContextMenu = false'></div>
			<div class="wm-report-context-menu-C" :style="contextMenuStyle">
				<ul>
					<li @click='showReportDetail()' >
						<Icon type="ios-create"  /> 编辑
					</li>
					<li @click="showClipDialog = true;moveType = 1">
						<Icon type="md-folder" />复制
					</li>
					<li @click="showClipDialog = true;moveType = 2">
						<Icon type="ios-folder-open" />剪切
					</li>
					<li>
						<Poptip	
							style="color:#000;z-index:200"
							confirm
							title="确定要删除此作品吗?"
							@on-ok="deleteReport('single')"
							>
							<div class="wm-del-ico"><Icon type="ios-trash-outline" /> 删除</div>
						</Poptip>
						
					</li>
				</ul>
			</div>
		</div>


		<Modal
			:footer-hide='true'
			v-model="showUploadDialog "
			:title="'添加上报'+(menus[currentType]?menus[currentType].split('-')[0]:'')"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form  ref="formUpload" :model="formUpload" :label-width="90" >
				<FormItem class="wm-report-upload-item"  :label="item.name+'：'" :prop="item.field" v-for='(item,i) in configList' v-if='item.edit || item.fieldname === "userlabel"' :key='i'  :class="{'wm-require':item.notnull}"> 

					<Input @on-blur='checkUpload' v-if='(item.type === "text" ||item.fieldname === "filetitle")&& item.fieldname !== "userlabel"'  v-model="formUpload[item.fieldname]" :placeholder="item.placeholder||item.name" autocomplete="off" />
					
					<Input  @on-blur='checkUpload' v-if='item.fieldname === "filedesc" '  type="textarea"  v-model="formUpload[item.fieldname]"  :placeholder="item.placeholder||item.name" autocomplete="off"/>
					<div  v-if='item.type === "select"'>
						<Select @on-change='checkUpload($event,"select")' v-model="formAdmin[item.fieldname]">
							<Option v-for="(dt,k) in item.data" :value="dt" :key="dt">{{ dt.split('-')[0] }}</Option>
						</Select>
					</div>

					<div class="wm-tags" v-if='item.fieldname === "userlabel"'>
						<input placeholder="按回车添加标签" type="text" v-model="beforeUploadTag" @keydown.13='addTagBeforeUpload' />
						<Tag color='warning' @on-close="deltag(tag)" closable  v-for="(tag,i) in formUpload.tagList" :key='i'>{{tag}}</Tag>
					</div>
				</FormItem>

				<FormItem class="wm-before-upload-C">
					<section :class="{'disabled':!showUploadFile}">
						<div class="wm-upload-before" v-show='showUploadFile'></div>
						<Icon type="ios-add-circle" />
						<div>上传附件</div>
					</section>
					<div class="wm-upload-tip" style="position: absolute;bottom: 0;width: 300px;margin-left: 30px;color:#f5a420;font-size:16px;font-weight:bold;    word-wrap: break-word;" v-html='"支持上传格式："+accepts[currentType].extensions'></div>
				</FormItem>

				<FormItem class="wm-before-upload-C" label="">
					<div style="margin-left:-80px;color:#b20000">提示：选择文件后自动上传</div>
				</FormItem>
				 
			</Form>
		</Modal>
		<Detail  :configList='configList' type="myreport" :showPreview='showPreview'  :showMaskDetail='showMaskDetail' :currentReportIndex='currentReportIndex' :closePreview='closePreview' :reportList='reportList'></Detail>

		<div class="wm-report-tips lt-full" v-if='showReportTip'>
			<img :src="imgs.tip" alt="" @click="showReportTip = false">
		</div>
 
		<Transfer @closeClipDialog='closeClipDialog' :moveType='moveType' :id='currentReport.id' :checkedList='checkedList' :sourceid='$route.params.id' v-if='showClipDialog' ></Transfer>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';
	import QRCode from '../lib/qrcode';
	import Detail from '../../common/mask/detail';
	import WmColors from '../lib/color';

	import Transfer from '../../common/transfer';
	
	var json = {};
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				showUploadDialog:false,
				visible:false,
				showClipDialog:false,
				imgs:window.imgs,
				WmColors,
				moveType:1,//文件迁移类型1：复制 2:剪切
				selectAll:false,
				isUpLoading:false,
				showContextMenu:false,
				tag:"",
				destinationid:-1,
				currentReport:{},
				beforeUploadTag:"",
				currentType:0,
				resourceList:[],
				accepts:[
					{
						title: 'Images',
						extensions: 'gif,jpg,jpeg,bmp,png,tiff,tif',
						mimeTypes: 'image/*'
					},{
						title: 'Video',
						extensions: 'mp4,webm,mov,quicktime',
						mimeTypes: 'video/*'
					},{
						title: 'Audio',
						extensions: 'aac,ogg,aac,wma,mp3,vnd.dlna.adts',
						mimeTypes: 'auido/*'
					},{
						title: 'All',
						extensions: 'mp3,gif,jpg,jpeg,bmp,png,tiff,tif,mp4,webm,mov,aac,ogg,aac,wma,vnd.dlna.adts',
						mimeTypes: '*/*'
					},{
						title: 'Images',
						extensions: 'gif,jpg,jpeg,bmp,png,tiff,tif',
						mimeTypes: 'image/*'
					}
				],
				publicadtype:"",
				currentReportIndex:0,
				showOriginalImg:false,
				showPreview:false,
				showMaskDetail:true,
				detailtag:'',
				showReportTip:false,
				defaultReportList:[],
				hasAuth:false,
				contextMenuStyle:{
					left:0,
					top:0
				},
				menus:[],
				colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				split1: 0.8,
				viewH:window.innerHeight,
				showUploadFile:false,
				isLowIE:false,
				configList:[],
				formUpload:{
					tagList:(window.config.defaultLabbel||'').split(' ')
				},
				formAdmin:{
					tagList:(window.config.defaultLabbel||'').split(' ')
				},
				ruleValidate: {
                     author:{
						 required:true,
						 trigger:'blur'
					 }
                },
				checkedList:[],
				reportList:[],
				userinfo:{}
			}
		},
		components:{
			Detail,
			Transfer
		},

		beforeCreate(){
			window.s = this;
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		watch:{

			showClipDialog:{
				handler(val){
					this.showContextMenu = false;
					if(val){
						this.resourceList =  Vue.obserable.trigger({type:'getResourceList'});
						this.reportList.forEach((item)=>{
							item.checked = false;
							this.checkedList = this.checkedList.slice(0,0);
						})
						this.currentReport.checked = true;
						//this.reportList = this.reportList.concat([])
						this.checkedList.push(this.currentReport);
						
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
			showUploadDialog(val){
				this.configList.forEach((item)=>{
					if(item.fieldname === 'previewurl' && this.menus[this.currentType] === 'h5-zmiti'){
						item.notnull = val|0;
					}
				});
			},
			"$route.params.id":(val)=>{
				json.getMyreportList(()=>{
					json.changeCurrentType(0,'first');
				});
				json.getAuth();
			}
		},
		mounted(){
			json = this;

			var nav = navigator.userAgent;
			this.isLowIE = /MSIE 9/.test(nav) || /MSIE 8/.test(nav)||/MSIE 7/.test(nav)||/MSIE 6/.test(nav)||/MSIE 7/.test(nav)

			if(this.isLowIE){
				$('#zmiti-error').show();
			}
			



			this.userinfo = symbinUtil.getUserInfo();
			this.getAuth();
			this.getMyreportList(()=>{
				this.changeCurrentType(0,'first');
			});
			var {obserable} = Vue;
			
			var t = setInterval(()=>{
				
				var id  = this.$route.params.id;
				
				if(id){
					clearInterval(t);
					setTimeout(() => {
						this.upload(id);
					}, 1000);
				}
			},20)

			obserable.on('searchReport',data=>{
				this.searchByKW(data);
			})
			window.onkeydown = (e)=>{
				if(e.keyCode === 27 || e.keyCode === 8){
					this.showReportTip = false;
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
			this.getConfigFile();
			

			/* this.$Notice.info({
				title: '双击上报作品可以预览'
			}); */

			if(!window.localStorage.getItem('wm-report-tip')){
				this.showReportTip = true;
				window.localStorage.setItem('wm-report-tip',1);
			} 
		},
		
		methods:{

			closeClipDialog(){
				this.showClipDialog = false;
			},
			showContextMenuDialog(report,e){
				this.contextMenuStyle = {
					left:e.pageX + 'px',
					top:e.pageY + 'px'
				};
				this.currentReport = report;
				this.showContextMenu = true;
			},

			getAuth(){
				var id = this.$route.params.id;
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadvuser/getuserauth',
					data:{
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
					},
					success(data){
						if(data.getret === 0){
							if(data.authtype<2){//没有写的权限；
								s.hasAuth = false;
							}else{
								s.hasAuth = true;
							}
						}
						
					}
				})
			},

			checkUpload(val,type){
				this.showUploadFile = true;
				
				this.configList.map((item)=>{
					if(item.notnull && item.edit){
						if(!this.formUpload[item.fieldname] && item.fieldname !== 'publicadtype'){
							this.showUploadFile = false;		
						}
					}
				});

				if(s.menus[this.currentType] === 'h5-zmiti'){
					if(!this.formUpload['previewurl']){
						this.showUploadFile = false;	
					}
				}
				
				if(type === 'select'){
					this.configList.forEach((item)=>{
						if(item.fieldname === 'previewurl'){
							item.notnull = val === 'h5-zmiti' ? 1 : 0;
						}
					});
					
					this.configList.forEach((item)=>{
						if(val === 'h5-zmiti' && !this.formUpload.previewurl){
							this.showUploadFile = false;		
							//item.notnull = val === 'h5-zmiti' ? 1 : 0;
							
						}
					});
				
					s.menus.map((item,i)=>{
						if(item === val){
							this.changeCurrentType(i);
						}
					})
				}
				//console.log(this.showUploadFile);
				if(this.showUploadFile){
					var id  = this.$route.params.id;
					this.upload(id);
				}
			},

			changeCurrentType(index,type){
				var s = this;
				this.currentType = index;
				var id = this.$route.params.id;
				this.upload(id);
				this.currentReportIndex = 0;
				this.filterReportList();
				
				this.formAdmin['publicadtype'] = this.menus[index];
				if(!type && false){
					s.formUpload = s.reportList[s.currentReportIndex ] || {
						tagList:[],
						publicadtype:s.menus[index]
					};
	
					s.formUpload.userlabel  = s.formUpload.tagList? s.formUpload.tagList.join(',') : '';
					s.formAdmin = s.reportList[s.currentReportIndex ] || {
						tagList:[],
						publicadtype:s.menus[index]
					};

					s.formAdmin.userlabel && (s.formAdmin.tagList = s.formAdmin.userlabel.split(','));
				}
			


			},
			toggleChecked(index){
				var isChecked = !this.reportList[index].checked;
				this.reportList[index].checked = isChecked;
				this.reportList = this.reportList.concat([]);
				if(isChecked){
					this.checkedList.push(this.reportList[index]);
				}else{
					this.checkedList.forEach((item,i)=>{
						if(item.id === this.reportList[index].id){
							this.checkedList.splice(i,1);
						}
					});
				}
			},

			deleteReport(type='single'){
				if(this.isUpLoading){
					return;
				}

				this.showContextMenu = false;

				var s = this;
				var id = this.$route.params.id;
				var ids = [];

				if(type === 'single'){
					ids = [this.currentReport.id];
				}
				else if(type === 'all'){//批量删除
					this.checkedList.map((item)=>{
						ids.push(item.id);
					})
				}


				if(ids.length<=0){
					this.$Message.warning('请选择一个要删除的文件');
					return;
				}


				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/delresource/',
					data:{
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
						id:ids.join(',')
					},
					success(data){
						s.$Message[data.getret === 0?'success':'error'](data.getmsg); 
						//s.reportList.splice(i,1);


						//s.currentReportIndex  = s.reportList.length -1;
						s.getMyreportList();
						
					}
				})
			},

			searchByKW(kw){
				var s = this;
				if(kw){
					s.reportList = s.reportList.filter((item)=>{
						return item.filetitle.indexOf(kw)>-1;
					});
				}else{
					s.getMyreportList();
				}
			},

			editReportByItem(p){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/editresource',
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.configList.forEach((it)=>{
								it.canedit = false;
							});
							s.reportList[s.currentReportIndex].status = 0;
							s.getMyreportList();
							s.configList = s.configList.concat([]);
						}
					}
				})
			},
			removeTag(filename,index){
				
				var s = this;
				var id = this.$route.params.id;

				this.formAdmin.tagList.splice(index,1);
				this.detailtag = '';
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[filename]:this.formAdmin.tagList.join(',')
				}
			
				this.editReportByItem(p,'移除标签');
				setTimeout(() => {
					this.getMyreportList();
				}, 400);
			},
			addTagByDetail(item){
				if(!this.detailtag){
					this.$Message.error('标签名不能为空');
					return;
				}
				var s = this;
				var id = this.$route.params.id;
				this.formAdmin.tagList = this.formAdmin.tagList||[];
				this.formAdmin.tagList.push(this.detailtag);
				this.detailtag = '';
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[item.fieldname]:this.formAdmin.tagList.join(',')
				}
			
				this.editReportByItem(p,'添加标签');
				setTimeout(() => {
					this.getMyreportList();
				}, 400);
			},

			modifyPublicadtype(key){
				var s = this;
				var id = this.$route.params.id;
				if(!s.formAdmin.id){
					return;
				}
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[key]:s.formAdmin[key]
				}
				this.editReportByItem(p,'修改分类');
			},

			modifyReport(model,key){
				
				var s = this;
				var id = this.$route.params.id;
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[key]:model
				}
				this.editReportByItem(p,'修改作品 :'+key);
			},

			editItem(item){
				if(!item.edit){
					return;
				}
				this.configList.forEach((it)=>{
					it.canedit = false;
				});
				item.canedit = true;
				this.configList = this.configList.concat([]);
			},
			closePreview(){
				this.showPreview = false;
				this.showMaskDetail = true;
				this.showOriginalImg = false;
			},

			previewReport(){//双击预览作品、
				if(this.isUpLoading){
					return;
				}
				this.showPreview = true;
				var s = this;
				if(s.menus[s.currentType] === "h5-zmiti"&&s.reportList[s.currentReportIndex].previewurl){
					setTimeout(() => {
						new QRCode(this.$refs['qrcode'],{
							height:130,
							width:130,
							text:s.reportList[s.currentReportIndex].previewurl
						})
					}, 100);
				}
			},

			showDetail(report,index){
				if(this.isUpLoading){
					return;
				}
				this.currentReportIndex = index;
				this.formAdmin = report;
				this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
				//this.currentReport = report;
			},
			showReportDetail(){
				
				var report = this.currentReport;
				if(this.isUpLoading){
					return;
				}

				this.showContextMenu = false;
				this.visible = true;
				this.formAdmin = report;
				this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
				var s = this;
				this.configList.map((col,i)=>{
					//s.formAdmin[col.fieldname] = '';
					if(col.notnull){
						s.ruleValidate[col.fieldname] = { required: true, message: col.name+'不能为空', trigger: 'blur' }
					}
				})
			},

			deltag(name){

				var index = this.formUpload.tagList.indexOf(name);
				this.formUpload.tagList.splice(index,1);

				if(this.showUploadFile){
					var id  = this.$route.params.id;
					this.upload(id);
				}
			},
			addTagBeforeUpload(){
				if(!this.beforeUploadTag){
					return;
				}
				this.formUpload.tagList = this.formUpload.tagList || [];
				this.formUpload.tagList.push(this.beforeUploadTag);
				this.beforeUploadTag =  '';
				if(this.showUploadFile){
					var id  = this.$route.params.id;
					this.upload(id);
				}
			},
			addTag(){
				if(!this.tag){
					return;
				}
		
				this.formAdmin.tagList = this.formAdmin.tagList || [];
				this.formAdmin.tagList.push(this.tag);
				this.tag = '';
			},
			
			getConfigFile(){
				/*var s = this;
				$.getJSON('./components/myreport/data.json',(data)=>{
					console.log(data);
					s.configList = data.collectionitems;
					data.collectionitems.map((col,i)=>{
						s.formAdmin[col.fieldname] = '';
						if(col.notnull){
							s.ruleValidate[col.field] = { required: true, message: col.name+'不能为空', trigger: 'blur' }
						}
					})
				})*/
			},

			filterReportList(){
				
				this.reportList = JSON.parse(this.defaultReportList).filter((item)=>{
					return item.publicadtype === this.menus[this.currentType];
				});
				this.currentReportIndex = 0;
				this.formAdmin = this.reportList[this.currentReportIndex]||{};
				//this.reportList = this.reportList.concat([]);
			},
			getMyreportList(fn){
				var s = this;
				var {obserable} = Vue;
				
				var t = setInterval(()=>{
					
					var id  = s.$route.params.id;
					var tableFields = obserable.trigger({
						type:"getFeildList",
						data:s.$route.params.id
					})
				
					if(tableFields){
					
						
						this.configList = tableFields.concat([]);
						
						this.configList.map((col,i)=>{
							
							///s.formAdmin[col.fieldname] = '';
							if(col.fieldname === 'publicadtype'){
								s.menus = col.data.concat([]);
							}
							
						})
						
						clearInterval(t);
						symbinUtil.ajax({
							_this:s,
							url:window.config.baseUrl+"/wmadvuser/getmyreportdata",
							data:{
								username:s.userinfo.username,
								accesstoken:s.userinfo.accesstoken,
								resourceid:id
							},
							success(data){
								if(data.getret === 0){
									data.list.forEach((item)=>{
										item.isLoaded = true;
									});
									s.reportList = data.list.concat([]);
									s.defaultReportList =  JSON.stringify(data.list);
									var ids = [];
									
									s.reportList.forEach((item)=>{
										ids.push(item.id);
										item.checked = false;
										s.checkedList.forEach((ls)=>{
											if(ls.id === item.id){
												item.checked = true;
											}
										})
									});

									s.getviews('views',id,ids);
									s.saveIPinfo('views',id,ids);

									window.list=  JSON.stringify(data.list);
									
									fn && fn();
									if(s.reportList.length>0){

										s.filterReportList();
										if( s.currentReportIndex>-1){
											s.formAdmin = s.reportList[ s.currentReportIndex ]||{};
										
										    s.formAdmin && s.formAdmin.userlabel &&(s.formAdmin.tagList = s.formAdmin.userlabel.split(','));
										}
									}
									//s.currentReport = s.reportList[0];
								}
							}
						})
					}
					
				},20)

			},

			saveIPinfo(key='views',resourceid,ids){
                var s = this;
                symbinUtil.ajax({
                    _this:s,
                    url:window.config.baseUrl+'/wmadadmin/getipaddress',
                    data:{
						id:ids.join(','),
						field:key,
						resourceid
                    },
                    success(data){
                        
                    }
                })
            },


			getviews(key='views',resourceid,ids){
				if(ids.length<=0){
					return;
				}
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmshare/getviews',
					data:{
						resourceid,
						id:ids.join(','),
						field:key
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							if(key === 'downloads'){
								s.reportList.forEach((item,i)=>{
									ids.forEach((id,k)=>{
										if(item.id === id){
											item.downloads += 1;
										}
									})
								})
							}
						}
					}
				})
			},



			upload(id){

				
				var s = this;
				var data = s.configList.filter((item)=>{return  item.fieldname === 'publicadtype'})[0];
				if(data){
					data = data.data;
				}
				else{
					window.location.hash = '/login';
				}
				s.formUpload.tagList = s.formUpload.tagList || [];
				var p = {
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
						uploadfilename:s.formUpload.filetitle,
						filedesc:s.formUpload.filedesc,
						publicadtype:s.menus[s.currentType],
						userlabel:s.formUpload.tagList.concat([]).join(','),
						author:s.formUpload.author,
						telphone:s.formUpload.telphone,
						previewurl:s.formUpload.previewurl
				}
				this.p = p;
				if(s.uploader){
					
					s.uploader.destroy();
				}
				var accepts  =  s.accepts;
				var uploader = WebUploader.create({
					// 选完文件后，是否自动上传。
					auto: true,
					// swf文件路径
					swf: './webuploader-0.1.5/Uploader.swf',
					// 文件接收服务端。
					//server: 'http://api.zmiti.com/v2/fileupload',
					server: window.config.baseUrl+'/wmadvuser/uploadfile/',
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: '.wm-upload-before',
					chunkSize:10*1024*1024,
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
					compress:false,
					prepareNextFile:true,//是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
					formData:p,
					thumb:{
						
						//height: 110,
						// 图片质量，只有type为`image/jpeg`的时候才有效。
						quality: 100,
						// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
						allowMagnify: true,
						// 是否允许裁剪。
						crop: true,
						// 为空的话则保留原有图片格式。
						// 否则强制转换成指定的类型。
						type: 'image/jpeg'
					},
				
					accept:accepts[s.currentType],
					dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				});

				uploader.on('uploadBeforeSend',function(obj,data){
					data.uploadfilename = s.formUpload.filetitle;
					data.filedesc = s.formUpload.filedesc;
					data.publicadtype = s.menus[s.currentType];
					if(s.formUpload.tagList){
						data.userlabel = s.formUpload.tagList.concat([]).join(',');
					}
					data.author = s.formUpload.author;
					data.telphone = s.formUpload.telphone;
					data.previewurl = s.formUpload.previewurl;
				});
				
				uploader.on('dndAccept',(file,a)=>{
					console.log(accepts[s.currentType].extensions,(file['0'].type.split('/')[1]))

					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
						return;
					}

					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadvuser/getuserauth',
						data:{
							username:s.userinfo.username,
							usertoken:s.userinfo.accesstoken,
							resourceid:id,
						},
						success(data){
							if(data.getret === 0){
								if(data.authtype<2){//没有写的权限；
									s.$Message.error('您没有上传的权限');
									uploader.stop();
								}else{
								
								}
							}
							
						}
					})

				})

				uploader.on("beforeFileQueued",function(file){
					if(accepts[s.currentType].extensions.indexOf(file['type'].split('/')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						return;
					}
					var data = s.configList.filter((item)=>{return item.fieldname === 'publicadtype'})[0]?s.configList.filter((item)=>{return item.fieldname === 'publicadtype'})[0].data:[]
					s.publicadtype = {data:data[s.currentType]}||'';
					s.showUploadDialog = false;
				});

				s.uploader = uploader;

				// 当有文件添加进来的时候

				
				var i = 0;
				var fileIndex = 0;
				
				uploader.on('fileQueued', function (file) {

					i++;
					s.isUpLoading = true;

					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadvuser/getuserauth',
						data:{
							username:s.userinfo.username,
							usertoken:s.userinfo.accesstoken,
							resourceid:id,
						},
						success(data){
							if(data.getret === 0){
								if(data.authtype<2){//没有写的权限；
									s.$Message.error('您没有上传的权限');
									uploader.stop();
								}else{
									uploader.upload();
									s.reportList.unshift({
										reportid:file.id,
										reportname:file.name,
										status:0,
										mobilethum:imgs.poster,
										type:file.type,
										process:0,
										bulk:file.size,
										size:'1920*1080',
										remark:'',
										suffix:file.ext,
										labels:''
									})
										
									uploader.makeThumb( file, function( error, ret ) {
										
										if ( error ) {
										} else {
											uploader.base64 = ret;
											
										}
									},1000,1000);
								}
							}
							
						}
					})

					
					 
					
					
				});
				// 文件上传过程中创建进度条实时显示。
					var index = -1;
				uploader.on('uploadProgress', function (file, percentage) {

					
					var scale = (percentage * 100|0);
					s.reportList.forEach((item,i)=>{
						if(item.reportid === file.id){
							index = i;
							item.process = scale + '%';
							if(scale >=100){
								setTimeout(()=>{
									item.isLoaded = true;
									s.reportList = s.reportList.concat([]);
									s.getMyreportList();
								},1500)
							}
						}
					});
				 
				});

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				var iNow = 0;
				uploader.on('uploadSuccess', function (file,response) {
					if(response.getret === 2000){
						s.$Message.error('您没有上传的权限');
						return;
					};
					setTimeout(() => {
						
						if(s.formAdmin.publicadtype !== '图片-zmiti'){
							iNow++;
							if(iNow === i){
								s.formUpload = {
									tagList:[]
								};
								s.formAdmin = {
									tagList:[]
								}
								s.getMyreportList();
								s.isUpLoading = false;
							}
							return;
						}
						var w = file._info.width;
						var h = file._info.height;
						var width =0,height = 0;
						if(w>800){
							width = 800;
							height = h * 800 / w;
						}else{
							width = w;
							height = h;
						}
						
						uploader.makeThumb( file, function( error, ret ) {
						
							if ( error ) {
							} else {
								uploader.base64 = ret;
								if(uploader.base64 && response.id){

									s.reportList.forEach((item)=>{
										if(item.reportid === file.id){
											item.mobilethum = ret;
										};
									})
									setTimeout(() => {
										s.reportList = s.reportList.concat([]);
									}, 10);

									symbinUtil.ajax({
										url:window.config.baseUrl+'/wmadvuser/base64_image/',
										data:{
											username:s.userinfo.username,
											usertoken:s.userinfo.accesstoken,
											resourceid:id,
											id:response.id,
											setcontents:uploader.base64,
											width:w,
											height:h
										},
										success(data){
											if(data.getret === 0){
												iNow++;
												if(iNow === i){
													s.formUpload = {
														tagList:[]
													};
													s.formAdmin = {
														tagList:[]
													}
													s.getMyreportList();
													s.isUpLoading = false;
												}
											}
										}
									})
								}
								
							}
						},width,height);

					}, 100);

					
					
				

					
				//	$('#' + file.id).addClass('upload-state-done');
				});

				// 文件上传失败，显示上传出错。
				uploader.on('uploadError', function (file) {
					console.log('error')
					s.$Message.error('文件上传超时，请刷新重试');
					//$('#' + file.id).find('p.state').text('上传出错');
				});

				// 完成上传完了，成功或者失败，先删除进度条。
				
				uploader.on('uploadComplete', function (file) {
					
					//
					/* $('#' + file.id).find('.progress').remove();
					$('#' + file.id).find('p.state').text('已上传'); */
				});
				
			},
			ok(){
				
				var {obserable} = Vue;
				var s = this;
				var id  =  this.$route.params.id;
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id
				}
				for(var attr in s.formAdmin){
					if(s.formAdmin[attr] && attr !== 'username' && attr !== 'tagList'){
						p[attr] = s.formAdmin[attr]
					}
					if(attr === 'tagList' && s.formAdmin[attr].length){
						p.userlabel = s.formAdmin[attr].join(',')
					}
					if(attr === 'filepath' || attr === 'pcbilethum' || attr === 'mobilethum'){
						delete p[attr];
					}
				}
				
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/editresource',
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
					}

				})
				
			},
			cancel(){
			//	this.formUser = {};
			},
			
		}
	}
</script>
 

