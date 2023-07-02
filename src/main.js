import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './routers'
import * as echarts from 'echarts'
// import echarts from 'echarts';
import AmapVue from '@amap/amap-vue'
Vue.config.productionTip = false
AmapVue.config.version='2.0'
AmapVue.config.key='aa389b742580cd15f19c3b2fd15cdbf1'
AmapVue.config.plugins = [
  'AMap.ToolBar',
  'AMap.MoveAnimation',
  // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
];
Vue.prototype.$echarts = echarts//封装一下
Vue.use(echarts)
Vue.use(ElementUI);
Vue.use(AmapVue);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
