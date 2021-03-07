<template>
  <div>
    <div style="width: 500px">
      <el-input
          placeholder="输入部门名称进行搜索..."
          prefix-icon="el-icon-search"
          v-model="filterText">
      </el-input>

      <el-tree
          :data="deps"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree">
      </el-tree>

    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "DepManage",
  data() {
    return {
      filterText: '',
      deps: [],
      defaultProps:{
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    initDeps() {
      this.getRequest('/system/basic/department/').then(resp=>{
        if (resp){
          this.deps = resp;
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
}
</script>

<style scoped>

</style>