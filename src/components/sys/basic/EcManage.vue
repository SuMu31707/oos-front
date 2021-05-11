<template>
  <div>
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="规则名称" prop="name">
          <el-input
              v-model="queryParams.name"
              placeholder="请输入规则名称..."
              clearable
              @clear="initEcRules"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initEcRules"
          />
        </el-form-item>
        <el-form-item label="奖惩类型" prop="ecType">
          <el-select style="width: 240px"
                     v-model="queryParams.ecType"
                     clearable
                     @clear="initEcRules"
                     placeholder="请选择奖惩类型">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initEcRules">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-row :gutter="10" style="margin-bottom: 5px">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="small"
              @click="handleAdd"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="batchDelete"
          >删除
          </el-button>
        </el-col>
      </el-row>
      <el-table
          :data="ecRules"
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
            prop="name"
            label="规则名称"
            align="center"
            width="300"/>
        <el-table-column
            label="奖惩类型"
            align="center"
            width="140">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ecType == 0" type="success">奖励</el-tag>
            <el-tag v-if="scope.row.ecType == 1" type="danger">惩罚</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="奖惩积分"
            align="center"
            width="145">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ecType == 0" type="success">+{{ scope.row.ecPoint }}</el-tag>
            <el-tag v-if="scope.row.ecType == 1" type="danger">-{{ scope.row.ecPoint }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="createDate"
            align="center"
            label="创建日期"
            width="140"/>
        <el-table-column
            prop="remark"
            label="备注信息"
            align="center"
            width="300"/>
        <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
            >修改
            </el-button>
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

      <div style="display: flex;justify-content: flex-end;margin-top: 3px">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes,prev,pager,next,jumper,->,total,slot" :total="total"></el-pagination>
      </div>


      <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible">
        <el-form :model="ecRule" ref="ecRule" :rules="rules">
          <el-form-item label="规则名称" prop="name">
            <el-input prefix-icon="el-icon-edit" style="width: 300px" v-model="ecRule.name" autocomplete="off"
                      placeholder="请输入奖惩规则名称"></el-input>
          </el-form-item>
          <el-form-item label="奖惩类型" prop="ecType">
            <el-select style="width: 300px" v-model="ecRule.ecType" placeholder="请选择奖惩类型">
              <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="奖惩分数" prop="ecPoint">
            <el-input prefix-icon="el-icon-edit" style="width: 300px" v-model="ecRule.ecPoint" autocomplete="off"
                      placeholder="请输入奖惩积分数量"></el-input>
          </el-form-item>
          <el-form-item label="备注信息:" prop="remark">
            <el-input style="width: 300px" v-model="ecRule.remark" type="textarea" placeholder="请输入备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "EcManage",
  data() {
    return {
      rules: {
        name: [
          {required: true, message: '请输入奖惩规则名称', trigger: 'blur'}
        ],
        ecType: [
          {required: true, message: '请选择奖惩类型', trigger: 'blur'}
        ],
        ecPoint: [
          {required: true, message: '请输入奖惩积分数量', trigger: 'blur'}
        ]
      },
      options: [{
        id: '0',
        name: '奖励'
      }, {
        id: '1',
        name: '惩罚'
      }],
      labelWidth: '150px',
      loading: false,
      multiple: true,
      ecRules: [],
      total: 0,
      currentPage: 1,
      currentSize: 10,
      multipleSelection: [],
      dialogFormVisible: false,
      ecRule: {
        id: null,
        name: '',
        ecType: null,
        ecPoint: null,
        createDate: null,
        remark: ''
      },
      title: '添加奖惩规则',
      queryParams: {
        name: '',
        ecType: null,
        beginDateScope: null
      },
    }
  },
  mounted() {
    this.initEcRules();
  },
  methods: {
    submitForm() {
      this.$refs['ecRule'].validate((valid) => {
        if (valid) {
          if (this.ecRule.id) {
            this.putRequest('/system/basic/rule/', this.ecRule).then(resp => {
              if (resp) {
                this.dialogFormVisible = false;
                this.initEcRules();
              }
            })
          } else {
            this.postRequest('/system/basic/rule/', this.ecRule).then(resp => {
              if (resp) {
                this.dialogFormVisible = false;
                this.initEcRules();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    batchDelete() {
      this.$confirm('此操作将永久删除选中的 ' + this.multipleSelection.length + ' 条奖惩规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/basic/rule/' + ids).then(resp => {
          if (resp) {
            this.initEcRules();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.ecRule = {
        id: null,
        name: '',
        ecType: null,
        ecPoint: null,
        createDate: '',
        remark: ''
      };
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】奖惩规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/rule/?ids=' + data.id).then(resp => {
          if (resp) {
            this.initEcRules();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleUpdate(data) {
      Object.assign(this.ecRule, data);
      this.title = '修改奖惩规则';
      this.dialogFormVisible = true;
    },
    initEcRules() {
      let url = '/system/basic/rule/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
      if (this.queryParams.name) {
        url += '&name=' + this.queryParams.name;
      }
      if (this.queryParams.ecType) {
        url += '&ecType=' + this.queryParams.ecType;
      }
      if (this.queryParams.beginDateScope) {
        url += '&beginDateScope=' + this.queryParams.beginDateScope;
      }
      this.loading = true;
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.total = resp.total;
          this.ecRules = resp.data;
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multiple = !val.length;
    },
    sizeChange(currentSize) {
      this.currentSize = currentSize;
      this.initEcRules();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEcRules();
    },
    resetQuery() {
      this.queryParams = {
        empName: '',
        ecType: null,
        beginDateScope: null
      };
      this.initEcRules();
    }
  }
}
</script>

<style scoped>

</style>