<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
/*解决表格控件表头与内容的边框不对齐问题*/
.el-table th.gutter {
  display: table-cell !important;
}
</style>
