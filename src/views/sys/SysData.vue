<template>
  <div>
    <div style="margin-top: 20px;margin-bottom: 5px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="备注信息" prop="empName">
          <el-input
              v-model="queryParams.remark"
              placeholder="请输入备注信息..."
              clearable
              @clear="initBackups"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initBackups"
          />
        </el-form-item>
        <el-form-item label="备份日期">
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initBackups">搜索</el-button>
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
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              icon="el-icon-refresh"
              size="mini"
              @click="showBackupView"
          >备份
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-table
          :data="backups"
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55"
            align="center"/>
        <el-table-column
            prop="name"
            label="文件名"
            align="center"
            width="300"/>
        <el-table-column
            prop="backupDate"
            label="备份日期"
            align="center"
            width="250"/>
        <el-table-column
            prop="remark"
            label="备注信息"
            align="center"
            width="250"/>
        <el-table-column
            label="操作"
            align="center">
          <template slot-scope="scope">
            <el-button type="success" round icon="el-icon-refresh-left" @click="handleRollBack(scope.row)">回滚</el-button>
            <a style="margin-left: 5px" :href="scope.row.url"><el-button type="primary" round icon="el-icon-download">下载</el-button></a>
          </template>
        </el-table-column>
      </el-table>

      <div style="display: flex;justify-content: flex-end;margin-top: 2px">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes,prev,pager,next,jumper,->,total,slot" :total="total"></el-pagination>
      </div>

      <el-dialog
          title="备份数据库"
          :visible.sync="dialogVisible"
          width="30%">
          <span>
            备注信息：<el-input v-model="remark" type="textarea" placeholder="请输入备注信息"></el-input>
          </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleBackup()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "SysData",
  data() {
    return {
      dialogVisible: false,
      remark: '',
      queryParams: {
        remark: '',
        beginDateScope: []
      },
      backups: [],
      total: 0,
      currentPage: 1,
      size: 10,
      multipleSelection: [],
      multiple: false
    }
  },
  mounted() {
    this.initBackups();

  },
  methods: {
    handleRollBack(data) {
      this.$confirm('此操作将会使数据库回滚到《' + data.backupDate + '》时候的状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.getRequest('/system/data/rollback?url=' + data.url).then(resp => {
          if (resp) {
            this.initBackups();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回滚'
        });
      });
    },
    showBackupView() {
      this.remark = '';
      this.dialogVisible = true;
    },
    handleBackup() {
      this.getRequest('/system/data/backup?remark=' + this.remark).then(resp => {
        if (resp) {
          this.initBackups();
          this.dialogVisible = false;
        }
      })
    },
    handleDelete() {
      this.$confirm('此操作将永久删除选中的[' + this.multipleSelection.length + ']条数据库备份信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/data/' + ids).then(resp => {
          if (resp) {
            this.initBackups();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initBackups() {
      let url = '/system/data/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (this.queryParams.remark) {
        url += '&remark=' + this.queryParams.remark;
      }
      if (this.queryParams.beginDateScope) {
        url += '&beginDateScope=' + this.queryParams.beginDateScope;
      }
      this.getRequest(url).then(resp => {
        if (resp) {
          this.total = resp.total;
          this.backups = resp.data;
        }
      })
    },// 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.multiple = !selection.length;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initBackups();
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initBackups();
    }
  }
}
</script>

<style scoped>

</style>