import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginManager from "@/view/LoginManager";
import DataHome from "@/view/DataHome"
import GasData from "@/components/GasData"
import GasCharts from "@/components/GasCharts";
import ManagerHome from "@/view/ManagerHome";
import AccountManage from "@/components/AccountManage";
import RegisterManage from "@/components/RegisterManage";
import MainHome from "@/view/MainHome";
import InformationFile from "@/view/InformationFile";
import ShowMap from "@/view/ShowMap";

Vue.use(VueRouter)
const routes = [
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
        redirect:'/DataHome',
        children: [
            {
                path: '/DataHome',
                name: '数据展示',
                component: DataHome,
                redirect:'/data',
                children: [
                    {
                        path: '/data',
                        name: '基本数据',
                        component: GasData,
                    },
                    {
                        path: '/charts',
                        name: '图表显示',
                        component: GasCharts,
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
                    },{
                        path: '/RegisterManage',
                        name:'注册审核',
                        component: RegisterManage
                    }
                ]
            },
            {
                path: '/InformationFile',
                name: '资料信息',
                component: InformationFile,
            },
            {
                path: '/ShowMap',
                name: '地图',
                component: ShowMap,
            }
        ]
    },

]

export default new VueRouter({
    routes
})
