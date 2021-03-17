<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DepManage">
        <DepManage></DepManage>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="PosManage">
        <PosManage></PosManage>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="JoblevelManage">
        <JoblevelManage></JoblevelManage>
      </el-tab-pane>
<!--      <el-tab-pane label="奖惩规则" name="EcManage">-->
<!--        <EcManage></EcManage>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="权限组" name="PermissManage">
        <PermissManage></PermissManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepManage from "@/components/sys/basic/DepManage";
import EcManage from "@/components/sys/basic/EcManage";
import PosManage from "@/components/sys/basic/PosManage";
import JoblevelManage from "@/components/sys/basic/JoblevelManage";
import PermissManage from "@/components/sys/basic/PermissManage";

export default {
  name: "SysBasic",
  data() {
    return {
      activeName: 'DepManage'
    }
  },
  components: {
    DepManage,
    EcManage,
    PosManage,
    JoblevelManage,
    PermissManage
  }
}
</script>

<style scoped>

</style>