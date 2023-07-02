<template>
  <div id="HomeCharts">
    <div class="HomeContainer">
      <div id="charts2" class="partContainer"></div>
      <div id="chartPie" class="partContainer"></div>
      <div id="chartPanel1" class="partContainer"></div>
      <div id="chartPanel2" class="partContainer"></div>
      <div id="charts1" class="linePartContainer"></div>
    </div>
  </div>
</template>

<script>
import {getDeviceRunNumber} from "@/utils/api";
import {closeConnection, inintWebSocket, sendInfo} from "@/utils/websocketUtil";

export default {
  name: "HomeCharts",
  data() {
    return {
      WebSocket:null,
      websocketId:null,
      drawCharts1: null,
      drawCharts2: null,
      drawPie: null,
      drawPanel1: null,
      drawPanel2: null,
      deviceRunNumberXData:[],
      deviceRunNumberYData:[],
    };
  },
  created() {
  },
  beforeDestroy() {
    window.clearInterval(this.websocketId);
    this.WebSocket=closeConnection();
    this.websocketId=null;
  },
  mounted() {
    this.connectWebSocket();
    this.drawInit();
    this.getData();
  },
  methods: {
    connectWebSocket(){
      this.WebSocket=inintWebSocket();
      this.websocketId=window.setInterval(function () {
        sendInfo('你好');
      }, 1000*60*5);
    },
    getData(){
      this.getDeviceData();
    },
    getDeviceData(){
      getDeviceRunNumber().then((res)=>{
        const code = res.code;
        const msg = res.msg;
        if (code===1) {
          this.deviceRunNumberXData = res.data.x.reverse();
          this.deviceRunNumberYData = res.data.y;
          this.drawDeviceNumber();
        }else if (code===0){
          this.$message.warning(msg);
        }
      })
    },
    drawInit() {
      this.drawCharts1 = this.$echarts.init(document.getElementById('charts1'));
      this.drawCharts2 = this.$echarts.init(document.getElementById('charts2'));
      this.drawPanel1 = this.$echarts.init(document.getElementById('chartPanel1'))
      this.drawPanel2 = this.$echarts.init(document.getElementById('chartPanel2'))
      this.drawPie = this.$echarts.init(document.getElementById('chartPie'))
      this.drawGasLineAndPie();
      this.drawTemperaturePanel();
      this.drawHumidityPanel();
      this.drawAlarmInfoPie();
    },
    drawGasLineAndPie() {
      const option = {
        title: {
          top: '10px',
          left: '5px',
          text: '有害气体24小时内数据显示'
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: true,
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ]
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '45%'},
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
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
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };
      this.drawCharts1.setOption(option);
      // this.drawCharts2.setOption(option);
    },
    drawDeviceNumber() {
      const option = {
        title: {
          top: '10px',
          left: 'center',
          text: '7小时内设备运作数量',
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
            data: this.deviceRunNumberXData,
            show:false,
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
            data: this.deviceRunNumberYData,
            barCategoryGap:5,
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
                value: 20
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
                value: 20,
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
              fontSize: 14,
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
                value: 0.7,
                name: '湿度表盘'
              }
            ]
          }
        ]
      };
      this.drawPanel2.setOption(option);
    },
    drawAlarmInfoPie() {
      const option = {
        title: {
          top: '10px',
          left: 'center',
          text: '7天报警信息数量分布'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '10%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 20,
              borderColor: '#fff',
              borderWidth: 3
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 1048, name: 'Search Engine'},
              {value: 735, name: 'Direct'},
              {value: 580, name: 'Email'},
              {value: 484, name: 'Union Ads'},
              {value: 300, name: 'Video Ads'}
            ]
          }
        ]
      };
      this.drawPie.setOption(option);
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