<template>
	<section  class="wm-collection-statistics-manager">
		<div class='wm-statistics-user-count-C'>
            <div class='wm-statistics-user-upload-count'>
                <header>用户上报数</header>
                <div>
                    <div class='wm-statistics-user-count'>
                        <div>9885</div>
                        <div>总上报人数</div>
                    </div>
                </div>
            </div>
            <div class='wm-statistics-user-upload-list'>
                <Table :data='userList' :columns='columns'></Table>
            </div>
        </div>
		<div class='wm-statistics-file-count-C'>
            <div class='wm-statistics-user-upload-count'>
                 <header>作品总数</header>
                <div>
                    
                </div>
            </div>
            <div></div>
        </div>
	</section>
</template>

<script>
    import symbinUtil from '../lib/util';
    import './statistics.css';
	import Vue from "vue";
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
                userList:[],
                columns:[
                    {
                        title:'上传者',
                        key:'username',
                        align:'center'
                    },
                    {
                        title:'总数量',
                        key:'totalnum',
                        align:'center'
                    },
                    {
                        title:'已审核',
                        key:'checkednum',
                        align:'center'
                    },
                    {
                        title:'待审核',
                        key:'checkednum',
                        align:'center'
                    }
                ]
                

			}
		},
		components:{
		},
		watch:{

			mainType(val){
				if(val === 3){
				}
			},
			
		},
		methods:{

		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			 
		
 
		}
	}
</script>
 <style>
	
 </style>
 