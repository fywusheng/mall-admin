<template>
  <div class="main-content">
    <el-page-header @back="back2Prev" content="角色授权管理2"></el-page-header>
    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-row type="flex" class="mb-10" justify="space-between">
      <el-col :span="6"> </el-col>
      <el-col :span="13"></el-col>
      <el-col :span="5"></el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="font-family:PingFang;">
      <el-col :span="3"></el-col>
      <el-col :span="18" class="grid-content01 bg-purple">
        <div style="width:100%;display:block;line-height:60px;text-align:center;">当前角色：{{roleName}}
        </div>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="font-family:PingFang;">
      <el-col :span="3"></el-col>
      <el-col :span="18" class="grid-content02 bg-purple">
        <div style="width:100%;display:block;line-height:50px;text-align:center;">
          <el-button type="info" @click="resetChecked()" size="small" plain round>重置(R)</el-button>
          <el-button type="primary" @click="save()" size="small" plain round>保存(S)</el-button>
        </div>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
    <el-row type="flex" class="mb-10" justify="space-between">
      <el-col :span="6"> </el-col>
      <el-col :span="12">
        <div>
          <el-tree :data="data" show-checkbox node-key="id" ref="tree" highlight-current
            :props="defaultProps" accordion :default-checked-keys="checkedPermissionKeys">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="6"> </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetch, post } from "@/utils/http-client";

export default {
  async mounted() {
    this.$loading = true;
    this.loadRoleInfo(this.$route.params);
    this.loadAllPermission();
    this.loadRolePermission(this.$route.params.id);
    this.$loading = false;
  },

  methods: {
    resetChecked() {
      //this.checkedPermissionKeys
      this.$refs.tree.setCheckedKeys([]);
    },
    back2Prev() {
      this.$router.back();
    },
    async loadRoleInfo(roleId) {
      const result = await fetch('/role/getRoleById', roleId);
      if (result.code == 200) {
        this.roleName = result.data.name
        this.roleCode = result.data.code
        this.roleDesc = result.data.description
      }
      else {
        this.$message.error(result.msg);
      }
    },

    async loadAllPermission() {
      let result = await fetch('permission/getPermissionTree', {})
      if (result.code == 200) {
        this.data = result.data;
      }
      else {
        this.$message.error(result.msg);
      }
    },
    async loadRolePermission(roleId) {
      let result = await fetch('permission/getIdsByRoleId', { roleId: roleId })
      if (result.code == 200) {
        this.checkedPermissionKeys = result.data;
      }
      else {
        this.$message.error(result.msg);
      }
    },
    async save() {
      this.sending = true
      console.log("====授权节点---", this.$refs.tree.getCheckedKeys())
      console.log('---node--', this.$refs.tree.getCheckedNodes())
      console.log("===22kan--", this.$refs.tree.getHalfCheckedNodes())
      let checkedkeys = this.$refs.tree.getCheckedKeys()
      let checknodes = this.$refs.tree.getHalfCheckedNodes()
      if (checknodes.length > 0) {
        checkedkeys.push(checknodes[0].id)
      }
      console.log("===resut--", checkedkeys)
      const result = await post('/role/grant', { id: this.$route.params.id, permissionIds: checkedkeys })
      this.sending = false
      if (result.code == 200) {
        this.$message.success('角色授权成功！')
        this.back2Prev()
      }
      else {
        this.$message.error(result.msg)
      }
    }
  },

  data() {
    return {
      data: [],
      roleName: '',
      roleCode: '',
      roleDesc: '',
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedPermissionKeys: []
    };
  },
};
</script>
<style>
.grid-content01 {
  border-radius: 6px;
  min-height: 60px;
}
.grid-content02 {
  border-radius: 6px;
  min-height: 50px;
}
.bg-purple {
  background: #5693f5;
}
</style>