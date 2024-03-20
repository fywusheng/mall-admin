<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="searchParams.realName" placeholder="请输入管理员姓名..." size="mini"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.loginName" placeholder="请输入手机号码(登录账号)..." size="mini"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini"
            @click="loadData">查询</el-button>
          <el-button type="default" icon="el-icon-circle-plus-outline" size="mini"
            @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table class="custom-table" :data="dataList"
      :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading">
      <div slot="empty" class="empty-wrap"><i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column label="序号" type="index" align="center" width="60px">
      </el-table-column>
      <el-table-column prop="realName" label="姓名">
      </el-table-column>
      <el-table-column prop="loginName" label="登录账号" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="telphone" label="所在部门/职务" width="150px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="telphone" label="手机号码" align="center" width="100px">
      </el-table-column>
      <el-table-column prop="email" label="邮件"  width="150px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="updatedTime" label="操作时间" align="center" width="150px">
      </el-table-column>
      <el-table-column prop="delFlag" label="启用状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.delFlag" active-color="#FF5500" :active-value="0"
            inactive-color="#909399" :inactive-value="1">
          </el-switch>
          <!-- 提示接口不存在 -->
          <!-- <el-switch :value="scope.row.delFlag" active-color="#FF5500" :active-value="0"
            inactive-color="#909399" :inactive-value="1" @change="(e) => disable(e, scope.row)">
          </el-switch> -->
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="380px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-info" :underline="false" size="mini"
            @click="forward2AuthorizationPage(scope.row)">授权&nbsp;&nbsp;</el-button>
          <el-button icon="el-icon-edit" :underline="false" size="mini"
            @click="edit(scope.row)">编辑&nbsp;&nbsp;</el-button>
          <el-button :underline="false" @click="reset(scope.row)" size="mini">重置密码&nbsp;&nbsp;</el-button>
          <el-button icon="el-icon-delete" :underline="false" size="mini"
            @click="del(scope.row)">删除&nbsp;&nbsp;</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-show="totalCount > 10" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize" @size-change="changeSize" @current-change="changePage"
      layout="total, slot, jumper, prev, pager, next" :total="totalCount">
    </el-pagination>
    <edit-template ref="template"></edit-template>
  </div>
</template>
<script>
import { fetch, post } from '@/utils/http-client'
import EditTemplate from './template'

export default {
  name: '',
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      dataList: [],
      totalCount: 10,
      loading: false,
      searchParams: {},
      dialogList: [],
      showDialog: false
    }
  },
  components: {
    EditTemplate
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    changePage(pageNo) {
      this.pageNo = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.loadData()
    },
    async loadData() {
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }

      const result = await post('/org/admin/getListByPage', params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list;
          this.totalCount = result.data.totalCount * 1;
          this.pageSize = result.data.pageSize;
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    add() {
      this.$refs.template.show(true)
    },
    edit(row) {
      this.$refs.template.show(true, row)
    },
    async disable(row) {
      this.$confirm('确定要禁用该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await post('/user/status.setting', { sysUserId: row.sysUserId, status: 0 })
        if (result.code == 200) {
          this.$message.success('禁用成功!')
          this.loadData()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(() => {
      })
    },

    async del(row) {
      this.$confirm('确定要删除该管理员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await post('/user/delete', { id: row.id })
        if (result.code == 200) {
          this.$message.success('删除成功!')
          this.loadData()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(() => {
      })
    },
    async reset(row) {
      this.$confirm('确定要重置该用户密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        ///user/password/reset  hostname:url,
        var url = location.origin + location.pathname + '#'
        const result = await post('/authority/resetPwd', { id: row.id })
        if (result.code == 200) {
          this.$message.success(result.data)
          this.loadData()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(() => {
      })
    },
    forward2AuthorizationPage(row) {
      this.$router.push({ name: 'Authorization2User', params: { id: row.id, name: row.realName, loginName: row.loginName } })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
