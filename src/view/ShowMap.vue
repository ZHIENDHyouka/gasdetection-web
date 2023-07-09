<template>
  <div id="ShowMap">
    <amap style="width: 100%;height: 630px" :map-style="mapStyle" :view-mode="viewMode" :zoom="zoom"
          :zooms="zooms" :center="center" :resizeEnable="resizeEnable" @mousemove="mapMouseEvent"
          >
      <amap-marker :position="center" />
      <!-- 覆盖物 -->
    </amap>

    <div class="selectStyle">
      <span>设备查询：</span>
      <el-select v-model="deviceId" placeholder="请选择设备查找的"
                 filterable clearable @change="locateDevice"
      >
        <el-option
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="lnglat">
      经度:{{this.mouseLng}}  纬度:{{this.mouseLat}}
    </div>
  </div>
</template>

<script>
import AmapVue from "@amap/amap-vue";
import {getDeviceInfoData} from "@/utils/api";
//地图api安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'c891879c1dbae42e7b5e9485091c2e0f'
}

export default {
  name: "ShowMap",
  data() {
    return {
      postions:[114.392091, 30.517153],
      mouseLng: 0,
      mouseLat: 0,
      deviceId: null,
      deviceOptions: [],
      deviceMarkerList:[],
      center: [114.392091, 30.517153],//地图中心坐标
      mapStyle:"amap://styles/macaron",//地图样式
      viewMode:'2D',
      zoom:15,
      zooms:[3,20],
      resizeEnable:true,
      markerPostion:[],
    }
  },
  created() {

  },
  mounted() {
    //获取初始化数据
    this.getData();
  },
  methods: {
    getData() {
      this.getDeviceList();
    },
    getDeviceList() {
      getDeviceInfoData().then(res => {
        const list = res.data;
        for (const listElement of list) {
          //封装下拉框的数据
          this.deviceOptions.push({
            value:listElement.id,
            label:listElement.deviceName
          })
          //封装点数据
          listElement
        }
      })
    },
    mapMouseEvent(e) {
      this.mouseLng = e.lnglat.lng;
      this.mouseLat = e.lnglat.lat;

    },
    locateDevice() {

    },
    addDeviceMarker(){
        const marker = AmapVue.Amap.Marker({
          icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          position: [114.392091, 30.517153],
        });
        console.log(AmapVue.Amap);
        marker.setMap(this.map);
    },
  }
}
</script>

<style scoped>
.selectStyle {
  margin-top: -620px;
  margin-left: 20px;
  float: left;
  position: absolute;
}
.lnglat{
  position: absolute;
  margin-top: -30px;
  margin-left: 1300px;
  font-size: 10px;
}
</style>