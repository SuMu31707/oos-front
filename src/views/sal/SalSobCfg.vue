<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 8px;margin-bottom: 10px">
      <el-input v-model="keywords" style="width: 500px;margin-right: 5px" placeholder="通过用户名搜索..."
                prefix-icon="el-icon-search" @keydown.enter.native="initEmps" @clear="initEmps" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="initEmps">搜索</el-button>
    </div>
    <div>
      <el-table
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="emps"
          border
          stripe>
        <el-table-column
            type="selection"
            align="center"
            width="40">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            width="80">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱地址"
            width="180">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            width="120">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            width="120">
        </el-table-column>
        <el-table-column
            label="工资账套"
            align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{scope.row.salary.basicSalary}}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{scope.row.salary.bonus}}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{scope.row.salary.lunchSalary}}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{scope.row.salary.trafficSalary}}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{scope.row.salary.pensionPer}}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{scope.row.salary.pensionBase}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{scope.row.salary.medicalPer}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{scope.row.salary.medicalBase}}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                  </tr>
                </table>
              </div>
              <el-tag type="success">{{ scope.row.salary.name }}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置账套</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center">
          <template slot-scope="scope">
            <el-popover
                placement="left"
                title="修改工资账套"
                width="200"
                @show="showPop(scope.row.salary)"
                @hide="hidePop(scope.row)"
                trigger="click">
              <div>
                <el-select v-model="currentSalary" placeholder="选择账套">
                  <el-option
                      v-for="item in salaries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-button slot="reference" type="danger">修改工资账套</el-button>
            </el-popover>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div style="display: flex;justify-content: flex-end;margin-top: 5px">
      <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSobCfg",
  data() {
    return {
      loading: false,
      keywords: '',
      emps: [],
      currentPage: 1,
      size: 10,
      total: 0,
      salaries: [],
      currentSalary: null
    }
  },
  mounted() {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    hidePop(data){
      if (this.currentSalary && this.currentSalary!=data.salary.id){
        this.putRequest('/salary/sobcfg/?eid=' + data.id+'&sid='+this.currentSalary).then(resp=>{
          if (resp) {
            this.initEmps();
          }
        })
      }
    },
    showPop(data) {
      if (data) {
        this.currentSalary = data.id;
      } else {
        this.currentSalary = null;
      }
    },
    initSalaries() {
      this.getRequest('/salary/sobcfg/salaries').then(resp=>{
        if (resp){
          this.salaries = resp;
        }
      })
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    initEmps() {
      this.loading = true;
      let url = '/salary/sobcfg/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (this.keywords){
        url += '&empName=' + this.keywords;

      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>