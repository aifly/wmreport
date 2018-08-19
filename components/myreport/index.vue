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
							<li  class="wm-report-item" v-for='(report,i) in reportList' :key="i">
								<div class='wm-report-item-bg' :style="{background:'url('+report.thumi+') no-repeat center',backgroundSize:'cover'}"></div>
								<span v-if='!report.isLoaded' class="wm-file-progress">{{report.process}}</span>
								<div class="wm-report-disabled-mask" v-if='report.status===2'></div>
								<span class="wm-file-disabled" v-if='report.status===2'>
									<span>
									</span>
									被管理员发回，不可用
								</span>
								<div class="wm-report-action">
									<div class="wm-report-action-icon"></div>
									<ul>
										<li>
											<Icon type="ios-create" /> 编辑
										</li>
										<li>
											<Icon type="ios-trash-outline" /> 删除
										</li>
									</ul>
								</div>
								<div class="wm-report-item-name">{{report.reportname}}</div>
							</li>	
						</ul>
					</div>
				</section>
			</div>
			<div slot="right" class="wm-myreport-right">
				Right Pane
			</div>
		</Split>

	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				split1: 0.8,
				viewH:window.innerHeight,

				reportList:[
					{
						reportid:'1',
						reportname:'我的上报',
						status:0,
						thumi:imgs.poster,
						type:'jpg',
						process:'0%',
						bulk:'1.2M',
						isLoaded:true,
						size:'1920*1080',
						remark:'说明',
						suffix:'jpg',
						labels:''
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
			this.upload(); 
			for(var i = 0;i<0;i++){

				this.reportList.push({
					reportid:i+1,
					reportname:'我的上报',
					status:2,
					thumi:imgs.poster,
					type:'jpg',
					process:1,
					bulk:'1.2M',
					isLoaded:true,
					size:'1920*1080',
					remark:'说明',
					suffix:'jpg',
					labels:''
				})
			}
		},
		
		methods:{

			upload(){

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
						resourceid:1
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
					/* $('#' + file.id).find('.progress').remove();
					$('#' + file.id).find('p.state').text('已上传'); */
				});
				uploader.upload();
			},
			ok(){
				if(this.formUser.newpassword  !== this.formUser.surepassword){
					this.$Message.error('新密码和确认密码不一致');
					return false;
				}
				var s = this;

				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmuser/modify_password',
					validate:s.validate,
					data:{
						oldpassword:s.formUser.oldpassword,
						password:s.formUser.newpassword,
						repassword:s.formUser.surepassword
					},success(data){

						if(data.getret === 0){
							s.$Message.warning('请重新登录');
							window.location.hash =  '/login';
						}else{
							s.$Message.error('修改密码失败');
						}
					}

				})
				
			},
			cancel(){
				this.formUser = {};
			},
			
		}
	}
</script>
 