// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme/index.css';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import vueWaves from './directive/waves';// 水波纹指令
import '../theme/index.css';
import router from './router/index';
import './mock/index';  // mockjs模拟数据
import store from './store';
import {getToken} from './utils/auth';
import VueVideoPlayer from 'vue-video-player';
import '../static/viewer.min.js';
import '../static/viewer.min.css';
import '../static/domvas.js';
import '../static/iframe2image.js';

import './common/scss/index.scss';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';

Vue.config.productionTip = false;
Vue.use(VueVideoPlayer);
Vue.use(ElementUI);
Vue.use(vueWaves, {
    name: 'waves',   // Vue指令名称
    duration: 200  // 涟漪效果持续时间
    // delay: 200      // 延时显示涟漪效果
});

router.beforeEach((to, from, next) => {
    // 当页面刷新的时候会再一次进入这个过程
    NProgress.start(); // 开启Progress 开启一个进度条
    if (to.matched.some(record => record.meta.requireAuth)) {
        // 首先检测当前要进入的路由是否需要登录，如果需要则检测是否有token
        // 如果有token则进入该页面，如果没有token，则进入login页面
        if (getToken()) {
            store.dispatch('GetUserInfo');
            store.dispatch('GetNoticeCount');
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        }
    } else {
        // 如果当前路由不需要登录，且token存在，则进入首页
        if (getToken()) {
            // 如果进入的是管理员进入用户界面则不拦截
            if (to.matched.some(record => record.meta.token)) {
                next();
            } else {
                // next({
                //     path: '/',
                //     query: {redirect: to.fullPath}
                // });
                next();
            }
        } else {
            next();
        }
    }
});

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});
