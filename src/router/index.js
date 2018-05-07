import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

// requireAuth有该字段的表示进入这个路由需要登录
const routes = [
    {
        path: '/',
        component: resolve => require(['@/views/layout/Layout'], resolve),
        meta: {
            requireAuth: true
        },
        children: [
            {
                path: '',
                redirect: 'print',
                requireAuth: true
            },
            {
                path: 'print',
                component: resolve => require(['@/components/print/print'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'file',
                component: resolve => require(['@/components/PanelFile/PanelFile'], resolve),
                meta: {
                    requireAuth: true,
                    keepAlive: true
                }
            },
            {
                path: 'trade',
                component: resolve => require(['@/components/PanelTrade/PanelTrade'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'pay',
                component: resolve => require(['@/components/PanelPay/PanelPay'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'success',
                component: resolve => require(['@/components/pay-success/pay-success'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'user',
                component: resolve => require(['@/components/PanelUser/PanelUser'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'robot',
                component: resolve => require(['@/components/PanelRobot/PanelRobot'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'suggest',
                component: resolve => require(['@/components/PanelSuggest/PanelSuggest'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'notice',
                component: resolve => require(['@/components/PanelNotice/PanelNotice'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'buy',
                component: resolve => require(['@/components/PanelBuy/PanelBuy'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'info',
                component: resolve => require(['@/components/DetailInfo/DetailInfo'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'file/:id',
                component: resolve => require(['@/components/ToResult/ToResult'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'doc',
                component: resolve => require(['@/components/DocSafe/DocSafe'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'test',
                component: resolve => require(['@/components/test'], resolve),
                meta: {
                    requireAuth: true
                }
            }]
    },
    {
        path: '/login',
        component: resolve => require(['@/views/login/login-wrapper'], resolve),
        children: [
            {
                path: '',
                component: resolve => require(['@/views/login/login'], resolve)
            },
            {
                path: 'findpwd',
                component: resolve => require(['@/views/login/findpwd'], resolve)
            },
            {
                path: 'findpwdTwo',
                component: resolve => require(['@/views/login/findpwd-two'], resolve),
                beforeEnter: (to, from, next) => {
                    if (store.getters.op_key === '') {
                        next({
                            path: '/login',
                            query: {redirect: to.fullPath}
                        });
                    } else {
                        next();
                    }
                }
            },
            {
                path: 'admin/:id',
                component: resolve => require(['@/views/token/token'], resolve),
                meta: {
                    token: true
                }
            }
        ]
    },
    {
        path: '/protocal',
        component: resolve => require(['@/views/protocal/protocal'], resolve)
    },
    {
        path: '/robotBegin',
        component: resolve => require(['@/components/PanelRobot/robot/robot'], resolve)
    }
];

export default new VueRouter({
    routes
});
