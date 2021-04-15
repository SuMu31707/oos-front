<template>
  <div class="com-container">
    <div class="com-chart" ref="posNum_ref"></div>
  </div>
</template>

<script>
export default {
  name: "PosNum",
  data() {
    return {
      chartInstance: null,
      allData: null,
    }
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener('resize', this.screenAdapter)
    // 页面加载完成时，主动进行屏幕适配
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timeId)
    // 组件销毁时，需要将监听器取消掉，以防内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.posNum_ref, 'chalk')
      // 对图标初始化进行控制
      const initOption = {
        title: {
          text: '▎职位人数占比',
          left: 20,
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}：{c}人<br/>总占比：{d}%"
        },
        series: [
          {
            type: 'pie'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    getData() {
      this.getRequest('/statistics/all/posNum').then(resp => {
        this.allData = resp;
        this.updateChart();
      })
    },
    // 更新图表
    updateChart() {
      const legendData = this.allData.map((item) => {
        return item.key
      });
      const seriesData = this.allData.map((item) => {
        return {
          name: item.key,
          value: item.value,
        }
      });
      const dataOption = {
        legend: {
          orient: 'horizontal',
          bottom: '3%',  //图例距离左的距离
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    // 当浏览器大小发生变化时调用此方法来完成屏幕的适配
    screenAdapter() {
      const titleFontSize = this.$refs.posNum_ref.offsetWidth / 100 * 3.6;
      // 分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize /2,
          itemHeight: titleFontSize /2,
          itemGap: titleFontSize /2,
        },
        series: [
          {
            radius: titleFontSize * 4.5,
            center: ['50%', '50%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize，才能产生适配效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>