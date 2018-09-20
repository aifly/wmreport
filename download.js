import Vue from "vue";
import Obserable from './components/lib/obserable';
import Download from './download/index'
import './components/css/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './components/css/admin.less'
var obserable = new Obserable();
Vue.obserable = obserable;
 Vue.use(iView)
new Vue({
    data: {
        obserable,
        imgs,
        viewW:window.innerWidth,
        viewH: document.documentElement.clientHeight,
    },
    el: '#app',
    template: `
        <div>
            <div class='lt-full' v-if='viewW>760' :style='{background:"url("+imgs.downloadbg+") no-repeat center 44px"}'></div>
            <img v-else :src="imgs.downloadbg1" alt = "" style='position:relative;z-index:1' >
            <Download :obserable='obserable'> </Download>
        </div>
        `,
    methods: {},
    components: {
        Download
    },
    mounted() {
    }
})