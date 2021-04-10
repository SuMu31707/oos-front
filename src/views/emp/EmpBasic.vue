<template>
  <div>
    <div>
      <div style="display: flex;justify-content: center;">
        <el-input prefix-icon="el-icon-search"
                  placeholder="请输入员工名进行搜索..."
                  v-model="empName"
                  @keydown.enter.native="initEmps"
                  clearable
                  @clear="initEmps"
                  :disabled="showAdvanceSearchVisible"
                  style="width: 300px;margin-right: 10px"></el-input>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="initEmps"
                   :disabled="showAdvanceSearchVisible">搜索
        </el-button>
        <el-button type="primary"
                   @click="showAdvanceSearchView">
          <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
             aria-hidden="true"></i>
          高级搜索
        </el-button>
      </div>
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchVisible"
             style="border: 1px solid #409eff;border-radius: 5px;box-sizing:border-box;padding: 5px;margin: 10px 0px">
          <el-row>
            <el-col :span="5">
              政治面貌:
              <el-select v-model="searchValue.politicId"
                         placeholder="政治面貌" size="mini"
                         style="width: 130px">
                <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              民族:
              <el-select v-model="searchValue.nationId"
                         placeholder="民族" size="mini" style="width: 130px">
                <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职位:
              <el-select v-model="searchValue.posId"
                         placeholder="职位" size="mini" style="width: 130px">
                <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职称:
              <el-select v-model="searchValue.jobLevelId"
                         placeholder="职称" size="mini"
                         style="width: 130px">
                <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              聘用形式:
              <el-radio-group v-model="searchValue.engageForm">
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="5">
              所属部门:
              <el-popover
                  placement="right"
                  title="请选择部门"
                  width="auto"
                  trigger="manual"
                  v-model="popVisible2">
                <el-tree :data="allDeps" :props="defaultProps"
                         default-expand-all
                         @node-click="searchHandleNodeClick">
                </el-tree>
                <div slot="reference"
                     style="width: 130px;display: inline-flex;
                        font-size: 13px;border: 1px solid #dedede;height: 24px;border-radius:
                        5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;
                        margin-left: 3px"
                     @click="showDepView2">
                  {{ inputDepName }}
                </div>
              </el-popover>
            </el-col>
            <el-col :span="10">
              入职日期:
              <el-date-picker
                  v-model="searchValue.beginDateScope"
                  size="mini"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="5" :offset="4">
              <el-button>取消</el-button>
              <el-button type="primary"
                         @click="initEmps('advanced')">搜索
              </el-button>
              <el-button type="info"
                         @click="resetParams()">重置
              </el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          stripe
          border
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55"/>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="center"
            width="60"/>
        <el-table-column
            prop="workID"
            label="工号"
            align="center"
            width="80"/>
        <el-table-column
            prop="gender"
            label="性别"
            align="center"
            width="45"/>
        <el-table-column
            prop="birthday"
            align="center"
            width="90"
            label="出生日期"/>
        <el-table-column
            prop="idCard"
            align="center"
            width="150"
            label="身份证号码"/>
        <el-table-column
            prop="wedlock"
            width="70"
            align="center"
            label="婚姻状况"/>
        <el-table-column
            prop="nation.name"
            width="50"
            align="center"
            label="民族"/>
        <el-table-column
            prop="nativePlace"
            width="80"
            align="center"
            label="籍贯"/>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            align="center"
            width="100"/>
        <el-table-column
            prop="email"
            align="left"
            width="170"
            label="电子邮件"/>
        <el-table-column
            prop="phone"
            align="center"
            width="100"
            label="电话号码"/>
        <el-table-column
            prop="address"
            align="left"
            width="270"
            label="联系地址"/>
        <el-table-column
            prop="department.name"
            align="center"
            width="100"
            label="所属部门"/>
        <el-table-column
            prop="position.name"
            width="100"
            align="center"
            label="职位"/>
        <el-table-column
            prop="joblevel.name"
            width="100"
            align="center"
            label="职称"/>
        <el-table-column
            prop="engageForm"
            align="center"
            width="80"
            label="聘用形式"/>
        <el-table-column
            prop="tiptopDegree"
            align="center"
            label="最高学历">
        </el-table-column>
        <el-table-column
            prop="school"
            align="center"
            width="150"
            label="毕业院校">
        </el-table-column>
        <el-table-column
            prop="specialty"
            align="center"
            width="150"
            label="专业">
        </el-table-column>
        <el-table-column
            prop="workState"
            align="center"
            width="70"
            label="在职状态">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            align="center"
            width="95"
            label="入职日期">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            align="center"
            width="95"
            label="转正日期">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            align="center"
            width="95"
            label="合同起始日期">
        </el-table-column>
        <el-table-column
            prop="endContract"
            align="center"
            width="95"
            label="合同截止日期">
        </el-table-column>
        <el-table-column
            align="center"
            width="80"
            label="合同期限">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>
      </el-table>
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
  name: "EmpBasic",
  data() {
    return {
      searchValue: {
        politicId: null,
        nationId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        departmentId: null,
        beginDateScope: null
      },
      showAdvanceSearchVisible: false,
      headers: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      title: '',
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      popVisible: false,
      popVisible2: false,
      allDeps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inputDepName: '',
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {
    resetParams() {
      this.searchValue = {
        politicId: null,
            nationId: null,
            jobLevelId: null,
            posId: null,
            engageForm: '',
            departmentId: null,
            beginDateScope: null
      };
      this.inputDepName = '';
      this.initEmps();
    },
    showAdvanceSearchView() {
      this.showAdvanceSearchVisible = !this.showAdvanceSearchVisible;
      this.searchValue = {
        politicId: null,
        nationId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        departmentId: null,
        beginDateScope: null
      }
    },
    searchHandleNodeClick(data) {
      this.inputDepName = data.name;
      this.searchValue.departmentId = data.id;
      this.popVisible2 = !this.popVisible2;
    },
    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentId = data.id;
      this.popVisible = !this.popVisible;
    },
    showDepView() {
      this.popVisible = !this.popVisible;
    },
    showDepView2() {
      this.popVisible2 = !this.popVisible2;
    },
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    initData() {
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem("nations", JSON.stringify(resp));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"))
      }
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"))
      }
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest('/employee/basic/politicsStatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"))
      }
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
    },
    getMaxWorkID() {
      this.getRequest('/employee/basic/maxworkid').then(resp => {
        if (resp) {
          this.emp.workID = resp.obj;
        }
      })
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    initEmps(type) {
      this.loading = true;
      let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.politicId) {
          url += '&politicId=' + this.searchValue.politicId;
        }
        if (this.searchValue.nationId) {
          url += '&nationId=' + this.searchValue.nationId;
        }
        if (this.searchValue.jobLevelId) {
          url += '&jobLevelId=' + this.searchValue.jobLevelId;
        }
        if (this.searchValue.posId) {
          url += '&posId=' + this.searchValue.posId
        }
        if (this.searchValue.engageForm) {
          url += '&engageForm=' + this.searchValue.engageForm;
        }
        if (this.searchValue.departmentId) {
          url += '&departmentId=' + this.searchValue.departmentId;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
      } else {
        url += '&name=' + this.empName;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
