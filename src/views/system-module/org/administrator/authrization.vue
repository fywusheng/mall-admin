
<template>
  <div class="main-content">
    <el-page-header @back="back2Prev" content="用户授权管理"></el-page-header>
    <el-row style="height:20px">
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
        <div style="width:100%;display:block;line-height:60px;text-align:center;">
          当前用户：{{userObject.userName}},&nbsp;登录账号：{{userObject.loginName}}</div>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="font-family:PingFang;">
      <el-col :span="3"></el-col>
      <el-col :span="18" class="grid-content02 bg-purple">
        <div style="width:100%;display:block;line-height:50px;text-align:center;">
          <!-- <el-button type="info"  @click="resetChecked()" size="small" plain round>重置(R)</el-button> -->
          <el-button type="primary" @click="save()" size="small" plain round>保存(S)</el-button>
        </div>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
    <div class="role_sq">角色授权</div>
    <el-row type="flex" class="mb-10" justify="space-between">
      <el-col :span="6"></el-col>
      <el-col :span="12">
        <template>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedRoleKeys">
            <el-checkbox v-for="r in roles" :label="r.id" :key="r.id" border size="small"
              style="width:150px">{{r.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-col>
      <el-col :span="6"> </el-col>
    </el-row>
    <div v-if="userObject.accountType == 9 || userObject.accountType == 1">
      <div class="role_sq _margin">管理地区授权</div>
      <div class="areaSelet">
        <div class="_left">请选择地区:</div>
        <el-button class="_btn">{{userObject.actualProvinceName}}</el-button>
        <el-button class="_btn">{{userObject.actualCityName}}</el-button>
        <el-select v-model="areaCode" multiple placeholder="请选择">
          <el-option v-for="item in cityList" :key="item.code" :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
    </div>

  </div>
</template>

<script>
import { fetch, post } from "@/utils/http-client";

export default {
  data() {
    return {
      userObject: {},
      checkedRoleKeys: [],
      roles: [],
      cityList: [],
      //  name:'',
      //  loginName:'',
      areaCode: ""
    }
  },
  async mounted() {
    const user = localStorage.getItem('userInfor')
    this.userObject = JSON.parse(user)
    this.$loading = true;
    this.loadAllRoles();
    // this.name = this.$route.params.name;
    // this.loginName= this.$route.params.loginName;
    this.loadUserRoles(this.$route.params.id);
    this.$loading = false;
    this.getAreaCityList()
    this.getManageArea()
  },

  methods: {
    resetChecked() {
      // this.$refs.tree.setCheckedKeys(this.checkedRoleKeys);
    },
    back2Prev() {
      this.$router.back();
    },

    // 获取用户所属区域
    async getManageArea() {
      const result = await post("userManage/getByUid", { uid: this.$route.params.id })
      if (result.code === "200") {
        this.areaCode = result.data.manageAreaList.map(el => {
          return el.actualAreaCode
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    // 获取省市下的所有区
    async getAreaCityList() {
      const params = {
        provinceCode: this.userObject.actualProvinceCode,
        cityCode: this.userObject.actualCityCode,
      }
      const result = await fetch("/area/getAreaByPCodeAndCCode", params)
      if (result.code === "200") {
        this.cityList = result.data
      } else {
        this.$message.error(result.msg)
      }
    },

    async loadAllRoles() {
      let result = await fetch('/role/list', {})
      if (result.code == 200) {
        this.roles = result.data;
      }
      else {
        this.$message.error(result.msg);
      }
    },
    async loadUserRoles(userId) {
      let result = await fetch('/role/getRoleIdsByUserId', { userId: userId })
      if (result.code == 200) {
        this.checkedRoleKeys = result.data
      }
      else {
        this.$message.error(result.msg);
      }
    },

    async save() {
      if (!this.areaCode.length) {
        this.$message.warning("请选择区域！")
        return false
      }
      this.sending = true
      const result = await post('/org/admin/grant', { id: this.$route.params.id, roles: this.checkedRoleKeys })
      this.sending = false
      if (result.code == 200) {
        this.saveArea()
        // this.$message.success(result.msg)
        // this.back2Prev()
      } else {
        this.$message.error(result.msg)
      }

    },
    // 维护用户区域
    async saveArea() {
      const manageAreaList = this.cityList.filter(el =>
        this.areaCode.includes(el.code)
      ).map(item => {
        return { actualAreaCode: item.code, actualAreaName: item.name }
      })
      const params = {
        uid: this.$route.params.id,
        actualProvinceCode: this.userObject.actualProvinceCode,
        actualProvinceName: this.userObject.actualProvinceName,
        actualCityCode: this.userObject.actualCityCode,
        actualCityName: this.userObject.actualCityName,
        manageAreaList
      }
      if (!params.manageAreaList.length) {
        delete params['manageAreaList']
      }
      const result = await post("userManage/save", params)
      if (result.code == 200) {
        this.$message.success(result.msg)
        this.back2Prev()
      } else {
        this.$message.error(result.msg)
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.role_sq {
  width: 74%;
  margin: 0 auto;
  font-size: 17px;
  height: 31px;
  line-height: 31px;
  margin-top: 10px;
}
._margin {
  margin-top: 20px;
}
.areaSelet {
  width: 74%;
  margin: 25px auto;
  font-size: 15px;
  ._btn {
    width: 105px;
    height: 32px;
  }
}
._left {
  height: 32px;
  line-height: 32px;
  width: 10%;
}
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
