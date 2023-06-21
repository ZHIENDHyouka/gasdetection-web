import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginManager from "@/view/LoginManager";
import ManageHome from "@/view/ManageHome"
import GasData from "@/view/GasData"
import GasCharts from "@/view/GasCharts";

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginManager,
        hidden: true
    },
    {
        path: '/home',
        name: 'ManageHome',
        component: ManageHome,
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

]

export default new VueRouter({
    routes
})
