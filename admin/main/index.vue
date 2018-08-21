<template>
    <div class="layout">
        <Layout v-if='$route.name !== "login" && $route.name !== "register"'>
            <Header>
               <div>
                    <div class="wm-title">
                        <img :src="imgs.loginTitle" alt="">
                    </div>
               </div>
               <div>
                   <div>
                       <span><img :src="imgs.search" alt=""></span><input type="text" placeholder="查询我的上报" />
                   </div>
               </div>
               <div class="wm-user-info">
                   <span><img :src='imgs.man' /></span>
                   <span class="zmiti-text-overflow">{{userinfo.adminusername}}</span>
                   <div @click="logout">
                       <img :src="imgs.logout" alt="">
                   </div>
               </div>
            </Header>
            <Layout class="wm-main-layout">
                <div class="wm-tab-C" :style='{height:(viewH - 64- 10)+"px"}'>
                   <div>
                        <div class='wm-menu-item' :class="{'active':$route.name ==='adminuser'}">
                            <a href='#/adminuser'>用户管理</a>
                        </div>
                        <div class='wm-menu-item' :class="{'active':$route.name ==='rater'}">
                            <a href='#/rater'>评委管理</a>
                        </div>
                        <div class='wm-menu-item' :class="{'active':$route.name ==='user'}">
                            <a href='#/user'>个人中心</a>
                        </div>
                   </div>
                </div>
                <Layout :style="{maxWidth:viewW-300+'px'}">
                   <router-view></router-view>
                </Layout>
            </Layout>
        </Layout>
        <div v-else>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
	import './index.css';
    import Vue from 'vue';
    import symbinUtil from '../lib/util';
    import sysbinVerification from '../lib/verification';

	export default {
		props:[],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
                viewH:document.documentElement.clientHeight,
                viewW:window.innerWidth,
                tabIndex:0,
                userinfo:{},
                
                topMenu:[
                ],
                defaultMenu:[
                  
                ],
                menus:[]
			}
		},
		components:{
		},
        beforeCreate(){
            this.validateData = sysbinVerification.validate(this);
        },
        watch:{
           $route(e){
               //console.log(e)
           }
        },
		mounted(){
           ///this.menus = this.defaultMenu.concat([]);
            var obserable = Vue.obserable;
            
            var userinfo = symbinUtil.getUserInfo();

            this.userinfo = userinfo; 
            
            window.onresize = ()=>{
                this.viewW  = window.innerWidth;
            }
        },
       
		methods:{
            
            tab(index){
                this.tabIndex = index;
            },
           
            loadMenu(option,fn){
                var s = this;
                return;
                symbinUtil.ajax({
                    url:window.config.baseUrl+"/admin/getmenulist",
                    validate:s.validateData,
                    data:{
                        status:option.status,
                    },
                    fn(data){

                       // console.log(JSON.stringify(data));
                        
                        if(data.getret===0){

                            fn && fn(data);
                        }
                        else{
                            s.$Message.error({
                                content:data.getmsg,
                                duration: 10
                            });
                             
                        }
                        
                    }
                })
            },
            logout(){
                var s = this;
                symbinUtil.ajax({
                    url:window.config.baseUrl+'/wmadadmin/exitlogin/',
                    data:{
                        adminusername:s.userinfo.adminusername,
						admintoken:s.userinfo.admintoken
                    },
                    
                    success(data){
                        if(data.getret === 0){
                            s.$Message.success('注销成功');
                            symbinUtil.clearCookie('login');
                            window.location.hash = '/login';
                            window.sessionStorage.clear();
                        }
                    }
                });
            }
		}
	}
</script>
 

 <style >
     .ivu-layout-header{
        padding: 0 !important; 
     }
     .ivu-layout{
        position: relative;
     }
 </style>