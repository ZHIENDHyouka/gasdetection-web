import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './routers'
import * as echarts from 'echarts'
import store from './store/index'
import AmapVue from '@amap/amap-vue'
Vue.config.productionTip = false
AmapVue.config.version='2.0'
AmapVue.config.key='aa389b742580cd15f19c3b2fd15cdbf1'
// AmapVue.config.plugins = [
//   "AMap.Scale", "AMap.ToolBar", "AMap.ControlBar", 'AMap.Geocoder', 'AMap.Marker',
//   'AMap.CitySearch', 'AMap.Geolocation', 'AMap.AutoComplete',
//   'AMap.InfoWindow','AMap.Icon'
// ];
Vue.prototype.$echarts = echarts//封装一下
Vue.use(echarts)
Vue.use(ElementUI);
Vue.use(AmapVue);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
