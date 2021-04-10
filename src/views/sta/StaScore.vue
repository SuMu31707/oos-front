<template>
  <div>
    <!-- 搜索区域 -->
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="员工姓名" prop="name">
          <el-input
              v-model="queryParams.empName"
              placeholder="请输入员工姓名..."
              clearable
              @clear="initEmpPoint"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initEmpPoint"
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initEmpPoint">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
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
          :data="empPoints"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="正在拼命加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
          stripe>
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column
            prop="empName"
            label="员工姓名"
            align="center"
            width="130"/>
        <el-table-column
            prop="workID"
            label="员工工号"
            align="center"
            width="160"/>
        <el-table-column
            prop="depName"
            label="所属部门"
            align="center"
            width="240"/>
        <el-table-column
            label="积分数量"
            align="center"
            width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.point < 0" type="danger">{{ scope.row.point }}</el-tag>
            <el-tag v-if="scope.row.point >= 0" type="success">{{ scope.row.point }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="积分月份"
            align="center"
            width="150">
          <template slot-scope="scope">
            <el-tag>{{(scope.row.month).substring(0,7)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateDate"
            align="center"
            label="更新时间"
            width="250"/>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
          title="清空员工积分记录"
          center
          :visible.sync="dialogVisible"
          width="30%">
        <div>
            <span>选择月份：</span>
            <el-date-picker
                v-model="dropMonth"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="month"
                placeholder="选择要清空的月份">
            </el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dropEmpPoints()">确 定</el-button>
        </span>
      </el-dialog>
      <!--分页-->
      <div style="display: flex;justify-content: flex-end;margin-top: 3px">
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
  name: "StaScore",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      multipleSelection: [],
      multiple: true,
      queryParams: {
        empName: '',
        month: null
      },
      total: 0,
      currentPage: 1,
      currentSize: 10,
      empPoints: [],
      dropMonth: null,
    }
  },
  mounted() {
    this.initEmpPoint();
  },
  methods: {
    dropEmpPoints() {
      this.dialogVisible = false;
      this.deleteRequest('/statistics/score/'+this.dropMonth).then(resp=>{
        if (resp){
          this.initEmpPoint();
        }
      })
    },
    batchDrop() {
      this.dialogVisible = true;
      this.dropMonth = null;
    },
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
        this.deleteRequest('/statistics/score/' + ids).then(resp => {
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
        this.deleteRequest('/statistics/score/?ids=' + data.id).then(resp => {
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
    initEmpPoint() {
      let url = '/statistics/score/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
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
          this.empPoints = resp.data;
          this.total = resp.total;
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multiple = !val.length;
    },
    resetQuery() {
      this.queryParams = {
        empName: '',
        month: null
      };
      this.initEmpPoint();
    },
    sizeChange(currentSize) {
      this.currentSize = currentSize;
      this.initEmpPoint();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmpPoint();
    },
  }
}
</script>

<style scoped>

</style>