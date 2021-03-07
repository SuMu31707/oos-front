<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input type="text" style="width: 300px;margin-right: 5px" placeholder="请输入员工姓名进行搜索..." prefix-icon="el-icon-search"></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" icon="el-icon-search">
          <i class="fa fa-angle-double-down" aria-hidden="true"></i>
          高级搜索</el-button>
      </div>
      <div>
        <el-button type="success"><i class="fa fa-level-down" aria-hidden="true"></i>导入数据</el-button>
        <el-button type="success"><i class="fa fa-level-up" aria-hidden="true"></i>导出数据</el-button>
        <el-button type="primary" icon="el-icon-plus">添加员工</el-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          border
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            fixed
            prop="name"
            label="姓名"
            align="left"
            width="65">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="80">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            align="left"
            width="40">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="idCard"
            label="身份证号"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻状况"
            align="left"
            width="70">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            align="left"
            width="50">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            align="left"
            width="60">
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            align="left"
            width="95">
        </el-table-column>
        <el-table-column
            prop="email"
            label="电子邮件"
            align="left"
            width="180">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
          prop="address"
          label="联系地址"
          align="left"
          width="270">
      </el-table-column>
        <el-table-column
            prop="department.name"
            label="部门"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            label="职称"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学位"
            align="left"
            width="70">
        </el-table-column>
        <el-table-column
            prop="school"
            label="学校"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="specialty"
            label="专业"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="workState"
            label="在职状态"
            align="left"
            width="70">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职日期"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            label="转正日期"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            label="合同起始日期"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="endContract"
            label="合同截止日期"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            label="合同期限"
            align="left"
            width="90">
          <template slot-scope="scope">
            <el-tag>{{scope.row.contractTerm}}</el-tag> 年
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button style="padding: 2px" size="mini">编辑</el-button>
            <el-button style="padding: 2px" size="mini" type="primary">查看高级资料</el-button>
            <el-button style="padding: 2px" size="mini" type="danger">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return{
      emps: [],
      loading: false
    }
  },
  mounted() {
    this.initEmps();
  },
  methods:{
    initEmps(){
      this.loading = true;
      this.getRequest('/employee/basic/').then(resp=>{
        this.loading = false;
        if (resp){
          this.emps = resp.data;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>