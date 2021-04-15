<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="员工姓名" prop="empName">
        <el-input
            v-model="queryParams.empName"
            placeholder="请输入员工姓名..."
            clearable
            @clear="initAppraiseInfo"
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工工号" prop="workID">
        <el-input
            v-model="queryParams.workID"
            placeholder="请输入员工工号..."
            clearable
            @clear="initAppraiseInfo"
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考评时间">
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" style="margin-bottom: 5px">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="batchDelete"
        >删除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="info"-->
<!--            plain-->
<!--            icon="el-icon-upload2"-->
<!--            size="mini"-->
<!--        >导入-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            icon="el-icon-download"-->
<!--            size="mini"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
    </el-row>

    <el-table style="width: 100%"
              :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
              v-loading="loading"
              element-loading-text="正在拼命加载..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :data="emps"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="员工姓名" align="center" prop="empName" width="100"/>
      <el-table-column label="员工工号" align="center" prop="workID" width="100"/>
      <el-table-column label="所属部门" align="center" prop="depName" width="150"/>
      <el-table-column label="考评日期" align="center" prop="appDate" width="120"/>
      <el-table-column label="考评内容" align="center" prop="appContent" width="200"/>
      <el-table-column label="考评结果" align="center" prop="appResult" width="100"/>
      <el-table-column label="备注" align="center" prop="remark" width="250"/>
      <el-table-column
          label="操作"
          align="center"
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
              v-if="scope.row.userId !== 1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div style="display: flex;justify-content: flex-end">
      <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes,prev,pager,next,jumper,->,total,slot" :total="total"></el-pagination>
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工工号" prop="workID">
              <el-input v-model="form.workID" placeholder="请输入工号..."/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考评日期" prop="appDate">
              <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="form.appDate"
                  type="date"
                  placeholder="请选择考评日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.empName" label="员工姓名" prop="empName">
              <el-input disabled v-model="form.empName" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考评结果" prop="appResult">
              <el-input v-model="form.appResult" placeholder="请输入考评结果..." maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="考评内容" prop="appContent">
              <el-input v-model="form.appContent" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息（如培训地点、培训时间）"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PerAppraise",
  data() {
    return {
      rules: {
        appDate: [
          { required: true, message: '请选择考评日期', trigger: 'blur' }
        ],
        appResult: [
          { required: true, message: '请输入考评结果', trigger: 'blur' }
        ],
        appContent: [
          { required: true, message: '请输入考评内容', trigger: 'blur' }
        ],
        workID: [
          { required: true, message: '请输入员工工号', trigger: 'blur' }
        ],
      },
      // 查询参数
      queryParams: {
        empName: '',
        workID: '',
        beginDateScope: null,
      },
      // 选中数组
      multipleSelection: [],
      // 总条数
      total: 0,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 用户表格数据
      emps: [],
      // 表单参数
      form: {
        empName: '',
        workID: '',
        appDate: '',
        appResult: '',
        appContent: '',
        remark: ''
      },
      title: '添加考评信息',
      open: false,
      currentPage: 1,
      currentSize: 10,
      loading: false,
    }
  },
  mounted() {
    this.initAppraiseInfo();
  },
  methods: {
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initAppraiseInfo();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initAppraiseInfo();
    },
    initAppraiseInfo() {
      this.loading = true;
      let url = '/personnel/appraise/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
      if (this.queryParams.empName) {
        url += '&empName=' + this.queryParams.empName;
      }
      if (this.queryParams.workID) {
        url += '&workID=' + this.queryParams.workID;
      }
      if (this.queryParams.beginDateScope) {
        url += '&beginDateScope=' + this.queryParams.beginDateScope;
      }

      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.total = resp.total;
          this.emps = resp.data;
        }
      })
    },
    // 表单重置
    reset() {
      this.form = {
        empName: '',
        workID: '',
        appDate: '',
        appResult: '',
        appContent: '',
        remark: ''
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.initAppraiseInfo();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.empName = '';
      this.queryParams.workID = '';
      this.queryParams.beginDateScope = [];
      this.initAppraiseInfo();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = '添加考评信息'
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = '修改考评信息';
      if (this.multipleSelection.length == 1) {
        Object.assign(this.form, this.multipleSelection[0]);
      } else {
        Object.assign(this.form, row);
      }
      this.open = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    batchDelete() {
      this.$confirm('此操作将永久删除选中的[' + this.multipleSelection.length + ']条考评信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/personnel/appraise/' + ids).then(resp => {
          if (resp) {
            this.initAppraiseInfo();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.empName + '】的考评信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/personnel/appraise/' + data.id).then(resp => {
          if (resp) {
            this.initAppraiseInfo();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.putRequest('/personnel/appraise/', this.form).then(resp => {
              if (resp) {
                this.open = false;
                this.initAppraiseInfo();
              }
            })
          } else {
            this.postRequest('/personnel/appraise/', this.form).then(resp => {
              if (resp) {
                this.open = false;
                this.initAppraiseInfo();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>