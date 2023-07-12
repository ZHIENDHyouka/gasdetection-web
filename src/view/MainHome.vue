<template>
  <div id="MainHome">
    <el-container>
      <el-header>
        <div style="float: left;display: inline">
          <el-menu :default-active="activeIndexHorizontal" class="el-menu-demo" mode="horizontal" router
            active-text-color="rgb(110,0,0)">
            <el-menu-item v-for="(item, index) in this.navigation" :key="index" :index="item.path">
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </div>
        <div class="userBar">

          <el-dropdown trigger="click" @command="showDeviceTable">
            <i class="el-icon-setting" style="padding-right: 10px;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="2">设备管理</el-dropdown-item>
              <el-dropdown-item command="3">用户反馈</el-dropdown-item>
              <el-dropdown-item command="1">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ username }}</span>
          <i class="el-icon-message" style="margin-left: 30px;height: 30px;font-weight: 600"
            @click="showAlarmInfoTable" />
          <el-badge v-if="this.$store.state.alarmNumber > 0" :value="this.$store.state.alarmNumber" :max="99">
          </el-badge>
        </div>
      </el-header>
      <router-view></router-view>
    </el-container>

    <el-dialog title="24小时报警数据" :visible.sync="showAlarmTable" :before-close="closeTable" width="70%">
      <el-table
        :data="this.$store.state.alarmTableData.slice((this.currentPage - 1) * this.pageSize, this.pageSize * this.currentPage)"
        :cell-style="columnStyle" :header-cell-style="headCellStyle" height="390px" :render-header="renderHeader">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column property="gasName" label="气体名称"></el-table-column>
        <el-table-column property="value" label="数值"></el-table-column>
        <el-table-column property="gasType" label="类型"></el-table-column>
        <el-table-column property="indatetime" label="记录时间"></el-table-column>
        <el-table-column property="deviceId" label="记录设备编号"></el-table-column>
      </el-table>
      <el-pagination style="margin-left: 200px;margin-top: 20px" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 50, 100, 500]" :page-size="5"
        layout="total, sizes, prev, pager, next, jumper" :total="this.$store.state.alarmTableData.length">
      </el-pagination>
    </el-dialog>

    <el-dialog title="设备管理" :visible.sync="dialogDeviceTableVisible">
      <el-table :data="DeviceData">
        <el-table-column prop="id" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="设备编号" align="center"></el-table-column>
        <el-table-column label="设备状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.deviceStatus === 1">已开启</el-tag>
            <el-tag type="danger" v-if="scope.row.deviceStatus === 0">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-switch style="display: block" v-model="scope.row.deviceStatus" :active-value="1" :inactive-value="0"
              active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关"
              @change="changSwitchState($event, scope.row.id)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="反馈信息" :visible.sync="dialogFeedbackFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="desc">
          <el-input type="textarea" :rows="8" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFeedbackFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFeedback">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="问题反馈" :visible.sync="dialogUserFeedbackTableVisible">
      <el-table :data="feedbackData">
        <el-table-column prop="id" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="userName" label="申请用户" align="center"></el-table-column>
        <el-table-column prop="submitTime" label="申请时间" align="center"></el-table-column>
        <el-table-column label="反馈问题" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="details(scope.row.problemDescribe)">详情</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1">已解决</div>
            <el-button type="primary" @click="solvingProblems(scope.row.id)" v-if="scope.row.status === 0">解决</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="问题反馈" :visible.sync="detailsFeedbackDialogVisible" width="30%">
      <span>{{ feedbackIssues }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailsFeedbackDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {closeConnection, sendInfo} from "@/utils/websocketUtil";
import { getAlarmInfoData, getDeviceInfoData, updateDeviceState, submitFeedbackInfo, getFeedbackInfoData, solvingProblems } from "@/utils/api";

export default {
  name: "MainHome",

  data() {
    return {
      navigation:[],
      showAlarmTable: false,
      activeIndexHorizontal: this.$router.options.routes[1].children[0].path,
      username: '',
      userId: '',
      userLevel: '',
      tableIntervalId: null,
      alarmNumber: 0,
      alarmInfoData: [],
      currentPage: 1,
      pageSize: 10,
      DeviceData: [],
      dialogDeviceTableVisible: false,
      state: true,
      dialogFeedbackFormVisible: false,
      ruleForm: {
        desc: ''
      },
      rules: {
        desc: [
          { required: true, message: '请输入所要反馈的问题', trigger: 'blur' }
        ]
      },

      feedbackData: [],
      dialogUserFeedbackTableVisible: false,
      detailsFeedbackDialogVisible: false,
      feedbackIssues: ''
    }
  },
  created() {
    if (this.$route.query.username) window.localStorage.setItem("username", this.$route.query.username);
    if (this.$route.query.userId) window.localStorage.setItem("userId", this.$route.query.userId);
    if (this.$route.query.userLevel) window.localStorage.setItem("userLevel", this.$route.query.userLevel);
    // if (this.$store.state.username) window.localStorage.setItem("username", this.$store.state.username);
    this.username = window.localStorage.getItem("username");
    this.userId = window.localStorage.getItem("userId");
    this.userLevel = window.localStorage.getItem("userLevel");
    // this.$store.state.websocket = inintWebSocket();
  },
  mounted() {
    this.$router.replace("/HomeCharts");
    this.getRealTimeAlarmNumber();
    this.menuBarJudgment();
  },
  methods: {
    menuBarJudgment(){
      if (this.userLevel==2){
        this.navigation =this.$router.options.routes[1].children
        this.navigation.splice(2,1)
      }else {
        this.navigation=this.$router.options.routes[1].children;
      }
      
    },
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
    renderHeader(h, { column }) {
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
    //展示设备管理表格
    showDeviceTable(command) {
      if (command === '1') {
        window.localStorage.setItem('username', '')
        this.$router.push({
          path: '/'
        })
        this.$message.success('退出成功!');
        this.$store.state.websocket = closeConnection();
      } else if ('2' === command) {
        getDeviceInfoData().then(res => {
          this.DeviceData = res.data;
        })
        this.dialogDeviceTableVisible = true;
      } else if ('3' === command) {
        if ('2' === this.userLevel) {
          this.ruleForm.desc = '';
          this.dialogFeedbackFormVisible = true;
        }
        if ('1' === this.userLevel) {
          getFeedbackInfoData().then(res => {
            this.feedbackData = res.data
          })
          this.dialogUserFeedbackTableVisible = true;
        }
      }
    },
    //控制设备开关的方法
    changSwitchState(state, deviceId) {
      updateDeviceState(state, deviceId).then(res => {
        if (0 == res.code) {
          this.$message({
            type: 'error',
            message: '设备操作失败，请重试或联系管理员!'
          });
          return
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        });
      })
    },
    //提交反馈
    submitFeedback() {
      console.log(this.ruleForm.desc)
      submitFeedbackInfo(this.username, this.userId, this.ruleForm.desc).then(res => {
        if (0 == res.code) {
          this.$message({
            type: 'error',
            message: '提交失败，请重试或联系管理员!'
          });
          return
        }
        this.$message({
          type: 'success',
          message: '提交成功'
        });
      })
      this.dialogFeedbackFormVisible = false
    },
    //展示反馈的详细信息
    details(problemDescribe) {
      this.feedbackIssues = problemDescribe;
      this.detailsFeedbackDialogVisible = true;
    },
    //解决问题
    solvingProblems(id) {
      solvingProblems(id).then(res => {
        if (0 == res.code) {
          this.$message({
            type: 'error',
            message: '操作失败，请重试或联系管理员!'
          });
          return
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        });
        getFeedbackInfoData().then(res => {
          this.feedbackData = res.data
        })
      })
    }

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