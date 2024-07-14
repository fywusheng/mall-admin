<template>
  <div class="panel">
    <div class="panel-header">
      <img class="arrow" :src="require('@/assets/imgs/large-panel-top-arrow.png')" alt="" srcset="" />
      <div class="panel-header-title">加盟商数据</div>
    </div>
    <div class="count-wrapper">
      <div class="count-item">
        <div class="counter">{{ informationCount }}</div>
        <div class="name">总加盟商(个)</div>
      </div>
      <div class="count-item">
        <div class="counter center">{{ initialFee }}</div>
        <div class="name">总加盟费(万元)</div>
      </div>
      <div class="count-item">
        <div class="counter right">{{ informationAmount }}</div>
        <div class="name">总销售额(万元)</div>
      </div>
    </div>
    <div class="table-wrapper" id="chart1"></div>
  </div>
</template>

<script>
//引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/line");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/dataZoomInside");
require("../theme/chalk");
import lodash from "lodash";
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
      }, 200);
    },
  },
  mounted() {
    this.desenType = JSON.parse(window.localStorage.getItem("desenType"));
    window.addEventListener("resize", this.onresize);
  },
  data() {
    return {
      desenType: true, // 脱敏模式
    };
  },
  computed: {
    informationCount() {
      if (this.list.length > 0) {
        return this.sumArray(this.list, "informationCount");
      }
      return 0;
    },
    informationAmount() {
      if (this.list.length > 0) {
        if (!this.desenType) {
          return this.formatNumber(this.sumArray(this.list, "informationAmount"));
        } else {
          return "****";
        }
      }
      return 0;
    },
    initialFee() {
      if (this.list.length > 0) {
        return this.formatNumber(this.sumArray(this.list, "initialFee"));
      }
      return 0;
    },
  },
  methods: {
    initEchart() {
      // 基于准备好的dom，初始化echarts图表
      var myChart = echarts.init(document.getElementById("chart1"), "chalk");
      this.myChart = myChart;
      myChart.darkMode = true;
      var option;
      var _this = this;

      option = {
        title: {
          text: " ",
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          formatter: function (params) {
            let html = params[0].name;
            params.forEach((item, index) => {
              if (index === 0) {
                html = html + "<br/>总加盟商: " + item.data + "个";
              }
              if (index === 1) {
                if (!_this.desenType) {
                  html = html + "<br/>总销售额: " + _this.formatNumber(item.data) + "万元";
                } else {
                  html = html + "<br/>总销售额: " + "****万元";
                }
              }
              if (index === 2) {
                html = html + "<br/>总加盟费: " + _this.formatNumber(item.data) + "万元";
              }
            });
            return `${html}`;
          },
          // show: false,
        },
        legend: {
          show: false,
          // data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
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
          data: [],
          axisLabel: {
            interval: 0, // 显示所有标签
          },
        },
        // 启用dataZoom组件，用于区域缩放
        dataZoom: [
          {
            type: "inside", // 使用滑动条形式的dataZoom
            start: 0, // 左侧在数据窗口范围的起始百分比, 0 表示从头开始
            end: 30, // 右侧在数据窗口范围的结束百分比, 100 表示到尾部结束
            xAxisIndex: [0],
          },
        ],
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
            areaStyle: {},
          },
          {
            data: [],
            type: "line",
            areaStyle: {},
          },
          {
            data: [],
            type: "bar",
          },
        ],
      };
      this.list.forEach((item) => {
        option.xAxis.data.push(item.cityName);
      });

      option.series[0].data = this.getSeriesData(this.list, "informationCount");
      option.series[1].data = this.getSeriesData(this.list, "informationAmount");
      option.series[2].data = this.getSeriesData(this.list, "initialFee");

      console.log("加盟商option: ", option);

      // 为echarts对象加载数据
      myChart.setOption(option);
    },
    // 元转换成万元保留两位小数点
    formatNumber(num) {
      num = Number(num);
      if (num == 0) {
        return num + "";
      } else {
        if ((num / 10000).toFixed(2) == 0) {
          //小于100的保留2位
          return (num / 100).toFixed(4);
        } else {
          // parseFloat() 去掉后面不用的0，如50.00
          //大于100的保留2位
          return parseFloat((num / 10000).toFixed(2));
        }
      }
    },
    getSeriesData(list, name) {
      const DataList = lodash.cloneDeep(list);
      const sortList = DataList.sort((a, b) => a.informationCount > b.informationCount);
      const data = [];
      sortList.forEach((item) => {
        data.push(item[name]);
      });
      return data;
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
