<template>
	<div class="wm-label-ui lt-full" >
		<header>标签管理</header>
		<div class="wm-label-main-content">
			<header>
				<ul>
					<li>
						增加分类
						<span  class='wm-decorate'></span>
					</li>
					<li>
						增加分类1
						<span  class='wm-decorate'></span>
					</li><li>
						增加分类1
						<span  class='wm-decorate'></span>
					</li><li>
						增加分类1
						<span  class='wm-decorate'></span>
					</li>
				</ul>
			</header>
			<div class='wm-lable-list'>

			</div>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import symbinUtil from '../lib/util';
	import Vue from "vue";
	
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
				viewH:document.documentElement.clientHeight,
				resourceList:[]
			}
		},
		components:{
		},
		watch:{
		
		},
		mounted() {
			
			var t = setInterval(()=>{
				var dataList = Vue.obserable.trigger({
					type:'getResourceList'
				});
				if(dataList){
					clearInterval(t);
					var arr = [];
					/* for(var i = 0 ; i<10;i++){
						arr = arr.concat(dataList);
					} */
					this.resourceList =  dataList;
				
				}
			},30);
		},
		methods:{

			
		}
	}
</script>
 <style>


 </style>
 