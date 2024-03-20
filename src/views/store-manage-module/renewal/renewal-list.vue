<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="searchParams.storeNo" placeholder="请输入门店编号..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.storeName" placeholder="请输入门店名称..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="" prop="informationNo">
          <franchisee-select v-model="searchParams.informationNo" placeholder="请输入加盟商名称..." size="mini"/>
        </el-form-item>
        <el-form-item label="" prop="renewalStatus">
          <el-select v-model="searchParams.renewalStatus" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择续签状态...">
            <el-option v-for="item in examineOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryByParams" size="mini">查询</el-button>
          <!-- <el-button type="default" icon="el-icon-circle-plus-outline" size="mini" @click="add">新增</el-button> -->
        </el-form-item>
      </el-form>
    </el-row>
    <el-table class="custom-table" :data="dataList" :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading">
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
      <el-table-column prop="storeNo" label="门店编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="门店名称" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="districtArea" label="所属地区" width="150px" align="center"></el-table-column>
      <el-table-column prop="openingTime" label="开店时间" width="200px" align="center"></el-table-column>
      <el-table-column prop="isPostage" label="门店有效期" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.periodStartValidity }} 至 {{ scope.row.periodEndValidity }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="infomationNo" label="所属加盟商" width="250px" align="center"></el-table-column>
      <el-table-column prop="xxxx" label="近一次申请时间" width="150px" align="center"></el-table-column>
      <el-table-column prop="renewalStatus" label="续签状态" width="80px" align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="180px" fixed="right">
        <template slot-scope="scope">
          <!-- 已续签 置灰续签按钮 -->
          <el-button :disabled="scope.row.renewalStatus == 1" icon="el-icon-set-up" size="mini" @click="renewal(scope.row)">续签</el-button>
          <el-button icon="el-icon-document" size="mini" @click="detail(scope.row)">详情</el-button>
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
        { label: "待续签", value: 0 },
        { label: "已续签", value: 1 },
        { label: "未续签", value: 2 },
      ],
    }
  },
  components: {
    FranchiseeSelect
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

    // 续签
    renewal(row) {
      this.$router.push({ name: 'Renewal-Info', params: { id: row.id } })
    },

    // 详情
    detail(row) {
      this.$router.push({ name: 'Store-Detail', params: { id: row.id, type: 0 } })
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
        ...this.searchParams
      }
      const result = await post('/srm/sh/stores/listByPageNo', params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    formatStatus (row, column) {
      const res = this.examineOptions.find(item => item.value == row.renewalStatus)
      return res ? res.label : '--'
    },
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
