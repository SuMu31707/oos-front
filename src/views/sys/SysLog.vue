<template>
  <div>
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="操作员" prop="empName">
          <el-input
              v-model="queryParams.adminName"
              placeholder="请输入操作员姓名..."
              clearable
              @clear="initOpLogs"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initOpLogs"
          />
        </el-form-item>
        <el-form-item label="请求方式" prop="workID">
          <el-select
              v-model="queryParams.reqType"
              @clear="initOpLogs"
              style="width: 240px"
              clearable placeholder="选择请求方式">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作日期">
          <el-date-picker
              v-model="queryParams.beginDateScope"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initOpLogs">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" style="margin-bottom: 5px">
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              @click="handleClean"
          >清空</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
          :data="opLogs"
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55"
            align="center"/>
        <el-table-column
            prop="adminName"
            label="操作员"
            align="center"
            width="180"/>
        <el-table-column
            label="请求方式"
            align="center"
            width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reqType == 'DELETE'" type="danger">{{ scope.row.reqType }}</el-tag>
            <el-tag v-if="scope.row.reqType == 'POST'" type="success">{{ scope.row.reqType }}</el-tag>
            <el-tag v-if="scope.row.reqType == 'PUT'" type="warning">{{ scope.row.reqType }}</el-tag>
            <el-tag v-if="scope.row.reqType == 'GET'" type="info">{{ scope.row.reqType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="opDesc"
            label="操作描述"
            align="center"
            width="220"/>
        <el-table-column
            prop="opIp"
            label="请求IP"
            align="center"
            width="180"/>
        <el-table-column
            prop="opDate"
            label="操作日期"
            align="center"
            width="180"/>
        <el-table-column
            label="操作"
            align="center">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)">
              <i class="el-icon-view" style="color: #409eff;margin-right: 5px"></i>
              <span>详情</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 操作日志详细 -->
      <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="form" :model="form" label-width="100px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作员：">{{ form.adminName }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求IP：">{{ form.opIp }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求方式：">{{ form.reqType }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作时间：">{{ form.opDate }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="操作方法：">{{ form.opMethod }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请求参数：">{{ form.params }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="返回参数：">{{ form.opResult }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作描述：">{{ form.opDesc }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </el-dialog>
      <!--分页-->
      <div style="display: flex;justify-content: flex-end">
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
  name: "SysLog",
  data() {
    return {
      opLogs: [],
      multipleSelection: [],
      multiple: true,
      total: 0,
      currentPage: 1,
      size: 10,
      queryParams: {
        adminName: '',
        reqType: '',
        beginDateScope: [],
      },
      options: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }],
      form: {},
      open: false
    }
  },
  mounted() {
    this.initOpLogs();
  },
  methods: {
    handleDelete(){
      this.$confirm('此操作将永久删除选中的[' + this.multipleSelection.length + ']条日志信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/log/' + ids).then(resp => {
          if (resp) {
            this.initOpLogs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleClean() {
      this.$confirm('此操作将永久清空所有操作日志, 且操作是不可逆的, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/log/clear').then(resp => {
          if (resp) {
            this.initOpLogs();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空操作'
        });
      });
    },
    handleDetail(data) {
      this.form = data;
      this.open = true;
    },
    initOpLogs() {
      let url = '/system/log/?currentPage=' + this.currentPage + "&size=" + this.size;
      if (this.queryParams.adminName) {
        url += '&adminName=' + this.queryParams.adminName;
      }
      if (this.queryParams.reqType) {
        url += '&reqType=' + this.queryParams.reqType;
      }
      if (this.queryParams.beginDateScope) {
        url += '&beginDateScope=' + this.queryParams.beginDateScope;
      }
      this.getRequest(url).then(resp => {
        if (resp) {
          this.total = resp.total;
          this.opLogs = resp.data;
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.multiple = !selection.length;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initOpLogs();
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initOpLogs();
    },
  }
}
</script>

<style scoped>

</style>