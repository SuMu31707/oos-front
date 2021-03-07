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
    <div>

    </div>
  </div>
</template>

<script>
export default {
  name: "EmpBasic"
}
</script>

<style scoped>

</style>