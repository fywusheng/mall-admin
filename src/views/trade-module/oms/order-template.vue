<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="订单详情"></el-page-header>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <el-divider content-position="left">&nbsp;订单状态</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <el-row style="height:80px" align="middle">
      <el-col :span="24">
        <el-steps v-if="orderStatus!=90" :space="350" :active="orderState" process-status="success"
          finish-status="finish" align-center style="justify-content: center">
          <el-step title="已创建/待支付"></el-step>
          <el-step title="已支付/待发货"></el-step>
          <el-step title="已发货/待收货"></el-step>
          <el-step title="已收货/待评价"></el-step>
          <el-step title="交易完成"></el-step>
        </el-steps>
        <el-steps v-if="orderStatus==90&&paymentState==0" :space="280" :active="orderState"
          process-status="success" finish-status="finish" align-center
          style="justify-content: center">
          <el-step title="已创建/待支付"></el-step>
          <el-step status="error" title="已取消"></el-step>
          <el-step title="已支付/待发货"></el-step>
          <el-step title="已发货/待收货"></el-step>
          <el-step title="已收货/待评价"></el-step>
          <el-step title="交易完成"></el-step>
        </el-steps>
        <el-steps v-if="orderStatus==90&&paymentState==1" :space="280" :active="orderState"
          process-status="success" finish-status="finish" align-center
          style="justify-content: center">
          <el-step title="已创建/待支付"></el-step>
          <el-step title="已支付/待发货"></el-step>
          <el-step status="error" title="已撤单"></el-step>
          <el-step title="已发货/待收货"></el-step>
          <el-step title="已收货/待评价"></el-step>
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
        <td width="20%" class="td-colspan-value">{{orderCode}}</td>
        <td width="10%" class="td-colspan-label">订单ID：</td>
        <td width="20%" class="td-colspan-value">{{id}}</td>
        <td width="10%" class="td-colspan-label">父订单号：</td>
        <td width="25%" class="td-colspan-value">{{parentOrderCode}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">订单金额：</td>
        <td width="20%" class="td-colspan-value">{{orderAmount}}</td>
        <td width="10%" class="td-colspan-label">应付金额：</td>
        <td width="20%" class="td-colspan-value">{{payableAmount}}</td>
        <td width="10%" class="td-colspan-label">实付金额：</td>
        <td width="25%" class="td-colspan-value">{{paidAmount}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">下单人：</td>
        <td width="20%" class="td-colspan-value">{{userName}}</td>
        <td width="10%" class="td-colspan-label">手机号码：</td>
        <td width="20%" class="td-colspan-value">{{loginName}}</td>
        <td width="10%" class="td-colspan-label">创建时间：</td>
        <td width="25%" class="td-colspan-value">{{createdTime}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">当前状态：</td>
        <td width="20%" class="td-colspan-value">{{orderStatusLabel}}</td>
        <!-- 订单类型包括【商品购买和积分兑换】两种。并且只有交易订单显示-->
        <td width="10%" class="td-colspan-label">订单类型：</td>
        <td width="20%" class="td-colspan-value">{{sceneType}}</td>
        <!-- <td width="10%" class="td-colspan-label">创建时间：</td>
        <td width="25%" class="td-colspan-value">{{createdTime}}</td> -->
      </tr>
    </table>
    <el-divider content-position="left">&nbsp;订单明细</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <div style="width: 100%; overflow: hidden">
      <!-- 交易订单 -->
      <table width="100%">
        <tr style="height:40px">
          <td width="8%"></td>
          <td>
            <el-table class="custom-table" :data="dataList"
              :header-cell-style="{background:'#F9F9F9',color:'#000000'}" size="mini"
              v-loading="loading" style="width:63%">
              <div slot="empty" class="empty-wrap">
                <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
              </div>
              <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
              <el-table-column label="LOGO" width="60px">
                <template slot-scope="scope">
                  <img :src="scope.row.imgUrl" width="30px" height="30px" />
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="商品名称"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="skuId" label="SKU ID" width="150px"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="skuNo" label="SKU 编码" width="150px"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="skuName" label="SKU规格" width="100px"></el-table-column>
              <el-table-column prop="productId" label="商品ID" width="150px"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="productNo" label="商品编码" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="brandName" label="商品品牌" width="150px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sellingPrice" label="单价" width="80px" align="center"></el-table-column>
              <el-table-column prop="skuQuantity" label="购买数量" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="unitPrice" label="商品金额" width="80px" show-overflow-tooltip></el-table-column>
              <!-- 2.7、积分抵扣：若该商品支持积分抵扣，则【会员优惠】字段为【——】，反之亦然，同一个商品不可会员优惠和积分兑换同时存在； -->
              <el-table-column prop="memberDiscountAmount" label="会员优惠" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="discountAmount" label="优惠券" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="totalDiscountAmount" label="总优惠" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="totalAmount" label="实付金额" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="discountScore" label="积分抵扣" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="returnsPrice" label="退款金额" width="80px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="skuQuantity" label="购买数量" width="80px" align="center"></el-table-column>
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
        <td width="20%" class="td-colspan-value">{{receiveName}}</td>
        <td width="10%" class="td-colspan-label">联系电话：</td>
        <td width="20%" class="td-colspan-value">{{receivePhone}}</td>
        <td width="10%" class="td-colspan-label">收货地址：</td>
        <td width="25%" class="td-colspan-value">{{receiveAddress}}</td>
      </tr>
    </table>

    <div v-for="item in orderExpressList" :key="item.id">
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

    </div>

    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <el-divider content-position="left">&nbsp;支付信息</el-divider>
    <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <!-- 后端说了原来就这样，如果显示的话往后排。 -->
        <td width="10%" class="td-colspan-label">支付方式：</td>
        <!-- <td width="20%" class="td-colspan-value">{{paymentMethod}}</td> -->
        <td width="20%" class="td-colspan-value">微信支付</td>
        <td width="10%" class="td-colspan-label">支付时间：</td>
        <td width="20%" class="td-colspan-value">{{paymentTime}}</td>
        <td width="10%" class="td-colspan-label">支付状态：</td>
        <td width="25%" class="td-colspan-value">{{paymentState == 0 ? '待支付' : paymentState == 1 ? '已支付' : ''}}</td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="10%" class="td-colspan-label">支付单号：</td>
        <td width="20%" class="td-colspan-value">{{payOrderId}}</td>
        <td width="10%" class="td-colspan-label">实付金额：</td>
        <td width="20%" class="td-colspan-value">{{paidAmount}}</td>
        <td width="10%" class="td-colspan-label">获得积分：</td>
        <td width="25%" class="td-colspan-value">{{points}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { fetch, post } from "@/utils/http-client";
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
      const result = await fetch('/order/getByOrderCode', { orderCode: orderCode });
      if (result.code == 200) {
        this.id = result.data.id,
          this.orderCode = result.data.orderId,
          this.parentOrderCode = result.data.parentOrderId,
          this.orderAmount = result.data.orderAmount,
          this.payableAmount = result.data.payableAmount,
          this.paidAmount = result.data.paidAmount,
          this.userId = result.data.userId,
          this.loginName = result.data.userLoginName,
          this.userName = result.data.userName
          this.mobile = '--',
          this.createdTime = result.data.createdTime,
          this.receiveName = result.data.receiveName,
          this.payOrderId = result.data.orderId?.replace('CO', '')
          this.receivePhone = result.data.receivePhone,
          this.orderStatusLabel = result.data.orderStatusLabel,
          this.sceneType = result.data.sceneType,
          this.receiveAddress = result.data.receiveProvinceName + result.data.receiveCityName + result.data.receiveAreaName + result.data.receiveAddress,
          this.paymentMethod = this.formatPaymentMethod(result.data.paymentMethod),
          this.paymentTime = result.data.paymentTime,
          this.paymentState = result.data.paymentState,
          this.points = result.data.points,
          this.orderStatus = result.data.orderStatus,
          this.orderExpressList = result.data.orderExpressList || []
        if (this.orderStatus === 90) {
          if (this.paymentState === 1) {
            this.orderState = 2
          }
          else {
            this.orderState = 1
          }
        }
        else {
          this.orderState = this.orderStatus === 10 ? 0 : this.orderStatus === 20 ? 1 : this.orderStatus === 30 ? 2 : this.orderStatus === 40 ? 3 : 4
        }
        if (result.data.storeOrderItems) {
          for (let store of result.data.storeOrderItems) {
            this.dataList = this.dataList.concat(store.items)
          }
        }
      }
      else {
        this.$message.error(result.msg);
      }
    },

    formatPaymentMethod: function (paymentMethod) {
      return paymentMethod === 'alipayMobile' ? '支付宝' : paymentMethod === 'wechatMobile' ? '微信支付' : paymentMethod === 'cash_pay' ? '余额支付' : '--'
      // return "微信支付"
    },
  },

  data() {
    return {
      loading: false,
      id: "",
      orderCode: "",
      parentOrderCode: "",
      orderAmount: "--",
      payableAmount: "--",
      paidAmount: "--",
      userId: "",
      loginName: '',
      mobile: "",
      createdTime: "",
      receiveName: '',
      receivePhone: '',
      receiveAddress: '',
      dataList: [],
      orderStatusLabel: '',
      sceneType: '',
      paymentMethod: '',
      paymentTime: '',
      paymentState: '',
      paymentNo: '',
      points: '0',
      orderStatus: 10,
      orderState: 0,
      orderExpressList: [],
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
