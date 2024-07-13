<template>
  <div class="map">
    <div class="songhui-wrapper" :style="{ width: map.width + 'px', height: map.height + 'px' }">
      <img class="songhui-map" :style="{ width: map.width + 'px', height: map.height + 'px' }" :src="require('@/assets/imgs/large/map-bg.png')" alt="" />
      <div class="songhui-provinces">
        <img v-for="item in activeCity" :key="item.name" :style="{ height: item.backgroudImage.height + 'px', width: item.backgroudImage.width + 'px', top: item.location.top + 'px', left: item.location.left + 'px' }" class="songhui-province" :src="item.backgroudImage.url" alt="" />
      </div>

      <div class="songhui-labels">
        <div v-for="(ele, index) in provinces" :key="index" :style="{ top: ele.label.top + 'px', left: ele.label.left + 'px' }" class="songhui-label" :class="{ active: ele.name === cityName }" @click="hanldeCityClick(ele)">
          <img class="songhui-label-point" :src="require('@/assets/imgs/large/point.png')" alt="" />
          <div class="songhui-trapezoid">
            <div class="songhui-trapezoid-text">{{ ele.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 南海背景 -->
    <img class="naihai" :src="require('@/assets/imgs/large/naihai.png')" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityName: "天津",
      activeCity: {},
      provinces: [
        { name: "河北", label: { left: 900, top: 370 }, location: { left: 874, top: 285 }, backgroudImage: { url: require("@/assets/imgs/large/hebei.png"), width: 135, height: 172 } },
        { name: "黑龙江", label: { left: 1097, top: 124 }, location: { left: 999, top: 4 }, backgroudImage: { url: require("@/assets/imgs/large/heilongjiang.png"), width: 268, height: 234 } },
        { name: "吉林", label: { left: 1072, top: 217 }, location: { left: 1026, top: 179 }, backgroudImage: { url: require("@/assets/imgs/large/jilin.png"), width: 203, height: 136 } },
        { name: "辽宁", label: { left: 1018, top: 286 }, location: { left: 983, top: 254 }, backgroudImage: { url: require("@/assets/imgs/large/liaoning.png"), width: 154, height: 129 } },
        { name: "北京", label: { left: 927, top: 319 }, location: { left: 912, top: 324 }, backgroudImage: { url: require("@/assets/imgs/large/beijing.png"), width: 48, height: 44 } },
        { name: "天津", label: { left: 946, top: 344 }, location: { left: 940, top: 342 }, backgroudImage: { url: require("@/assets/imgs/large/tianjin.png"), width: 37, height: 46 } },
        { name: "内蒙古", label: { left: 680, top: 320 }, location: { left: 539, top: 15 }, backgroudImage: { url: require("@/assets/imgs/large/neimenggu.png"), width: 555, height: 401 } },
        { name: "宁夏", label: { left: 703, top: 402 }, location: { left: 672, top: 362 }, backgroudImage: { url: require("@/assets/imgs/large/ningxia.png"), width: 79, height: 109 } },
        { name: "甘肃", label: { left: 650, top: 475 }, location: { left: 427, top: 264 }, backgroudImage: { url: require("@/assets/imgs/large/gansu.png"), width: 347, height: 275 } },
        { name: "陕西", label: { left: 740, top: 487 }, location: { left: 692, top: 367 }, backgroudImage: { url: require("@/assets/imgs/large/shanxi.png"), width: 137, height: 207 } },
        { name: "山西", label: { left: 830, top: 409 }, location: { left: 805, top: 334 }, backgroudImage: { url: require("@/assets/imgs/large/sanxi.png"), width: 95, height: 162 } },
        { name: "青海", label: { left: 467, top: 409 }, location: { left: 342, top: 342 }, backgroudImage: { url: require("@/assets/imgs/large/qinghai.png"), width: 311, height: 203 } },
        { name: "新疆", label: { left: 315, top: 315 }, location: { left: 35, top: 71 }, backgroudImage: { url: require("@/assets/imgs/large/xinjiang.png"), width: 496, height: 341 } },
        { name: "西藏", label: { left: 315, top: 514 }, location: { left: 75, top: 376 }, backgroudImage: { url: require("@/assets/imgs/large/xizang.png"), width: 466, height: 279 } },
        { name: "四川", label: { left: 620, top: 553 }, location: { left: 507, top: 484 }, backgroudImage: { url: require("@/assets/imgs/large/sichuan.png"), width: 260, height: 218 } },
        { name: "云南", label: { left: 553, top: 708 }, location: { left: 476, top: 610 }, backgroudImage: { url: require("@/assets/imgs/large/yunnan.png"), width: 226, height: 210 } },
        { name: "重庆", label: { left: 723, top: 592 }, location: { left: 682, top: 552 }, backgroudImage: { url: require("@/assets/imgs/large/chongqing.png"), width: 120, height: 105 } },
        { name: "贵州", label: { left: 695, top: 679 }, location: { left: 639, top: 627 }, backgroudImage: { url: require("@/assets/imgs/large/guizhou.png"), width: 150, height: 116 } },
        { name: "广西", label: { left: 731, top: 769 }, location: { left: 654, top: 702 }, backgroudImage: { url: require("@/assets/imgs/large/guangxi.png"), width: 197, height: 129 } },
        { name: "广东", label: { left: 850, top: 760 }, location: { left: 784, top: 723 }, backgroudImage: { url: require("@/assets/imgs/large/guangdong.png"), width: 197, height: 135 } },
        { name: "湖南", label: { left: 807, top: 652 }, location: { left: 764, top: 606 }, backgroudImage: { url: require("@/assets/imgs/large/hunan.png"), width: 139, height: 141 } },
        { name: "湖北", label: { left: 825, top: 574 }, location: { left: 757, top: 526 }, backgroudImage: { url: require("@/assets/imgs/large/hubei.png"), width: 188, height: 111 } },
        { name: "江西", label: { left: 908, top: 636 }, location: { left: 882, top: 605 }, backgroudImage: { url: require("@/assets/imgs/large/jiangxi.png"), width: 122, height: 145 } },
        { name: "福建", label: { left: 964, top: 690 }, location: { left: 941, top: 646 }, backgroudImage: { url: require("@/assets/imgs/large/fujian.png"), width: 113, height: 122 } },
        { name: "浙江", label: { left: 1004, top: 616 }, location: { left: 989, top: 571 }, backgroudImage: { url: require("@/assets/imgs/large/zhejiang.png"), width: 100, height: 104 } },
        { name: "安徽", label: { left: 942, top: 568 }, location: { left: 909, top: 487 }, backgroudImage: { url: require("@/assets/imgs/large/anhui.png"), width: 116, height: 135 } },
        { name: "河南", label: { left: 851, top: 493 }, location: { left: 805, top: 448 }, backgroudImage: { url: require("@/assets/imgs/large/henan.png"), width: 147, height: 129 } },
        { name: "山东", label: { left: 946, top: 430 }, location: { left: 907, top: 395 }, backgroudImage: { url: require("@/assets/imgs/large/shandong.png"), width: 170, height: 101 } },
        { name: "江苏", label: { left: 991, top: 497 }, location: { left: 939, top: 471 }, backgroudImage: { url: require("@/assets/imgs/large/jiangsu.png"), width: 139, height: 112 } },
        { name: "上海", label: { left: 1056, top: 545 }, location: { left: 1048, top: 559 }, backgroudImage: { url: require("@/assets/imgs/large/shanghai.png"), width: 30, height: 25 } },
        // { name: "海南", label: { left: 806, top: 843 }, location: { left: 765, top: 856 }, backgroudImage: { url: require("@/assets/imgs/large/hainan.png"), width: 69, height: 52 } },
      ],
      map: {
        width: 1323,
        height: 879,
      },
      zoom: 0.7,
    };
  },
  mounted() {
    // 引入资源
    // window.onresize = this.onresize;
    this.zoomChinaMap();
    this.getActiveCity(this.cityName);
  },
  methods: {
    zoomChinaMap() {
      this.map.width = this.map.width * this.zoom;
      this.map.height = this.map.height * this.zoom;
      this.provinces.forEach((item) => {
        item.label.left = item.label.left * this.zoom;
        item.label.top = item.label.top * this.zoom;
        item.location.left = item.location.left * this.zoom;
        item.location.top = item.location.top * this.zoom;
        item.backgroudImage.width = item.backgroudImage.width * this.zoom;
        item.backgroudImage.height = item.backgroudImage.height * this.zoom;
      });
    },
    getActiveCity(cityName) {
      this.activeCity = this.provinces.filter((item) => item.name === cityName);
      // console.log("this.activeCity: ", this.activeCity);
    },
    hanldeCityClick(item) {
      this.cityName = item.name;
      this.getActiveCity(this.cityName);
      this.$emit("onSelect", item.name);
    },
    onresize() {
      // this.myChart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .map-bg {
    // width: 100%;
    height: 879px;
    margin: 0 auto;
    // object-fit: contain;
  }
  .songhui-wrapper {
    // height: 100%;
    // width: 100%;
    position: relative;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // .songhui-map {
    // width: 1323px;
    // height: 879px;
    // }
    .songhui-provinces {
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      position: absolute;
      z-index: 4;
      .songhui-province {
        position: absolute;
      }
    }

    .songhui-labels {
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      position: absolute;
      z-index: 5;
      .songhui-label {
        position: absolute;
        display: flex;
        font-family: "youshe";
        font-size: 16px;
        color: #ffffff;
        font-style: normal;
        height: 28px;
        cursor: pointer;
        transform: scale(1);
        transition: transform 0.5s linear;
        &:hover {
          transform: scale(1.2);
          .songhui-trapezoid {
            height: 0;
            border-top: 0 solid pink;
            border-right: 0 solid transparent;
            border-bottom: 24px solid rgba(204, 56, 1, 0.8);
            border-left: 10px solid transparent;
            margin-left: -9px;
            .songhui-trapezoid-text {
              padding-right: 5px;
            }
          }
        }
        &.active {
          transform: scale(1.2);
          .songhui-trapezoid {
            height: 0;
            border-top: 0 solid pink;
            border-right: 0 solid transparent;
            border-bottom: 24px solid rgba(204, 56, 1, 0.8);
            border-left: 10px solid transparent;
            margin-left: -9px;
            .songhui-trapezoid-text {
              padding-right: 5px;
            }
          }
        }
        .songhui-label-point {
          height: 28px;
          cursor: pointer;
        }
        .songhui-label-text {
          height: 24px;
          padding: 0 5px;
          background: #111111;
        }
        .songhui-trapezoid {
          height: 0;
          border-top: 0 solid pink;
          border-right: 0 solid transparent;
          border-bottom: 24px solid #111111;
          border-left: 10px solid transparent;
          margin-left: -9px;
          .songhui-trapezoid-text {
            padding-right: 5px;
          }
        }
      }
    }
  }
  .naihai {
    width: 169px;
    height: 256px;
    position: absolute;
    bottom: 27px;
    right: 15px;
  }
}
</style>
