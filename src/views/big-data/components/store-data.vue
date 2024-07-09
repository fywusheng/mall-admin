<template>
  <div class="panel">
    <div class="panel-header">
      <img class="arrow" :src="require('@/assets/imgs/large-panel-top-arrow.png')" alt="" srcset="" />
      <div class="panel-header-title">门店数据</div>
    </div>
    <div class="count-wrapper">
      <div class="count-item">
        <div class="counter">{{ totalUser }}</div>
        <div class="name">总门店数(人)</div>
      </div>
      <div class="count-item">
        <div class="counter center">{{ saleUser }}</div>
        <div class="name">总销售额(万元)</div>
      </div>
      <div class="count-item">
        <div class="counter right">{{ totalActiveUser }}</div>
        <div class="name">总待续签(万元)</div>
      </div>
    </div>
    <div class="table-wrapper" id="chart">
      <!-- <el-table :data="list" ref="table1">
        <el-table-column prop="cityName" align="center" label="城市" />
        <el-table-column prop="userCount" align="center" label="注册用户数" />
        <el-table-column prop="orderUserCount" align="center" label="交易用户数" />
        <el-table-column prop="activeCount" align="center" label="活跃用户数" />
      </el-table> -->
    </div>
  </div>
</template>

<script>
//引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/line");
// 引入深色主题
// require("echarts/theme/dark");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    list() {
      setTimeout(() => {
        this.initEchart();
      }, 1000);
    },
  },
  mounted() {
    window.addEventListener("resize", this.onresize);
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
    initEchart() {
      console.log(echarts, "1231232213-------");
      // 基于准备好的dom，初始化echarts图表
      const chartDom = document.getElementById("chart");
      // chartDom.style.height = "200px";
      var myChart = echarts.init(chartDom, "dark");
      this.myChart = myChart;
      myChart.darkMode = true;
      var option;

      option = {
        darkMode: true,
        title: {
          text: " ",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          show: false,
          data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
        },
        grid: {
          top: "15px",
          left: "50px",
          right: "15px",
          bottom: "30px",
          // containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          // {
          //   name: "Direct",
          //   type: "line",
          //   stack: "Total",
          //   data: [320, 332, 301, 334, 390, 330, 320],
          // },
          // {
          //   name: "Search Engine",
          //   type: "line",
          //   stack: "Total",
          //   data: [820, 932, 901, 934, 1290, 1330, 1320],
          // },
        ],
      };

      // 为echarts对象加载数据
      myChart.setOption(option);
    },
    onresize() {
      setTimeout(() => {
        this.myChart.resize();
      }, 100);
    },
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
    height: 200px;
    flex: 1;
    overflow: hidden;
  }
}
</style>
