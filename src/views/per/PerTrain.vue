<template>
  <div>
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="员工姓名" prop="empName">
          <el-input
              v-model="queryParams.empName"
              placeholder="请输入员工姓名..."
              clearable
              @clear="initTrains"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initTrains"
          />
        </el-form-item>
        <el-form-item label="培训内容" prop="trainContent">
          <el-input
              v-model="queryParams.trainContent"
              placeholder="请输入培训内容..."
              clearable
              @clear="initTrains"
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
          :data="empTrains"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="正在拼命加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
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
            width="120"/>
        <el-table-column
            prop="phone"
            label="手机号码"
            align="center"
            width="125"/>
        <el-table-column
            prop="email"
            label="电子邮箱"
            align="center"
            width="180"/>
        <el-table-column
            prop="trainContent"
            label="培训内容"
            align="center"
            width="200"/>
        <el-table-column
            prop="trainDate"
            label="培训日期"
            align="center"
            width="120"/>
        <el-table-column
            prop="remark"
            label="备注信息"
            align="center"
            width="180"/>
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
      <el-dialog :title="title" @open="showDialog" :visible.sync="open" :width="dialogWidth">
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
              <el-form-item label="调后职位" prop="removeDate">
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
            </el-form>

            <el-table v-loading="loading"
                      :data="emps"
                      height="350"
                      border
                      stripe
                      @selection-change="empSelectionChange">
              <el-table-column type="selection" width="50" align="center"/>
              <el-table-column label="员工姓名" align="center" prop="name"/>
              <el-table-column label="员工工号" align="center" prop="workID"/>
              <el-table-column label="所属部门" align="center" prop="department.name"/>
              <el-table-column label="员工职位" align="center" prop="position.name"/>
              <el-table-column label="员工职称" align="center" prop="joblevel.name"/>
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
        <el-form :model="form">
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item v-if="form.empName" label="员工姓名:" prop="name">
                <el-input disabled style="width: 220px" v-model="form.empName" placeholder="请输入员工姓名"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训日期:" prop="trainDate">
                <el-date-picker
                    v-model="form.trainDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择调薪日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="培训内容:" prop="trainContent">
                <el-input style="width: 220px" v-model="form.trainContent" type="textarea" placeholder="请输入调薪原因"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注信息:" prop="name">
                <el-input style="width: 220px" v-model="form.remark" type="textarea" placeholder="请输入备注信息"
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
  name: "PerTrain",
  data() {
    return {
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
      empTrains: [],
      multipleSelection: [],
      empSelects: [],
      multiple: false,
      total: 0,
      currentPage: 1,
      currentSize: 10,
      loading: false,
      title: '新增培训信息',
      open: false,
      form: {},
      queryParams: {
        empName: '',
        trainContent: '',
        beginDateScope: null
      },
      emps: [],
      allPos: [],
      allDeps: [],
      dialogWidth: '80%'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initTrains();
    this.initData();
  },
  methods: {
    handleQuery() {
      this.initTrains();
    },
    resetQuery() {
      this.queryParams = {
        empName: '',
        trainContent: '',
        beginDateScope: null
      }
      this.initTrains();
    },
    handleAdd() {
      this.dialogWidth = '80%'
      this.reset();
      this.initEmps();
      this.title = '添加培训信息'
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.dialogWidth = '40%'
      this.title = '修改培训信息';
      this.form = row;
      this.open = true;
    },
    /** 删除按钮操作 */
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.empName + '】的调薪信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/personnel/train/' + data.id).then(resp => {
          if (resp) {
            this.initTrains();
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
        this.deleteRequest('/personnel/train/' + ids).then(resp => {
          if (resp) {
            this.initTrains();
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
      this.currentSize = currentSize;
      this.initTrains();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initTrains();
    },
    sizeChange1(currentSize) {
      this.queryEmpParams.currentSize = currentSize;
      this.initEmps();
    },
    currentChange1(currentPage) {
      this.queryEmpParams.currentPage = currentPage;
      this.initEmps();
    },
    initTrains() {
      this.loading = true;
      let url = '/personnel/train/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
      if (this.queryParams.empName) {
        url += '&empName=' + this.queryParams.empName;
      }
      if (this.queryParams.trainContent) {
        url += '&trainContent=' + this.queryParams.trainContent;
      }
      if (this.queryParams.beginDateScope) {
        url += '&beginDateScope=' + this.queryParams.beginDateScope;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.total = resp.total;
          this.empTrains = resp.data;
        }
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        eid: null,
        trainDate: '',
        trainContent: '',
        remark: '',
        empName: '',
        email: '',
        phone: '',
        workID: '',
        depName: ''
      };
    },
    cancel() {
      this.initTrains();
      this.open = false;
      this.reset();
      this.queryEmpParams.departmentId = null;
    },
    submitForm() {
      if (this.form.id) {
        this.putRequest('/personnel/train/', this.form).then(resp => {
          if (resp) {
            this.open = false;
            this.initTrains();
          }
        })
      } else {
        let url = '/personnel/train/?trainDate=' + this.form.trainDate + '&trainContent=' + this.form.trainContent + '&remark=' + this.form.remark + '&ids=' + this.empSelects;
        this.postRequest(url).then(resp => {
          if (resp) {
            this.open = false;
            this.initTrains();
          }
        })
      }
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
</style>