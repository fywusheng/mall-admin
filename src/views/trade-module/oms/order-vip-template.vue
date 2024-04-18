<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="订单详情"></el-page-header>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <el-divider content-position="left">&nbsp;订单状态</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <!-- 会员订单 状态 -->
    <el-row style="height:80px" align="middle">
      <el-col :span="24">
        <el-steps v-if="orderStatus == 1 || orderStatus == 2 || orderStatus == 3" :space="350" :active="orderState" process-status="success"
          finish-status="finish" align-center style="justify-content: center">
          <el-step title="已创建/待支付"></el-step>
          <el-step title="已取消"></el-step>
          <el-step title="已关闭"></el-step>
          <el-step title="交易完成"></el-step>
        </el-steps>
        <el-steps v-if="orderStatus != 1 && orderStatus != 2 && orderStatus != 3 && orderStatus != 4" :space="280" :active="orderState"
          process-status="success" finish-status="finish" align-center
          style="justify-content: center">
          <el-step title="已创建/待支付"></el-step>
          <el-step status="error" title="已取消"></el-step>
          <el-step title="已关闭"></el-step>
          <el-step title="交易完成"></el-step>
        </el-steps>
        <el-steps v-if="orderStatus == 4" :space="280" :active="orderState"
          process-status="success" finish-status="finish" align-center
          style="justify-content: center">
          <el-step title="已创建/待支付"></el-step>
          <el-step title="已取消"></el-step>
          <el-step status="error" title="已关闭"></el-step>
          <el-step title="交易完成"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-divider content-position="left">&nbsp;基本信息</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">订单编号：</td>
        <td width="20%" class="td-colspan-value">{{orderId}}</td>
        <td width="10%" class="td-colspan-label">订单ID：</td>
        <td width="20%" class="td-colspan-value">--</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">订单金额：</td>
        <td width="20%" class="td-colspan-value">{{orderAmount}}</td>
        <td width="10%" class="td-colspan-label">应付金额：</td>
        <td width="20%" class="td-colspan-value">{{payAmount}}</td>
        <td width="10%" class="td-colspan-label">实付金额：</td>
        <td width="25%" class="td-colspan-value">{{paymentAmount}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">下单人：</td>
        <td width="20%" class="td-colspan-value">{{crterName}}</td>
        <td width="10%" class="td-colspan-label">手机号码：</td>
        <td width="20%" class="td-colspan-value">{{updterName}}</td>
        <td width="10%" class="td-colspan-label">创建时间：</td>
        <td width="25%" class="td-colspan-value">{{orderTime}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">当前状态：</td>
        <td width="20%" class="td-colspan-value">{{orderStatusLabel}}</td>
        <!-- <td width="10%" class="td-colspan-label">创建时间：</td>
        <td width="25%" class="td-colspan-value">{{orderTime}}</td> -->
      </tr>
    </table>
    <el-divider content-position="left">&nbsp;订单明细</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <div style="width: 100%; overflow: hidden">
      <!-- 会员订单 -->
      <table width="100%">
        <tr style="height:40px">
          <td width="8%"></td>
          <td>
            <el-table class="custom-table" :data="dataList"
              :header-cell-style="{background:'#F9F9F9',color:'#000000'}" size="mini"
              v-loading="loading" style="width:90%">
              <div slot="empty" class="empty-wrap">
                <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
              </div>
              <el-table-column prop="productName" label="商品名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="productId" label="商品ID" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="productId" label="商品编码" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="scopeOfApplication" label="卡类型" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="productPrice" label="价格" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="usageTime" label="开通时间" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="expirationTime" label="有效期至" width="150px" show-overflow-tooltip></el-table-column>
            </el-table>
          </td>
        </tr>
      </table>
    </div>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <el-divider content-position="left">&nbsp;收货信息</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">收货人姓名：</td>
        <td width="20%" class="td-colspan-value">{{crterName}}</td>
        <td width="10%" class="td-colspan-label">联系电话：</td>
        <td width="20%" class="td-colspan-value">{{updterName}}</td>
        <!-- 空标签，占位 -->
        <td width="10%" class="td-colspan-label"></td>
        <td width="20%" class="td-colspan-value"></td>
        <td width="5%"></td>
      </tr>
    </table>

    <!-- <div v-for="item in orderExpressList" :key="item.id">
      <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
      <el-divider content-position="left">&nbsp;发货信息</el-divider>
      <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
      <table width="100%">
        <tr style="height:40px">
          <td width="5%"></td>
          <td width="10%" class="td-colspan-label">运单号：</td>
          <td width="20%" class="td-colspan-value">{{item.trackingNumber}}</td>
          <td width="10%" class="td-colspan-label">快递公司：</td>
          <td width="20%" class="td-colspan-value">{{item.expressProviderName}}</td>
          <td width="10%" class="td-colspan-label">是否包邮：</td>
          <td width="25%" class="td-colspan-value">{{item.freightAmount>0?'不包邮':'包邮'}}</td>
        </tr>
        <tr style="height:40px">
          <td width="5%"></td>
          <td width="10%" class="td-colspan-label">发货时间：</td>
          <td width="20%" class="td-colspan-value">{{item.createdTime}}</td>
          <td width="10%" class="td-colspan-label">发货地址：</td>
          <td width="20%" class="td-colspan-value">{{item.expressCity}}</td>
          <td width="10%" class="td-colspan-label">发货备注：</td>
          <td width="25%" class="td-colspan-value">{{item.expressRemarks}}</td>
        </tr>
      </table>

    </div> -->

    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <el-divider content-position="left">&nbsp;支付信息</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">支付方式：</td>
        <!-- <td width="20%" class="td-colspan-value">{{paymentMethod}}</td> -->
        <td width="20%" class="td-colspan-value">微信支付</td>
        <td width="10%" class="td-colspan-label">支付时间：</td>
        <td width="20%" class="td-colspan-value">{{paymentTime}}</td>
        <td width="10%" class="td-colspan-label">支付状态：</td>
        <td width="25%" class="td-colspan-value">{{orderStatusLabel}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <!-- TODO -->
        <td width="10%" class="td-colspan-label">支付单号：</td>
        <!-- <td width="20%" class="td-colspan-value">{{receiveName}}</td> -->
        <td width="20%" class="td-colspan-value">{{paymentOrderNo}}</td>
        <td width="10%" class="td-colspan-label">实付金额：</td>
        <td width="20%" class="td-colspan-value">{{paymentAmount}}</td>
        <td width="10%" class="td-colspan-label">获得积分：</td>
        <td width="25%" class="td-colspan-value">--</td>
      </tr>
    </table>
  </div>
</template>

<script>
// import { fetch, post } from "@/utils/http-client";
import { post as nepspPost } from '@/utils/http-nepsp'
import template from '../../commodity-module/brand/template.vue';
// import template from '../../commodity-module/brand/template.vue';
export default {
  components: { template },
  // components: { template },
  
  async mounted() {
    this.$loading = true;
    this.loadOrderInfo(this.$route.params.orderCode);
    this.$loading = false;
  },

  methods: {
    back2Prev() {
      this.$router.back();
    },
    async loadOrderInfo(orderCode) {
      const result = await nepspPost('/offlineshopping/order/findOrderDetail', {data: { orderId: orderCode }});
      if (result.code == 0) {
        this.dtData = result.data

        this.id = result.data.id,
        this.orderId = result.data.orderId,
        this.paymentOrderNo = result.data.paymentOrderNo
        this.parentOrderCode = result.data.parentOrderId,
        this.orderAmount = result.data.orderAmount,
        this.payAmount = result.data.payAmount,
        this.paymentAmount = result.data.paymentAmount,
        this.userId = result.data.userId,
        this.crterName = result.data.crterName,
        this.updterName = result.data.updterName,
        this.orderTime = result.data.orderTime,
        // this.receiveName = result.data.receiveName,
        // this.receivePhone = result.data.receivePhone,
        this.orderStatusLabel = this.formatOrderStatusLabel(result.data.orderStatus),
        this.receiveAddress = result.data.receiveProvinceName + result.data.receiveCityName + result.data.receiveAreaName + result.data.receiveAddress,
        this.paymentMethod = this.formatPaymentMethod(result.data.paymentMethod),
        this.paymentTime = result.data.paymentTime,
        this.paymentState = result.data.paymentState,
        this.points = result.data.points,
        this.orderStatus = result.data.orderStatus,
        // this.orderStatus = '5'
        // this.orderExpressList = result.data.orderExpressList || []

        this.dataList = [result.data.detailDTO]
        // 订单状态 （1-未支付、2-已支付、3-已完成、4-关闭订单、5-部分退款、6-已退款、7-退款中）
        if (this.orderStatus == 1) {
          this.orderStatus = 1
        } else if (this.orderStatus == 2 || this.orderStatus == 3) {
          this.orderState = 4
        } else if (this.orderStatus == 4) {
          this.orderState = 3
        } else {
          this.orderState = 2
        }

        // if (this.orderStatus === 90) {
        //   if (this.paymentState === 1) {
        //     this.orderState = 2
        //   }
        //   else {
        //     this.orderState = 1
        //   }
        // }
        // else {
        //   this.orderState = this.orderStatus === 10 ? 0 : this.orderStatus === 20 ? 1 : this.orderStatus === 30 ? 2 : this.orderStatus === 40 ? 3 : 4
        // }
        // if (result.data.storeOrderItems) {
        //   for (let store of result.data.storeOrderItems) {
        //     this.dataList = this.dataList.concat(store.items)
        //   }
        // }
      }
      else {
        this.$message.error(result.msg);
      }
    },

    formatPaymentMethod: function (paymentMethod) {
      return paymentMethod === 'alipayMobile' ? '支付宝' : paymentMethod === 'wechatMobile' ? '微信支付' : paymentMethod === 'cash_pay' ? '余额支付' : '--'
    },

    formatOrderStatusLabel (val) {
      const res = this.vipOrderStatusOptionsCopy.find(item => item.code == val)
      return res ? res.name : '--'
    }
  },

  data() {
    return {
      loading: false,
      id: "",
      orderId: '',
      orderCode: "",
      paymentOrderNo: "",
      parentOrderCode: "",
      orderAmount: "--",
      payAmount: "--",
      paymentAmount: "--",
      userId: "",
      crterName: '--',
      updterName: "",
      orderTime: "",
      // receiveName: '',
      // receivePhone: '',
      receiveAddress: '',
      dataList: [],
      orderStatusLabel: '',
      paymentMethod: '',
      paymentTime: '',
      paymentState: '',
      paymentNo: '',
      points: '0',
      orderStatus: 10,
      orderState: 0,
      orderExpressList: [],
      vipOrderStatusOptionsCopy: [
        { name: '未支付', code: '1' },
        { name: '已支付', code: '2' },
        { name: '已完成', code: '3' },
        { name: '关闭订单', code: '4' },
        { name: '部分退款', code: '5' },
        { name: '已退款', code: '6' },
        { name: '退款中', code: '7' },
      ],
    };
  },
};
</script>
<style>
.div-layout {
  padding: 10px 20px;
}
.td-colspan-label {
  text-align: right;
  font-size: 12px;
}
.td-colspan-value {
  text-align: left;
  font-size: 12px;
  font-weight: 550;
}
</style>
