<template>
  <div>
    <div>
      <div>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="员工姓名" prop="empName">
            <el-input
                v-model="queryParams.empName"
                placeholder="请输入员工姓名..."
                clearable
                @clear="initRemoves"
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
                @clear="initRemoves"
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="调动时间">
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
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-row :gutter="10" style="margin-bottom: 5px;">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              @click="handleAdd"
          >新增调动信息
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              :disabled="multiple"
              @click="batchDelete"
          >批量删除
          </el-button>
        </el-col>
<!--        <el-col :span="1.5">-->
<!--          <el-button-->
<!--              type="warning"-->
<!--              plain-->
<!--              icon="el-icon-download"-->
<!--          >导出数据-->
<!--          </el-button>-->
<!--        </el-col>-->
      </el-row>
      <el-table
          :data="removes"
          border
          stripe
          :header-cell-style="{background:'#F5F7FA',color:'#606266'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            prop="empName"
            label="员工姓名"
            align="center"
            width="80">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            prop="removeDate"
            label="调动日期"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            label="部门"
            align="center">
          <el-table-column
              label="调动前"
              align="center"
              width="120">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.bdepName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="调动后"
              align="center"
              width="120">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.adepName }}</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            label="职位"
            align="center">
          <el-table-column
              label="调动前"
              align="center"
              width="120">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.bposName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="调动后"
              align="center"
              width="120">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.aposName }}</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            prop="reason"
            label="调动原因"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
              <el-form-item v-if="form.empName" label="员工姓名" prop="empName">
                <el-input disabled v-model="form.empName" placeholder="请输入邮箱" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="调动日期" prop="removeDate">
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="form.removeDate"
                    type="date"
                    placeholder="请选择调动日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调后职位" prop="afterPosId">
                <el-select v-model="form.afterPosId"
                           placeholder="职位">
                  <el-option
                      v-for="item in allPos"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="调后部门" prop="adepName">
                <el-select v-model="depName" placeholder="请选择部门">
                  <el-option style="height: auto">
                    <el-tree :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="调动原因" prop="reason">
                <el-input v-model="form.reason" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  name: "PerMv",
  data() {
    return {
      // 查询参数
      queryParams: {
        empName: '',
        workID: '',
        beginDateScope: null,
      },
      removes: [],
      allDeps: [],
      allPos: [],
      total: 0,
      currentPage: 1,
      currentSize: 10,
      multiple: true,
      multipleSelection: [],
      form: {
        eid: null,
        beforeDepId: null,
        afterDepId: null,
        beforePosId: null,
        afterPosId: null,
        removeDate: '',
        reason: '',
        remark: '',
        empName: '',
        workID: ''
      },
      title: '添加调动信息',
      open: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      depName: '',
      rules: {
        workID: [
          {required: true, message: '请输入员工工号', trigger: 'blur'}
        ],
        reason: [
          {required: true, message: '请输入调动原因', trigger: 'blur'}
        ],
        adepName: [
          {required: true, message: '请选择调后部门', trigger: 'blur'}
        ],
        afterPosId: [
          {required: true, message: '请选择调后职位', trigger: 'blur'}
        ],
        removeDate: [
          {required: true, message: '请选择调动日期', trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.initData();
    this.initRemoves();
  },
  methods: {
    handleNodeClick(data) {
      this.depName = data.name;
      this.form.afterDepId = data.id;
    },
    batchDelete() {
      this.$confirm('此操作将永久删除选中的[' + this.multipleSelection.length + ']条调动信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/personnel/remove/' + ids).then(resp => {
          if (resp) {
            this.initRemoves();
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
        this.deleteRequest('/personnel/remove/' + data.id).then(resp => {
          if (resp) {
            this.initRemoves();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = '修改调动信息';

      this.form = row;
      Object.assign(this.form, row);
      this.depName = row.adepName;
      this.open = true;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.depName = '';
      this.title = '添加调动信息';
      this.open = true;
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.putRequest('/personnel/remove/', this.form).then(resp => {
              if (resp) {
                this.open = false;
                this.initRemoves();
              }
            })
          } else {
            this.postRequest('/personnel/remove/', this.form).then(resp => {
              if (resp) {
                this.open = false;
                this.initRemoves();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        eid: null,
        beforeDepId: null,
        afterDepId: null,
        beforePosId: null,
        afterPosId: null,
        removeDate: '',
        reason: '',
        remark: '',
        empName: '',
        workID: ''
      };
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.multiple = !selection.length;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.initRemoves();
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initRemoves();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initRemoves();
    },
    initRemoves() {
      let url = '/personnel/remove/?currentPage=' + this.currentPage + '&size=' + this.currentSize;
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
        if (resp) {
          this.total = resp.total;
          this.removes = resp.data;
        }
      })
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

<style scoped>

</style>