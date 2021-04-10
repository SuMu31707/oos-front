<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">人事管理系统</div>
        <div>
<!--          <el-button size="normal"-->
<!--                     icon="el-icon-bell"-->
<!--                     type="text"-->
<!--                     @click="goChat"-->
<!--                     style="font-size: 20px;color: white;margin-right: 15px">-->
<!--          </el-button>-->
          <el-dropdown class="userInfo" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ user.name }}<i><img :src="user.userFace"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu :index="index+ ''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
              <template slot="title">
                <i :class="item.iconCls" style="color: #1accff;margin-right: 5px"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="children.path" v-for="(children,index1) in item.children">{{
                  children.name
                }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到人事管理系统
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods: {
    goChat() {
      // this.$router.push('/chat')
    },
    handleCommand(command) {
      if (command == 'logout') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 注销登录
          this.postRequest('/logout');
          // 清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          // 清空菜单
          this.$store.commit('initRoutes', []);
          // 跳转到登录页
          this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
      if (command == 'userinfo'){
        this.$router.push('/userinfo')
      }
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentAdmin;
    }
  }
}
</script>

<style scoped>
.homeHeader {
  background: #1e87d7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: white;
  font-family: 楷体;
  font-size: 18px;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 10px;
}

.homeWelcome {
  text-align: center;
  font-size: 50px;
  font-family: 华文楷体;
  color: #1e87d7;
  padding-top: 50px;
}

.homeRouterView {
  margin-top: 8px;
}
</style>