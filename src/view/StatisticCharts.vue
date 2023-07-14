<template>
  <div id="StatisticCharts">
    <div class="asideMenu">
      <el-menu
          default-active="1"
          style=" border-radius: 15px;">
        <el-menu-item @click="queryChartsData({index:item.index,flag:0,chartType:''})"
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
      <div>
        <div class="selectStyle">
          <span>时间单位：</span>
<!--          @change="changeDateTimeUint"-->
          <el-select v-model="value" placeholder="请选择" style="width: 75px;height: 30px" >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <span style="margin-left: 10px">统计标准：</span>
          <el-select v-model="satisticValue" placeholder="请选择" style="width: 100px;height: 30px">
            <el-option
                v-for="item in statisOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <span style="margin-left: 10px">时间范围选择：</span>
          <el-date-picker
              v-model="datetime"
              :type="datePickerType"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-button type="primary" round style="margin-left: 10px"
                     @click="queryChartsData({flag:1,chartType:'line1'})">查询</el-button>
        </div>
        <div id="drawLine1" class="lineStyle"></div>
      </div>
      <div>
        <div class="selectStyle">
          <span>时间单位：</span>
          <!--          @change="changeDateTimeUint"-->
          <el-select v-model="value" placeholder="请选择" style="width: 75px;height: 30px" >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <span style="margin-left: 10px">统计标准：</span>
          <el-select v-model="satisticValue" placeholder="请选择" style="width: 100px;height: 30px">
            <el-option
                v-for="item in statisOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <span style="margin-left: 10px">时间范围选择：</span>
          <el-date-picker
              v-model="datetime"
              :type="datePickerType"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-button type="primary" round style="margin-left: 10px"
                     @click="queryChartsData({flag:1,chartType:'line1'})">查询</el-button>
        </div>
        <div id="drawLine2" class="lineStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {getGasNameList, getStatisticData} from "@/utils/api";

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
      },
      //   {
      //   value: 'custom',
      //   label: '时间均摊'
      // }
      ],
      statisOptions: [{
        value: 'average',
        label: '平均数'
      }, {
          value: 'median',
        label: '中位数'
      }],
      value: 'day',
      satisticValue: 'average',
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
      gasIndex: 0,
      datetime: [],
      datePickerType: 'datetimerange'
    }
  },
  mounted() {
    this.drawInit();
    this.getGasName();
    this.setNowMothRange();
    this.queryChartsData({index:this.gasIndex,flag:0,chartType:''})
  },
  methods: {
    getGasName() {
      getGasNameList().then(res => {
        if (res.data && res.data.length > 0) {
          this.menuListData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    queryChartsData(item) {
      if (this.datetime && this.datetime.length > 0) {
        if (item.flag === 0) {
          //切换查询图表类型
          console.log(item.index);
          this.gasIndex = Number(item.index);
          console.log(this.gasIndex);
          this.value = 'day';
          this.satisticValue = 'average'
        }
        const gasName = this.menuListData[this.gasIndex].name;
        //封装数据
        var param = {
          name: gasName,
          satisticValue: this.satisticValue,
          datetimeUnit: this.value,
          chartType: item.chartType,
          datetime: this.datetime,
        }
        console.log(param);
        getStatisticData(param).then(res => {
          if (item.chartType===''){
            const result = res.data;
            //展示数据获取信息
            for (const resultKey in result) {
              const item = result[resultKey];
              if (item.msg!=='') this.$message.error({message:item.msg,duration:2000});
              //折线图和面积图
              if (resultKey==='drawLineAndAreaData'){
                this.drawGasLine1(item.data);
                this.drawGasLine2(item.data);
              }else if (resultKey==='xxx'){
                //后续其他图
              }
            }


          /*  param.chartType='line1';
            getStatisticData(param).then(res => {
              if (res.code===1) {
                const dataList = res.data.dataList;
                const dateList = res.data.dateList;
                console.log(dataList)
                console.log(dateList)
                //渲染图像
                this.drawGasLine1({
                  dataList:dataList,
                  dateList:dateList,
                })
              }else {
                this.$message.error({
                  message:'未获取到数据',
                  duration:2000
                })
              }
            })
            param.chartType='line2'
            getStatisticData(param).then(res => {
              if (res.code===1) {
                const dataList = res.data.dataList;
                const dateList = res.data.dateList;
                //渲染图像
                this.drawGasLine1({
                  dataList:dataList,
                  dateList:dateList,
                })
              }else {
                this.$message.error({
                  message:'未获取到数据',
                  duration:2000
                })
              }
            })*/
          }else if (item.chartType==='line1'){
            //基本折线图
            if (res.code===1) {
              const dataList = res.data.dataList;
              const dateList = res.data.dateList;
              //渲染图像
              this.drawGasLine1({
                dataList:dataList,
                dateList:dateList,
              })
            }else {
              this.$message.error({
                message:'未获取到数据',
                duration:2000
              })
            }
          }else if (item.chartType==='line2') {
            //面积图
            if (res.code===1) {
              const dataList = res.data.dataList;
              const dateList = res.data.dateList;
              //渲染图像
              this.drawGasLine2({
                dataList:dataList,
                dateList:dateList,
              })
            }else {
              this.$message.error({
                message:'未获取到数据',
                duration:2000
              })
            }
          }
        })
      } else {
        this.$message.error({
          message: '请将查询信息填写完整!',
          duration: 2000,
        })
      }

    }
    //图像渲染
    /*imageRendering(drawGasLine,res){
      if (res.code===1) {
        const dataList = res.data.dataList;
        const dateList = res.data.dateList;
        console.log(dataList)
        console.log(dateList)
        //渲染图像
        if ('drawGasLine1'===drawGasLine){
          this.drawGasLine1({
            dataList:dataList,
            dateList:dateList,
          })
        }
        if ('drawGasLine2'===drawGasLine){
          this.drawGasLine2({
            dataList:dataList,
            dateList:dateList,
          })
        }
      }else {
        this.$message.error({
          message:'为获取到数据',
          duration:2000
        })
      }
    }*/,
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
      this.drawLine2 = this.getDrawInstance('drawLine2');
      const data = {
        dataList: [110, 111, 112],
        dateList: ["2000-06-05", "2000-06-06", "2000-06-07"],
      }
      this.drawGasLine2(data);
    },
    //基本折线图
    drawGasLine1(data) {
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
              text: `${this.menuListData[this.gasIndex].name}基本数据折线图`
            },
          ],
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            feature: {
              // restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
              data: data.dateList,
              boundaryGap: false,
            },
          yAxis: {},
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 10,
            },
          ],
          grid: [
            {
              bottom: '15%'
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
    },
    //面积图
    drawGasLine2(data){
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: `${this.menuListData[this.gasIndex].name}面积图`
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.dateList
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: `${this.menuListData[this.gasIndex].name}`,
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }
              ])
            },
            data: data.dataList
          }
        ]
      };
      this.drawLine2.setOption(option);
    },
    // changeDateTimeUint(){
    //   if (this.value==='year'){
    //     this.datePickerType='daterange';
    //   }else if (this.value==='month'){
    //     this.datePickerType='daterange';
    //   }else if (this.value==='day'){
    //     this.datePickerType='daterange';
    //   }else if (this.value==='custom'){
    //     this.datePickerType==='datetimerange'
    //   }
    // },
    //设置当前默认时间
    setNowMothRange() {
      this.datetime = [];
      const now = new Date().getTime();
      this.datetime.push(this.getDataTimeFormat(now - 1000 * 60 * 60 * 24 * 30));
      this.datetime.push(this.getDataTimeFormat(now));
    },
    getDataTimeFormat(n) {
      const now = new Date(n),
          y = now.getFullYear(),
          m = now.getMonth() + 1,
          d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
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

.lineStyle {
  margin-top: 20px;
  height: 600px;
  width: 95%;
}

.selectStyle {
  margin-top: 15px;
  font-size: 14px;
  margin-left: 100px;
}

</style>