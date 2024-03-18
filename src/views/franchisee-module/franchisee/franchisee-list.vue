<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="" prop="informationNo">
          <el-input v-model="searchParams.informationNo" placeholder="请输入加盟商编号..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="" prop="informationName">
          <!-- <el-input v-model="searchParams.informationName" placeholder="请输入加盟商名称..." clearable size="mini"></el-input> -->
          <franchisee-select placeholder="请输入加盟商名称..." size="mini" @change="changeName"/>
        </el-form-item>
        <el-form-item label="" prop="authorityScope">
          <el-select v-model="searchParams.authorityScope" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择授权范围...">
            <el-option v-for="item in agentTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="searchParams.status" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择审核状态...">
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
      <el-table-column prop="informationNo" label="加盟商编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="informationName" label="加盟商名称" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contacts" label="联系人" width="150px" align="center"></el-table-column>
      <el-table-column prop="contactsPhone" label="联系方式" width="100px" align="center"></el-table-column>
      <el-table-column prop="authorityScope" label="授权范围" width="100px" align="center" :formatter="formatAuthorityScope"></el-table-column>
      <el-table-column prop="initialFee" label="加盟费" width="100px" align="center"></el-table-column>
      <el-table-column prop="salesVolume" label="销售额" width="100px" align="center"></el-table-column>
      <el-table-column prop="status" label="审核状态" width="80px" align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="220px" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" v-if="scope.row.status == 0"  @click="edit(scope.row)">编辑</el-button>
          <el-button icon="el-icon-folder-checked" size="mini" v-if="scope.row.status == 2" @click="check(scope.row, 1)">审核</el-button>
          <el-button icon="el-icon-document" size="mini" @click="check(scope.row, 0)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-show="totalCount > 10" @size-change="changeSize" @current-change="changePage" :page-size="pageSize" layout="total, slot, jumper, prev, pager, next" :total="totalCount"></el-pagination>
  </div>
</template>
<script>
import { fetch, post } from '@/utils/http-client'
import FranchiseeSelect from '@/components/FranchiseeSelect'

export default {
  name: '',
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      searchParams: {
        informationNo: '', // 加盟编号
        informationName: '', // 加盟名称
        authorityScope: '', // 授权范围 1省 2市 3县 4城 5个
        status: '', // 审核状态
      },
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
        { label: "审核不通过", value: 0 },
        { label: "待审核", value: 2 },
      ],
      showDialog: false
    }
  },
  components: {
    FranchiseeSelect
  },
  async mounted() {
    // 从首页跳转过来的链接
    if (this.$route.query) {
      if (this.$route.query.type == 2 || this.$route.query.type == 0) {
        this.searchParams.status = parseInt(this.$route.query.type)
      }
    }
    this.loadData()
  },
  methods: {
    changeName(val) {
      this.searchParams.informationName = val?.informationName
    },
    changePage(pageNo) {
      this.pageNo = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.loadData()
    },

    formatStatus (row, column) {
      const res = this.examineOptions.find(item => item.value == row.status)
      return res ? res.label : '--'
    },

    formatAuthorityScope (row, column) {
      const res = this.agentTypeOptions.find(item => item.value == row.authorityScope)
      return res ? res.label : '--'
    },

    add() {
      this.$router.push({ name: 'Franchisee-Tpl', params: { id: '-1' } })
    },
    edit(row) {
      this.$router.push({ name: 'Franchisee-Tpl', params: { id: row.id } })
    },
    // 审核
    check(row, type) {
      // type = 1审核 = 0详情
      if (type == 1) {
        this.$router.push({ name: 'Franchisee-Examine', params: { id: row.id, type } })
      } else if (type == 0) {
        this.$router.push({ name: 'Franchisee-Detail', params: { id: row.id, type } })
      }
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
      const result = await post('/srm/sh/information/listByPageNo', params)
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
