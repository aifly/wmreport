<template>
	<div class="wm-myreport-main-ui">
		 <Split v-model="split1">
			<div slot="left" class="wm-myreport-left">
				<header > 
					 <span>我的上报</span> <Button icon='ios-cloud-upload-outline' size='small' type='primary'>上报</Button>
					 <div id='wm-upload'>1</div>
				</header>
				<section>
					<div v-if='reportList.length<=0' class="wm-no-report">
						<div >
							<img :src="imgs.shangbao" alt="">
							<Button type="primary" size='large'>点我上报</Button>
						</div>
					</div>
					<div v-else class="wm-report-list" :style="{height:viewH - 60-60-20+'px'}">
						<ul>
							<li @dblclick="previewReport(report)" @click.prevent='showDetail(report,i)'  class="wm-report-item" v-for='(report,i) in reportList' :key="i">
								<div :class="{'active':i === currentReportIndex}" class='wm-report-item-bg' :style="{background:'url('+(report.pcbilethum||imgs.poster)+') no-repeat center',backgroundSize:report.fileextname ==='jpg'||report.fileextname==='jpeg'||report.fileextname==='png'||report.fileextname==='gif'?'cover':'none'}"></div>
								<span v-if='!report.isLoaded' class="wm-file-progress">{{report.process}}</span>
								
								<div v-if='!report.isLoaded' class="wm-uploading"></div>
								<div class="wm-report-disabled-mask" v-if='report.status===2'></div>
								<span class="wm-file-disabled" v-if='report.status === 2'>
									<span>
									</span>
									被管理员发回，不可用
								</span>
								<div class="wm-report-action" v-if='report.isLoaded'>
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
										        @on-ok="deleteReport"
										        >
										        <div class="wm-del-ico"><Icon type="ios-trash-outline" /> 删除</div>
										    </Poptip>
											
										</li>
									</ul>
								</div>
								<div :title='report.newfilename' class="wm-report-item-name zmiti-text-overflow">{{report.filetitle}}</div>
							</li>	
						</ul>
					</div>
				</section>
			</div>
			<div slot="right" class="wm-myreport-right wm-scroll">
				<div class="wm-right-thumb" :style="{background:'url('+(reportList[currentReportIndex].pcbilethum||imgs.poster)+') no-repeat center center',backgroundSize:'cover'}">
					
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
					<div v-if='item.type === "text" ||item.type === "textarea"' @dblclick="editItem(item)" >
						<span v-if='!item.canedit'>{{reportList[currentReportIndex][item.fieldname]}}</span>
						<input @keydown.13="modifyReport(reportList[currentReportIndex][item.fieldname],item.fieldname)" v-if='item.canedit' type="text" v-model="reportList[currentReportIndex][item.fieldname]">
					</div>

					<div  v-if='item.type ===  "select" && item.canedit'>
						<Select @on-change='modifyPublicadtype(item.fieldname)'   v-model="formAdmin[item.fieldname]" size='small'  style="width:100px">
							<Option v-for="(dt,k) in item.data" :value="dt" :key="k">{{ dt.split('-')[0] }}</Option>
						</Select>
					</div>
					<div @dblclick="editItem(item)" v-if='item.type === "select" && !item.canedit'>
						{{formAdmin[item.fieldname]&& formAdmin[item.fieldname].split('-')[0]}}
					</div>

					<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
						<div class="wm-userlabel-header">
							<div>标签</div>
							<div><input type="text" placeholder="输入标签名" v-model="detailtag" @keydown.13='addTagByDetail(item)' /></div>
							<div>
								<div class="wm-add-label" @click='addTagByDetail(item.fieldname)'>

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
				<FormItem :label="item.name+'：'" :prop="item.field" v-for='(item,i) in configList' :key='i'> 
					<Input v-if='item.type === "text"'  v-model="formAdmin[item.fieldname]" :placeholder="item.name" autocomplete="off" />
					<Input v-if='item.type === "textarea" ' :type="item.type"  v-model="formAdmin[item.fieldname]" :placeholder="item.name" autocomplete="off"/>
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

		<div class="lt-full wm-report-C" v-if='showPreview'>
			<span class="wm-report-close" @click="closePreview"></span>
			<div  v-if='reportList[currentReportIndex].fileextname !== "mp3" &&reportList[currentReportIndex].fileextname!== "webm" &&reportList[currentReportIndex].fileextname !== "mp4" && reportList[currentReportIndex].fileextname!== "aac"&&reportList[currentReportIndex].fileextname!== "wma"&&reportList[currentReportIndex].fileextname!== "ogg"'>
				<img :class="reportList[currentReportIndex].fileextname" :src="reportList[currentReportIndex].pcbilethum||imgs.poster" alt="" />
				<div class="wm-report-detail"  :class="{'hide':showMaskDetail,[reportList[currentReportIndex].fileextname]:1}" >
					<span v-if='"xlsx doc pdf ppt xls docx html css scss js vb shtml zip".indexOf(reportList[currentReportIndex].fileextname)<=-1 '  @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div  class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
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
			<div v-if='reportList[currentReportIndex].fileextname=== "mp4" ||reportList[currentReportIndex].fileextname=== "webm" '>
				<video autoplay controls :src='reportList[currentReportIndex].filepath'></video>
				<div class="wm-report-detail wm-video-detail" :class="{'hide':showMaskDetail}" >
					<span @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
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
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				tag:"",
				currentReportIndex:0,
				showPreview:false,
				showMaskDetail:false,
				detailtag:'',
				colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				split1: 0.8,
				viewH:window.innerHeight,
				configList:[],
				formAdmin:{
					tagList:[]
				},
				ruleValidate: {
                     author:{
						 required:true,
						 trigger:'blur'
					 }
                },
				
				reportList:[{}],
				userinfo:{}
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
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			setTimeout(() => {
				this.upload(); 
			}, 100);
			 
			window.onkeydown = (e)=>{
				if(e.keyCode === 27 || e.keyCode === 8){
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
			this.getConfigFile();
			this.getMyreportList();

			this.$Notice.info({
				title: '双击上报作品可以预览'
			});
			
		},
		
		methods:{

			deleteReport(){
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadvuser/delresource/',
					data:{
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
						id:s.formAdmin.id
					},
					success(data){
						s.$Message[data.getret === 0?'success':'error'](data.getmsg);
						console.log(data);
						s.currentReportIndex  = 0;
						s.getMyreportList();
					}
				})
			},

			editReportByItem(p){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadvuser/editresource',
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.configList.forEach((it)=>{
								it.canedit = false;
							});
							s.configList = s.configList.concat([]);
						}
					}
				})
			},
			removeTag(filename,index){
				
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})

				this.formAdmin.tagList.splice(index,1);
				this.detailtag = '';
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[filename]:this.formAdmin.tagList.join(',')
				}
			
				this.editReportByItem(p);
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
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})

				this.formAdmin.tagList.push(this.detailtag);
				this.detailtag = '';
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[item.fieldname]:this.formAdmin.tagList.join(',')
				}
			
				this.editReportByItem(p);
				setTimeout(() => {
					this.getMyreportList();
				}, 400);
			},

			modifyPublicadtype(key){
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[key]:s.formAdmin[key]
				}
				this.editReportByItem(p)
			},

			modifyReport(model,key){
				

				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[key]:model
				}
				this.editReportByItem(p)
			},

			editItem(item){
				console.log(item);
				this.configList.forEach((it)=>{
					it.canedit = false;
				});
				item.canedit = true;
				this.configList = this.configList.concat([]);
			},
			closePreview(){
				this.showPreview = false;
				this.showMaskDetail = false;
			},

			previewReport(){//双击预览作品、
				this.showPreview = true;
			},

			showDetail(report,index){
				this.currentReportIndex = index;
				this.formAdmin = report;
				this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
				//this.currentReport = report;
			},
			showReportDetail(report){
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

				var index = this.formAdmin.tagList.indexOf(name);
				this.formAdmin.tagList.splice(index,1);
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

			getMyreportList(){
				var s = this;
				var {obserable} = Vue;
				var t = setInterval(()=>{
					var id  = obserable.trigger({
						type:'getCurrentSourceId'
					})
					var tableFields = obserable.trigger({
						type:"getFeildList"
					})
					
					if(id){

						this.configList = tableFields.concat([]);
						this.configList.map((col,i)=>{
							///s.formAdmin[col.fieldname] = '';
							if(col.notnull){
								setTimeout(() => {
									s.ruleValidate[col.fieldname] = { required: true, message: col.name + '不能为空', trigger: 'blur' }
								}, 1000);
							}
						})
						clearInterval(t);
						symbinUtil.ajax({
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

									s.reportList = data.list;
									s.formAdmin = s.reportList[s.currentReportIndex ];
									s.formAdmin.tagList = s.formAdmin.userlabel.split(',');
									//s.currentReport = s.reportList[0];
								}
							}
						})
					}
					
				},20)

			},

			upload(){

				var {obserable} = Vue;
				var id  = obserable.trigger({
					type:'getCurrentSourceId'
				})

				var s = this;
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
					pick: '#wm-upload',
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
					formData:{
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
						filetitle:"123",
						filedesc:"",
						publicadtype:"图片-zmiti",
						userlabel:"测试",
						author:"123",
						telphone:'110'

					}
				});
				// 当有文件添加进来的时候
				uploader.on('fileQueued', function (file) {
					 
					s.reportList.push({
						reportid:file.id,
						reportname:file.name,
						status:0,
						thumi:imgs.poster,
						type:file.type,
						process:0,
						bulk:file.size,
						size:'1920*1080',
						remark:'',
						suffix:file.ext,
						labels:''
					})
					/* // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
					$list.append('<div id="' + file.id + '" class="item">' +
						'<h4 class="info">' + file.name + '</h4>' +
						'<p class="state">等待上传...</p>' +
						'</div>'); */
				});
				// 文件上传过程中创建进度条实时显示。
				uploader.on('uploadProgress', function (file, percentage) {
					console.log(percentage * 100|0 + '%')
					var index = -1;
					var scale = (percentage * 100|0);
					s.reportList.forEach((item,i)=>{
						if(item.reportid === file.id){
							index = i;
							item.process = scale + '%';
							if(scale >=100){
								setTimeout(()=>{
									item.isLoaded = true;
									s.reportList = s.reportList.concat([]);
								},500)
							}
						}
					});
				
					//s.reportList = s.reportList.concat([]);
					/* var $li = $('#' + file.id),
						$percent = $li.find('.progress .progress-bar');

					// 避免重复创建
					if (!$percent.length) {
						$percent = $('<div class="progress progress-striped active">' +
							'<div class="progress-bar" role="progressbar" style="width: 0%">' +
							'</div>' +
							'</div>').appendTo($li).find('.progress-bar');
					}

					$li.find('p.state').text('上传中');

					$percent.css('width', percentage * 100 + '%'); */
				});

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				uploader.on('uploadSuccess', function (file) {
					console.log('success')
				//	$('#' + file.id).addClass('upload-state-done');
				});

				// 文件上传失败，显示上传出错。
				uploader.on('uploadError', function (file) {
					console.log('error')
					//$('#' + file.id).find('p.state').text('上传出错');
				});

				// 完成上传完了，成功或者失败，先删除进度条。
				uploader.on('uploadComplete', function (file) {
					console.log('uploadComplete');
					s.getMyreportList();
					/* $('#' + file.id).find('.progress').remove();
					$('#' + file.id).find('p.state').text('已上传'); */
				});
				uploader.upload();
			},
			ok(){
				
				var {obserable} = Vue;
				var s = this;
				var id  = obserable.trigger({
					type:'getCurrentSourceId'
				})
				
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
				}
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadvuser/editresource',
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
					}

				})
				
			},
			cancel(){
				this.formUser = {};
			},
			
		}
	}
</script>
 