<template>
  <div class="big-data">
    <div @click="enterScreenfull" class="screenful">
      <img v-if="!isFullscreen" :src="require('@/assets/imgs/screenful-1.png')" alt="" />
      <img v-else :src="require('@/assets/imgs/screenful-2.png')" alt="" />
    </div>
    <div class="time">{{ time }}</div>
    <div class="header">
      <h2>松辉云康数据大屏</h2>
    </div>
    <div class="main-content">
      <div class="left">
        <div class="count">
          <div class="count-item">
            <div class="label">销售总额（万元）</div>
            <div class="counter">{{ saleTotalCount }}</div>
          </div>
          <div class="count-item">
            <div class="label">用户总数（万人）</div>
            <div class="counter">{{ userTotalCount }}</div>
          </div>
          <div class="count-item">
            <div class="label">门店总数（个）</div>
            <div class="counter">{{ storeTotalCount }}</div>
          </div>
          <div class="count-item">
            <div class="label">加盟商总数（个）</div>
            <div class="counter">{{ supplyTotalCount }}</div>
          </div>
        </div>
        <div class="china-map" id="main">
          <china @onSelect="handleOnSelect" />
        </div>
      </div>
      <div class="right">
        <user-data :list="userList"></user-data>
        <store-data :list="userList"></store-data>
        <supply-data :list="userList"></supply-data>
      </div>
    </div>
    <div class="count-wrapper">
      <div class="count">销售总额：{{ saleTotalCount }}万元</div>
      <div class="count">用户总数：{{ userTotalCount }}万人</div>
      <div class="count">门店总数：{{ storeTotalCount }}</div>
      <div class="count">加盟商总数：{{ supplyTotalCount }}</div>
    </div>
    <div class="footer-bg">
      <img :src="require('@/assets/imgs/large-bottom-bg.png')" alt="" />
    </div>
  </div>
</template>

<script>
// import "@/plugin/chart/echarts-all.js";
import dayjs from "dayjs";
import screenfull from "screenfull";
import lodash from "lodash";
import { post } from "@/utils/http-client";
import UserData from "./components/user-data.vue";
import StoreData from "./components/store-data.vue";
import SupplyData from "./components/supply-data.vue";
import China from "./components/china-v2.vue";

export default {
  name: "BigData",
  components: { UserData, StoreData, SupplyData, China },
  data() {
    return {
      desenType: true, // 脱敏模式
      isFullscreen: true,
      time: "",
      area: "黑龙江",
      loading: true,
      saleTotalCount: "", //销售总额
      userTotalCount: "", //用户总数
      storeTotalCount: "", //门店总数
      supplyTotalCount: "", //销售总额
      userList: [],
    };
  },
  mounted() {
    this.desenType = JSON.parse(window.localStorage.getItem("desenType"));
    this.updateTime();
    this.onresize = lodash.debounce(this.onresize, 700);
    // window.onresize = this.onresize;
    setTimeout(() => {
      // this.setEcahrtsHeight();
      this.initChart();
    }, 200);
    this.indexOrderCount();
  },
  methods: {
    handleOnSelect(name) {
      this.area = name;
      this.indexOrderCount();
    },
    async indexOrderCount() {
      this.loading = true;
      let params = {
        area: this.area,
      };
      const res = await post("/srm/sh/stores/getIndexDataCountByArea", params);
      this.loading = false;
      if (res.code == "200") {
        if (this.desenType) {
          res.data.totalAmount = "******";
          res.data.results.forEach((item) => {
            item.storeAmount = "******";
            item.informationAmount = "******";
          });
        }

        this.userList = res.data.results || [];
        // 总数
        this.saleTotalCount = res.data.totalAmount;
        this.userTotalCount = res.data.totalUserCount;
        this.storeTotalCount = res.data.totalStoreNum;
        this.supplyTotalCount = res.data.totalInformationNun;

        // this.$nextTick(() => {
        //   this.$refs.table1.doLayout();
        //   this.$refs.table2.doLayout();
        //   this.$refs.table3.doLayout();
        // });
      } else {
        this.$message.warning(res.msg);
      }
    },
    onresize() {
      console.log("抖动");
      // this.setEcahrtsHeight();
      setTimeout(() => {
        this.myChart.resize();
      }, 100);
    },

    initChart() {
      // 基于准备好的dom，初始化echarts图表
      // console.log(echarts);
      return;
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
        // 值域
        dataRange: {
          show: false,
          min: 0,
          max: 2500,
          x: "left",
          y: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
          orient: "vertical", // 布局方式，默认为垂直布局，可选为：
          // 'horizontal' ¦ 'vertical'
          // x: "left", // 水平安放位置，默认为全图左对齐，可选为：
          // 'center' ¦ 'left' ¦ 'right'
          // ¦ {number}（x坐标，单位px）
          // y: "bottom", // 垂直安放位置，默认为全图底部，可选为：
          // 'top' ¦ 'bottom' ¦ 'center'
          // ¦ {number}（y坐标，单位px）
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "#ccc", // 值域边框颜色
          borderWidth: 0, // 值域边框线宽，单位px，默认为0（无边框）
          padding: 5, // 值域内边距，单位px，默认各方向内边距为5，
          // 接受数组分别设定上右下左边距，同css
          itemGap: 10, // 各个item之间的间隔，单位px，默认为10，
          // 横向布局时为水平间隔，纵向布局时为纵向间隔
          itemWidth: 20, // 值域图形宽度，线性渐变水平布局宽度为该值 * 10
          itemHeight: 14, // 值域图形高度，线性渐变垂直布局高度为该值 * 10
          splitNumber: 5, // 分割段数，默认为5，为0时为线性渐变
          color: ["#4A7CE4", "#f0ffff"], //颜色
          //text:['高','低'],         // 文本，默认为数值文本
          textStyle: {
            color: "#333", // 值域文字颜色
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
              areaColor: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(27,132,199,0.7)",
                  },
                  {
                    offset: 1,
                    color: "rgba(46,197,251,0.7)",
                  },
                ],
                global: false,
              },
              emphasis: {
                label: { show: true },
                borderColor: "#FFF9EC",
                color: "#FFF9EC",
              },
            },
            data: [
              { name: "北京", value: 2500 },
              {
                name: "天津",
                value: 2500,
                selected: true,
              },
              { name: "上海", value: 2500 },
              { name: "重庆", value: 2500 },
              { name: "河北", value: 2500 },
              { name: "河南", value: 2500 },
              { name: "云南", value: 2500 },
              { name: "辽宁", value: 2500 },
              { name: "黑龙江", value: 2500 },
              { name: "湖南", value: 2500 },
              { name: "安徽", value: 2500 },
              { name: "山东", value: 2500 },
              { name: "新疆", value: 2500 },
              { name: "江苏", value: 2500 },
              { name: "浙江", value: 2500 },
              { name: "江西", value: 2500 },
              { name: "湖北", value: 2500 },
              { name: "广西", value: 2500 },
              { name: "甘肃", value: 2500 },
              { name: "山西", value: 2500 },
              { name: "内蒙古", value: 2500 },
              { name: "陕西", value: 2500 },
              { name: "吉林", value: 2500 },
              { name: "福建", value: 2500 },
              { name: "贵州", value: 2500 },
              { name: "广东", value: 2500 },
              { name: "青海", value: 2500 },
              { name: "西藏", value: 2500 },
              { name: "四川", value: 2500 },
              { name: "宁夏", value: 2500 },
              { name: "海南", value: 2500 },
              { name: "台湾", value: 2500 },
              { name: "香港", value: 2500 },
              { name: "澳门", value: 2500 },
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
    // setEcahrtsHeight() {
    //   return;
    //   const chartEle = document.getElementById("main");
    //   chartEle.style.display = "none";
    //   var element = document.getElementById("footer");
    //   var rect = element.getBoundingClientRect();
    //   var position = {
    //     top: rect.top + window.scrollY,
    //     left: rect.left + window.scrollX,
    //     bottom: rect.bottom + window.scrollY,
    //     right: rect.right + window.scrollX,
    //     width: rect.width,
    //     height: rect.height,
    //   };
    //   const height = document.documentElement.clientHeight;
    //   // console.log(position);
    //   let mainHeight = height - position.bottom;
    //   mainHeight = mainHeight < 351 ? 351 : mainHeight;
    //   chartEle.style.display = "block";
    //   chartEle.style.height = mainHeight + "px";
    // },
    enterScreenfull() {
      screenfull.toggle();
      this.isFullscreen = screenfull.isFullscreen;
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
      var timetap = dayjs().format(`YYYY年MM月DD日 HH:mm:ss`);
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
  overflow: hidden;
  position: relative;
  background: url("../../assets/imgs/largeScreen-bg.png") 100% 100% no-repeat;
  background-size: 100vw 100vh;
  display: flex;
  flex-direction: column;
  .screenful {
    cursor: pointer;
    font-size: 24px;
    position: absolute;
    top: 30px;
    right: 48px;
    width: 20px;
    height: 20px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 16px;
    height: 25px;
    position: absolute;
    top: 30px;
    right: 90px;
    color: #ffffff;
  }
  .header {
    height: 85px;
    width: 100vw;
    background: url("../../assets/imgs/large-top-bg.png") 100% 100% no-repeat;
    background-size: 100vw 85px;
    h2 {
      font-weight: 650;
      font-style: normal;
      font-size: 45px;
      color: #ffffff;
      font-family: "youshe";
      margin-left: 120px;
      letter-spacing: 9px;
      font-style: normal;
      text-shadow: 0px 5px 5px rgba(7, 10, 53, 0.5);
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
  .main-content {
    padding: 0;
    flex: 1;
    display: flex;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      .count {
        height: 170px;
        display: flex;
        align-items: center;
        // justify-content: space-evenly;
        padding-left: 70px;
        .count-item {
          font-family: PingFangSC, PingFang SC;
          font-size: 20px;
          color: #ffffff;
          font-style: normal;
          height: 91px;
          // margin-right: 70px;
          width: 304px;
          .counter {
            background: url("../../assets/imgs/large-data-bg.png") no-repeat;
            background-size: 127px 50px;
            background-position: left 10px;
            color: #ffffff;
            font-family: "youshe";
            padding-left: 12px;
            font-size: 50px;
            line-height: 65px;
            text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
            font-style: normal;
            margin-left: -10px;
          }
        }
      }
      .china-map {
        flex: 1;
      }
    }
    .right {
      width: 500px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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

  .footer-bg {
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 85px;
    width: 100vw;
    background: url("../../assets/imgs/large-bottom-bg.png") 100% 100% no-repeat;
    background-size: 100vw 85px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
