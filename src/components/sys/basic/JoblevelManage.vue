<template>
  <div>
    <div>
      <el-form size="small" :inline="true" :model="jl" class="demo-form-inline">
        <el-form-item label="职称名称">
          <el-input @keydown.enter.native="addJobLevel" v-model="jl.name" placeholder="请输入职称名称"></el-input>
        </el-form-item>
        <el-form-item label="职称等级">
          <el-select v-model="jl.titleLevel" placeholder="选择等级">
            <el-option v-for="tl in tls" :key="tl" :label="tl" :value="tl"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-circle-plus" type="primary" @click="addJobLevel">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
          :data="jls"
          size="small"
          stripe
          border
          style="width: 70%">
        <el-table-column
            prop="id"
            label="编号"
            width="60">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称等级"
            width="150">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建日期"
            width="150">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="150">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "JoblevelManage",
  data() {
    return {
      jl: {
        name: '',
        titleLevel: ''
      },
      tls: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级'
      ],
      jls: []
    }
  },
  mounted() {
    this.initJls();
  },
  methods: {
    initJls() {
      this.getRequest('/system/basic/joblevel/').then(resp => {
        if (resp) {
          this.jls = resp;
        }
      })
    },
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest('/system/basic/joblevel/', this.jl).then(resp => {
          if (resp) {
            this.initJls();
            this.jl.name = '';
            this.jl.titleLevel = '';
          }
        })
      } else {
        this.$message.error('字段不能为空！');
      }
    },
    showEditView(index, data) {

    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除《' + data.name + '》职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/joblevel/'+data.id).then(resp=>{
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>