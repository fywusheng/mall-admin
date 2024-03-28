<template>
  <div class="main-content">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" style="padding-top:0">
      <!-- 交易订单 -->
      <el-tab-pane label="交易订单" name="1">
        <el-row class="mb-2">
          <el-form :inline="true">
            <el-form-item label="">
              <el-input v-model="searchParams.orderId" placeholder="请输入订单编号..." clearable
                size="mini"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="searchParams.userLoginName" placeholder="请输入会员账号..." clearable
                size="mini"></el-input>
            </el-form-item>
            <!-- 交易订单订单状态 -->
            <el-form-item label="">
              <el-select v-model="searchParams.orderStatus" size="mini" clearable collapse-tags
                filterable style="width:100%" placeholder="请选择订单状态...">
                <el-option v-for="item in orderStatusOptions" :key="item.code" :label="item.name"
                  :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="searchParams.sceneType" size="mini" clearable collapse-tags
                filterable style="width:100%" placeholder="请选择订单类型...">
                <el-option v-for="item in orderTypeOptions" :key="item.code" :label="item.name"
                  :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="loadData"
                size="mini">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-table class="custom-table" :data="dataList"
          :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading">
          <div slot="empty" class="empty-wrap">
            <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
          </div>
          <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" width="200px" show-overflow-tooltip  align="center"></el-table-column>
          <el-table-column prop="sceneType" label="订单类型" width="160px" show-overflow-tooltip align="center"></el-table-column>

          <el-table-column prop="orderAmount" label="订单金额" width="70px"
            align="center"></el-table-column>
          <el-table-column prop="payableAmount" label="应付金额" width="70px"
            align="center"></el-table-column>
          <el-table-column prop="paidAmount" label="实付金额" width="70px" align="center"></el-table-column>
          <el-table-column prop="orderStatusLabel" label="订单状态" align="center"
            width="80px"></el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" align="center" width="80px"
            :formatter="formatPaymentMethod"></el-table-column>
          <el-table-column prop="userName" label="下单人" align="center" width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.userName || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userLoginName" label="下单账号" align="center"
            width="120px"></el-table-column>
          <el-table-column prop="userName" label="收货地址" :formatter="formatReceiveAddress"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdTime" label="下单时间" align="center"
            width="150px"></el-table-column>
          <el-table-column prop="" label="操作" align="center" width="120px" fixed="right">
            <template slot-scope="scope">
              <el-button type="default" icon="el-icon-document" size="mini"
                @click="forward2DetailsPage(scope.row, 1)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background v-show="totalCount > 10" @size-change="changeSize"
          @current-change="changePage" :page-size="pageSize"
          layout="total, slot, jumper, prev, pager, next" :total="totalCount">
        </el-pagination>
      </el-tab-pane>

      
      <!-- 会员订单 -->
      <el-tab-pane label="会员订单" name="2">
        <el-row class="mb-2">
          <el-form :inline="true">
            <el-form-item label="">
              <el-input v-model="vipSearchParams.orderId" placeholder="请输入订单编号..." clearable
                size="mini"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="vipSearchParams.userPhone" placeholder="请输入会员账号..." clearable
                size="mini"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="vipSearchParams.orderStatus" size="mini" clearable collapse-tags
                filterable style="width:100%" placeholder="请选择订单状态...">
                <el-option v-for="item in vipOrderStatusOptions" :key="item.code" :label="item.name"
                  :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="loadVipData"
                size="mini">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-table class="custom-table" :data="vipDataList"
          :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading">
          <div slot="empty" class="empty-wrap">
            <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
          </div>
          <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" width="200px" show-overflow-tooltip  align="center"></el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" width="70px" show-overflow-tooltip
            align="center"></el-table-column>
          <el-table-column prop="payAmount" label="应付金额" width="70px"
            align="center"></el-table-column>
          <el-table-column prop="paymentAmount" label="实付金额" width="70px" align="center"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" align="center"
            width="80px" :formatter="formatOrderStatusLabel"></el-table-column>
          <el-table-column prop="paymentMethod" label="支付方式" align="center" width="80px"
            :formatter="formatPaymentMethod"></el-table-column>
          <el-table-column prop="crterName" label="下单人" align="center" width="100px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.crterName || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updterName" label="下单账号" align="center"
            width="120px"></el-table-column>
          <el-table-column prop="orderTime" label="下单时间" align="center"
            ></el-table-column>
          <el-table-column prop="" label="操作" align="center" width="120px" fixed="right">
            <template slot-scope="scope">
              <el-button type="default" icon="el-icon-document" size="mini"
                @click="forward2DetailsPage(scope.row, 2)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background v-show="vipTotalCount > 10" @size-change="changeVipSize"
          @current-change="changeVipPage" :page-size="vipPageSize"
          layout="total, slot, jumper, prev, pager, next" :total="vipTotalCount">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetch, post } from '@/utils/http-client'
import { post as nepspPost } from '@/utils/http-nepsp'
import { deepClone } from '@/utils/index'
export default {
  name: '',
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      vipPageNo: 1,
      vipPageSize: 15,
      dataList: [],
      vipDataList: [],
      totalCount: 0,
      vipTotalCount: 0,
      loading: false,
      vipLoading: false,
      // 交易订单状态
      orderStatusOptions: [{ name: '待支付', code: '10' }, { name: '待发货', code: '20' }, { name: '待收货', code: '30' }, { name: '待评价', code: '50' }, { name: '交易完成', code: '40' }, { name: '已取消', code: '90' }],
      // 会员订单状态 TODO 
      vipOrderStatusOptions: [{ name: '已完成', code: '3' }, { name: '待支付', code: '1' }, { name: '已关闭', code: '4' }, { name: '已退款', code: '6' }],
      // 列表中的字典用到
      vipOrderStatusOptionsCopy: [
        { name: '未支付', code: '1' },
        { name: '已支付', code: '2' },
        { name: '已完成', code: '3' },
        { name: '关闭订单', code: '4' },
        { name: '部分退款', code: '5' },
        { name: '已退款', code: '6' },
        { name: '退款中', code: '7' },
      ],
      orderTypeOptions: [{ name: '商品购买', code: '商品购买' }, { name: '积分兑换', code: '积分兑换' }],
      searchParams: {},
      vipSearchParams: {
        orderSource: 6,
        // orderId: '202403049510001925', // 测试数据
        orderId: '',
        userPhone: '',
        orderStatus: '',
      },
      dialogList: [],
      showDialog: false,
      activeType: '1',
      disabled: false,
    }
  },
  async mounted() {
    this.loadData()
    this.loadVipData()
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.activeType)
      // this.dataList = []
      // this.pageNo = 1
      // this.searchParams = {}
      // this.searchParams.queryType = this.activeType
      // this.loadData();
    },
    formatPaymentMethod: function (row, column) {
      return row.paymentMethod === 'alipayMobile' ? '支付宝' : row.paymentMethod === 'wechatMobile' ? '微信支付' : row.paymentMethod === 'cash_pay' ? '余额支付' : '--'
    },
    formatReceiveAddress: function (row, column) {
      return row.receiveCityName + row.receiveAreaName + row.receiveAddress
    },
    formatOrderStatusLabel (row, column) {
      const res = this.vipOrderStatusOptionsCopy.find(item => item.code == row.orderStatus)
      return res ? res.name : '--'
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
    async loadData() {
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: deepClone(this.searchParams)
      }
      params.queryObject.sceneType = params.queryObject.sceneType || undefined
      const result = await post('/order/listByPageNo', params)
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          //this.pageSize = result.data.limit;
        })
      } else {
        this.$message.error(result.msg)
      }
      this.loading = false
    },

    changeVipPage(pageNo) {
      this.vipPageNo = pageNo
      this.loadVipData()
    },
    changeVipSize(pageSize) {
      this.pageSize = pageSize
      this.vipPageNo = 1
      this.loadVipData()
    },
    async loadVipData() {
      this.vipLoading = true
      const params = {
        pageNum: this.vipPageNo,
        pageSize: this.pageSize,
        ...this.vipSearchParams
      }
      params.orderId = params.orderId ? params.orderId : undefined
      params.userPhone = params.userPhone ? params.userPhone : undefined
      params.orderStatus = params.orderStatus ? params.orderStatus : undefined
      const result = await nepspPost('/offlineshopping/order/findOrderPage', {data: params})
      if (result.code == 0) {
        this.$nextTick(() => {
          this.vipDataList = result.data.list
          this.vipTotalCount = result.data.total * 1
          //this.pageSize = result.data.limit;
        })
      } else {
        this.$message.error(result.msg)
      }
      this.vipLoading = false
    },
    forward2DetailsPage(row, type) {
      // 交易订单
      if (type == 1) {
        this.$router.push({ name: 'Order-Detail', params: { orderCode: row.orderId } })
        // 会员订单
      } else if (type == 2) {
        this.$router.push({ name: 'Order-Vip-Detail', params: { orderCode: row.orderId } })
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
