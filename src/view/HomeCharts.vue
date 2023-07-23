<template>
  <div id="HomeCharts">
    <div class="HomeContainer">
      <div id="charts2" class="partContainer"></div>
      <div id="drawLine" class="partContainer"></div>
      <div id="chartPanel1" class="partContainer"></div>
      <div id="chartPanel2" class="partContainer"></div>
      <div id="charts1" class="linePartContainer"></div>
    </div>
  </div>
</template>

<script>
import {getDeviceRunNumber, getHarmfulGasAvgData, getRealTimeAlarmDataer} from "@/utils/api";
import {sendInfo} from "@/utils/websocketUtil";

export default {
  name: "HomeCharts",
  data() {
    return {
      WebSocket: null,
      websocketId: null,
      drawCharts1: null,
      drawCharts2: null,
      drawPie: null,
      drawPanel1: null,
      drawPanel2: null,

    };
  },
  created() {
  },
  beforeDestroy() {
    window.clearInterval(this.websocketId);
    // this.WebSocket = closeConnection();
    this.websocketId = null;
  },
  mounted() {
    this.connectWebSocket();
    this.drawInit();
    this.getData();
  },
  methods: {
    connectWebSocket() {
      if (!this.WebSocket) {
        this.WebSocket =this.$store.state.websocket;
        this.rewriteWebSocketFunc();
        this.websocketId = window.setInterval(function () {
          sendInfo(JSON.stringify({
            code:'1',
            data:null,
          }));
        }, 2000);
      }
    },
    rewriteWebSocketFunc() {
      if (this.WebSocket) {
        this.WebSocket.onmessage = ((event) => {
          if (JSON.parse(event.data)) {
            const data = JSON.parse(event.data);
            const code = data.code;
            if (code===1) {
              this.dynamicDeviceNumber(JSON.parse(data.deviceNumberData));
              this.dynamicAlarmInfo(JSON.parse(data.alarmInfoData).datetime, JSON.parse(data.alarmInfoData).number);
              this.dynamicTemperatureDatar(data.temperatureData);
              this.dynamicHumidityData(data.humidityData);
              this.dynamicHarmfulGasData(data.HarmfulGasData);
            }else if (code===2){
              this.$store.state.alarmNumber=Number(data.alarmNumber);
            }else if (code===3){
              // console.log(data);
              if (data.data.length!==0) {
                this.$store.state.alarmTableData=data.data;
              }
            }
          }
        })
      }
    },
    dynamicDeviceNumber(data) {
      const xData = (data.data.x).reverse();
      const yData = data.data.y;
      if (this.drawCharts2) {
        this.drawCharts2.setOption({
          xAxis: [
            {
              data: xData,
            }
          ],
          series: [
            {
              data: yData,
            },
          ]
        })
      }
    },
    dynamicAlarmInfo(date, value) {
      if (this.drawLine&&this.drawLine.getOption()) {
        //更新数据
        const xData = this.drawLine.getOption().xAxis[0].data;
        const yData = this.drawLine.getOption().series[0].data;
        xData.shift();
        yData.shift();
        xData.push(date);
        yData.push(value);
        this.drawLine.setOption({
          xAxis: [
            {
              data: xData,
            }
          ],
          series: [
            {
              data: yData,
            },
          ]
        })
      }
    },
    dynamicTemperatureDatar(value) {
      if (this.drawPanel1) {
        this.drawPanel1.setOption({
          series: [
            {
              data: [
                {
                  value: value,
                  name: '温度仪表盘'
                }
              ]
            },
            {
              data: [
                {
                  value: value
                }
              ]
            },
          ]
        })
      }
    },
    dynamicHumidityData(value) {
      if (this.drawPanel2) {
        this.drawPanel2.setOption({
          series: [{
            data: [
              {
                value: value,
                name: '湿度仪表盘'
              }
            ]
          }]
        })
      }
    },
    dynamicHarmfulGasData(value) {
      if (this.drawCharts1) {
        const result = JSON.parse(value);
        const source = this.drawCharts1.getOption().dataset[0].source;
        source[0].splice(1,1);
        source[0].push(result.datetime);
        for (const sourceElement of source) {
          for (const dataEle of result.data) {
            if (dataEle.gasName === sourceElement[0]) {
              sourceElement.splice(1, 1);
              sourceElement.push(dataEle.data);
            }
          }
        }
        const pieData = this.calcPieData(source);
        this.drawCharts1.setOption({
          dataset: [
            {
              source: source,
            }
          ],
          series: [
            {
              data: pieData,
            }
          ]
        })
      }
    },
    getData() {
      this.getDeviceData();
      this.getAlarmData();
      this.getHarmfulGasData();
    },
    getAlarmData() {
      getRealTimeAlarmDataer().then((res) => {
        if (res.code === 1) {
          this.drawAlarmInfoLine(res.data.dateList, res.data.valueList);
        } else if (res.code === 0) {
          // this.$message.warning(res.msg);
          const dateList =[];
          const valueList = [];
          let now = new Date().getTime();
          for (let i = 0; i <7; i++) {
            dateList.push(this.getDataTimeFormat(now));
            now-=(1000*60);
            valueList.push(0);
          }

          this.drawAlarmInfoLine(dateList,valueList);
        }
      })
    },
    getDataTimeFormat(n) {
      const now = new Date(n)
          // y = now.getFullYear(),
          // m = now.getMonth() + 1,
          // d = now.getDate();
      // return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
      return now.toTimeString().substr(0, 8);
    },
    getDeviceData() {
      getDeviceRunNumber().then((res) => {
        const code = res.code;
        const msg = res.msg;
        if (code === 1) {
          this.drawDeviceNumber(res.data.x.reverse(), res.data.y);
        } else if (code === 0) {
          this.$message.warning(msg);
        }
      })
    },
    getHarmfulGasData() {
      getHarmfulGasAvgData().then((res) => {
        const dataList = res.data;
        const sourceList = [];
        const datetimeList = ['product'];
        for (const item of dataList) {
          datetimeList.push(item.datetime);
        }
        sourceList.push(datetimeList);
        for (const item of dataList[0].data) {
          sourceList.push([item.gasName]);
        }
        for (const dataEle of dataList) {
          const element = dataEle.data
          for (const ele of element) {
            for (let i = 1; i < sourceList.length; i++) {
              if (sourceList[i][0] === ele.gasName)
                sourceList[i].push(ele.avg)
            }
          }
        }
        const pieData = this.calcPieData(sourceList);
        // console.log(sourceList,pieData)
        this.drawGasLineAndPie(sourceList, pieData);
      })
    },
    calcPieData(list) {
      const pieDataList = [];
      for (let i = 1; i < list.length; i++) {
        let sum = 0;
        for (let j = 1; j < list[i].length; j++) {
          sum += list[i][j];
        }
        pieDataList.push({
          name: list[i][0],
          value: (sum / (list[i].length - 1)).toFixed(2),
        })
      }
      return pieDataList;
    },
    drawInit() {
      this.drawCharts1 = this.$echarts.init(document.getElementById('charts1'));
      this.drawCharts2 = this.$echarts.init(document.getElementById('charts2'));
      this.drawPanel1 = this.$echarts.init(document.getElementById('chartPanel1'))
      this.drawPanel2 = this.$echarts.init(document.getElementById('chartPanel2'))
      this.drawLine = this.$echarts.init(document.getElementById('drawLine'))
      this.drawTemperaturePanel();
      this.drawHumidityPanel();
    },
    drawGasLineAndPie(source, pieData) {
      const option = {
        title: {
          top: '10px',
          left: '5px',
          text: '有害气体实时数据显示'
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: true,
        },
        dataset: {
          source: source,
          //  source: [
          //   ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
          //   ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
          //   ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
          //   ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
          //   ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          // ]
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '45%'},
        series: [
          // {
          //   type: 'line',
          //   smooth: true,
          //   seriesLayoutBy: 'row',
          //   emphasis: {focus: 'series'}
          // },
          // {
          //   type: 'line',
          //   smooth: true,
          //   seriesLayoutBy: 'row',
          //   emphasis: {focus: 'series'}
          // },
          // {
          //   type: 'line',
          //   smooth: true,
          //   seriesLayoutBy: 'row',
          //   emphasis: {focus: 'series'}
          // },
          // {
          //   type: 'line',
          //   smooth: true,
          //   seriesLayoutBy: 'row',
          //   emphasis: {focus: 'series'}
          // },
          {
            type: 'pie',
            id: 'pie',
            radius: '25%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            data: pieData,
            // data: [
            //   { value: 1048, name: 'Milk Tea' },
            //   { value: 735, name: 'Matcha Latte' },
            //   { value: 484, name: 'Cheese Cocoa' },
            //   { value: 300, name: 'Walnut Brownie' }
            // ]
          }
        ]
      };
      for (let i = 0; i < pieData.length; i++) {
        option.series.push({
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: {focus: 'series'}
        })
      }
      this.drawCharts1.setOption(option);
      // this.drawCharts2.setOption(option);
    },
    drawDeviceNumber(xData, yData) {
      const option = {
        title: {
          top: '10px',
          left: 'center',
          text: '实时设备数量监控',
          textStyle: {
            fontFamily: 'Arial',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New'
            // 'Microsoft YaHei'(微软雅黑) ，文字字体
            fontSize: 18, //字体大小
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: xData,
            show: false,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '设备数量',
            type: 'bar',
            data: yData,
            barCategoryGap: 5,
            itemStyle: {
              barBorderRadius: 10,
              borderWidth: 2,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
              shadowBlur: 3
            }
          },
        ]
      };
      this.drawCharts2.setOption(option);
    },
    drawTemperaturePanel() {
      const option = {
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: -10,
            max: 50,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91'
            },
            progress: {
              show: true,
              width: 30
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 30
              }
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 12
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '10%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-10%'],
              fontSize: 50,
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'inherit'
            },
            data: [
              {
                value: 0
              }
            ]
          },
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: -10,
            max: 50,
            itemStyle: {
              color: '#FD7347'
            },
            progress: {
              show: true,
              width: 8
            },
            pointer: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 0,
                name: '温度仪表盘'
              }
            ]
          }
        ]
      };
      this.drawPanel1.setOption(option);
    },
    drawHumidityPanel() {
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '70%'],
            radius: '100%',
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 5
              }
            },
            axisLabel: {
              color: '#464646',
              fontSize: 13,
              distance: -85,
              rotate: 'tangential',
              formatter: function (value) {
                if (value === 0.875) {
                  return '过渡湿润';
                } else if (value === 0.625) {
                  return '湿润';
                } else if (value === 0.375) {
                  return '略微干燥';
                } else if (value === 0.125) {
                  return '干燥';
                }
                return '';
              }
            },
            title: {
              offsetCenter: [0, '-10%'],
              fontSize: 20
            },
            detail: {
              fontSize: 30,
              offsetCenter: [0, '-35%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + '%';
              },
              color: 'inherit'
            },
            data: [
              {
                value: 0,
                name: '湿度表盘'
              }
            ]
          }
        ]
      };
      this.drawPanel2.setOption(option);
    },
    drawAlarmInfoLine(dateList, valueList) {
      // const dateList = list.map(function (item) {
      //   return item[0];
      // });
      // const valueList = list.map(function (item) {
      //   return item[1];
      // });
      const option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 25
          },
        ],
        title: {
          top: '10px',
          left: 'center',
          text: '实时报警信息',
          textStyle: {
            fontFamily: 'Arial',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New'
            // 'Microsoft YaHei'(微软雅黑) ，文字字体
            fontSize: 18, //字体大小
          },
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            data: dateList
          },
        ],
        yAxis: [
          {},
        ],
        grid: [
          {
            bottom: '15%'
          },
          {
            top: '60%'
          }
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            data: valueList
          },

        ]
      };
      this.drawLine.setOption(option);
    },
  }
}
</script>

<style scoped>
.parent {
  margin-top: -15px;
  margin-bottom: -15px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  overflow: auto;
}

.chartsPart {
  width: 100%;
  height: 320px;
}

.charts {
  margin-top: 20px;
  width: 66%;
  height: 300px;
}

.linePartContainer {
  height: 700px;
  width: 100%;
  margin-top: 20px;
  margin-right: auto;
  margin-left: 45px;
  margin-right: 45px;
  border-radius: 15px;
  background-clip: padding-box;
  background-color: rgba(85, 0, 0, 0);
  border: 1px solid azure;
  box-shadow: 0 0 25px rgb(161, 138, 143);
  border-color: lavenderblush;
  float: left;
}

.partContainer {
  height: 400px;
  width: 650px;
  margin-top: 20px;
  margin-right: auto;
  margin-left: 45px;
  border-radius: 15px;
  background-clip: padding-box;
  background-color: rgba(85, 0, 0, 0);
  border: 1px solid azure;
  box-shadow: 0 0 25px rgb(161, 138, 143);
  border-color: lavenderblush;
  float: left;
}

.HomeContainer {
  height: 100%;
  width: 97%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  background-clip: padding-box;
  background-color: rgba(85, 0, 0, 0);
  border: 1px solid azure;
  box-shadow: 0 0 25px rgba(222, 187, 195, 1);
  border-color: lavenderblush;
  overflow: auto;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
}
</style>