<template>
  <div class="screen-container">
    <div class="screen-body">
      <section class="screen-left">

        <div id="left-top" :class="[fullScreenStatus.depNum ? 'fullscreen' : '']">
          <!-- 部门人数占比图表 -->
          <dep-num ref="depNum"></dep-num>
          <div class="resize">
            <!-- icon-compress-alt -->
            <i @click="changeSize('depNum')" :class="['fa', fullScreenStatus.depNum ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </div>
        </div>

        <div id="left-bottom" :class="[fullScreenStatus.empSalaries ? 'fullscreen' : '']">
          <!-- 员工薪资图表 -->
          <emp-salaries ref="empSalaries"></emp-salaries>
          <div class="resize">
            <!-- icon-compress-alt -->
            <i @click="changeSize('empSalaries')" :class="['fa', fullScreenStatus.empSalaries ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </div>
        </div>

      </section>
      <section class="screen-middle">

        <div id="middle-top" :class="[fullScreenStatus.mapRef ? 'fullscreen' : '']">
          <!-- 员工分布图表 -->
          <single-map ref="mapRef"></single-map>
          <div class="resize">
            <!-- icon-compress-alt -->
            <i @click="changeSize('mapRef')" :class="['fa', fullScreenStatus.mapRef ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </div>
        </div>

        <div id="middle-bottom" :class="[fullScreenStatus.depSalaries ? 'fullscreen' : '']">
          <!-- 部门薪资排行图表 -->
          <dep-salaries ref="depSalaries"></dep-salaries>
          <div class="resize">
            <!-- icon-compress-alt -->
            <i @click="changeSize('depSalaries')" :class="['fa', fullScreenStatus.depSalaries ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </div>
        </div>

      </section>
      <section class="screen-right">

        <div id="right-top" :class="[fullScreenStatus.posNum ? 'fullscreen' : '']">
          <!-- 职位占比图表 -->
          <pos-num ref="posNum"></pos-num>
          <div class="resize">
            <!-- icon-compress-alt -->
            <i @click="changeSize('posNum')" :class="['fa', fullScreenStatus.posNum ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </div>
        </div>

        <div id="right-bottom" :class="[fullScreenStatus.jobNum ? 'fullscreen' : '']">
          <!-- 职称占比图表 -->
          <job-level-num ref="jobNum"></job-level-num>
          <div class="resize">
            <!-- icon-compress-alt -->
            <i @click="changeSize('jobNum')" :class="['fa', fullScreenStatus.jobNum ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </div>
        </div>

      </section>
    </div>
  </div>
</template>


<script>
import mapJson from 'echarts/map/json/china.json';
import EmpSalaries from "@/components/sta/EmpSalaries";
import DepSalaries from "@/components/sta/DepSalaries";
import DepNum from "@/components/sta/DepNum";
import JobLevelNum from "@/components/sta/JobLevelNum";
import PosNum from "@/components/sta/PosNum";
import Map from "@/components/sta/Map";
import {getThemeValue} from "@/utils/theme_utils";
import mapState from "vuex/dist/vuex.mjs";

export default {
  name: "StaAll",
  components: {
    'empSalaries': EmpSalaries,
    'single-map': Map,
    'depSalaries': DepSalaries,
    'depNum': DepNum,
    'jobLevelNum': JobLevelNum,
    'posNum': PosNum
  },
  data () {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        depNum: false,
        empSalaries: false,
        mapRef: false,
        jobNum: false,
        posNum: false,
        depSalaries: false
      }
    }
  },
  methods: {
    changeSize (chartName) {
      // 1.改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      this.$refs[chartName].screenAdapter()
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    // 接收到全屏数据之后的处理
    recvData (data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName
      // 取出, 切换成什么状态
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme () {
      // 修改VueX中数据
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    recvThemeChange () {
      this.$store.commit('changeTheme')
    }
  },
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 10px 10px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 45%;
      margin-top: 10px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 50%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 10px;
      width: 100%;
      height: 42%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 53%;
      position: relative;
    }
    #right-bottom {
      height: 45%;
      margin-top: 10px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>