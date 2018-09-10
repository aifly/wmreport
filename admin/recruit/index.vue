<template>
	<div class="wm-recurit-ui lt-full" @click.stop='showCondition = false;showCheckAction = false'>
		<header class="wm-recurit-header">
			<h1>征集管理</h1>
			<div><Icon type="ios-create-outline" />发布新的征集</div>
		</header>
		<div class="wm-recurit-list wm-scroll">
			<ul>
				<li v-for='(item,i) in resourceList' :key="i">
					<header>
						<div>{{item.resourcecnname}}</div>
					</header>
				</li>
			</ul>
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
				page:1,
				pagenum:20,
				resourceList:[],

			}
		},
		components:{
			
		},
		watch:{
		
		},
		mounted() {
			
			var t = setInterval(()=>{
				var dataList = Vue.obserable.trigger({
					type:'getResource'
				});
				if(dataList){
					clearInterval(t);
					this.resourceList = dataList;
				
				}
			},30);
		},
		methods:{

			
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
 