<template>
  <div class="big-data">
    <i @click="enterScreenfull" title="切换全屏" class="el-icon-full-screen"></i>
    <div class="time">{{ time }}</div>
    <div class="header">
      <h2>松辉云康数据大屏</h2>
    </div>
    <div class="count-wrapper">
      <div class="count">销售总额：{{ saleTotalCount }}万元</div>
      <div class="count">用户总数：{{ userTotalCount }}万人</div>
      <div class="count">门店总数：{{ storeTotalCount }}</div>
      <div class="count">加盟商总数：{{ supplyTotalCount }}</div>
    </div>
    <div id="main"></div>
    <div id="footer" class="footer">
      <div class="table-wrapper">
        <div class="title">用户数据</div>
        <div class="table">
          <el-table v-loading="loading" :data="userList" show-summary stripe height="290" @load="handleLoad" style="width: 100%" ref="table1">
            <el-table-column prop="cityName" label="城市" />
            <el-table-column prop="userCount" label="注册用户数" />
            <el-table-column prop="orderUserCount" label="交易用户数" />
            <el-table-column prop="activeCount" label="活跃用户数" />
          </el-table>
        </div>
      </div>
      <div class="table-wrapper">
        <div class="title">门店数据</div>
        <div class="table">
          <el-table v-loading="loading" ref="table2" height="290" :data="userList" show-summary stripe style="width: 100%">
            <el-table-column prop="cityName" label="城市" />
            <el-table-column prop="storeCount" label="已有门店数" />
            <el-table-column prop="storeAmount" label="门店销售额" />
            <el-table-column prop="renewalCount" label="待续签门店数" />
          </el-table>
        </div>
      </div>
      <div class="table-wrapper">
        <div class="title">加盟商数据</div>
        <div class="table">
          <el-table v-loading="loading" ref="table3" height="290" :data="userList" show-summary stripe style="width: 100%">
            <el-table-column prop="cityName" label="城市" />
            <el-table-column prop="informationCount" label="已有加盟商数" />
            <el-table-column prop="informationAmount" label="加盟商销售额" />
            <el-table-column prop="initialFee" label="加盟费总额" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/plugin/chart/echarts-all.js";
import dayjs from "dayjs";
import screenfull from "screenfull";
import lodash from "lodash";
import { post } from "@/utils/http-client";
export default {
  name: "BigData",
  data() {
    return {
      time: "",
      area: "天津",
      loading: true,
      saleTotalCount: "", //销售总额
      userTotalCount: "", //用户总数
      storeTotalCount: "", //门店总数
      supplyTotalCount: "", //销售总额
      userList: [],
    };
  },
  mounted() {
    this.updateTime();
    this.onresize = lodash.debounce(this.onresize, 700);
    window.onresize = this.onresize;
    setTimeout(() => {
      this.setEcahrtsHeight();
      this.initChart();
    }, 200);
    this.indexOrderCount();
  },
  methods: {
    async indexOrderCount() {
      this.loading = true;
      let params = {
        area: this.area,
      };
      const res = await post("/srm/sh/stores/getIndexDataCountByArea", params);
      this.loading = false;
      if (res.code == "200") {
        this.userList = res.data.results || [];
        // 总数
        this.saleTotalCount = res.data.totalAmount;
        this.userTotalCount = res.data.totalUserCount;
        this.storeTotalCount = res.data.totalStoreNum;
        this.supplyTotalCount = res.data.totalInformationNun;

        this.$nextTick(() => {
          this.$refs.table1.doLayout();
          this.$refs.table2.doLayout();
          this.$refs.table3.doLayout();
        });
      } else {
        this.$message.warning(res.msg);
      }
    },
    onresize() {
      console.log("抖动");
      this.setEcahrtsHeight();
      setTimeout(() => {
        this.myChart.resize();
      }, 100);
    },

    initChart() {
      // 基于准备好的dom，初始化echarts图表
      console.log(echarts);
      var myChart = echarts.init(document.getElementById("main"));

      var option = {
        title: {
          text: "",
          subtext: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: function (data) {
            return data.name;
          },
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: [""],
        },
        dataRange: {
          show: false,
          min: 0,
          max: 2500,
          x: "left",
          y: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
        },
        toolbox: {
          show: false,
          orient: "vertical",
          x: "right",
          y: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        roamController: {
          show: false,
          x: "right",
          mapTypeControl: {
            china: true,
          },
        },
        series: [
          {
            name: "",
            type: "map",
            mapType: "china",
            selectedMode: "single",
            roam: false,
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } },
            },
            data: [
              { name: "北京", value: Math.round(Math.random() * 1000) },
              {
                name: "天津",
                value: Math.round(Math.random() * 1000),
                selected: true,
              },
              { name: "上海", value: Math.round(Math.random() * 1000) },
              { name: "重庆", value: Math.round(Math.random() * 1000) },
              { name: "河北", value: Math.round(Math.random() * 1000) },
              { name: "河南", value: Math.round(Math.random() * 1000) },
              { name: "云南", value: Math.round(Math.random() * 1000) },
              { name: "辽宁", value: Math.round(Math.random() * 1000) },
              { name: "黑龙江", value: Math.round(Math.random() * 1000) },
              { name: "湖南", value: Math.round(Math.random() * 1000) },
              { name: "安徽", value: Math.round(Math.random() * 1000) },
              { name: "山东", value: Math.round(Math.random() * 1000) },
              { name: "新疆", value: Math.round(Math.random() * 1000) },
              { name: "江苏", value: Math.round(Math.random() * 1000) },
              { name: "浙江", value: Math.round(Math.random() * 1000) },
              { name: "江西", value: Math.round(Math.random() * 1000) },
              { name: "湖北", value: Math.round(Math.random() * 1000) },
              { name: "广西", value: Math.round(Math.random() * 1000) },
              { name: "甘肃", value: Math.round(Math.random() * 1000) },
              { name: "山西", value: Math.round(Math.random() * 1000) },
              { name: "内蒙古", value: Math.round(Math.random() * 1000) },
              { name: "陕西", value: Math.round(Math.random() * 1000) },
              { name: "吉林", value: Math.round(Math.random() * 1000) },
              { name: "福建", value: Math.round(Math.random() * 1000) },
              { name: "贵州", value: Math.round(Math.random() * 1000) },
              { name: "广东", value: Math.round(Math.random() * 1000) },
              { name: "青海", value: Math.round(Math.random() * 1000) },
              { name: "西藏", value: Math.round(Math.random() * 1000) },
              { name: "四川", value: Math.round(Math.random() * 1000) },
              { name: "宁夏", value: Math.round(Math.random() * 1000) },
              { name: "海南", value: Math.round(Math.random() * 1000) },
              { name: "台湾", value: Math.round(Math.random() * 1000) },
              { name: "香港", value: Math.round(Math.random() * 1000) },
              { name: "澳门", value: Math.round(Math.random() * 1000) },
            ],
          },
        ],
      };

      // 为echarts对象加载数据
      myChart.setOption(option);
      const _this = this;
      myChart.on(echarts.config.EVENT.MAP_SELECTED, function (param) {
        // var selected = param.selected;
        // var str = "当前选择： ";
        // for (var p in selected) {
        //   if (selected[p]) {
        //     str += p + " ";
        //   }
        // }
        console.log("123123", param.target);
        _this.area = param.target;
        _this.indexOrderCount();
      });
      this.myChart = myChart;
    },
    setEcahrtsHeight() {
      const chartEle = document.getElementById("main");
      chartEle.style.display = "none";
      var element = document.getElementById("footer");
      var rect = element.getBoundingClientRect();
      var position = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        right: rect.right + window.scrollX,
        width: rect.width,
        height: rect.height,
      };
      const height = document.documentElement.clientHeight;
      // console.log(position);
      let mainHeight = height - position.bottom;
      mainHeight = mainHeight < 351 ? 351 : mainHeight;
      chartEle.style.display = "block";
      chartEle.style.height = mainHeight + "px";
    },
    enterScreenfull() {
      screenfull.toggle();
    },
    handleLoad(event) {
      console.log("数据加载完成", event);
      // 在这里执行加载数据的逻辑
      // 例如从API获取数据并更新this.tableData
    },
    updateTime() {
      this.time = this.getNowTime();
      this.timer = setTimeout(() => {
        this.time = this.getNowTime();
        this.updateTime();
      }, 1000);
    },
    getNowTime() {
      const weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      var timetap = dayjs().format(`YYYY-MM-DD HH:mm:ss`);
      var timedata = new Date();
      var week = weekArr[timedata.getDay()];
      return timetap + " " + week;
    },
  },
  beforeDestroy() {
    window.onresize = null;
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.big-data {
  font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC", sans-serif;
  height: 100vh;
  overflow: scroll;
  padding-top: 20px;
  position: relative;
  .el-icon-full-screen {
    cursor: pointer;
    font-size: 24px;
    position: absolute;
    top: 45px;
    right: 48px;
    &:hover {
      color: #2c12bf;
    }
  }
  .time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 16px;
    height: 25px;
    position: absolute;
    top: 45px;
    right: 90px;
  }
  .header {
    h2 {
      font-weight: 650;
      font-style: normal;
      font-size: 48px;
      text-align: center;
      // margin-top: 40px;
    }
    .time {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 16px;
      margin-right: 10%;
      height: 25px;
    }
  }
  .count-wrapper {
    margin-top: 14px;
    font-size: 24px;
    font-weight: 650;
    font-style: normal;
    display: flex;
    justify-content: space-between;
    padding: 0 13%;
  }
  .footer {
    display: flex;
    justify-content: space-evenly;
    // padding: 0 16%;
    height: 380px;
    .table-wrapper {
      width: 29%;
      .title {
        font-size: 24px;
        margin: 16px 0;
      }
      .table {
        ::v-deep .el-table__header-wrapper {
          table thead tr th.el-table__cell {
            background-color: #ebedf0 !important;
            height: 56px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #323233;
          }
        }
        ::v-deep .el-table__body-wrapper {
          table tbody tr td {
            // height: 80px;
            font-size: 12px !important;
            &:nth-child(1) {
              color: #ff5500 !important;
            }
          }
        }
        ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
          background: #fffaf7;
          font-size: 14px;
          font-weight: 400;
          color: #323233;
        }
      }
    }
  }
}
</style>
