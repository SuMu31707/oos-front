<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data() {
    return {
      chartInstance: null,
      allData: null
    }
  },
  mounted() {
    this.initChart();
    this.getData();
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    // 获取服务器数据
    getData() {
      this.getRequest('/statistics/all/salaries').then(resp=>{
        this.allData = resp;
        this.updateChart();
      })
    },
    // 更新图表
    updateChart() {
      const sellerNames = this.allData.map((item) => {
        return item.key;
      })
      const sellerValue = this.allData.map((item) => {
        return item.value;
      })
      const option = {
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          date: sellerNames
        },
        series: [
          {
            type: 'bar',
            data: sellerValue
          }
        ]
      };
      this.chartInstance.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>