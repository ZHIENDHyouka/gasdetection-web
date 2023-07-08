<template>
  <div id="MainHome">
    <el-container>
      <el-header>
        <div style="float: left;display: inline">
          <el-menu :default-active="activeIndexHorizontal" class="el-menu-demo" mode="horizontal"
                   router active-text-color="rgb(110,0,0)">
            <el-menu-item v-for="(item,index) in this.$router.options.routes[1].children" :key="index"
                          :index="item.path">
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </div>
        <div class="userBar">

          <el-dropdown trigger="click">
            <i class="el-icon-setting" style="padding-right: 10px;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ username }}</span>
          <i class="el-icon-message" style="margin-left: 30px;height: 30px;font-weight: 600"
             @click="showAlarmInfoTable"/>
          <el-badge v-if="this.$store.state.alarmNumber>0" :value="this.$store.state.alarmNumber" :max="99">
          </el-badge>
        </div>
      </el-header>
      <router-view></router-view>
    </el-container>

    <el-dialog title="24小时报警数据" :visible.sync="showAlarmTable"
               :before-close="closeTable" width="70%">
      <el-table :data=" this.$store.state.alarmTableData.slice((this.currentPage-1)*this.pageSize,this.pageSize*this.currentPage)"
                :cell-style="columnStyle" :header-cell-style="headCellStyle" height="390px"
                :render-header="renderHeader">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column property="gasName" label="气体名称"></el-table-column>
        <el-table-column property="value" label="数值"></el-table-column>
        <el-table-column property="gasType" label="类型"></el-table-column>
        <el-table-column property="indatetime" label="记录时间"></el-table-column>
        <el-table-column property="deviceId" label="记录设备编号"></el-table-column>
      </el-table>
      <el-pagination style="margin-left: 200px;margin-top: 20px"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 50, 100, 500]" :page-size="5"
                     layout="total, sizes, prev, pager, next, jumper" :total="this.$store.state.alarmTableData.length">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import {inintWebSocket, sendInfo} from "@/utils/websocketUtil";
import {getAlarmInfoData} from "@/utils/api";

export default {
  name: "MainHome",
  data() {
    return {
      showAlarmTable: false,
      activeIndexHorizontal: this.$router.options.routes[1].children[0].path,
      username: '',
      tableIntervalId: null,
      alarmNumber: 0,
      alarmInfoData: [],
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {
    this.$router.replace("/HomeCharts");
    this.$store.state.websocket = inintWebSocket();
  },
  mounted() {
    if (this.$route.query.username) window.localStorage.setItem("username", this.$route.query.username);
    this.username = window.localStorage.getItem("username");
    this.getRealTimeAlarmNumber();
  },
  methods: {
    getRealTimeAlarmNumber() {
      if (this.$store.state.websocket) {
        this.$store.state.idInterval = window.setInterval(function () {
          sendInfo(JSON.stringify({
            code: '2',
            data: null,
          }));
        }, 2000);
      }
    },
    getRealTimeAlarmData() {
      if (this.$store.state.websocket) {
        const map = {
          code: '3',
          data: this.$store.state.alarmNumber
        }
        this.tableIntervalId = window.setInterval(function () {
          sendInfo(JSON.stringify(map));
        }, 2000);
      }
    },
    showAlarmInfoTable() {
      getAlarmInfoData().then(res => {
        this.$store.state.alarmTableData = res.data;
        this.getRealTimeAlarmData();
        this.showAlarmTable = true;
      })
    },
    closeTable() {
      window.clearInterval(this.tableIntervalId);
      this.showAlarmTable = false;
      this.currentPage = 1;
      this.pageSize = 10;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    renderHeader(h, {column}) {
      let realWidth = 0;
      let span = document.createElement('span');

      span.innerText = column.label;
      document.body.appendChild(span);

      realWidth = span.getBoundingClientRect().width;
      column.minWidth = realWidth; // 可能还有边距/边框等值，需要根据实际情况加上

      document.body.removeChild(span);
      return h('span', column.label);
    },
    //表格样式函数
    columnStyle() {
      return "text-align:center;height:55px";
    },
    //表格样式函数
    headCellStyle() {
      return "text-align:center;height:65px;background:#eef1f6;color:#606266;";
    },
  }
}
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #000000;
  text-align: center;
  line-height: 45px;
  text-align: center;
  font-size: 12px;
  border-bottom: 1px solid #8c8888;
}

.el-menu {
  margin-left: 200px;
  border-bottom: 1px solid #8c8888;
  height: 59px;
  width: 800px;
}

.el-menu-item {
  color: rgb(29, 31, 32);
  width: 150px;
  margin: -1px auto;
  text-align: center;
  display: inline-block;
}

.el-submenu__title:hover {
  background-color: #eae6e6 !important;
}

.el-menu-item:hover {
  background-color: #eae6e6 !important;
}

.userBar {
  /*margin-left: 600px;*/
  font-size: 15px;
  display: inline;
  width: 50px;
  height: 60px;
  margin-left: -100px;
}

</style>