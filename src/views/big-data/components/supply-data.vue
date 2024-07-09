<template>
  <div class="panel">
    <div class="panel-header">
      <img class="arrow" :src="require('@/assets/imgs/large-panel-top-arrow.png')" alt="" srcset="" />
      <div class="panel-header-title">加盟商数据</div>
    </div>
    <div class="count-wrapper">
      <div class="count-item">
        <div class="counter">{{ totalUser }}</div>
        <div class="name">总加盟商(人)</div>
      </div>
      <div class="count-item">
        <div class="counter center">{{ saleUser }}</div>
        <div class="name">总加盟费(万元)</div>
      </div>
      <div class="count-item">
        <div class="counter right">{{ totalActiveUser }}</div>
        <div class="name">总销售额(万元)</div>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table :data="list" ref="table1">
        <el-table-column prop="cityName" align="center" label="城市" />
        <el-table-column prop="userCount" align="center" label="注册用户数" />
        <el-table-column prop="orderUserCount" align="center" label="交易用户数" />
        <el-table-column prop="activeCount" align="center" label="活跃用户数" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    totalUser() {
      if (this.list.length > 0) {
        return this.sumArray(this.list, "userCount");
      }
      return 0;
    },
    saleUser() {
      if (this.list.length > 0) {
        return this.sumArray(this.list, "orderUserCount");
      }
      return 0;
    },
    totalActiveUser() {
      if (this.list.length > 0) {
        return this.sumArray(this.list, "activeCount");
      }
      return 0;
    },
  },
  methods: {
    sumArray(arr, name) {
      let sum = 0;
      arr.forEach((value) => {
        sum += value[name];
      });
      return sum;
    },
  },
};
</script>
<style lang="scss">
.el-table .tr {
  color: #ffffff !important;
  background-color: #112654 !important;
}
</style>
<style lang="scss" scoped>
.panel {
  width: 461px;
  height: 27vh;
  background: linear-gradient(180deg, rgba(12, 37, 77, 0.4) 0%, rgba(12, 37, 77, 0.9) 100%);
  box-shadow: inset 0px 1px 40px 0px rgba(33, 117, 214, 0.4);
  border: 1px solid #416aae;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  .panel-header {
    background: url("../../../assets/imgs/large-panel-top-bg.png") no-repeat;
    background-size: 100% 100%;
    height: 50px;
    display: flex;
    align-items: center;
    .arrow {
      width: 12px;
      height: 41px;
      margin-left: 14px;
      margin-right: 10px;
    }
    .panel-header-title {
      font-family: "youshe";
      font-size: 24px;
      color: #ffffff;
      line-height: 31px;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      text-align: left;
      font-style: normal;
    }
  }
  .count-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    .count-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 17px;
      .counter {
        width: 120px;
        height: 39px;
        font-family: "youshe";
        font-size: 30px;
        color: #ffffff;
        line-height: 39px;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
        text-align: center;
        font-style: normal;
        color: #00ff6d;
        &.center {
          color: #ff9600;
        }
        &.right {
          color: #ff0000;
        }
      }
      .name {
        width: 94px;
        height: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        text-align: center;
        font-style: normal;
      }
    }
  }
  .table-wrapper {
    // height: 155px;
    flex: 1;
    overflow: hidden;
  }
  ::v-deep .el-table::before {
    height: 0;
  }
  ::v-deep .el-table th.el-table__cell {
    background-color: #173367;
  }
  ::v-deep .el-table {
    color: #ffffff !important;
    background-color: rgb(73, 126, 232, 0.1) !important;
    // opacity: 0.1;
    // height: 150px;
  }
  ::v-deep .el-table tr:hover {
    background-color: #112654 !important;
  }
  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    color: #ffffff !important;
    background-color: #112654 !important;
  }
  // ::v-deep .el-table tr {
  //   color: #ffffff !important;
  //   background-color: #112654 !important;
  // }

  ::v-deep .el-table tbody tr:nth-child(even) {
    background-color: #173367 !important;
  }
  ::v-deep .el-table tbody tr:nth-child(odd) {
    background-color: #112654 !important;
  }
  ::v-deep .el-table th.el-table__cell {
    padding: 2px 0;
  }
  ::v-deep .el-table .el-table__cell {
    padding: 2px 0;
  }
  ::v-deep .el-table__header-wrapper {
    table thead tr th.el-table__cell {
      height: unset;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
  ::v-deep .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: none;
  }
  ::v-deep .el-table__body-wrapper {
    table tbody tr td {
      font-size: 14px !important;
    }
  }
  ::v-deep .el-table td.el-table__cell {
    border-bottom: none;
  }
  ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
    background: #fffaf7;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
