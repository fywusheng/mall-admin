<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="searchParams.tempName" placeholder="请输入加盟商编号..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.tempCode" placeholder="请输入加盟商名称..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="" prop="supplierId">
          <el-select v-model="searchParams.supplierId" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择省代...">
            <el-option v-for="item in agentTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="supplierId">
          <el-select v-model="searchParams.supplierId" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择审核状态...">
            <el-option v-for="item in examineOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryByParams" size="mini">查询</el-button>
          <el-button type="default" icon="el-icon-circle-plus-outline" size="mini" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table class="custom-table" :data="dataList" :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading">
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
      <el-table-column prop="tempName" label="加盟商编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tempCode" label="加盟商名称" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplierId" label="联系人" width="150px" align="center"></el-table-column>
      <el-table-column prop="type" label="联系方式" width="100px" align="center"></el-table-column>
      <el-table-column prop="isPostage" label="授权范围" width="100px" align="center"></el-table-column>
      <el-table-column prop="updatedTime" label="加盟费" width="150px" align="center"></el-table-column>
      <el-table-column prop="modifier" label="销售额" width="80px" align="center"></el-table-column>
      <el-table-column prop="modifier" label="审核状态" width="80px" align="center"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="320px" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button icon="el-icon-folder-checked" size="mini" @click="check(scope.row)">审核</el-button>
          <el-button icon="el-icon-document" size="mini" @click="edit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-show="totalCount > 10" @size-change="changeSize" @current-change="changePage" :page-size="pageSize" layout="total, slot, jumper, prev, pager, next" :total="totalCount"></el-pagination>
  </div>
</template>
<script>
import { fetch, post } from '@/utils/http-client'

export default {
  name: '',
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      searchParams: {},
      dialogList: [],
      agentTypeOptions: [
        { label: "省代", value: 1 },
        { label: "市代", value: 2 },
        { label: "区县代", value: 3 },
        { label: "城乡代", value: 4 },
        { label: "个体", value: 5 },
      ],
      examineOptions: [
        { label: "审核通过", value: 1 },
        { label: "审核不通过", value: 2 },
        { label: "待审核", value: 3 },
      ],
      showDialog: false
    }
  },
  components: {
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

    // formatType: function (row, column) {
    //   return row.type === 1 ? '计件' : row.type === 2 ? '重量' : row.type === 3 ? '体积' : '--'
    // },
    // formatPostage: function (row, column) {
    //   return row.isPostage === 1 ? '包邮' : row.isPostage === 0 ? '不包邮' : '--'
    // },

    add() {
      this.$router.push({ name: 'Franchisee-Tpl', params: { id: '-1' } })
    },
    edit(row) {
      this.$router.push({ name: 'Franchisee-Tpl', params: { id: row.id } })
    },
    // 审核
    check(row) {
      this.$router.push({ name: 'Franchisee-Examine', params: { id: row.id } })
    },
    async resetting(row) {
      const result = await post('/tms/freight-template/resetting', row);
      if (result.code == 200) {
        this.$message.success("运费模板启用状态重置成功!");
        this.loadData();
      } else {
        this.$message.error(result.msg);
      }
    },
    queryByParams() {
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
      const result = await post('/tms/freight-template/listPageNo', params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          //this.pageSize = result.data.limit;
        })
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
