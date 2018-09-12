<template>
	<div class="wm-recruitaction-ui lt-full" >
		<header class="wm-recruitaction-header">
			<h1>征集管理</h1>
		</header>
		 <div class="wm-recruitaction-content">
			 <div class="wm-recruitaction-form">
				<div class="wm-recruitaction-progress">
					<div @click='current = 0' :class="{'active':current === 0}">
						<span>1</span>
					</div>
					<div @click='current = 1' :class="{'active':current === 1}">
						<span>2</span>
					</div>
				</div>
				<div v-if='current === 0'>
					<h1 class="wm-recruitaction-title">发布新的征集</h1>
					<div class="wm-recruitaction-form-item">
						<label for="">名称：</label><input v-model="formRecruit.resourcecnname" placeholder="请输入征集名称"/>
					</div>
					<div class="wm-recruitaction-form-item">
						<label for="">说明：</label><textarea v-model="formRecruit.resourcedesc"></textarea>
					</div>
					<div class="wm-recruitaction-form-item">
						<label for="">起止时间：</label>
					</div>
					<div class="wm-recruitaction-form-item">
						<label for="">路径：</label>
					</div>
					<div class="wm-recruitaction-form-item">
						<section>允许上传的类型</section>
						<Checkbox v-for='(item,i) in accepts' :key="i">{{item.name}}</Checkbox>
					</div>
				</div>
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
				current:0,
				accepts:window.config.accepts,
				formRecruit:{
					resourcecnname:'',
					resourcedesc:'',
					endtime:'',
					starttime:'',
					dirid:'',
					

				}
			}
		},
		components:{
			
		},
		watch:{
		
		},
		mounted() {
			 
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
 