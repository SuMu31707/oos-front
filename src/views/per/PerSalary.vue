<template>
  <div>
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="员工姓名" prop="empName">
          <el-input
              v-model="queryParams.empName"
              placeholder="请输入员工姓名..."
              clearable
              @clear="initAdjusts"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initAdjusts"
          />
        </el-form-item>
        <el-form-item label="员工工号" prop="workID">
          <el-input
              v-model="queryParams.workID"
              placeholder="请输入员工工号..."
              clearable
              @clear="initAdjusts"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="调薪时间">
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
        <el-col :span="1.5">
          <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="small"
          >导出
          </el-button>
        </el-col>
      </el-row>

      <el-table
          :data="SalaryAdjusts"
          style="width: 100%"
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="正在拼命加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column
            prop="empName"
            label="员工姓名"
            align="center"
            width="120"/>
        <el-table-column
            prop="workID"
            label="工号"
            align="center"
            width="120"/>
        <el-table-column
            prop="depName"
            label="所属部门"
            align="center"
            width="150"/>
        <el-table-column
            label="调前薪资"
            align="center"
            width="120">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.beforeSalary }} 元/月</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="调后薪资"
            align="center"
            width="120">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.afterSalary }} 元/月</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="asDate"
            label="调薪日期"
            align="center"
            width="120"/>
        <el-table-column
            prop="reason"
            label="调薪原因"
            align="center"
            width="170"/>
        <el-table-column
            prop="remark"
            label="备注"
            align="center"
            width="165"/>
        <el-table-column
            label="操作"
            align="center"
            width="160"
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
      <el-dialog :title="title" @open="showDialog" :visible.sync="open" width="85%">
        <!--添加时显示-->
        <el-row v-if="!form.id" :gutter="20">
          <!--部门数据-->
          <el-col :span="6" :xs="24">
            <div>
              <el-input
                  v-model="filterText"
                  placeholder="请输入部门名称"
                  clearable
                  size="small"
                  prefix-icon="el-icon-search"
                  style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                  :data="allDeps"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="tree"
                  default-expand-all
                  @node-click="handleNodeClick"
              />
            </div>
          </el-col>
          <!--用户数据-->
          <el-col :span="18" :xs="24">
            <el-form :model="queryEmpParams" ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="用户名称" prop="userName">
                <el-input
                    v-model="queryEmpParams.name"
                    placeholder="请输入用户名称"
                    clearable
                    @clear="empQuery"
                    size="small"
                    style="width: 150px"
                    @keyup.enter.native="empQuery"
                />
              </el-form-item>
              <el-form-item label="员工工号" prop="workID">
                <el-input
                    v-model="queryEmpParams.workID"
                    placeholder="请输入员工工号"
                    clearable
                    @clear="empQuery"
                    size="small"
                    style="width: 150px"
                    @keyup.enter.native="empQuery"
                />
              </el-form-item>
              <el-form-item label="所属职位" prop="removeDate">
                <el-select clearable v-model="queryEmpParams.posId"
                           placeholder="请选择职位">
                  <el-option
                      v-for="item in allPos"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="empQuery">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="info" icon="el-icon-refresh" @click="resetQueryParam">重置</el-button>
              </el-form-item>
            </el-form>

            <el-table v-loading="loading"
                      :data="emps"
                      border
                      stripe
                      @selection-change="empSelectionChange">
              <el-table-column type="selection" width="50" align="center"/>
              <el-table-column label="员工姓名" align="center" prop="name"/>
              <el-table-column label="员工工号" align="center" prop="workID"/>
              <el-table-column label="所属部门" align="center" prop="department.name"/>
              <el-table-column label="员工职位" align="center" prop="position.name"/>
            </el-table>
            <!--分页-->
            <div style="display: flex;justify-content: flex-end">
              <el-pagination
                  background
                  @current-change="currentChange1"
                  @size-change="sizeChange1"
                  layout="sizes,prev,pager,next,jumper,->,total,slot" :total="queryEmpParams.total"></el-pagination>
            </div>
          </el-col>
        </el-row>
        <!--修改时显示-->
        <el-form :model="form" :rules="rules" ref="form">
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="6">
              <el-form-item v-if="form.empName" label="员工姓名:" prop="name">
                <el-input disabled style="width: 180px" v-model="form.empName" placeholder="请输入员工姓名"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调薪日期:" prop="asDate">
                <el-date-picker
                    v-model="form.asDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 180px"
                    placeholder="选择调薪日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调前薪资:" prop="beforeSalary">
                <el-input style="width: 180px" v-model="form.beforeSalary" placeholder="请输入员工姓名"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调后薪资:" prop="afterSalary">
                <el-input style="width: 180px" v-model="form.afterSalary" placeholder="请输入员工姓名"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="调薪原因:" prop="reason">
                <el-input size="mini" v-model="form.reason" type="textarea" placeholder="请输入调薪原因"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注信息:" prop="remark">
                <el-input size="mini" v-model="form.remark" type="textarea" placeholder="请输入备注信息"
                          prefix-icon="el-icon-edit"></el-input>
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
  </div>
</template>

<script>
export default {
  name: "PerSalary",
  data() {
    return {
      rules: {
        asDate: [
          { required: true, message: '请选择调薪日期', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入调薪原因', trigger: 'blur' }
        ],
        afterSalary: [
          { required: true, message: '请输入调后薪资', trigger: 'blur' }
        ],
        beforeSalary: [
          { required: true, message: '请输入调前薪资', trigger: 'blur' }
        ],
      },
      filterText: undefined,
      queryEmpParams: {
        name: '',
        workID: '',
        departmentId: null,
        posId: null,
        beginDate: null,
        total: 0,
        currentPage: 1,
        currentSize: 10
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      SalaryAdjusts: [],
      multipleSelection: [],
      empSelects: [],
      multiple: true,
      total: 0,
      currentPage: 1,
      currentSize: 10,
      loading: false,
      title: '新增调薪信息',
      open: false,
      form: {
        empName: '',
        workID: '',
        beforeSalary: null,
        afterSalary: null,
        asDate: '',
        reason: '',
        remark: ''
      },
      queryParams: {
        empName: '',
        workID: '',
        beginDateScope: null
      },
      emps: [],
      allPos: [],
      allDeps: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initAdjusts();
    this.initData();
  },
  methods: {
    handleQuery() {
      this.initAdjusts();
    },
    resetQuery() {
      this.queryParams = {
        empName: '',
        workID: '',
        beginDateScope: null
      }
    },
    handleAdd() {
      this.reset();
      this.initEmps();
      this.title = '添加调薪信息'
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = '修改调薪信息';
      Object.assign(this.form, row);
      this.open = true;
    },
    /** 删除按钮操作 */
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.empName + '】的调薪信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/personnel/salary/' + data.id).then(resp => {
          if (resp) {
            this.initAdjusts();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    batchDelete() {
      this.$confirm('此操作将永久删除选中的[' + this.multipleSelection.length + ']条调薪信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/personnel/salary/' + ids).then(resp => {
          if (resp) {
            this.initAdjusts();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.multiple = !selection.length;
    },
    empSelectionChange(selection) {
      this.empSelects = selection.map(item => item.id);
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initAdjusts();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initAdjusts();
    },
    sizeChange1(currentSize) {
      this.queryEmpParams.currentSize = currentSize;
      this.initEmps();
    },
    currentChange1(currentPage) {
      this.queryEmpParams.currentPage = currentPage;
      this.initEmps();
    },
    initAdjusts() {
      this.loading = true;
      let url = '/personnel/salary/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
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
          this.SalaryAdjusts = resp.data;
        }
      })
    },
    // 表单重置
    reset() {
      this.form = {
        empName: '',
        workID: '',
        beforeSalary: null,
        afterSalary: null,
        asDate: '',
        reason: '',
        remark: ''
      };
    },
    cancel() {
      this.open = false;
      this.reset();
      this.queryEmpParams.departmentId = null;
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.putRequest('/personnel/salary/', this.form).then(resp => {
              if (resp) {
                this.open = false;
                this.initAdjusts();
              }
            })
          } else {
            console.log("form:" + JSON.stringify(this.form))
            let url = '/personnel/salary/?asDate=' + this.form.asDate + '&beforeSalary=' + this.form.beforeSalary + '&afterSalary=' + this.form.afterSalary + '&reason=' + this.form.reason + '&remark=' + this.form.remark + '&ids=' + this.empSelects;
            this.postRequest(url).then(resp => {
              if (resp) {
                this.open = false;
                this.initAdjusts();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    empQuery() {
      this.initEmps();
    },
    initEmps() {
      let url = '/personnel/salary/emps?currentPage=' + this.queryEmpParams.currentPage + '&size=' + this.queryEmpParams.currentSize;
      if (this.queryEmpParams.departmentId) {
        url += '&departmentId=' + this.queryEmpParams.departmentId;
      }
      if (this.queryEmpParams.posId) {
        url += '&posId=' + this.queryEmpParams.posId
      }
      if (this.queryEmpParams.name) {
        url += '&name=' + this.queryEmpParams.name;
      }
      if (this.queryEmpParams.workID) {
        url += '&workID=' + this.queryEmpParams.workID;
      }
      this.getRequest(url).then(resp => {
        if (resp) {
          this.queryEmpParams.total = resp.total;
          this.emps = resp.data;
        }
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryEmpParams.departmentId = data.id;
      this.initEmps();
    },
    showDialog() {
      this.queryEmpParams = {
        name: '',
        workID: '',
        departmentId: null,
        posId: null,
        beginDate: null,
        total: 0,
        currentPage: 1,
        currentSize: 10
      }
      this.initEmps();
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      } else if (rowIndex === 5) {
        return 'warning-row';
      } else if (rowIndex === 7) {
        return 'success-row';
      } else if (rowIndex === 9) {
        return 'warning-row';
      }
      return '';
    },
    resetQueryParam() {
      this.queryEmpParams = {
        name: '',
        workID: '',
        departmentId: null,
        posId: null,
        beginDate: null,
        total: 0,
        currentPage: 1,
        currentSize: 10
      };
      this.initEmps();
    },
    initData() {
      if (!window.sessionStorage.getItem("allDeps")) {
        this.getRequest('/system/basic/department/').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("allDeps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps =
            JSON.parse(window.sessionStorage.getItem("allDeps"))
      }

      if (!window.sessionStorage.getItem("allPos")) {
        this.getRequest('/system/basic/pos/').then(resp => {
          if (resp) {
            this.allPos = resp;
            window.sessionStorage.setItem("allPos", JSON.stringify(resp));
          }
        })
      } else {
        this.allPos =
            JSON.parse(window.sessionStorage.getItem("allPos"))
      }
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>