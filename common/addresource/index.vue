<template>
    <div class="wm-addstudent-ui">
        <header class="wm-addstudent-header">
			<div style="opacity:0">{{title}} > 新增学员</div>
		</header>
		<div class='wm-addstudent-main' :style="{height:viewH- 64 - 64+'px'}">
			<ul class='wm-addstudent-step'>
				<li v-for="(step,i) in steps" :key='i' :class="{'active':current>=i,' active1':current>i}" :title="step.title" :content="step.content">
					<div>
						<div class='wm-step-index' ><span>{{i+1}}</span></div>
						<section>{{step.title}}</section>
					</div>
				</li>
			</ul>

			<div class='wm-step-content-wrap'>
				<ol :style="{width:400*steps.length+'px',WebkitTransform:'translate3d('+-400*current+'px,0,0)',transform:'translate3d('+-400*current+'px,0,0)'}">
					<li>
						<div v-if='current === 0'>
							<h1 class="wm-recruitaction-title">{{formRecruit.resourcecnname||'发布新的征集'}}</h1>
							<div class="wm-recruitaction-form-item">
								<label for="">名称：</label><input v-model="formRecruit.resourcecnname" placeholder="请输入征集名称"/>
							</div>
							<div class="wm-recruitaction-form-item">
								<label for="">说明：</label><textarea placeholder="请输入征集说明" v-model="formRecruit.resourcedesc"></textarea>
							</div>
							<div class="wm-recruitaction-form-item">
								<label for="">起止时间：</label>
							</div>
							<div class="wm-recruitaction-form-item">
								<label for="">路径：</label>
							</div>
							<div class="wm-recruitaction-form-item">
								<section>允许上传的类型</section>
								<section class="wm-accept-list">
									<Checkbox v-model="item.checked" :checked='item.checked' v-for='(item,i) in accepts' :key="i">{{item.name}}</Checkbox>
								</section>
							</div>
							<div class="wm-recruitaction-next-btn">
								<Button long type='primary' size='large'>下一步</Button>
							</div>
						</div>
						<div v-if='current === 1'>
							<h1  class="wm-recruitaction-title">{{formRecruit.resourcecnname}}</h1>
							<div class="wm-default-field">
								<div v-for='(field,i) in formRecruit.configList.fieldList' :key='i'></div>
							</div>
						</div>
					</li>
					<li v-show='current===1'>
						<div class='wm-addstudent-form-item'>
							<label for="">姓名：</label><input placeholder="请输入姓名" type='text' v-model="formStudent.username"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">密码：</label><input disabled placeholder="请输入密码" type='text' v-model="formStudent.userpwd"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">职务：</label><input placeholder="请输入职务" type='text' v-model="formStudent.job"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">公司名称：</label><input placeholder="请输入公司名称" type='text' v-model="formStudent.companyname"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">邮箱：</label><input placeholder="请输入邮箱" type='text' v-model="formStudent.email"/>
						</div>
						<div class='wm-addstudent-form-item displayFlex'>
							<div><label for="">所属小组：</label></div>
							<Select v-model="formStudent.groupid" style="width:240px;background:transparent">
						       <Option v-for="item in groupList" :value="item.groupid+''" :key="item.groupid">{{ item.groupname }}</Option>
						    </Select>
						</div>
						
						<div class='wm-addstudent-form-item'>
							<label for="">详细地址：</label><textarea placeholder="请输入详细地址"  v-model="formStudent.detailaddress" ></textarea>
						</div>
						<div class='wm-next-step-btn' @click='insertStudent'>{{current>=steps.length-1?'完成':'下一步'}}</div>
					</li>
				</ol>
			</div>

		</div>
    </div>
</template>


<script>
	import './index.css';
	import Vue from 'vue';
	import symbinUtil  from '../../admin/lib/util';
    export default {
		props:['obserable','title','steps'],
		name:'zmitiindex',
		data(){
			return{
				userinfo:{},
				groupList:[],
				viewH:window.innerHeight,
				current:0,
				accepts:window.config.accepts,
				formStudent:{
					mobile:"",
					userpwd:'123456',
					cityids:[]
				},
				formRecruit:{
					resourcecnname:'',
					resourcedesc:'',
					endtime:'',
					starttime:'',
					dirid:'',
					configList:{
						acceptsList:[

						],
						fieldlist:[
							{
								"name": "编号",
								"type": "text",
								"notnull": 1,
								"default": "",
								"primary":1,
								"fieldtype": "varchar",
								"fieldname": "id",
								"length": 36,
								"loading": 0,
								"edit": 0
							},{
								"name": "名称",
								"type": "text",
								"notnull": 1,
								"default": "",
								"fieldtype": "varchar",
								"fieldname": "name",
								"length": 255,
								"loading": 1,
								"edit": 1
							},
							{
								"name": "说明",
								"type": "textarea",
								"notnull": 0,
								"default": "",
								"fieldtype": "text",
								"fieldname": "desc",
								"loading": 1,
								"edit": 1
							}
						]
					},
					

				},
				success:false,
				msg:'',
				provinceList:[]

			}
		},
		components:{
		},
		watch:{
			
		},
		beforeCreate(){
			
		},
		mounted(){
			 this.userinfo = symbinUtil.getUserInfo();
		},
		
		methods:{
			insertStudent(){
				var s = this;
				if(this.current >= this.steps.length - 1){//添加
					symbinUtil.ajax({
						url:window.config.baseUrl+'/zmitiadmin/addstudent/',
						data:{
							adminuserid:s.userinfo.userid,
							studentpwd:s.formStudent.userpwd,
							admintoken:s.userinfo.accesstoken,
							username:s.formStudent.mobile,
							mobile:s.formStudent.mobile,
							companyname:s.formStudent.companyname,
							studentname:s.formStudent.studentname,
							email:s.formStudent.email,
							provinceid:s.formStudent.cityids[0],
							meetid:s.$route.params.meetid,
							job:s.formStudent.job,
							groupid:s.formStudent.groupid,
							cityid:s.formStudent.cityids[1],
							areaid:s.formStudent.cityids[2],
							detailaddress:s.formStudent.detailaddress
						},
						success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								Vue.obserable.trigger({
									type:"hideAddStudent"
								});
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					this.current++;
				}
			},
			
			isPoneAvailable(val) {
	            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
	            return myreg.test(val);
	        },
			next(){
				if(this.isPoneAvailable(this.formStudent.mobile)){
					this.checkMobile();
				}else{
					this.msg = '手机号格式错误';
					this.success = false;
					setTimeout(()=>{
						this.msg = '';
					},2000)
				}


			},
			
        }
	}
</script>
