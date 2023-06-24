<template>
  <div id="GasData">
    <div class="queryBar">
      <span class="demonstration">数据筛选：</span>
      <div>
        <el-select v-model="queryGas" placeholder="请选择查询的数据"
                   filterable clearable style="margin-right: 20px"
                    @change="getConditionTableDate">
        <el-option-group
            v-for="group in gasOptions"
            :key="group.label"
            :label="group.label">
          <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-option-group>
        </el-select>
      </div>
      <div class="block">
        <span class="demonstration">时间范围：</span>
        <el-date-picker
            @change="getConditionTableDate"
            v-model="queryDateTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-right: 20px;width: 360px">
        </el-date-picker>
      </div>
      <div>
        <span class="demonstration">设备选择：</span>
        <el-select v-model="queryDevice" clearable placeholder="请选择"
                   @change="getConditionTableDate">
          <el-option
              v-for="item in deviceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="tablePart">
      <el-table
          :data="this.tableData.slice((this.currentPage-1)*this.pageSize,this.pageSize*this.currentPage)"
          style="width: 100%" :cell-style="columnStyle" :header-cell-style="headCellStyle"  height="500">
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column v-for="(item,key) in this.tableHead" :key="key" :property="item.proper"
                         :label="item.label" :render-header="renderHeader">
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[10, 50, 100, 500]" :page-size="5"
                       layout="total, sizes, prev, pager, next, jumper" :total="this.tableData.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {getAllDeviceName, getAllTemperatureData, getConditionData} from "@/utils/api";

export default {
  name: "GasData",
  data() {
    return {
      tableHead: [{
        label: '日期',
        proper: "date",
      }, {
        label: '姓名',
        proper: "name",
      }, {
        label: '地址',
        pro: "address",
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      currentPage: 1,
      pageSize: 10,
      gasOptions: [{
        label: '常规',
        options: [{
          value: '温度',
          label: '温度'
        }, {
          value: '湿度',
          label: '湿度'
        }]
      }, {
        label: '有害气体',
        options: [
          {
            value: '全部',
            label: '全部'
          },{
          value: 'PM2.5',
          label: 'PM2.5'
        }, {
          value: 'PM10',
          label: 'PM10'
        }, {
          value: 'SO2',
          label: 'SO2'
        }, {
          value: 'NO2',
          label: 'NO2'
        },{
            value: 'CO',
            label: 'CO'
          },{
            value: 'O3',
            label: 'O3'
          }]
      }],
      queryGas: '',
      queryDateTime:'',
      queryDevice:'',
      deviceList:[],
    }
  },
  mounted() {
    this.queryGas="温度";
    this.getAllTemperatureList();
    this.getDeviceNameList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    columnStyle() {
      return "text-align:center;height:55px";
    },
    headCellStyle() {
      return "text-align:center;height:65px;background:#eef1f6;color:#606266;";
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
    getAllTemperatureList() {
      getAllTemperatureData().then(res => {
        console.log(res.data);
        this.tableData = res.data.dataList;
        this.tableHead = res.data.headList;
        if (this.tableData.length===0){
          this.$message.warning("暂无数据!");
        }
        console.log("数据获取!");
      })
    },
    getConditionTableDate(){
      if (this.queryDateTime||this.queryGas||this.queryDevice) {
        const condition={
          datetime:this.queryDateTime,
          gas:this.queryGas,
          device:this.queryDevice
        };
        getConditionData(condition).then(res=>{
          this.tableData = res.data.dataList;
          this.tableHead = res.data.headList;
          if (this.tableData.length===0){
            this.$message.warning("暂无数据!");
          }
          console.log(res);
          console.log("数据获取!");
        })
      }
    },
    getGasDataList(){
      if (this.queryGas)
      console.log(this.queryGas);
    },
    getDeviceDataList(){
      if (this.queryDevice)
        console.log(this.queryDevice);
    },
    getDeviceNameList(){
      getAllDeviceName().then(res=>{
        // console.log(res);
        this.deviceList=res.data;
      })
    }
  }
}
</script>

<style scoped>
.queryBar {
  display: flex;
  width: auto;
  height: 55px;
}

.tablePart {
  border-top: 1px solid #eae6e6;
}

/*.el-table__header{*/
/*  width: 100% !important;*/
/*}*/
/*.el-table__body{*/
/*  width: 100% !important;*/
/*}*/
.el-pagination {
  width: 80%;
  height: 60px;
  position: fixed;
  bottom: 0;
}
.queryBar span{
  line-height: 40px;
}
</style>