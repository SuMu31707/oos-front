<template>
  <div class="com-container">
    <div class="com-chart" ref="empSalaries_ref"></div>
  </div>
</template>

<script>
export default {
  name: "EmpSalaries",
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timeId: null, //定时器标识
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
      this.chartInstance = this.$echarts.init(this.$refs.empSalaries_ref, 'chalk')
      // 对图标初始化进行控制
      const initOption = {
        title: {
          text: '▎员工本月薪资',
          left: 20,
          top: 20
        },
        grid: {
          top: '25%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
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
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              // 指明颜色渐变的方向
              // 指明不同百分比之下的颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 0%时的颜色，慢慢过渡到100%
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 100%时的颜色
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 监听鼠标事件
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    getData() {
      this.getRequest('/statistics/all/salaries').then(resp => {
        this.allData = resp;
        // 每5个元素显示一页
        this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
        this.updateChart();
        // 启动定时器
        this.startInterval();
      })
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5; // 0
      const end = this.currentPage * 5; // 5
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => {
        return item.key;
      });
      const sellerValue = showData.map((item) => {
        return item.value;
      });
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValue
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 1500)
    },
    // 当浏览器大小发生变化时调用此方法来完成屏幕的适配
    screenAdapter() {
      const titleFontSize = this.$refs.empSalaries_ref.offsetWidth / 100 * 3.6;
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
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
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