<!--导出弹窗-->
<!-- TODO -->
<template>
  <el-dialog
    title=""
    top="70px"
    class="export-modal-wraper"
    :visible.sync="dialogVisible"
    @close="close"
    width="520px">
    <div class="export-item">
      <div class="_t">
        <div class="_title">订单报表导出</div>
        <div class="_line"></div>
      </div>
      <div class="_main">
        <div class="time">
          <span class="_label">下单时间</span>
          <el-date-picker
            v-model="orderParams.startTime"
            type="date"
            style="width: 150px"
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
          </el-date-picker>
          <span class="line"> - </span>
          <el-date-picker
            v-model="orderParams.endTime"
            type="date"
            style="width: 150px"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="btns">
          <el-button @click="exportOrderList(40)" :loading="orderLoading">导出已完成订单列表</el-button>
          <el-button @click="exportOrderList(100)" :loading="orderLoading">导出已退款订单列表</el-button>
          <br/>
          <el-button @click="exportOrderDetail(40)" :loading="detailLoading">导出已完成订单明细</el-button>
          <el-button @click="exportOrderDetail(100)" :loading="detailLoading">导出已退款订单明细</el-button>
        </div>
      </div>
    </div>
    <div class="export-item">
      <div class="_t">
        <div class="_title">销售报表导出</div>
        <div class="_line"></div>
      </div>
      <div class="_main">
        <div class="_select">
          <el-radio-group v-model="saleParams.exportTimeType">
            <el-radio :label="1">按天统计</el-radio>
            <el-radio :label="2">按周统计</el-radio>
            <el-radio :label="3">按月统计</el-radio>
          </el-radio-group>
        </div>
        <div class="time">
          <span class="_label">统计时间</span>
          <el-date-picker
            v-model="saleParams.year"
            type="year"
            value-format="yyyy"
            style="width: 150px"
            placeholder="选择年份">
          </el-date-picker>
          <span class="line"> - </span>
          <el-date-picker
            v-model="saleParams.month"
            type="month"
            style="width: 150px"
            value-format="MM"
            placeholder="选择月份">
          </el-date-picker>
        </div>
        <div class="btns center">
          <el-button @click="exportSaleList()" :loading="saleLoading">导出</el-button>
        </div>
      </div>
    </div>
    <div class="export-item">
      <div class="_t">
        <div class="_title">对账报表导出</div>
        <div class="_line"></div>
      </div>
      <div class="_main">
        <div class="_select">
          <el-radio-group v-model="accountParams.sceneType">
            <el-radio label="全部">全部</el-radio>
            <el-radio label="商品购买">商品购买</el-radio>
            <el-radio label="积分兑换">积分兑换</el-radio>
          </el-radio-group>
        </div>
        <div class="time">
          <span class="_label">对账时间</span>
          <el-date-picker
            v-model="accountParams.year"
            type="year"
            value-format="yyyy"
            style="width: 150px"
            placeholder="选择年份">
          </el-date-picker>
          <span class="line"> - </span>
          <el-date-picker
            v-model="accountParams.month"
            type="month"
            value-format="MM"
            style="width: 150px"
            placeholder="选择月份">
          </el-date-picker>
        </div>
        <div class="btns center">
          <el-button @click="exportAccountList()" :loading="accountLoading">导出</el-button>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    </span>
  </el-dialog>
</template>

<script>
  import { downloadByPost } from '@/utils/http-client'
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: true,
        orderLoading: false,
        detailLoading: false,
        saleLoading: false,
        accountLoading: false,
        // 订单导出参数
        orderParams: {
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          status: '', // 订单状态（已完成：40，已退款：100）
        },
        // 销售报表导出参数
        saleParams: {
          exportTimeType: '', // 统计时间类型 1:天，2:周，3:月
          year: '', // 年
          month: '', // 月
        },
        saleExportTypeDict: {1: '天', 2: '周', 3: '月'},
        // 对账导出参数
        accountParams: {
          sceneType: '', // 传汉字，全部不传值
          year: '', // 年
          month: '', // 月
        }
      };
    },
    watch: {
      value (nVal) {
        console.log(nVal)
        if (nVal) {
          this.dialogVisible = nVal
        }
      }
    },
    methods: {
      // 导出订单列表
      async exportOrderList (status) {
        if (!this.orderParams.startTime) return this.$message.warning('请选择下单开始日期')
        if (!this.orderParams.endTime) return this.$message.warning('请选择下单结束日期')
        const params = {...this.orderParams, status}
        const fileName = status == 40 ? '已完成订单列表' : '已退款订单列表'
        this.orderLoading = true
        await downloadByPost('/order/exportOrderInfo', fileName, params).then(res => {
          this.orderLoading = false
        })
      },
      // 订单详情导出
      async exportOrderDetail (status) {
        if (!this.orderParams.startTime) return this.$message.warning('请选择下单开始日期')
        if (!this.orderParams.endTime) return this.$message.warning('请选择下单结束日期')
        const params = {...this.orderParams, status}
        const fileName = (status == 40 ? '已完成订单' : '已退款订单') + `-下单时间-${params.startTime}-${params.endTime}`
        this.detailLoading = true
        await downloadByPost('/order/exportOrderDetail', fileName, params).then(res => {
          this.detailLoading = false
        })
      },
      // 销售报表导出
      async exportSaleList () {
        if (!this.saleParams.exportTimeType) return this.$message.warning('请选择统计类型')
        if (!this.saleParams.year) return this.$message.warning('请选择统计年份')
        if (!this.saleParams.month) return this.$message.warning('请选择统计月份')
        const params = {...this.saleParams}
        const fileName = `销售报表-按${this.saleExportTypeDict[params.exportTimeType]}统计-${params.year}-${params.month}`
        this.saleLoading = true
        await downloadByPost('/order/exportSaleExcel', fileName, params).then(res => {
          this.saleLoading = false
        })
      },
      // 对账报表导出
      async exportAccountList () {
        if (!this.accountParams.sceneType) return this.$message.warning('请选择对账类型')
        if (!this.accountParams.year) return this.$message.warning('请选择对账年份')
        if (!this.accountParams.month) return this.$message.warning('请选择对账月份')
        const params = {...this.accountParams}
        const fileName = `对账报表-${params.sceneType}-${params.year}-${params.month}`
        this.accountLoading = true
        await downloadByPost('/order/exportReconciliation', fileName, params).then(res => {
          this.accountLoading = false
        })
      },

      close () {
        this.$emit('input')
        this.$emit('close')
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.export-modal-wraper {
  ::v-deep .el-dialog__header {
    padding: 0;
    .el-dialog__headerbtn {
      position: absolute;
      top: -50px;
      right: -50px;
      padding: 10px;
      border: 1px solid #909399;
      border-radius: 20px;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0;
    background: #F7F8FA;
    .export-item {
      padding: 32px;
      margin-bottom: 16px;
      background: #ffffff;
      ._t {
        display: flex;
        ._line {
          height: 0.5px;
          border: 0.5px solid #e5e5e5;
          height: 0.5px;
          margin-top: 13px;
          margin-left: 15px;
          width: 90%;
        }
        ._title {
          // width: 10%;
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          flex-shrink: 0;
        }
      }
      ._main {
        .time {
          display: flex;
          margin-top: 25px;
          margin-bottom: 19px;
          ._label {
            width: 80px;
            height: 32px;
            background: #FFFFFF;
            border-radius: 2px;
            border: 1px solid #DCDEE0;
            line-height: 32px;
            text-align: center;
            font-size: 12px;
            color: #323233;
          }
          .el-date-editor {
            margin-left: 10px;
          }
          .line {
            margin-left: 10px;
            transform: translateY(4px);
          }
        }
        ._select {
          margin-top: 25px;
        }
        .btns {
          .el-button {
            margin-top: 13px;
          }
        }
        .center {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  ::v-deep .el-dialog__footer {
    padding: 0;
  }
}
</style>

