<template>
<div id="ShowMap">
  111
  <div id="container" style="width: 900px;height: 600px"></div>
</div>
</template>

<script>
import AmapVue from "@amap/amap-vue";
//地图api安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'c891879c1dbae42e7b5e9485091c2e0f'
}
export default {
  name: "ShowMap",
  data(){
    return{
      map:null,
    }
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initAMap()
  },
  methods:{
    initAMap() {
      AmapVue.loadAmap({
        key: "aa389b742580cd15f19c3b2fd15cdbf1", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar", 'AMap.Geocoder', 'AMap.Marker',
          'AMap.CitySearch', 'AMap.Geolocation', 'AMap.AutoComplete', 'AMap.InfoWindow'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        // 获取到作为地图容器的DOM元素，创建地图实例
        this.map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"2D",    //是否为3D地图模式
          zoom:13,           //初始化地图级别
          center:[116.397428, 39.90923], //初始化地图中心点位置（北京）
        });
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>

</style>