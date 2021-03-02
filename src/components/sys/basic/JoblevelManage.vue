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
    <el-dialog width="35%" title="编辑职称" :visible.sync="dialogFormVisible">
      <el-form :model="updateJl">
        <el-form-item style="width: 68.5%" label="职称名称" :label-width="formLabelWidth">
          <el-input v-model="updateJl.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职称等级" :label-width="formLabelWidth">
          <el-select v-model="updateJl.titleLevel" placeholder="选择等级">
            <el-option v-for="tl in tls" :label="tl" :value="tl"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
              style="display: block;margin-top: 9px"
              v-model="updateJl.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="已启用"
              inactive-text="未启用">
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateJl">确 定</el-button>
      </div>
    </el-dialog>
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
      jls: [],
      updateJl: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      dialogFormVisible: false,
      formLabelWidth: '120px'
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
      Object.assign(this.updateJl, data);
      this.updateJl.createDate = '';
      this.dialogFormVisible = true;
    },
    doUpdateJl() {
      this.putRequest('/system/basic/joblevel/', this.updateJl).then(resp=>{
        if (resp){
          this.initJls();
          this.dialogFormVisible = false;
        }
      })
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

<style>
.el-form-item__label {
  color: #1e87d7;
}
</style>