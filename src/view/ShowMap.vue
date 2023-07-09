<template>
  <div id="ShowMap">
    <amap ref="myMap" style="width: 100%;height: 630px" :map-style="mapStyle" :view-mode="viewMode" :zoom="zoom"
          :zooms="zooms" :center="center" :resizeEnable="resizeEnable" @mousemove="mapMouseEvent"
          @click="onMapClick">
      <!--      @click="onMapClick"-->
      <amap-tool-bar/>
      <amap-map-type/>
      <amap-scale/>
      <amap-marker :position="center"/>
      <amap-marker v-for="(ele,index) of this.markerPostion" :key="index" :position="ele"
                   clickable @click="onMarkerClick(ele)"></amap-marker>
      <!--          :visible="!!markerInfo"-->
      <amap-info-window
          :visible="markerInfo!=null"
          :position="markerInfo ? markerInfo.position: null"
          :offset="[0, -30]"
          is-custom>
        <div class="infoWindow" v-if="markerInfo">
          <div>经度{{ markerInfo.position[0] }},纬度{{ markerInfo.position[1] }}</div>
        </div>
      </amap-info-window>
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
      经度:{{ this.mouseLng }} 纬度:{{ this.mouseLat }}
    </div>
  </div>
</template>

<script>
import {getDeviceInfoData} from "@/utils/api";
//地图api安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'c891879c1dbae42e7b5e9485091c2e0f'
}

export default {
  name: "ShowMap",
  data() {
    return {
      mouseLng: 0,
      mouseLat: 0,
      deviceId: null,
      deviceOptions: [],
      deviceMarkerList: [],
      center: [114.392091, 30.517153],//地图中心坐标
      mapStyle: "amap://styles/macaron",//地图样式
      viewMode: '2D',
      zoom: 15,
      zooms: [3, 20],
      resizeEnable: true,
      markerPostion: [],
      markerInfo: null,
      allDeviceList: [],
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
        this.allDeviceList = res.data;
        for (const listElement of this.allDeviceList) {
          //封装下拉框的数据
          this.deviceOptions.push({
            value: listElement.id,
            label: listElement.deviceName
          })
          //封装点数据
          const lng = parseFloat(listElement.coordinates.split(",")[0]);
          const lat = parseFloat(listElement.coordinates.split(",")[1]);
          this.markerPostion.push([lng, lat]);
        }
      })
    },
    mapMouseEvent(e) {
      this.mouseLng = e.lnglat.lng;
      this.mouseLat = e.lnglat.lat;
    },
    locateDevice(e) {
      if (e) {
        const lngLat = this.allDeviceList.find(item => {
          return item.id === e;
        }).coordinates.split(',')
        const lng = parseFloat(lngLat[0]);
        const lat = parseFloat(lngLat[1]);
        // this.$refs.myMap.$map.setZoom(15);
        this.$refs.myMap.$map.setCenter([lng, lat]);
        this.$refs.myMap.$map.setZoom(18);
      } else {
        this.$refs.myMap.$map.setCenter(this.center);
        this.$refs.myMap.$map.setZoom(this.zoom);
      }
    },
    onMarkerClick(ele) {
      this.markerInfo = {
            position:ele
          };
    },
    onMapClick() {
      this.markerInfo = null;
    }

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

.lnglat {
  position: absolute;
  margin-top: -30px;
  margin-left: 1250px;
  font-size: 10px;
}

.infoWindow {
  height: 100px;
  width: 250px;
  background-color: rgb(255, 255, 255);
  border: 1px solid #000000;
  border-color: #eae6e6;
  box-shadow: 0 0 25px rgb(255, 255, 255);
  border-radius: 15px;
}

</style>