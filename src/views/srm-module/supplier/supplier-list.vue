<template>
  <!-- 重写商家管理页面 -->
  <div class="main-content">
    <div class="_query">
      <el-row class="mb-2">
        <el-form :inline="true" ref='searchParams' :model='searchParams'>
          <el-form-item label="商家名称:" prop="supplierName">
            <el-input v-model="searchParams.supplierName" placeholder="请输入商家名称..." clearable
              size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" prop="contactPerson">
            <el-input v-model="searchParams.contactPerson" placeholder="请输入联系人..." clearable
              size="mini"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="mobile">
            <el-input v-model="searchParams.mobile" placeholder="请输入联系电话..." clearable
              size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadData"
              size="mini">查询</el-button>
            <el-button icon="el-icon-search" @click="resetData('searchParams')"
              size="mini">重置</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini"
              @click="forward2DetailsPage(false)">新增</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div class="table_content" v-if="countMap">
      <el-tabs v-model="searchParams.auditState" :tab-position="tabPosition"
        @tab-click="handleTabClick">
        <el-tab-pane name="3">
          <span slot="label">审核通过<span style='color:red'>({{countMap[3].countNum}})</span></span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">待审核<span style='color:red'>({{countMap[2].countNum}})</span></span>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label">审核未通过<span style='color:red'>({{countMap[4].countNum}})</span></span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 后期做整合 -->
    <el-table class="custom-table" :data="dataList"
      :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading"
      height="400px">
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="商家名称" width="150px" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplierCode" label="商家编码" width="120px"
        align="center"></el-table-column>
      <!-- TODO 公司名称prd 没有显示后期对接口的时候注意 -->
      <!-- <el-table-column prop="companyName" label="公司名称" width="200px" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="businessCertificatesImg" label="营业执照" align="center">
        <template slot-scope="scope">
          <el-image style="width: 20px; height: 20px" :src="scope.row.businessCertificatesImg"
            :preview-src-list="[scope.row.businessCertificatesImg]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="address" width="170px" label="住所/经营场所" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactPerson" label="联系人" width="120px" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="150px" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="审核状态" width="170px" align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1" style="display: inline-block;">已注册</div>
          <div v-if="scope.row.status === 2" style="display: inline-block;">待审核</div>
          <div v-if="scope.row.status === 3" style="display: inline-block;">审核通过</div>
          <div v-if="scope.row.status === 4" style="display: inline-block;">审核未通过</div>
          <div v-if="scope.row.status === 5" style="display: inline-block;">关闭封号</div>
          <div v-if="scope.row.status === 6" style="display: inline-block;">删除</div>
          <div v-if="scope.row.status === 7" style="display: inline-block;">打回修改</div>
          <el-button v-if="scope.row.status === 4" type="text" size="mini"
            @click="lookReason(scope.row)">查看原因</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="申请时间" width="150px"></el-table-column>
      <el-table-column prop="auditTime" label="入驻时间" width="150px"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="170px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showDetail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === 4" type="text" size="mini"
            @click="forward2DetailsPage(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-show="totalCount > 10" @size-change="changeSize"
      @current-change="changePage" :page-size="pageSize"
      layout="total, slot, jumper, prev, pager, next" :total="totalCount">
    </el-pagination>
    <!-- 商家详情 -->
    <info-template ref="template" />
  </div>
</template>
<script>
import { post } from '@/utils/http-client'
import InfoTemplate from "./supplier-info";

export default {
  name: '',
  data() {
    return {
      tabPosition: 'top',
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      // orderStatusOptions:[{name:'待支付',code:'10'},{name:'待发货',code:'20'},{name:'待收货',code:'30'},{name:'待评价',code:'50'},{name:'交易完成',code:'40'},{name:'已取消',code:'90'}],
      searchParams: {
        supplierName: '',
        contactPerson: '',
        mobile: '',
        auditState: '3'
      },
      countMap: null
    }
  },
  components: { InfoTemplate },
  created() {
    if (this.$route.query.type) {
      this.searchParams.auditState = this.$route.query.type
    }
  },
  async mounted() {
    this.loadData()
    // this.loadCountAuditState()
  },
  methods: {
    // 详情
    showDetail({ id }) {
      this.$refs.template.showInfo(id)
    },
    // 新增or编辑
    forward2DetailsPage(row) {
      this.$router.push({ name: "Supplier-Edit", params: { id: row ? row.id : -1 } })
    },
    // 查看原因
    lookReason({ auditRemark, supplierName }) {
      this.$alert(
        `<div style="color:black">商家名称：${supplierName}</div><div>审核不通过原因：${auditRemark}</div>`,
        "查看审核不通过原因",
        {
          dangerouslyUseHTMLString: true
        }
      )
    },
    resetData(searchParams) {
      this.$refs[searchParams].resetFields()
    },
    formatSupplierStatus: function (row, column) {
      return row.status === 1 ? '已注册待提交' : row.status === 2 ? '待审核' : row.status === 3 ? '审核通过' : row.status === 4 ? '审核未通过' : row.status === 5 ? '已禁用' : row.status === 6 ? '已删除' : '--'
    },
    handleTabClick() {
      this.pageNo = 1
      this.loadData()
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

    // add() {
    //   this.$refs.template.show(true);
    // },

    async loadData() {
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      const result = await post('/srm/supplier/listByPageNo', params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          //this.pageSize = result.data.limit;
          this.loadCountAuditState()
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    async loadCountAuditState() {
      const result = await post("/supplier/supplierStatusCount", {})
      if (result.code === "200") {
        this.countMap = {}
        const countMap = {}
        result.data.forEach((i) => {
          countMap[i.auditStatus] = { countNum: i.statusNum }
        })
        this.countMap = countMap
      } else {
        this.$message.error(result.msg)
      }
    },
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
