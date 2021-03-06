<template>
  <div>
    <div class="permissAdd">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名"></el-input>
      <el-button size="small" type="primary" icon="el-icon-circle-plus">添加角色</el-button>
    </div>
    <div class="permissMain">
      <el-collapse accordion @change="change">
        <el-collapse-item v-for="(r,index) in roles" :key="index" :title="r.nameZh" :name="r.id">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0;color: #ff0000" type="text" icon="el-icon-delete"></el-button>
            </div>
            <div>
              <el-tree show-checkbox :data="allMenus" :props="defaultProps"></el-tree>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissManage",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    change(rid) {
      if (rid) {
        this.initAllMenus();
      }
    },
    initAllMenus() {
      this.getRequest('/system/basic/permission/menus').then(resp=>{
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    initRoles() {
      this.getRequest('/system/basic/permission/').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    }
  }
}
</script>

<style>
.permissAdd {
  display: flex;
  justify-content: flex-start;
}

.permissAdd .el-input {
  width: 300px;
  margin-right: 8px;
}

.permissMain {
  margin-top: 10px;
  width: 700px;
}
</style>