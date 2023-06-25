<template>
<div id="GasCharts">
    <div class="parent">
      <div class="chartsPart">
<!--        <div class="chartsUtils"></div>-->
        <div id ="charts1" class="charts"></div>
      </div>
      <div class="chartsPart">
<!--        <div class="chartsUtils"></div>-->
        <div id ="charts2" class="charts"></div>
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: "GasCharts",
  data(){
    return{
      drawCharts1:null,
      drawCharts2:null,

    };
  },
  mounted() {
    this.drawCharts1=this.$echarts.init(document.getElementById('charts1'));
    this.drawCharts2 =this.$echarts.init(document.getElementById('charts2'));
    this.drawTemperatureLine();
    this.drawPieGasProportion();
    },
  methods:{
    drawTemperatureLine(){
      const option = {
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 1000
          },
          {
            show: false,
            type: 'continuous',
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: 6
          }
        ],
        title: {
          text: '温度折线图',
          top:'20px',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false, //不显示坐标轴线
          },
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '温度',
            type: 'line',
            stack: 'Total',
            data: [1, 200, 901, 450, 2, 3, 1320]
          }
        ]
      };
      this.drawCharts1.setOption(option);
      // this.drawCharts2.setOption(option);
    },
    drawPieGasProportion(){
      const option = {
        title: {
          text: '有害气体占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 200,
          top: 20,
          bottom: 20,
          data: ['温度','湿度','SO2','PM2.5','PM10'],
        },
        series: [
          {
            name: '有害气体',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: [{
              name:'温度',
              value:100000,
            },{
              name:'湿度',
              value: 200000,
            },{
              name:'S02',
              value: 20000,
            },{
              name: 'PM2.5',
              value: 30000,
            },{
              name:'PM10',
              value: 20000,
            }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.drawCharts2.setOption(option);
    }
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
.chartsPart{
  width: 100%;
  height: 320px;
}
.charts{
  margin-top: 20px;
  width: 66%;
  height:300px;
}
/*.chartsUtils{*/
/*  width: 50%;*/
/*  height:300px;*/
/*  float: right;*/
/*  background-color: rebeccapurple;*/
/*}*/

.child {
  box-sizing: border-box;
  background-color: white;
  flex: 0 0 50%;
  height: 310px;
  border: 1px solid red;
}
</style>