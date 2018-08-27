<template>
	<div class="wm-detail-main-ui">
		<header>
			<span>征集管理>评选详情>票数</span>
			<ul>
				<li @click='currentType = 0' :class="{'active':currentType === 0}">全部({{totalnum}})</li>
				<li @click='currentType = 1' :class="{'active':currentType === 1}">通过({{passnum}})</li>
				<li @click='currentType = 2' :class="{'active':currentType === 2}">拒绝({{rejectnum}})</li>
			</ul>
		</header>
	</div>
</template>

<script>
	import './index.css';
	import symbinUtil from '../lib/util';
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				visible:false,
				totalnum:0,
				passnum:0,
				rejectnum:0,
				imgs:window.imgs,
				isLoading:false,
				currentType:0,
				viewH:window.innerHeight,
				currentRateid:-1,
				formAdmin:{
					raterpwd:'111111'
				},
				
				raterList:[],
				
				userinfo:{}
			}
		},
		components:{
		},
		beforeCreate(){
			
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			
		},
		
		methods:{
			
		}
	}
</script>