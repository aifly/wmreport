			
<template>
	<section  class="wm-collection-survey-manager">
		<div class="lt-full" style="">
			<div class="zmiti-survey-header">
				<h2>{{resourcecnname}}</h2>
				<div class="zmiti-survey-classic">
					<div class="zmiti-survey-pv">
						<div>
							<img :src="imgs.eye" alt="">
						</div>
						<div>
							<div>浏览量</div>
							<div>总：<span>{{total.viewsnum}}</span></div>
						</div>
					</div>
					<div class="zmiti-survey-download">
						<div>
							<img :src="imgs.download" alt="">
						</div>
						<div>
							<div>下载量</div>
							<div>总：<span>{{total.downloads}}</span></div>
						</div>
					</div>
					<div class="zmiti-survey-upload">
						<div>
							<img :src="imgs.upload" alt="">
						</div>
						<div>
							<div>上传量</div>
							<div>总：<span>{{total.totalnum}}</span></div>
							<div>(今日：{{total.todayuploadnumber}})</div>
						</div>
					</div>

					<div class="zmiti-survey-works">
						<div>
							<img :src="imgs.works" alt="">
						</div>
						<div>
							<div>作品数</div>
							<div>总：<span>{{total.totalnum}}</span></div>
							<div>(H5：{{total.typenum}})</div>
						</div>
					</div>
					<div class="zmiti-survey-users">
						<div>
							<img :src="imgs.users" alt="">
						</div>
						<div>
							<div>上传人数</div>
							<div>总：<span>{{total.uploadnumber}}</span></div>
							<div>(今日上传人数：{{total.todayuploadnumber}})</div>
						</div>
					</div>

				</div>
			</div>
			<div class="zmiti-survey-main">
				<div class="zmiti-survey-map">
					<div class="zmiti-survey-select">
						<Select  v-model="mapType" @on-change='loadMapData'>
							<Option value='downloads'>下载量</Option>
							<Option value='views'>浏览量</Option>
						</Select>
					</div>
					<div ref='myEchart' class="zmiti-survey-chart">
						
					</div>
				</div>
				<div class="zmiti-survey-rank">
					 <Collapse class='zmiti-survey-collapse' @on-change='change' v-model="value2" accordion>
				        <Panel name="1">
				            省份排行榜
				            <Table slot="content" :columns="proviceColumns" :data="proviceData" :height='viewH-64-150 - 200'></Table>
				        </Panel>
				        <Panel name="2">
				            作品排行榜
				            <Table slot="content" :columns="worksColumns" :data="worksData" :height='viewH-64-150 - 200'></Table>
				        </Panel>
				        <Panel name="3">
				            上传单位排行榜
				            <Table slot="content" :columns="companyColumns" :data="userData" :height='viewH-64-150 - 200'></Table>
				        </Panel>
				    </Collapse>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
    import symbinUtil from '../lib/util';
    import './survey.css';
	import Vue from "vue";
	import ECharts from 'vue-echarts';
	import echarts from "echarts";
	import '../../node_modules/echarts/map/js/china.js'
	export default {
		props:['obserable','resourcecnname','userJson','id'],
		name:'zmitiindex',
		data(){
			return{
               chart: null,
               imgs:window.imgs,
               value2:'1',
               mapType:'downloads',
               viewH:window.innerHeight,
               total:{
	               downloads:0,//总下载量
	               viewsnum:0,//总浏览量,
	               typenum:0,//H5作品数量，
	               uploadnumber:0,//上传量
	               totalnum:0,//作品总数量
	               todayuploadnumber:0,
	               todayuploadnum:0
               },
               proviceData:[],
               worksData:[],
               userData:[],
               mapList:[],
                worksColumns:[
                	{
                		align:'center',
                		title:'作品名称',
                		key:'filetitle',
                	},
                	{
                		align:'center',
                		title:'下载量',
                		sortable: true,
                		key:'downloads'
                	},
                	{
                		align:'center',
                		title:'浏览量',
                		key:'views',
                		sortable: true,
                	}
                ],
                companyColumns:[
                	{
                		align:'center',
                        title: '上传单位',
                        key: 'username'
                    },
                    {
                		align:'center',
                		title:'下载量',
                		sortable: true,
                		key:'downloads'
                	},
                	{
                		align:'center',
                		title:'浏览量',
                		key:'views',
                		sortable: true,
                	}
                ],
                proviceColumns: [
                    {
                    	align:'center',
                        title: '省份',
                        key: 'province'
                    },
                    {
                    	align:'center',
                        title: '下载量',
                        sortable: true,
                        key: 'downloads'
                    },
                    {
                    	align:'center',
                        title: '浏览量',
                        sortable: true,
                        key: 'views'
                    }
                ],
                 

			}
		},
		beforeDestroy() {
	      if (!this.myChart) {
	        return;
	      }
	      this.myChart.dispose();
	      this.myChart = null;
	    },
		components:{
		},
		watch:{

			 
			
		},
		methods:{

			change(){
				var key = this.value2[0]*1;
				if(isNaN(key)){
					return;
				}

				this.getRankingList(key);

			},

			getRankingList(type=1){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/getrankinglist',
					data:{
						adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken,
						resourceid:s.id,
						type,
					},
					success(data){
						if(data.getret === 0){
							
							switch(type){
								case 1:
								s.proviceData = data.list;
								break;
								case 2:
								s.worksData = data.list;
								break;
								case 3:
								s.userData = data.list;
								break;
							}
						}
					}
				})
			},

			getsurvey(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/getsurvey',
					data:{
						adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken,
						resourceid:s.id,
						type:1,
						uploadtype:'h5-zmiti'
					},
					success(data){
						if(data.getret === 0){
							s.total = data.total;	
						}
					}
				})
			},
			loadMapData(){
				this.getMapData();
			},
			getMapData(groupby='province'){
				var s = this;
				s.mapList = [];
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/getprovincialip',
					data:{
						adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken,
						resourceid:s.id,
						groupby,
						status:s.mapType === 'downloads' ? 2 : 1
					},
					success(data){
						if(data.getret === 0){
							data.list.forEach((item,i)=>{
								var obj = {
									name:item.province.replace('市','').replace('省',''),
									value:item.num
								};
								
								s.mapList.push(obj);
							});
							s.chinaConfigure(s.mapList);

							
						}
					}
				})
			},

			mapConfig(mapList){
				var s = this;
				return { // 进行相关配置
		          backgroundColor: "#fff",
		          tooltip: {}, // 鼠标移到图里面的浮动提示框
		          dataRange: {
		            show: true,
		            min: 0,
		            max: 1000,
		            text: ['', ''],
		            realtime: true,
		            calculable: true,
		            color: [ '#ea5428', '#f5fc5a','#98cdf6']
		          },
		          geo: { // 这个是重点配置区
		            map: 'china', // 表示中国地图
		            roam: true,
		            label: {
		              normal: {
		                show: true, // 是否显示对应地名
		                textStyle: {
		                  color: 'rgba(0,0,0,0.4)'
		                }
		              }
		            },
		            itemStyle: {
		              normal: {
		                borderColor: 'rgba(0, 0, 0, 0.2)'
		              },
		              emphasis: {
		                areaColor: null,//鼠标移上去的效果
		                shadowOffsetX: 0,
		                shadowOffsetY: 0,
		                shadowBlur: 20,
		                borderWidth: 0,
		                shadowColor: 'rgba(0, 0, 0, 0.5)'
		              }
		            }
		          },
		          series: [{
		              type: 'scatter',
		              coordinateSystem: 'geo' // 对应上方配置
		            },{
		              name: s.mapType === 'downloads' ? '下载量':'浏览量', // 浮动框的标题
		              type: 'map',
		              geoIndex: 0,
		              data:mapList
		            }
		          ]
		        }
			},
			 
         	chinaConfigure(mapList) {
         		var s = this;
         		if(this.myChart){
		        	this.myChart.setOption(this.mapConfig(mapList));
         		}
         		else{
			        let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置  
			        window.onresize = myChart.resize;
			        this.myChart = myChart;
			        this.myChart.setOption(this.mapConfig(mapList));
         		}
		      }
		     

		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
            this.getMapData();
            this.getsurvey();
			this.getRankingList();
 
		}
	}
</script>
 <style>
	
 </style>
 