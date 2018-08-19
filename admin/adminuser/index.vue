<template>
	<div class="wm-myreport-main-ui">
		 <Split v-model="split1">
			<div slot="left" class="wm-myreport-left">
				<header> 
					 <span>我的上报</span> <Button icon='ios-cloud-upload-outline' size='small' type='primary'>上报</Button>
				</header>
				<section>
					<div v-if='reportList.length<=0' class="wm-no-report">
						<div>
							<img :src="imgs.shangbao" alt="">
							<Button type="primary" size='large'>点我上报</Button>
						</div>
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

				reportList:[
					{
						reportid:'1',
						reportname:'我的上报',
						status:2,
						thumi:"",
						type:'jpg',
						process:1,
						bulk:'1.2M',
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
			
		},
		
		methods:{

			upload(){
				var uploader = WebUploader.create({
					// 选完文件后，是否自动上传。
					auto: false,
					// swf文件路径
					swf: './webuploader-0.1.5/Uploader.swf',
					// 文件接收服务端。
					server: 'http://api.zmiti.com/v2/fileupload',
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: '#picker',
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
				});
				// 当有文件添加进来的时候
				uploader.on('fileQueued', function (file) {
					/* // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
					$list.append('<div id="' + file.id + '" class="item">' +
						'<h4 class="info">' + file.name + '</h4>' +
						'<p class="state">等待上传...</p>' +
						'</div>'); */
				});
				// 文件上传过程中创建进度条实时显示。
				uploader.on('uploadProgress', function (file, percentage) {
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
				//	$('#' + file.id).addClass('upload-state-done');
				});

				// 文件上传失败，显示上传出错。
				uploader.on('uploadError', function (file) {
					//$('#' + file.id).find('p.state').text('上传出错');
				});

				// 完成上传完了，成功或者失败，先删除进度条。
				uploader.on('uploadComplete', function (file) {
					/* $('#' + file.id).find('.progress').remove();
					$('#' + file.id).find('p.state').text('已上传'); */
				});
            
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
			}
		}
	}
</script>
 