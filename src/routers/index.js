import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginManager from "@/view/LoginManager";
import DataHome from "@/view/DataHome"
import GasData from "@/components/GasData"
import HomeCharts from "@/view/HomeCharts";
import ManagerHome from "@/view/ManagerHome";
import AccountManage from "@/components/AccountManage";
import RegisterManage from "@/components/RegisterManage";
import MainHome from "@/view/MainHome";
import ShowMap from "@/view/ShowMap";
import StatisticCharts from "@/view/StatisticCharts";

Vue.use(VueRouter)
const router = new VueRouter({
        routes: [
            {
                path: '/',
                name: 'login',
                component: LoginManager,
                hidden: true
            },
            {
                path: '/MainHome',
                name: 'MainHome',
                component: MainHome,
                children: [
                    {
                        path: '/HomeCharts',
                        name: '首页',
                        component: HomeCharts,
                    },
                    {
                        path: '/DataHome',
                        name: '数据展示',
                        component: DataHome,
                        redirect: '/data',
                        children: [
                            {
                                path: '/data',
                                name: '基本数据',
                                component: GasData,
                            },
                        ]
                    },
                    {
                        path: '/ManagerHome',
                        name: '用户管理',
                        component: ManagerHome,
                        redirect: '/AccountManage',
                        children: [
                            {
                                path: '/AccountManage',
                                name: '账号管理',
                                component: AccountManage,
                            }, {
                                path: '/RegisterManage',
                                name: '注册审核',
                                component: RegisterManage
                            }
                        ]
                    },
                    {
                        path: '/StatisticCharts',
                        name: '统计图表',
                        component: StatisticCharts,
                    },
                    {
                        path: '/ShowMap',
                        name: '地图',
                        component: ShowMap,
                    }
                ]
            }]
        }
);

//解决冗余导航
const RouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return RouterPush.call(this, to).catch(err => err)
}
const RouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(to) {
    return RouterReplace.call(this, to).catch(err => err)
}
//配置路由守卫
// router.beforeEach((to, from, next) => {
//     console.log(to.path)
//     // console.log(from.path)
//     const username = window.localStorage.getItem('username')
//     // console.log(username)
//     if (to.path==='/'&&username==='') {
//         console.log(1)
//         next('/')
//     }else if (to.path==='/'&&username!=='') {
//         console.log(2)
//         next('/HomeCharts')
//     }
// })


export default router


