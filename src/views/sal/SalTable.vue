<template>
  <div>
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="员工姓名" prop="name">
          <el-input
              v-model="queryParams.empName"
              placeholder="请输入员工姓名..."
              clearable
              @clear="initEmpSalaries"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initEmpSalaries"
          />
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker
              v-model="queryParams.month"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="month"
              placeholder="选择月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initEmpSalaries">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" icon="el-icon-pie-chart" @click="">结算本月薪资</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-row :gutter="10" style="margin-bottom: 5px">
        <el-col :span="1.5">
          <el-button
              plain
              icon="el-icon-delete-solid"
              type="danger"
              size="small"
              :disabled="multiple"
              @click="handleBatchDelete"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="small"
              @click="batchDrop"
          >清空
          </el-button>
        </el-col>
      </el-row>

      <el-table
          :data="empSalaries"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="正在拼命加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
          border
          stripe>
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column
            prop="empName"
            label="员工姓名"
            align="center"
            width="80"/>
        <el-table-column
            prop="workID"
            label="工号"
            align="center"
            width="80"/>
        <el-table-column
            prop="depName"
            label="所属部门"
            align="center"
            width="150"/>
        <el-table-column
            label="积分月份"
            align="center"
            width="150">
          <template slot-scope="scope">
            <el-tag>{{ (scope.row.month).substring(0, 7) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="payable"
            label="应发工资"
            align="center"
            width="120"/>
        <el-table-column
            prop="accFund"
            label="住房公积金扣除"
            align="center"
            width="120"/>
        <el-table-column
            prop="medical"
            label="医疗保险扣除"
            align="center"
            width="120"/>
        <el-table-column
            prop="pension"
            label="养老保险扣除"
            align="center"
            width="120"/>
        <el-table-column
            prop="tax"
            label="个人所得税扣除"
            align="center"
            width="120"/>
        <el-table-column
            prop="netSalary"
            label="实发工资"
            align="center"/>
      </el-table>
      <!--分页-->
      <div style="display: flex;justify-content: flex-end;margin-top: 5px">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes,prev,pager,next,jumper,->,total,slot" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalTable",
  data() {
    return {
      loading: false,
      multipleSelection: [],
      multiple: true,
      empSalaries: [],
      total: 0,
      currentPage: 1,
      currentSize: 10,
      queryParams: {
        empName: '',
        month: null
      },
    }
  },
  mounted() {
    this.initEmpSalaries();
  },
  methods: {
    handleBatchDelete() {
      this.$confirm('此操作将永久删除选中的 ' + this.multipleSelection.length + ' 条积分记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/statistics/' + ids).then(resp => {
          if (resp) {
            this.initEmpPoint();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.empName + '】的积分记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/statistics/?ids=' + data.id).then(resp => {
          if (resp) {
            this.initEmpPoint();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initEmpSalaries() {
      let url = '/salary/table/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
      if (this.queryParams.empName) {
        url += '&empName=' + this.queryParams.empName;
      }
      if (this.queryParams.month) {
        url += '&month=' + this.queryParams.month;
      }
      this.loading = true;
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.total = resp.total;
          this.empSalaries = resp.data;
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.multiple = !selection.length;
    },
    sizeChange(currentSize) {
      this.currentSize = currentSize;
      this.initEmpSalaries();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmpSalaries();
    },
    resetQuery() {
      this.queryParams = {
        empName: '',
        month: null
      };
      this.initEmpSalaries();
    }
  }
}
</script>

<style scoped>

</style>