<template>
  <div>
    <div style="margin-top: 10px">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="员工姓名" prop="empName">
          <el-input
              v-model="queryParams.empName"
              placeholder="请输入员工姓名..."
              clearable
              @clear="initEmpEcs"
              size="small"
              style="width: 240px"
              @keyup.enter.native="initEmpEcs"
          />
        </el-form-item>
        <el-form-item label="奖惩类型" prop="ecType">
          <el-select style="width: 240px"
                     v-model="queryParams.ecType"
                     clearable
                     @clear="initEmpEcs"
                     placeholder="请选择奖惩类型">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖惩时间">
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="initEmpEcs">搜索</el-button>
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
          :data="empEcs"
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
            label="奖惩类型"
            align="center"
            width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ecType == 0" type="success">奖励</el-tag>
            <el-tag v-if="scope.row.ecType == 1" type="danger">惩罚</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="奖惩积分"
            align="center"
            width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ecType == 0" type="success">+{{ scope.row.ecPoint }}</el-tag>
            <el-tag v-if="scope.row.ecType == 1" type="danger">-{{ scope.row.ecPoint }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="ecReason"
            label="奖惩原因"
            align="center"
            width="250"/>
        <el-table-column
            prop="ecDate"
            label="奖惩日期"
            align="center"
            width="120"/>
        <el-table-column
            prop="remark"
            label="备注信息"
            align="center"
            width="245"/>
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
      <div style="display: flex;justify-content: flex-end;margin-top: 5px">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes,prev,pager,next,jumper,->,total,slot" :total="total"></el-pagination>
      </div>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" @open="showDialog" :visible.sync="open" :width="dialogWidth">
        <!--添加时显示-->
        <el-row v-if="!empEc.id" :gutter="20">
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
                    @clear="initEmps"
                    size="small"
                    style="width: 150px"
                    @keyup.enter.native="initEmps"
                />
              </el-form-item>
              <el-form-item label="员工工号" prop="workID">
                <el-input
                    v-model="queryEmpParams.workID"
                    placeholder="请输入员工工号"
                    clearable
                    @clear="initEmps"
                    size="small"
                    style="width: 150px"
                    @keyup.enter.native="initEmps"
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
                <el-button type="primary" icon="el-icon-search" @click="initEmps">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="info" icon="el-icon-refresh" @click="resetQueryParam">重置</el-button>
              </el-form-item>
            </el-form>

            <el-table v-loading="loading"
                      :data="emps"
                      height="350"
                      border
                      stripe>
              <el-table-column align="left" label="选择员工" width="120">
                <template scope="scope">
                  <el-radio :label="scope.row.id" v-model="empEc.eid">{{scope.row.name}}</el-radio>
                </template>
              </el-table-column>
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
        <el-form :model="empEc" :rules="rules" ref="empEc">
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
              <el-form-item v-if="empEc.empName" label="员工姓名:" prop="empName">
                <el-input disabled style="width: 220px" v-model="empEc.empName" placeholder="请输入员工姓名"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="!empEc.id" label="奖惩规则" prop="ruleId">
                <el-select clearable v-model="empEc.ruleId"
                           placeholder="请选择奖惩规则">
                  <el-option
                      v-for="item in ecRules"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="奖惩日期:" prop="ecDate">
                <el-date-picker
                    v-model="empEc.ecDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择奖惩日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="奖惩原因:" prop="ecReason">
                <el-input style="width: 220px" v-model="empEc.ecReason" type="textarea" placeholder="请输入调薪原因"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注信息:" prop="remark">
                <el-input style="width: 220px" v-model="empEc.remark" type="textarea" placeholder="请输入备注信息"
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
  name: "PerEc",
  data() {
    return {
      rules: {
        ecDate: [
          {required: true, message: '请选择培训日期', trigger: 'blur'}
        ],
        ecReason: [
          {required: true, message: '请输入奖惩原因', trigger: 'blur'}
        ],
        ruleId: [
          {required: true, message: '请输选择奖惩规则', trigger: 'blur'}
        ]
      },
      open: false,
      allPos: [],
      allDeps: [],
      dialogWidth: '80%',
      showDialog: false,
      title: '添加员工奖惩信息',
      multiple: true,
      loading: false,
      empEc: {
        depName: '',
        ecDate: '',
        ecReason: '',
        ecType: null,
        eid: null,
        empName: '',
        id: null,
        remark: '',
        ruleId: null,
        workID: '',
        ecPoint: null
      },
      filterText: undefined,
      empEcs: [],
      total: 0,
      currentPage: 1,
      currentSize: 10,
      queryParams: {
        empName: '',
        ecType: null,
        beginDateScope: null
      },
      options: [{
        value: '0',
        label: '奖励'
      }, {
        value: '1',
        label: '惩罚'
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
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
      emps: [],
      ecRules: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initEmpEcs();
    this.initData();
  },
  methods: {
    cancel() {
      this.initEmps();
      this.open = false;
      this.reset();
      this.queryEmpParams.departmentId = null;
    },
    submitForm() {
      if (this.empEc.eid == null) {
        this.$message({
          type: 'warning',
          message: '请选择要奖惩的员工'
        });
        return false;
      }
      this.$refs['empEc'].validate((valid) => {
        if (valid) {
          if (this.empEc.id) {
            this.putRequest('/personnel/ec/', this.empEc).then(resp => {
              if (resp) {
                this.open = false;
                this.initEmpEcs();
              }
            })
          } else {
            this.postRequest('/personnel/ec/', this.empEc).then(resp => {
              if (resp) {
                this.open = false;
                this.initEmpEcs();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetQuery() {
      this.queryParams = {
        empName: '',
        ecType: null,
        beginDateScope: null
      };
      this.initEmpEcs();
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.empName + '】的奖惩信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/personnel/ec/?ids=' + data.id).then(resp => {
          if (resp) {
            this.initEmpEcs();
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
      this.dialogWidth = '40%'
      this.title = '修改培训信息';
      Object.assign(this.empEc, data);
      this.open = true;
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
    initEmpEcs() {
      let url = '/personnel/ec/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
      if (this.queryParams.empName) {
        url += '&empName=' + this.queryParams.empName;
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
          this.empEcs = resp.data;
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
      this.initEmpEcs();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmpEcs();
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryEmpParams.departmentId = data.id;
      this.initEmps();
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    initData() {
      this.getRequest('/commons/ecrule').then(resp => {
        if (resp) {
          this.ecRules = resp;
        }
      })
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
    },
    sizeChange1(currentSize) {
      this.queryEmpParams.currentSize = currentSize;
      this.initEmps();
    },
    currentChange1(currentPage) {
      this.queryEmpParams.currentPage = currentPage;
      this.initEmps();
    },
    handleAdd() {
      this.dialogWidth = '85%'
      this.reset();
      this.initEmps();
      this.title = '添加奖惩信息'
      this.open = true;
    },
    batchDelete() {
      this.$confirm('此操作将永久删除选中的[' + this.multipleSelection.length + ']条奖惩信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/personnel/ec/' + ids).then(resp => {
          if (resp) {
            this.initEmpEcs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    reset() {
      this.empEc = {
        depName: '',
        ecDate: '',
        ecReason: '',
        ecType: null,
        eid: null,
        empName: '',
        id: null,
        remark: '',
        ruleId: null,
        workID: '',
        ecPoint: null
      }
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
    }
  }
}
</script>

<style scoped>

</style>