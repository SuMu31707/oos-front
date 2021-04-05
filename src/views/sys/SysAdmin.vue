<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 8px">
      <el-input v-model="keywords" style="width: 500px;margin-right: 5px" placeholder="通过用户名搜索..."
                prefix-icon="el-icon-search" @keydown.enter.native="doSearch" @clear="initAdmins" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
    </div>
    <div style="margin-left: 40px;margin-top: 10px">
      <el-button @click="showAdd()" icon="el-icon-plus" type="success">添加操作员</el-button>
    </div>
    <div class="admin-container">
      <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <el-button v-if="user.username=='admin'" size="normal" style="float: right; padding: 3px 0;color: red;margin-left: 20px" type="text" icon="el-icon-refresh"
                     @click="showResetPass(admin)"></el-button>

          <el-button size="normal" style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete"
                     @click="deleteAdmin(admin)"></el-button>
        </div>
        <div>
          <div class="img-container">
            <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userFace-img">
          </div>
        </div>
        <div class="userInfo-container">
          <div>用户名称：{{ admin.name }}</div>
          <div>手机号码：{{ admin.phone }}</div>
          <div>电话号码：{{ admin.telephone }}</div>
          <div>用户地址：{{ admin.address }}</div>
          <div>用户状态：
            <el-switch
                v-model="admin.enabled"
                @change="enabledChange(admin)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="已启用"
                inactive-text="未启用">
            </el-switch>
          </div>
          <div>
            用户角色：
            <el-tag style="margin-right: 4px" type="success" v-for="(role,index) in admin.roles">{{ role.nameZh }}
            </el-tag>
            <el-popover
                placement="bottom"
                @show="showPop(admin)"
                @hide="hidePop(admin)"
                title="角色列表"
                width="200"
                trigger="click">
              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                    v-for="(r,index) in allRoles"
                    :key="index"
                    :label="r.nameZh"
                    :value="r.id">
                </el-option>
              </el-select>
              <el-button type="text" icon="el-icon-more" slot="reference"></el-button>
            </el-popover>
          </div>
          <div>备注信息：{{ admin.remark }}</div>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="重置操作员密码"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog width="40%" title="添加操作员" :visible.sync="open">
      <el-form :model="adminForm" :rules="rules1" ref="adminForm">
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="adminForm.name" autocomplete="off" placeholder="请输入中文名..."></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="adminForm.username" autocomplete="off" placeholder="请输入英文名(即用户名)..."></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="adminForm.password" autocomplete="off" placeholder="请输入密码..."></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="adminForm.phone" autocomplete="off" placeholder="请输入手机号码..."></el-input>
        </el-form-item>
        <el-form-item label="座机号码" prop="telephone" :label-width="formLabelWidth">
          <el-input v-model="adminForm.telephone" autocomplete="off" placeholder="请输入座机号码..."></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="adminForm.address" autocomplete="off" placeholder="请输入家庭住址..."></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="adminForm.remark" autocomplete="off" placeholder="请输入备注信息..."></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="submitForm1('adminForm')">提 交</el-button>
          <el-button @click="resetForm1('adminForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      open: false,
      dialogVisible: false,
      admins: [],
      adminForm: {
        address: '',
        enabled: true,
        name: '',
        password: '',
        phone: '',
        remark: '',
        telephone: '',
        userFace: '',
        username: ''
      },
      keywords: '',
      allRoles: [],
      selectedRoles: [],
      adminId: null,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      rules1: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入联系地址', trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px'
    }
  },
  computed: {
    user() {
      return this.$store.state.currentAdmin;
    }
  },
  mounted() {
    this.initAdmins();
  },
  methods: {
    submitForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest('/system/admin/', this.adminForm).then(resp=>{
            if (resp){
              this.open = false;
              this.initAdmins();
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm1(formName) {
      this.$refs[formName].resetFields();
    },
    showAdd() {
      this.adminForm = {
        address: '',
        enabled: true,
        name: '',
        password: '',
        phone: '',
        remark: '',
        telephone: '',
        userFace: '',
        username: ''
      };
      this.open = true;
    },
    showResetPass(admin) {
      this.adminId = admin.id;
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.putRequest('/system/admin/repw/' + this.adminId + '?password=' + this.ruleForm.checkPass).then(resp=>{
            if (resp){
              this.dialogVisible = false;
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    hidePop(admin) {
      let roles = [];
      Object.assign(roles, admin.roles);
      let flag = false;
      if (roles.length != this.selectedRoles.length) {
        flag = true;
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j];
            if (role.id == sr) {
              roles.splice(i, 1);
              // 移除后，后面的元素往前挪一位，防止遍历时漏掉往前挪的元素，i要减一
              i--;
              break;
            }
          }
        }
        if (roles.length != 0) {
          flag = true;
        }
      }

      if (flag) {
        let url = '/system/admin/role?adminId=' + admin.id;
        this.selectedRoles.forEach(sr => {
          url += '&rids=' + sr;
        });
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initAdmins();
          }
        })
      }
    },
    showPop(admin) {
      this.initAllRoles();
      let roles = admin.roles;
      this.selectedRoles = [];
      roles.forEach(r => {
        this.selectedRoles.push(r.id);
      });
    },
    initAllRoles() {
      this.getRequest('/system/admin/roles').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    },
    enabledChange(admin) {
      console.log(admin)
      this.putRequest('/system/admin/', admin).then(resp => {
        if (resp) {
          console.log(resp)
          this.initAdmins();
        }
      })
    },
    deleteAdmin(admin) {
      this.$confirm('此操作将永久删除《' + admin.name + '》用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/' + admin.id).then(resp => {
          if (resp) {
            this.initAdmins();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doSearch() {
      this.initAdmins();
    },
    initAdmins() {
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
        if (resp) {
          this.admins = resp;
        }
      })
    }
  }
}
</script>

<style>
.userInfo-container {
  font-size: 15px;
  color: #1e87d7;
}

.img-container {
  display: flex;
  justify-content: center;
}

.userFace-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.admin-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.admin-card {
  width: 350px;
  margin-top: 10px;
}
</style>