<template>
	<div class='wm-report-context-menu-ui'  >
		<div class='lt-full' @mousedown='closeMenu'></div>
		<div class="wm-report-context-menu-C" :style="contextMenuStyle">
			<ul>
				<slot name="edit"></slot>
				<li @click="fileMove(1)">
					<Icon type="md-folder" />复制
				</li>
				<li @click="fileMove(2)">
					<Icon type="ios-folder-open" />剪切
				</li>
				<li>
					<Poptip	
						style="color:#000;z-index:200;width:100%"
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
</template>

<script>
	import symbinUtil from '../../components/lib/util';
    import Vue from 'vue';
    import WmColors from '../../components/lib/color';
	import IScroll from 'iscroll';
	import './index.css';
	export default {
		props:['obserable','contextMenuStyle','showReportDetail','fileMove','deleteReport'],
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
		
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			
		},
		
		methods:{
			closeMenu(){
				this.$emit('closeMenu');
			},
			 

		}
	}
</script>
 

