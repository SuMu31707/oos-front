<template>
  <div class="com-container">
    <div class="com-chart" ref="depSalaries_ref"></div>
  </div>
</template>

<script>
export default {
  name: "DepSalaries",
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
    // 初始化chartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.depSalaries_ref, 'chalk')
      // 对图标初始化进行控制
      const initOption = {
        title: {
          text: '▎部门薪资排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              barBorderRadius: [33, 33, 0, 0],
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    getData() {
      this.getRequest('/statistics/all/depSalaries').then(resp => {
        this.allData = resp;
        this.allData.sort((a, b) => {
          return b.value - a.value
        })
        this.updateChart();
      })
    },
    // 更新图表
    updateChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const sellerNames = this.allData.map((item) => {
        return item.key;
      });
      const sellerValue = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValue,
            itemStyle: {
              color: arg => {
                let targetColorArr = null
                if (arg.value > 60000) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 40000) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    // 当浏览器大小发生变化时调用此方法来完成屏幕的适配
    screenAdapter() {
      const titleFontSize = this.$refs.depSalaries_ref.offsetWidth / 100 * 3.6;
      // 分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            }
          }
        ]
      }
      // 手动调用图表对象的resize，才能产生适配效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>