<template>
  <div class="container">
    <div class="xx-map" id="baseMap"></div>
  </div>
</template>

<script>
// import China from "@assets/js/100000";
import * as echarts from "echarts";
import China from "@/assets/data/china.json";
var piePatternSrc =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODIwYzUxMy1hYjk5LTE1NDEtYTk1Ni1lOWE4MDdlZTY4M2UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTYwOTE3MDFFQURCMTFFQzhGRjhGOEVGN0NCMjVCQzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTYwOTE3MDBFQURCMTFFQzhGRjhGOEVGN0NCMjVCQzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NGVhZTRmY2ItYzE1Ny1jNjQ1LTgzOTgtOTM2YTk0M2QxNDMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI4MjBjNTEzLWFiOTktMTU0MS1hOTU2LWU5YTgwN2VlNjgzZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhOhos0AAABBSURBVHjaNMoxDoAwEAPBNZxB+f8L6WgpScElOYktLI1kXfeDOMKSvszob0/hPaaZbu0EFmrDNlXm8sZfPRgCDAAriw4EHt+HWgAAAABJRU5ErkJggg==";
var piePatternImg = new Image();
piePatternImg.src = piePatternSrc;
var patternSrc =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODIwYzUxMy1hYjk5LTE1NDEtYTk1Ni1lOWE4MDdlZTY4M2UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjRENTQzNDlFQUY3MTFFQzhFMDNFNjI4MzExMjBCQkMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjRENTQzNDhFQUY3MTFFQzhFMDNFNjI4MzExMjBCQkMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NGVhZTRmY2ItYzE1Ny1jNjQ1LTgzOTgtOTM2YTk0M2QxNDMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI4MjBjNTEzLWFiOTktMTU0MS1hOTU2LWU5YTgwN2VlNjgzZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PifD0UMAAAA4SURBVHjaLIvBDQAgDALB1O4/gfs0cSax1d6LcMAVm6T7JHCkwQINYWleKFJaS/1Olp8yvcAVYADRHwpwESUINQAAAABJRU5ErkJggg==";
var patternImg = new Image();
patternImg.src = patternSrc;
var scatterImg =
  "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA2LTEzVDE3OjEzOjExKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNi0xM1QxNzoxOToyMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNi0xM1QxNzoxOToyMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNWFlOWE3OS04NDBj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";
var scatterHImg =
  "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAwCAYAAACfbhNRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA2LTEzVDE3OjEzOjM2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNi0xM1QxNzoxOTo1NSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNi0xM1QxNzoxOTo1NSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MWRkOTZkNi1hZDMx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";
var scatterBg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAAbCAYAAADGfCe4AAAEpElEQVRYhaWYvaskRRDAf7W37+19KAb+A4IG74y8CwwMFJMLX2CgYHKZf4CI+DTRaEUwUsHMUOMFOTCWOw5EzG4xMhCEE0G89873dne2pKd7Zmpru2fmsGF3uquruuuru6pLbt678wtwTeFc4JEiFeiW+K2Av4E1EPqVQBVwgVOQDeimmQM5Bb2Q2K+0ppcV6FnCCetuBN0q/BvXlQTXZo3ztH+AbQXZarfHNv00zAsaeFEB1RpW/wJtGsa/qcJzwGvAI+CZAJeIpDUGzIDDRKBp0TC4FpmJG6apaVwzMtgIIHBZW0WwTf1JhGslaS7C9Woc1wJsoqLi3tIqrp1XaelaA2hSWKOQ7TQx/Nvy+CR0n4pykeSrBa/YbRdES9pWHS3mZwT1JFLdWca2HCyqNjRLLy127GmGtoNImpe2l+CTqSF7HfiyM7k1f/HXaLlaHp9Uhq6x2mly9a2BBSU9drhrA6vMvgG2cXys0k/dGudG5m36XkyuzB5OZYSak88Xploau1QDu2qEa5gPsKcN05U5b5U7e5bO4uSUrgavNZBuqgcTJ5kYBMuxFSAnjFeUZOBFJY5oY+k01590Pr/DoGfSE/v5klC+iaPPMZ9ba+z6FreVY+L2ygnnhSr1/w9Dlom+28rOifvijk/rkZMRHJUEzzFRGlt4bssc3J71EptSctGMJYsM9rlVaVMGXE4zlhnjEX3K3nPRHUvqrqJKLjN08eQE6GtjXFozv6ELLSd4sOQOX32WsK3kciXavjNdUkrJTcfwtiNHzl37BLDj0oVUujhKZ6e09/h0qYAnjbuOJPC31hiGfBOzzpPE3awAPXu0eNpjydJ57LPaUFjxaz9pUjA+LMlOr7OklNDyF0nuHJVcMZdEjI2NffBiE92ntWndWYZwKPuxeOr6Obf08Jz75vYuxcw93hxznbsKPH+0mP8AvAn8mtFwLnZ6wcfENd/vCwt2ndK5dVlplq864/lA4Xvgk6PF/GfgFvAx8E+Bkb58cygEiWN6KESMclfjollFh2Tga+CmwAvAT0eL+avXF59+k6oF3420pg/GpaRgKJT4W3xU2maA2btCbty7Y+lugX4O3BfkQ0UfLo9PXkyWfck9Urfu3effer6/GXg/Dn39up4PzX3lYPrA3K610sK5fBn4XdEfQW4fLeZL4C3gXeDPEc8jf1nYyybnrrk+Hi55S/W1Lo2zlrTVEYHrCp/FrEHeV3S5PD4Jr/p3gNvApcKrXQvWGnr9D83lrOkrA3vfYEnnrjkLyduCvqfIt4J+kUqJdUtCT43FDlN1rxlPUrnDWuGKO2sHaQ01NDN3ti+78UHCszQNH019p64wyuzwjyEhG26eBT4CbgBfhZtXkga1jq91/bXR3soUlZpy5eNmHMqdiq7TGcXUTFd92XrHSz9WZnYy9cQ+OifIX+lMvgLyRqrJVqkAPQtjQTapCBwILkldM2WN6gapNV8LlgRsNB7664Qb9lqDBmHXyWMukjICzkqjIjbaFbVX7lIL6+y5ci1klNz+N4Lu6e4u6N1OEeVo0KYo9aEuKbCcFkksfLdbp/5Eu6SmcdNcyEpegyrwHzdCxPS7nMn3AAAAAElFTkSuQmCC";
var scatterHBg =
  "data:image/png;base64,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";

export default {
  name: "xx-map",
  components: {},
  props: {
    mapData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: China, // 加载地图
      chinaData: [
        { name: "北京", value: [116.405289, 39.904987] },
        { name: "天津", value: [117.190186, 39.125595] },
        { name: "河北", value: [114.502464, 38.045475] },
        { name: "黑龙江", value: [126.642464, 45.756966] },
        { name: "吉林", value: [125.324501, 43.886841] },
        { name: "辽宁", value: [123.429092, 41.796768] },
        { name: "内蒙古", value: [111.75199, 40.84149] },
        { name: "山西", value: [112.549248, 37.857014] },
        { name: "山东", value: [117.000923, 36.675808] },
        { name: "河南", value: [113.665413, 34.757977] },
        { name: "陕西", value: [108.948021, 34.263161] },
        { name: "湖北", value: [114.298569, 30.584354] },
        { name: "江苏", value: [118.76741, 32.041546] },
        { name: "安徽", value: [117.283043, 31.861191] },
        { name: "上海", value: [121.472641, 31.231707] },
        { name: "湖南", value: [112.982277, 28.19409] },
        { name: "江西", value: [115.892151, 28.676493] },
        { name: "浙江", value: [120.15358, 30.287458] },
        { name: "福建", value: [119.306236, 26.075302] },
        { name: "广东", value: [113.28064, 23.125177] },
        { name: "台湾", value: [121.520076, 25.030724] },
        { name: "海南", value: [110.19989, 20.04422] },
        { name: "广西", value: [108.320007, 22.82402] },
        { name: "重庆", value: [106.504959, 29.533155] },
        { name: "云南", value: [102.71225, 25.040609] },
        { name: "贵州", value: [106.713478, 26.578342] },
        { name: "四川", value: [104.065735, 30.659462] },
        { name: "宁夏", value: [106.23248, 38.48644] },
        { name: "甘肃", value: [103.83417, 36.06138] },
        { name: "青海", value: [101.77782, 36.61729] },
        { name: "西藏", value: [91.1145, 29.64415] },
        { name: "新疆", value: [87.61688, 43.82663] },
        { name: "香港", value: [114.16546, 22.27534] },
        { name: "澳门", value: [113.54913, 22.19875] },
      ],
      scatterData: [],
      option: {
        // backgroundColor: '#001f4833',
        tooltip: {
          show: true,
          trigger: "item",
          textStyle: {
            fontSize: 14,
          },
          formatter: function (params) {
            console.log(params);
            if (params.componentSubType === "scatter") {
              return `项目总数：${params.data.count}`;
            }
          },
        },
        animation: false,
        geo: {
          show: true,
          map: "china", // 要与 `registerMap()` 的第一个参数对应, 'china' 会显示南海诸岛
          roam: false, // 鼠标缩放+平移
          aspectScale: 0.9,
          zoom: 1.16,
          selectedMode: "single", // 选中
          // label: {
          //   show: false,
          //   fontSize: 22,
          //   color: '#fff',
          //   position: 'inside' // 注: 将地图 JSON 文件的 cp 坐标删掉才有效
          // },

          silent: true,
          center: [105.194115019531, 36.582111640625],
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false,
                  },
                },
              },
            },
          ],
          itemStyle: {
            color: "#9bdbdc",
            areaColor: "#9bdbdc",
            // areaColor: {
            //   type: 'radial', // 径向渐变
            //   x: 0.5,
            //   y: 0.5,
            //   r: 0.8,
            //   colorStops: [
            //     // 0% 处的颜色
            //     {
            //       offset: 0,
            //       color: 'rgba(147, 235, 248, 0)'
            //     },
            //     // 100% 处的颜色
            //     {
            //       offset: 1,
            //       color: 'rgba(147, 235, 248, .2)'
            //     }
            //   ]
            // },
            // borderColor: 'rgba(147, 235, 248, 1)',
            borderColor: "#71cdcb",
            borderWidth: 7,
            shadowColor: "#b6e7e5",
            shadowBlur: 5,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
          },
        },
        series: [
          {
            type: "map",
            map: "china",
            roam: false, // 鼠标缩放+平移
            aspectScale: 0.9,
            zoom: 1.16,
            center: [105.194115019531, 35.582111640625], // 设置地图中心
            data: this.scatterData,
            // geoIndex: 0, // 共享 geo 样式
            itemStyle: {
              color: {
                image: piePatternImg,
                repeat: "repeat",
              },
              areaColor: {
                image: piePatternImg,
                repeat: "repeat",
              },
              borderColor: "#bddee6",
              borderWidth: 1,
            },
            select: {
              label: {
                show: false,
                color: "#fff",
              },
              itemStyle: {
                areaColor: {
                  image: patternImg,
                  repeat: "repeat",
                },
              },
            },
            emphasis: {
              label: {
                show: false,
                color: "#fff",
              },
              itemStyle: {
                areaColor: {
                  image: patternImg,
                  repeat: "repeat",
                },
              },
            },
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: this.scatterData,
            symbol: function (params) {
              return scatterImg;
              if (params[2] === "0") {
                return "pin";
              } else {
                return "diamond";
              }
            },
            symbolSize: 20,
            symbolOffset: [0, "-100%"],
            label: {
              show: true,
              formatter: "{b}",
              fontSize: 12,
              fontWeight: "bold",
              position: "top",
              backgroundColor: {
                image: scatterBg,
              },
              align: "center",
              padding: [8, 15],
              color: "#fff",
            },

            itemStyle: {
              color: "#1dfd28",
            },
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    mapData: {
      handler(newName, oldName) {
        this.initMap();
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.initMap();
  },
  methods: {
    // 销毁图表实例, 防止内存泄漏
    destroyChart() {
      let chart = echarts.getInstanceByDom(document.getElementById("baseMap"));

      if (chart) {
        chart.clear(); // 释放图形资源
        chart.dispose(); // 销毁实例对象
      }
    },

    // 图表初始化
    initMap() {
      this.scatterData = [];
      this.mapData.map((item) => {
        this.chinaData.map((city) => {
          if (item.area == city.name) {
            let obj = { ...item, ...city };
            this.scatterData.push(obj);
          }
        });
      });
      if (this.scatterData.length) {
        this.scatterData[0].selected = true;
        this.scatterData[0].symbol = scatterHImg;
        this.scatterData[0].label = {
          backgroundColor: {
            image: scatterHBg,
          },
        };
        this.scatterData[0].symbolSize = 30;
      }
      // console.log(this.scatterData)
      // this.$emit('handle-map', this.scatterData[0]);
      this.destroyChart();

      let myChart = echarts.init(document.getElementById("baseMap"));

      // 注册地图
      echarts.registerMap(this.option.geo.map, this.map);

      // 事件解绑
      myChart.off("click");

      this.$set(this.option.series[1], "data", this.scatterData);
      this.$set(this.option.series[0], "data", this.scatterData);
      myChart.setOption(this.option, true);

      // 点击事件
      myChart.on("click", (e) => {
        if (!e.data) {
          this.scatterData.map((item) => {
            if (item.symbolSize == 30) {
              item.selected = true;
            }
          });
          myChart.setOption(this.option, true);
          return;
        }
        // this.$emit('handle-map', this.scatterData[e.dataIndex]);
        this.scatterData.map((item) => {
          item.symbol = item.name == e.name ? scatterHImg : scatterImg;
          item.label = item.name == e.name ? { backgroundColor: { image: scatterHBg } } : { backgroundColor: { image: scatterBg } };
          item.symbolSize = item.name == e.name ? 30 : 20;
          item.selected = item.name == e.name ? true : false;
        });
        myChart.setOption(this.option, true);
      });
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;

  .xx-map {
    width: 100%;
    height: 100%;
  }
}
</style>
