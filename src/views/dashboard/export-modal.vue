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
            v-model="value1"
            type="date"
            style="width: 150px"
            placeholder="开始日期">
          </el-date-picker>
          <span class="line"> - </span>
          <el-date-picker
            v-model="value1"
            type="date"
            style="width: 150px"
            placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="btns">
          <el-button>导出已完成订单列表</el-button>
          <el-button>导出已退款订单列表</el-button>
          <br/>
          <el-button>导出已完成订单明细</el-button>
          <el-button>导出已退款订单明细</el-button>
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
          <el-radio-group v-model="radio">
            <el-radio :label="1">按天导出</el-radio>
            <el-radio :label="2">按周导出</el-radio>
            <el-radio :label="3">按月导出</el-radio>
          </el-radio-group>
        </div>
        <div class="time">
          <span class="_label">统计时间</span>
          <el-date-picker
            v-model="value1"
            type="year"
            style="width: 150px"
            placeholder="选择年份">
          </el-date-picker>
          <span class="line"> - </span>
          <el-date-picker
            v-model="value1"
            type="month"
            style="width: 150px"
            placeholder="选择月份">
          </el-date-picker>
        </div>
        <div class="btns center">
          <el-button>导出</el-button>
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
          <el-radio-group v-model="radio">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">商品购买</el-radio>
            <el-radio :label="3">积分兑换</el-radio>
          </el-radio-group>
        </div>
        <div class="time">
          <span class="_label">对账时间</span>
          <el-date-picker
            v-model="value1"
            type="year"
            style="width: 150px"
            placeholder="选择年份">
          </el-date-picker>
          <span class="line"> - </span>
          <el-date-picker
            v-model="value1"
            type="month"
            style="width: 150px"
            placeholder="选择月份">
          </el-date-picker>
        </div>
        <div class="btns center">
          <el-button>导出</el-button>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        value1: '',
        radio: 1
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

