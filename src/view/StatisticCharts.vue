<template>
  <div id="StatisticCharts">
    <div class="asideMenu">
      <el-menu
          :default-active="this.gasIndex"
          style=" border-radius: 15px; ">
        <el-menu-item @click="queryChartsData(null,{index:this.gasIndex,flag:0})"
                      style="height: 50px;
            margin-top:10px;text-align: center;width: 150px;padding-left: 15px;padding-right: 25px"
                      :index="item.index" v-for="(item,index) in menuListData" :key="index">
          <i class="el-icon-pie-chart"></i>
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="chartsContainer">
      <!--基本折线图-->
      <div></div>
      <div class="selectStyle">
        <span>查询时间：</span>
        <el-select v-model="value" placeholder="请选择" style="width: 75px;height: 30px"
                   @change="queryChartsData($event,{index:null,flag:1})">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
          </el-option>
        </el-select>
        <span style="margin-left: 10px">统计标准：</span>
        <el-select v-model="satisticValue" placeholder="请选择" style="width: 100px;height: 30px"
                   @change="queryChartsData($event,{index:null,flag:1})">
          <el-option
              v-for="item in statisOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
          </el-option>
        </el-select>
      </div>
      <div id="drawLine1" class="lineStyle"></div>
    </div>
  </div>
</template>

<script>
import {getGasNameList} from "@/utils/api";

export default {
  name: "StatisticCharts",
  data() {
    return {
      //画图实例
      drawLine1: null,
      drawLine2: null,
      drawLine3: null,
      //下拉框选项
      options: [{
        value: 'year',
        label: '年'
      }, {
        value: 'month',
        label: '月'
      }, {
        value: 'day',
        label: '日'
      }],
      statisOptions:[{
        value: 'average',
        label: '平均数'
      }, {
        value: 'median',
        label: '中位数'
      }],
      value: 'year',
      satisticValue:'average',
      isCollapse: true,
      menuListData: [
        {
          index: '1',
          name: '温度',
        },
        {
          index: '2',
          name: '湿度',
        }, {
          index: '3',
          name: 'co2',
        },
        {
          index: '4',
          name: 'so2',
        }
      ],
      gasIndex:'1',
    }
  },
  mounted() {
    this.drawInit();
    this.getGasName();
  },
  methods: {
    getGasName(){
      getGasNameList().then(res=>{
        if (res.data&&res.data.length>0){
          this.menuListData=res.data;
        }else {
          this.$message.error(res.msg);
        }
      })
    },
    queryChartsData(event,item) {
      if (item.flag===0) {
        //切换查询图表类型
        this.gasIndex = item.index;
        // if (this.gasIndex === '1') {
        //   return;
        // }
        this.value = 'year';
        this.satisticValue = 'average'
      }
      const gasName = this.menuListData[Number(this.gasIndex) - 1].name;
      //封装数据
      const param={
        name:gasName,
        satisticValue:this.satisticValue,
        datetime:this.value,
      }
      console.log(param);

    },
    getDrawInstance(id) {
      const instance = this.$echarts.init(document.getElementById(id));
      if (instance) return instance;
      this.$message.error({
        message: '图像初始化失败，有bug捏',
        duration: 2000
      })
      return null;
    },
    drawInit() {
      this.drawLine1 = this.getDrawInstance('drawLine1');
      const data = {
        dataList: [110, 111, 1112],
        dateList: ["2000-06-05", "2000-06-06", "2000-06-07"],
      }
      this.drawTempertureLine1(data);
    },
    drawTempertureLine1(data) {
      if (this.drawLine1) {
        const option = {
          visualMap: [
            {
              show: false,
              type: 'continuous',
              seriesIndex: 0,
              min: 0,
              max: 400
            },
          ],
          title: [
            {
              left: 'center',
              text: '温度基本数据折线图'
            },
          ],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [
            {
              data: data.dateList
            },
          ],
          yAxis: [
            {},
          ],
          grid: [
            {
              bottom: '60%'
            },
          ],
          series: [
            {
              type: 'line',
              showSymbol: false,
              data: data.dataList
            },
          ]
        };
        this.drawLine1.setOption(option);

      }
    }
  }
}
</script>

<style scoped>

/*设置侧栏触碰背景颜色*/
.el-menu-item:hover {
  background-color: rgba(64, 158, 255, 0.1) !important;
}

.asideMenu {
  width: 150px;
  text-align: center;
  height: 615px;
  border: 1px solid #DCDFE6;
  border-radius: 15px;
  margin-top: 5px;
  float: left;
  position: fixed;
}

.chartsContainer {
  /*background-color: #1296db;*/
  width: 89%;
  height: 635px;
  /*height: 1000px;*/
  margin-left: 170px;
}

.lineStyle{
  margin-top: 20px;
  height: 800px;
  width: 100%;
}

.selectStyle{
  margin-top: 10px;
  font-size: 14px;
  margin-left: 10px;
}

</style>