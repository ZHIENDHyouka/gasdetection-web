<template>
  <div id="ManageHome">
    <div id="testChart" style="width: 100%;height:100%;"></div>
  </div>
</template>

<script>
import 'echarts-gl';
export default {
  name: "ManageHome",
  data(){
    return{

    };
  },
  mounted() {
    this.drawTestChart()
  },
  methods:{
    drawTestChart(){
      const testChart = this.$echarts.init(document.getElementById('testChart'));
      let option;
      option = {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
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
      testChart.setOption(option);
    },
  }
}
</script>

<style scoped>

</style>