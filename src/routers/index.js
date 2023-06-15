import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginManager from "@/view/LoginManager";
import ManageHome from "@/view/ManageHome"

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginManager,
        hidden:true
    },
    {
        path: '/home',
        name: 'ManageHome',
        component: ManageHome,
    },

]

export default new VueRouter({
    routes
})
