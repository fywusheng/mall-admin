<template>
  <div class="map">
    <div id="main" ref="chinaMap" style=""></div>
  </div>
</template>

<script>
// echarts5.0以上版本使用中国地图
import * as echarts from "echarts";
import dataJson from "@/assets/data/china.json";
export default {
  data() {
    return {};
  },
  mounted() {
    // 引入资源
    this.chinaEchart();
    window.onresize = this.onresize;
  },
  methods: {
    // 方法
    chinaEchart() {
      //注册地图，这个特别重要
      echarts.registerMap("china", dataJson);
      let myChart = echarts.init(this.$refs.chinaMap);
      this.myChart = myChart;
      const _this = this;
      // 地图北京
      var img = require("../../../assets/imgs/china-bg.jpg");
      var domImg = document.createElement("img");
      domImg.style.height = "1063px";
      domImg.style.width = "845px";
      domImg.src = img;

      domImg.onload = (e) => {
        var options = {
          // tooltip: {
          //   show: true,
          //   triggerOn: "mousemove", //mousemove、click
          //   padding: [4, 8],
          //   borderWidth: 1,
          //   borderColor: "#409eff",
          //   backgroundColor: "rgba(255,255,255,0.7)",
          //   textStyle: {
          //     color: "#000000",
          //     fontSize: 13,
          //   },
          //   formatter: function (e) {
          //     return e.name;
          //   },
          // },
          // geo: [
          //   // 第一层
          //   {
          //     map: "china",
          //     z: 3,
          //     zoom: 1.2,
          //     aspectScale: 0.85,
          //     roam: false,
          //     top: "10%",
          //     layoutSize: "100%", //保持地图宽高比
          //     regions: [
          //       {
          //         // 隐藏南海诸岛,因为顶层已经添加过了
          //         name: "南海诸岛",
          //         itemStyle: {
          //           borderWidth: 0.5,
          //           shadowBlur: 0,
          //           borderColor: "#61aacb",
          //           areaColor: "#104584",
          //         },
          //       },
          //     ],
          //     itemStyle: {
          //       borderColor: "#c8feff",
          //       borderWidth: 0.5,
          //       shadowBlur: 3,
          //       shadowColor: "#66edff",
          //       areaColor: "#0862db",
          //     },
          //     emphasis: {
          //       itemStyle: {
          //         shadowBlur: 10,
          //         borderWidth: 1,
          //         areaColor: "#2da9ff",
          //       },
          //       label: {
          //         show: false,
          //         color: "#ffffff",
          //       },
          //     },
          //     select: {
          //       itemStyle: {
          //         shadowBlur: 10,
          //         borderWidth: 1,
          //         areaColor: "#2da9ff",
          //       },
          //       label: {
          //         color: "#ffffff",
          //       },
          //     },
          //   },
          //   // // 第二层
          //   // {
          //   //   map: "china",
          //   //   z: 2,
          //   //   zoom: 1.2,
          //   //   aspectScale: 0.85,
          //   //   roam: false,
          //   //   silent: true,
          //   //   top: "10%",
          //   //   layoutSize: "100%", //保持地图宽高比
          //   //   regions: [
          //   //     {
          //   //       // 隐藏南海诸岛,因为顶层已经添加过了
          //   //       name: "南海诸岛",
          //   //       itemStyle: {
          //   //         opacity: 0, // 为 0 时不绘制该图形
          //   //       },
          //   //       label: {
          //   //         show: false,
          //   //       },
          //   //     },
          //   //   ],
          //   //   itemStyle: {
          //   //     borderColor: "#d8feff",
          //   //     borderWidth: 3,
          //   //     shadowBlur: 10,
          //   //     shadowColor: "#22a1ff",
          //   //     areaColor: "#0862db",
          //   //     shadowOffsetX: 0,
          //   //     shadowOffsetY: 8,
          //   //   },
          //   // },
          //   // // 第三层
          //   // {
          //   //   map: "china",
          //   //   z: 1,
          //   //   zoom: 1.2,
          //   //   aspectScale: 0.85,
          //   //   top: "11.5%",
          //   //   silent: true,
          //   //   layoutSize: "100%", //保持地图宽高比
          //   //   itemStyle: {
          //   //     borderColor: "#c8feff",
          //   //     borderWidth: 1,
          //   //     shadowBlur: 0,
          //   //     shadowColor: "#99c4ff",
          //   //     areaColor: "#4ebaff",
          //   //   },
          //   //   regions: [
          //   //     {
          //   //       // 隐藏南海诸岛,因为顶层已经添加过了
          //   //       name: "南海诸岛",
          //   //       itemStyle: {
          //   //         opacity: 0, // 为 0 时不绘制该图形
          //   //       },
          //   //       label: {
          //   //         show: false,
          //   //       },
          //   //     },
          //   //   ],
          //   // },
          //   // // 第四层
          //   // {
          //   //   map: "china",
          //   //   z: 0,
          //   //   zoom: 1.2,
          //   //   aspectScale: 0.85,
          //   //   top: "12%",
          //   //   silent: true,
          //   //   layoutSize: "100%", //保持地图宽高比
          //   //   itemStyle: {
          //   //     borderColor: "#66edff",
          //   //     borderWidth: 2,
          //   //     shadowBlur: 20,
          //   //     shadowColor: "#4d99ff",
          //   //     areaColor: "#1752ad",
          //   //     shadowOffsetX: 0,
          //   //     shadowOffsetY: 8,
          //   //   },
          //   //   regions: [
          //   //     {
          //   //       // 隐藏南海诸岛,因为顶层已经添加过了
          //   //       name: "南海诸岛",
          //   //       itemStyle: {
          //   //         opacity: 0, // 为 0 时不绘制该图形
          //   //       },
          //   //       label: {
          //   //         show: false,
          //   //       },
          //   //     },
          //   //   ],
          //   // },
          // ],
          // geo: {
          //   map: "china", // 设置为中国地图，需要提前引入中国地图的 geoJSON 数据
          //   itemStyle: {
          //     normal: {
          //       areaColor: {
          //         image: domImg, //配置图片
          //         repeat: "no-repeat", //可选值repeat、no-repeat、repeat-x、repeat-y
          //       },
          //     },
          //   },
          //   // type: "pattern",
          //   // image: domImg, //配置图片
          //   // repeat: "repeat", //可选值repeat、no-repeat、repeat-x、repeat-y
          // },
          // 通过偏移，缩放来实现多层外轮廓的效果
          geo: [
            // 主图
            {
              map: "china",
              z: 5,
              zoom: 1.2, //当前视角的缩放比例
              roam: false, //是否开启平游或缩放
              center: undefined,
              show: true,
              // left: "8%",
              selectedMode: "single",
              select: {
                itemStyle: {
                  color: "#111111",
                  areaColor: "#FFF9EA", //悬浮区背景
                  shadowColor: "#FFF9EA",
                  shadowOffsetX: -2,
                  shadowOffsetY: 5,
                  shadowBlur: 10,
                },
              },
              label: {
                // position: "insideRight",
                position: [10, 10],
                normal: {
                  show: true,
                  fontSize: 16,
                  color: "#ffffff",
                },
              },
              itemStyle: {
                normal: {
                  borderColor: "#ffffff",
                  borderWidth: 1,
                  areaColor: {
                    type: "pattern",
                    image: domImg, //配置图片
                    repeat: "repeat", //可选值repeat、no-repeat、repeat-x、repeat-y
                  },
                },
                emphasis: {
                  color: "#111111",
                  areaColor: "#FFF9EA", //悬浮区背景
                  shadowColor: "#FFF9EA",
                  shadowOffsetX: -2,
                  shadowOffsetY: 5,
                  shadowBlur: 10,
                },
              },
              regions: [
                {
                  name: "南海诸岛",
                  itemStyle: {
                    // 隐藏地图
                    normal: {
                      opacity: 1, // 为 0 时不绘制该图形
                    },
                  },
                  emphasis: {
                    disabled: true,
                  },
                  label: {
                    show: false, // 隐藏文字
                  },
                },
                {
                  name: "台湾",
                  itemStyle: {
                    // 隐藏地图
                    normal: {
                      opacity: 1, // 为 0 时不绘制该图形
                    },
                  },
                  emphasis: {
                    disabled: true,
                  },
                  label: {
                    show: false, // 隐藏文字
                  },
                },
              ],
            },
            //第一层投影
            {
              map: "china",
              z: 4,
              zoom: 1.24, //当前视角的缩放比例
              roam: false, //是否开启平游或缩放
              center: undefined,
              show: true,
              // left: "18%",
              label: {
                normal: {
                  show: false,
                },
              },
              emphasis: {
                disabled: true,
              },
              itemStyle: {
                normal: {
                  borderJoin: "round",
                  borderColor: "#3C4FAA",
                  borderWidth: 3,
                  areaColor: "#3C4FAA",
                  shadowColor: "rgba(60,79,170, .7)",
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowBlur: 25,
                },
              },
              regions: [
                {
                  name: "南海诸岛",
                  itemStyle: {
                    // 隐藏地图
                    normal: {
                      opacity: 0, // 为 0 时不绘制该图形
                    },
                  },
                  emphasis: {
                    disabled: true,
                  },
                  label: {
                    show: false, // 隐藏文字
                  },
                },
                {
                  name: "台湾",
                  itemStyle: {
                    // 隐藏地图
                    normal: {
                      opacity: 1, // 为 0 时不绘制该图形
                    },
                  },
                  emphasis: {
                    disabled: true,
                  },
                  label: {
                    show: false, // 隐藏文字
                  },
                },
              ],
            },
            // 第二层投影
            {
              map: "china",
              z: 3,
              zoom: 1.2, //当前视角的缩放比例
              roam: false, //是否开启平游或缩放
              center: undefined,
              show: true,
              // left: "24%",
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  disabled: true,
                },
              },
              regions: [
                {
                  name: "南海诸岛",
                  itemStyle: {
                    // 隐藏地图
                    normal: {
                      opacity: 0, // 为 0 时不绘制该图形
                    },
                  },
                  emphasis: {
                    disabled: true,
                  },
                  label: {
                    show: false, // 隐藏文字
                  },
                },
                {
                  name: "台湾",
                  itemStyle: {
                    // 隐藏地图
                    normal: {
                      opacity: 0, // 为 0 时不绘制该图形
                    },
                  },
                  label: {
                    show: false, // 隐藏文字
                  },
                },
              ],
              itemStyle: {
                normal: {
                  borderJoin: "round",
                  areaColor: "#1F2C65",
                  shadowColor: "#1F2C65",
                  shadowOffsetX: -5,
                  shadowOffsetY: 6,
                },
                emphasis: {
                  show: false,
                },
              },
            },
          ],
          series: [
            {
              name: "企业分布", //红色标注
              type: "custom",
              coordinateSystem: "geo",
              clickable: true,
              z: 9,
              data: [
                // 这里可以添加更多的省市数据
                { name: "北京", value: Math.round(Math.random() * 2000) },
                // { name: "上海", value: Math.round(Math.random() * 2000) },
              ],
              renderItem: function () {
                // ...
                return {
                  type: "group",
                  children: [
                    {
                      type: "circle",
                      // ...
                    },
                    {
                      type: "circle",
                      name: "aaa",
                      // 用户指定的信息，可以在 event handler 访问到。
                      info: 12345,
                      // ...
                    },
                  ],
                };
              },
              markPoint: {
                symbolSize: 16,
                symbolOffset: ["", "-50%"],
                symbol:
                  "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAABNCAYAAAARtbwVAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAADYAAAAAQAAANgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAD+gAwAEAAAAAQAAAE0AAAAAkXtHdAAAAAlwSFlzAAAhOAAAITgBRZYxYAAAC0JJREFUeAHNW0+sHVUZ/+a++/oEaSHQVpQ/LSVUIzSGhW7UvNsoBhNZNi4EperCGlci0QVNbgIuDLFujCVxQRVxUd11oYLm3RvCAgkhhqCIFpFaLD6xLbRVeLx3/P1m5pt77jdn5sy9d94rXzL3O+d8/8/vnDMz992XuM/IQEQWcYk4XEnO2dc2+UbQpPEn1R+vYZi426Unq7KUjk9arA0+7rw8eZPqW3/WPpZvnX5H9qaYFuhbZRvc9mPBrb7t23gxf7Pqj+IPk8el10n7HemnPJ0KtMibXH4ybNuLTjmmpG3V84v12yq33Nfx26rHOGwrUYdE7l9zWb0qFnebt/dTi9yAzlRL2xqA4zqmNnVcdae1r/NNmfVv9bN8U9QpypBnK5+NolCOWdJJIPcLZ1AtSDltta1y38b3RV2S1Vc75b6O31a59c++f1FP68xFdJNSsfeLATTUoY75XGXkTYjB1Yb62q6yn1Tf5lC2HyaP4YDPaYQ8B7j3aVBFmiS531Z9tSX32yqPcd+GbcZQ7rc5Frron+NKfo5sr+VnWy5XsapLCf1CEmhoYhrQTzCgXhTSVD/ko26sPp8x1OlmHPlspB+cVU1YOXV16sj9wqmjesqpHyPVVXvLaa86flv1/Bz83KirdzS2c1IV7ae8En0G0QDU1HbQC+QXW38UvzjhmbZSGXlKdJZoTCIfOcqK9gtXueW+jk6QcvWrPOSfsln01dY74elSScXaL3h630/wzK9JFZIZGuqLPETMRnVCcpWpvdUPy4Oo0303FCMdm+v2cTwuVcopcIiWIANykrbJSVbeyXXJm1DMnmG5dvPwRXtsPXf6Iu8Eo9Vm4T63MMAELBZrj9oMpFba1uBWHgzpDcbsZ5VLMkyOvdXzIo41q5GnWjfpSzK/VExtDNnSCRjLfiwXdGL6Rl7KBy4UALp2a32yKlIMq+Ti9m0eYDkvViq0KbDL3BZnY9XqA/WjZ3vWxO/XI0/NhYU+ZnDJNyraNngh0IbCoHNskCtgyuUxdbsy7OT47jvc6/WkWdVqubu3DRA3gL7NttZNQOhnS3HMn9GvKp57/chrvUDAsaE48lTvzvWR2FI5OZOM6UZPf5u8RXZqf8w3To2Qpxt3YAfQx8mvCae+DVKmW7rV2XzUF3mI7Lay+lae+RgmD53ohdzZsWbI02rOP/k12RI0UNQxGmmbnFSaHW8sVYh8xOwhj5zwfgCtwh+rbLtv3gT0sfcLqwbJFBMAtxYpax6dHGtgJ1eGyaG/9CoLMILmyNNwE/bSGvd+Ts2WoWqX+az21mOn2V5XswJDHYhxd9+eDP2YYiqPImW8TKrvmSdA/YHnet5ItDkZ8nRXnPzsmGRjy9quUmNe7BA9IhjCpzr9xPV91SZtupuY3P0fHaDuxZJhXXJUjsmtw6bbwgH1g0/3rHmsPzny9Ej0O97ej0WpksdWgrWr0neTo07XUyFPQ3fokwOwMvoUVpFN3urZlWHl1j7THyb3PNGzqk360yFPz/NA3/FvfJoxB7VNTgpnW8x5TD1zUv85xV5Xh5ql9ifi7vBtAxgsTmTUrvIwOfB4b1qX0yPPiNz7CfY+T/mUYlAauemWH4KgoHcQ+rcLSabb61muxfrT7uTcPXzHAKs9jH6pOPjXsWAoW50qkxviCb//WM+MTtSdDXmGSk/+/O/7pdyR9BhyUNDbF221Td6E1Be5k34TkzqdhlHrXCCPo/sG0Bh908tJING7Tkg6YD78YiiKTcZIf5h8/pc9423i7uzIM2Rx8tv4tnqdiarZsfIKf8nsqNNzK8jTkTt21wBske0RNSxmsjSGyR2P9EYxpm+1gzzj+ye/7uHRMs0ytMvaymN1ZPb9mFpTeWvIM6D73VcH4vhNLxEnxZZ9pjX6jOgn+G7uUz/ujfRna7WHPPPodLNnfiJKitRSOuDsSrD25u/rWZDpP+m+VXJPfmOAooE+yWRvi8uURp/122KYfPyHvZHy7K12kWc+m7p9rPql2VMzHlo64X2vrSNP5+7Zbw3AcvQ50pC4W3Sx0GS0EobJrQ/2ONQmtY88s+t2+/gso6+F6ZTbYmFUQf2K8ZmGNY2ZnISM3Qv3DTA+OfplZ8PkQw/0ysOzj6wP8syLf99PDPoW+Vj+XBktPMNXhVk35BnQvXL/IL3va5TmyzzL17lhsvNgL+u0/7l+yDPX+W4fxS8Rvowi0Ntbof42KLdumykmbfst/LnlBwc4theLgbrGePHDZPu9vTr1WWVjv16Z1VmFfT+7f+k8Kw9od/J0yNfhvm4j1mRiVafvu39/fwDrMvrjSEOF6XCL4Bl+2z09NNaVNgJ51JP/NobFksj9wvkww4uFp7z+tzSpjxY+NgR55umWib5bHKGLwdETHFWUhsnW9UedwTYG+bQsoOmj6xeuKyHlG4M6U9ow5BksPfmTDr7ry5e/PwFUEHwju0GoM9i6I486E3dUNrlDcqX88ZmfF7d8Rrf0/DOPuB/IFak+7Ky47X4rAVig/ELegx+zXipv4TopV8sZ+Zj8D9eK7MGP/K9D0VvT5Pd/XeT6XeU6/n5c5Mhhjq8BkmVcr+BfQv4Ab0/LNnkKU/e6bJILcl4uJPvhuQWaqnj8naQjH5bNSOHytOBELpH/yBXyD/k00rsd/6d3K3IL+955o8iXDmSp+8v+yI9EXsYEhGkVE/GUXCa/kl0ywIScx89pLyDCeUz2WfmynIOrfC+FHYRGwwkGNNOCd2P+OyjYyZYUH+q9Ke+Vl+ROpPIF9C4NmJaHiP4OTALTZQYsmsU3oUROI8oR2Z2utbdzk1XwN+S/WG9fkdNNJyJaPPefvC3bkSSX7dxYfseB8LJ8D0VcOTYe6xD9uzEBPPiIfj3qYW9zcgKb6165Xv46ppBgo60iq2tlOdlb8XPr3KDywHNL0nWPyg4sq1tQ+PugP174n7DE/yUPTVw4AxPpl/OcyauXe55mgK3iHDkpDwsB8MnJPFbnB+SU7HE/k2sxv5U1BgUw2oL9ezN8boVpeXW8Budn5SDk4xPiJxFrDx7LUCefni4Bxt/FYt9ScsFjk6A9Kje7n2JrBqhUvPuJXAWjm2Ba/bp7CoeaCzsMxAgPEe3Bb6ZD3ffosCVPyif8obF2gm07L7tTQMcE5j7vjuEo6WCpx+gd2RlTaSSfDfVRiJVIPtkq2JWeXyMrlOrTG3JNulj8sVB7Xl4IDV+0sYVG+czhKHy/n2NRPM9d3L42+8LK9k45Bu1TlfKNFHTkz3KjPNEoJG/RHhXFe2Px5hbc3a+Wb2OVnIkrr6NGIq9irX4Hu3plmihF8TjSeVN4s7GTnfK83ICHmzl5rrFNm4rz8iSeMu/C/fxEY7cJHoQ8Gj/Rt+DcPIOlH7q9eUZFczuW/lV4uHxR9mLavoaHi12FbL0anOzL5bB8UH4/YYhVnPr/9G1K9/D0VteNnJ6+B7/9NzwQnZbP4olwL9bRdl80U7uDp44F+S2eI39deqJr4riD02xVjid3jiNfKp6+0nuiw6Kuu9fHgp7CbnxdPoKJuAUPmdch/DW4eNrOV5om0E6w+jq4unirWwDKW/Fmtx3PktOSg881eSn5Il6CDAWLpw4fb9PjZA0Lu+k2MM5LXZ4q5/AGuILrAq41TMQmPEAv4JWkg3fEy8DnsGbaoAztZbxuvYrXh7WQy8riVbn2xUaV3k18ghebaPFaV+UrrSpcXL4+r7ShmtKJsF9m8BFyo4hLeiO/zKirq/Q1Fl8muJ/xOw3s4OoDrs4p9z5LFBxYPLR4vRu+xqrL2cryieEEzOFI6+Cw66RPEuTzONtXUNY5lNlNp2sN3wTycFqVfbKCg6qdw88mlff/DwE/V6Lg8VWOAAAAAElFTkSuQmCC", // symbolSize: 20, // 标注点大小
                data: [
                  // 这里添加自定义标注的城市
                  // { name: "北京", coord: [116.46, 39.92] }, // 比如这里标注北京的经纬度
                ],
              },
            },
          ],
        };
        dataJson.features.forEach((item) => {
          if (item.properties.name !== "台湾") {
            options.series[0].markPoint.data.push({ name: item.properties.name, coord: item.properties.cp });
          }
        });
        myChart.setOption(options);
        // 选中事件
        myChart.on("click", function (param) {
          _this.$emit("onSelect", param.name);
        });
        // 选中北京
        myChart.dispatchAction({
          type: "select",
          seriesIndex: 0,
          dataIndex: myChart.getOption().series[0].data.findIndex((item) => item.name === "北京"),
        });
      };
    },
    onresize() {
      this.myChart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
  #main {
    height: 100%;
    width: 100%;
  }
}
</style>
