			
<template>
	<section  class="wm-collection-survey-manager">
		<div class="lt-full" style="">
			<div class="zmiti-survey-header">
				<h2 v-if='false'>{{resourcecnname}}</h2>
				<div class="zmiti-survey-classic">
					<div class="zmiti-survey-pv">
						<div>
							<img :src="imgs.eye" alt="">
						</div>
						<div>
							<div>浏览量</div>
							<div>总：<span>{{tranNumber(total.viewsnum)}}</span></div>
						</div>
					</div>
					<div class="zmiti-survey-download">
						<div>
							<img :src="imgs.download" alt="">
						</div>
						<div>
							<div>下载量</div>
							<div>总：<span>{{tranNumber(total.downloads)}}</span></div>
						</div>
					</div>
					<div class="zmiti-survey-upload">
						<div>
							<img :src="imgs.upload" alt="">
						</div>
						<div>
							<div>上传量</div>
							<div>总：<span>{{tranNumber(total.totalnum)}}</span></div>
							<div>(今日：{{tranNumber(total.todayuploadnum)}})</div>
						</div>
					</div>

					<div class="zmiti-survey-works">
						<div>
							<img :src="imgs.works" alt="">
						</div>
						<div>
							<div>作品数</div>
							<div>总：<span>{{tranNumber(total.totalnum)}}</span></div>
							<div>(H5：{{tranNumber(total.typenum)}})</div>
						</div>
					</div>
					<div class="zmiti-survey-users">
						<div>
							<img :src="imgs.users" alt="">
						</div>
						<div>
							<div>上传人数</div>
							<div>总：<span>{{tranNumber(total.totalnumber)}}</span></div>
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

					<div class='zmiti-refresh-btn'>
							<Button type="primary" :loading="loading" @click="refresh">
									<span v-if="!loading">刷新</span>
									<span v-else>刷新中...</span>
							</Button>
					</div>
					<div ref='myEchart' class="zmiti-survey-chart">
						
					</div>
				</div>
				<div class="zmiti-survey-rank">
					 <Collapse class='zmiti-survey-collapse' @on-change='change' v-model="value2" accordion>
				        <Panel name="1">
				            省份排行榜
										<div  class='zmiti-survey-more' @click="getMore('province')">更多>></div>
				            <Table slot="content" :columns="proviceColumns" :data="proviceData" :height='viewH-64-150 - 200'></Table>
				        </Panel>
				        <Panel name="2">
				            作品排行榜
										<div  class='zmiti-survey-more'>更多>></div>
				            <Table slot="content" :columns="worksColumns" :data="worksData" :height='viewH-64-150 - 200'></Table>
				        </Panel>
				        <Panel name="3">
				            上传单位排行榜
										<div  class='zmiti-survey-more'>更多>></div>
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
							 loading:false,
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
						key:'downloads',
						render:(h,params)=>{
							return h('div',{},this.tranNumber(params.row.downloads))
						}
                	},
                	{
                		align:'center',
                		title:'浏览量',
                		key:'views',
						sortable: true,
						render:(h,params)=>{
							return h('div',{},this.tranNumber(params.row.views))
						}
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
						key:'downloads',
						render:(h,params)=>{
							return h('div',{},this.tranNumber(params.row.downloads))
						}
                	},
                	{
                		align:'center',
                		title:'浏览量',
                		key:'views',
						sortable: true,
						render:(h,params)=>{
							return h('div',{},this.tranNumber(params.row.views))
						}
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
                		title:'下载量',
                		sortable: true,
						key:'downloads',
						render:(h,params)=>{
							return h('div',{},this.tranNumber(params.row.downloads))
						}
                	},
                	{
                		align:'center',
                		title:'浏览量',
                		key:'views',
						sortable: true,
						render:(h,params)=>{
							return h('div',{},this.tranNumber(params.row.views))
						}
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

			toLoading(){
				
			},

			getMore(e){
				return false;
			},

			tranNumber(num, point = 2) {
				let numStr = num+"";
				// 十万以内直接返回 
				if (numStr.length < 6) {
					return numStr;
				}
				//大于8位数是亿
				else if (numStr.length > 8) {
					let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
					return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
				}
				//大于6位数是十万 (以10W分割 10W以下全部显示)
				else if (numStr.length > 5) {
					let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
					return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
				}
			},

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
						order:1,//降序
						status:1,//1分页 2 不分页
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
				//this.getJsonFile();
				this.getMapData();
			},

			refreshMapData(groupby='province'){

				var s = this;
				s.loading = true;

					var p = {
						adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken,
						resourceid:s.id,
						groupby,
						status:s.mapType === 'downloads' ? 2 : 1
					};
					symbinUtil.ajax({
						url:window.config.baseUrl+'/wmadadmin/getprovincialip',
						data:p,
						success(data){
							s.loading = false;
							if(data.getret === 0){
								s.$Message.success('刷新成功!!!');
								s.mapList = [];
								data.list.forEach((item,i)=>{
									var obj = {
										name:item.province.replace('市','').replace('省',''),
										value:item.num
									};
									
									s.mapList.push(obj);
								});
								window.localStorage.setItem(s.mapType,JSON.stringify(s.mapList));
								s.chinaConfigure(s.mapList);
								s.getMapData();
								s.getRankingList();
								s.getsurvey();
							}
						}
					})
			},
			refresh(groupby='province'){

				var s = this;
			//	this.loading = true;
		
				s.refreshMapData();

				return;
			
			
				
			},
			getMapData(groupby='province'){
				var s = this;
				s.mapList = [];

				if(window.localStorage.getItem(s.mapType)){//优先加载缓存数据
					s.mapList = JSON.parse(window.localStorage.getItem(s.mapType));
					s.chinaConfigure(s.mapList);
				}

				var url = window.config.host+'/uploads/json/'+(s.mapType === 'downloads' ?  "provincedownloads": "provinceviews")+'.json';
				
				symbinUtil.ajax({
					//url:window.config.baseUrl+'/wmadadmin/getprovincialip',
					url,
					type:"get",
					data:{
						adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken,
						resourceid:s.id,
						groupby,
						status:s.mapType === 'downloads' ? 2 : 1
					},
					success(data){
						if(data.getret === 0){
							s.mapList = [];
							data.list.forEach((item,i)=>{
								var name = item.province.replace('市','').replace('省','');
								if(name.length>3){
									name = name.substring(0,2);
								}
								if(item.province.indexOf('内蒙古自治区')>-1){
									name = '内蒙古';
								}
								var obj = {
									name,
									value:item.num
								};
								
								s.mapList.push(obj);
							});
							window.localStorage.setItem(s.mapType,JSON.stringify(s.mapList));
							s.chinaConfigure(s.mapList);

							
						}
					}
				})
			},

			mapConfig(mapList){
				var s = this;

				var max = 0;
				mapList.map(item=>{
					max = Math.max(max,item.value);
				})
				return { // 进行相关配置
		          backgroundColor: "#fff",
		          tooltip: {}, // 鼠标移到图里面的浮动提示框
		          dataRange: {
		            show: true,
		            min: 0,
		            max: max*1.5,
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
					if(myChart){
						window.onresize = myChart.resize;
					}
					this.myChart = myChart;
					this.myChart.setOption(this.mapConfig(mapList));
				}
			},
			getJsonFile(){
				var s = this;
				s.mapList = [];
				symbinUtil.ajax({
					url:window.config.baseUrl+'/wmadadmin/getjsonfile',
					//url:'https://h5.wenming.cn/v1/wmadadmin/getjsonfile',
					data:{
						adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken,
						type:s.mapType === 'downloads' ?  "provincedownloads": "provinceviews"
					},
					success(data){
						if(typeof data === 'string'){
							data = JSON.parse(data);
						}
						if(data.getret === 0){
							//s.getMapData(data.list);

						}
					}
				})
			}
		     

		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			if(this.$route.params.type*1 === 0){
			
				this.getsurvey();
				this.getRankingList();
				this.getMapData()
			}
		}
	}
</script>
 <style>
	
 </style>
 