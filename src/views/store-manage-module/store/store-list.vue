<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="" prop="storeNo">
          <el-input v-model="searchParams.storeNo" placeholder="请输入门店编号..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="" prop="storeName">
          <el-input v-model="searchParams.storeName" placeholder="请输入门店名称..." clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="" prop="informationNo">
          <!-- <el-select v-model="searchParams.informationNo" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择加盟商...">
            <el-option v-for="item in agentTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <franchisee-select v-model="searchParams.informationNo" placeholder="请输入加盟商名称..." size="mini"/>
        </el-form-item>
        <el-form-item label="" prop="reviewStatus	">
          <el-select v-model="searchParams.reviewStatus" collapse-tags filterable style="width:100%" size="mini" clearable placeholder="请选择审核状态...">
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
      <el-table-column prop="storeNo" label="门店编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="门店名称" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="districtArea" label="所属地区" width="150px" align="center"></el-table-column>
      <el-table-column prop="salesArea" label="开店时间" width="100px" align="center"></el-table-column>
      <el-table-column prop="openingTime" label="有效期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openingTime }}至{{ scope.row.periodEndValidity }}</span>
        </template>
      </el-table-column>
      <!-- 这个字段文档中没有 -->
      <el-table-column prop="xxxx" label="所属加盟商" width="150px" align="center"></el-table-column>
      <el-table-column prop="reviewStatus" label="审核状态" width="80px" align="center"></el-table-column>
      <el-table-column prop="yn" label="启用状态" width="80px" align="center"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="320px" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button icon="el-icon-turn-off" size="mini" @click="toggle(scope.row, 0)">停用</el-button>
          <el-button icon="el-icon-open" size="mini" @click="toggle(scope.row, 1)">启用</el-button>
          <el-button icon="el-icon-set-up" size="mini" @click="renewal(scope.row)">续签</el-button>
          <el-button icon="el-icon-folder-checked" size="mini" @click="check(scope.row, 1)">审核</el-button>
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
        storeNo: '',
        storeName: '',
        informationNo: '',
        reviewStatus: '' // 审核状态 0否1是
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
      this.$router.push({ name: 'Store-Tpl', params: { id: '-1' } })
    },
    edit(row) {
      this.$router.push({ name: 'Store-Tpl', params: { id: row.id } })
    },
    // 审核
    check(row, type) {
      // type = 1审核  = 0详情
      this.$router.push({ name: 'Store-Examine', params: { id: row.id, type } })
    },
    // 续签
    renewal(row) {
      this.$router.push({ name: 'Renewal-Info', params: { id: row.id } })
    },
    // 停用 | 启用 type=0停用  =1启用
    toggle(row, type) {
      this.$confirm(`确认要${type === 1 ? '启用' : '停用'}此门店吗？`, "提示", {
        type: "warning",
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then((res) => {
        if (type === 1) {

        } else if (type === 0) {
          
        }
        console.log(res)
      }).catch((action) => { })
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
        // queryObject: this.searchParams
        ...this.searchParams
      }
      const result = await post('/srm/srm/sh/stores/listByPageNo', params)
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
