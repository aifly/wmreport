<template>
    <div class="lt-full wm-collection-report-C" v-if='showPreview'>
			<span class="wm-report-close" @click="closePreview"></span>
			<div :class='{"original":showOriginalImg}' v-if='"mp3 mp4 webm aac wma ogg".indexOf(reportList[currentReportIndex].fileextname)<=-1'>
				<img @dblclick.stop="showOriginalImg = !showOriginalImg"  :class="reportList[currentReportIndex].fileextname" :src="reportList[currentReportIndex].filepath||imgs.poster" alt="" />
				<div class="wm-report-detail"  :class="{'hide':showMaskDetail,[reportList[currentReportIndex].fileextname]:1}" >
					<span v-if='"xlsx doc docx pdf dmg txt ppt pptx xls rar html css scss js vb shtml zip m4a".indexOf(reportList[currentReportIndex].fileextname)<=-1 '  @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div  class="wm-myreport-title wm-myreport-field-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"'>{{item.name}}：</div>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if='reportList[currentReportIndex].fileextname=== "mp4" ||reportList[currentReportIndex].fileextname=== "webm" '>
				<video autoplay controls :src='reportList[currentReportIndex].filepath'></video>
				<div class="wm-report-detail wm-video-detail" :class="{'hide':showMaskDetail}" >
					<span @click='showMaskDetail = !showMaskDetail'>{{showMaskDetail?'展开':'收起'}}</span>
					<div class="wm-myreport-title wm-myreport-field-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"'>{{item.name}}：</div>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if='reportList[currentReportIndex].fileextname=== "mp3" ||reportList[currentReportIndex].fileextname=== "ogg"||reportList[currentReportIndex].fileextname=== "aac"||reportList[currentReportIndex].fileextname=== "wma" '>
				<audio autoplay controls :src='reportList[currentReportIndex].filepath'></audio>
				<div class="wm-report-detail wm-audio" :class="{'wm-audio':showMaskDetail}"  >
					<div class="wm-myreport-title wm-myreport-field-item" v-for='(item,i) in configList' :key='i'>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"'>{{item.name}}：</div>
						<div v-if='item.fieldname === "filetitle" || item.fieldname === "filedesc"' >
							<span>{{reportList[currentReportIndex][item.fieldname]}}</span>
						</div>
					</div>
				</div>
			</div>

			<section v-if='type*1 === 0' class="wm-report-check-in-mask" :class="{'hide':nextReport}">
				<div>
					<Input placeholder="请输入拒绝的原因(非必填)" :disabled='!!reportList[currentReportIndex].raterid' type="textarea" v-model="reportList[currentReportIndex].remark"/>
					<span v-if='!reportList[currentReportIndex].remark && false' class="wm-collection-placeholder">请输入拒绝的原因(非必填)</span>
				</div>
				<div>
					<div  v-if='!reportList[currentReportIndex].raterid || reportList[currentReportIndex].score === 100' :class='{"pass":reportList[currentReportIndex].score === 100}'  class="wm-report-adopt" @click='checkReportById(reportList[currentReportIndex],1,currentReportIndex)'>
						<span>通过</span>
					</div>
					<div  v-if='!reportList[currentReportIndex].raterid  || reportList[currentReportIndex].score === 0' :class='{"reject":reportList[currentReportIndex].score === 0}'  class="wm-report-reject" @click='checkReportById(reportList[currentReportIndex],2,currentReportIndex)'>
						<span>拒绝</span>
					</div>
				</div>
				
			</section>

            <section v-if='type*1 === 2'  class="wm-reset" @click='checkReportById(reportList[currentReportIndex],1,currentReportIndex)'>
				<img :src="imgs.reset" alt="">
			</section>

			<section class="wm-detail-mask-tip">双击放大浏览</section>
		</div>
</template>
<script>
	import Vue from 'vue';
	export default {
		props:['obserable','nextReport','showMaskDetail','currentReportIndex','closePreview','reportList','showPreview','type','configList','checkReportById'],
		name:'zmitiindex',
		data(){
			return{
                imgs:window.imgs,
                showOriginalImg:false,
				/* colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				isLoading:false,
				selectAll:false,
				scale:.8,
				imgs:window.imgs,
				viewH:document.documentElement.clientHeight,
				resourcecnname:'',
				kwType:'关键字',
				showCondition:false,
				keyword:'',
				fieldname:-1,
				nextReport:false,
				reportList:[],
				mainType:2,
				showCheckAction:false,
				configList:[],
				currentReportIndex:0,
				menus:[],
				classicType:'全部',
				statusType:'全部',
				publicadtype:-1,
				totalnum:0,
				status:-1,
				currentPage:0,
				classic:-1,
				page:1,
				pagenum:20,
				raterReportList:[], */

			}
		},
		components:{
			 
        },
        mounted() {
          //  console.log(this.type)

            window.ss = this;
            Vue.obserable.on('closeOriginalImg',()=>{
            	this.showOriginalImg = false;
            })
        },
		 
		methods:{

        }
	}
    

</script>

