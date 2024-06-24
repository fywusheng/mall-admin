<template>
  <div>
    <div id="main" style="height: 600px"></div>
  </div>
</template>

<script>
import "@/plugin/chart/echarts-all.js";
export default {
  name: "BigData",
  data() {
    return {};
  },
  mounted() {
    // 基于准备好的dom，初始化echarts图表
    console.log(echarts);
    var myChart = echarts.init(document.getElementById("main"));

    var option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}",
      },
      series: [
        {
          name: "中国",
          type: "map",
          mapType: "china",
          selectedMode: "single",
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } },
          },
          data: [{ name: "广东", selected: false }],
        },
      ],
    };
    // 为echarts对象加载数据
    myChart.setOption(option);
    myChart.on(echarts.config.EVENT.MAP_SELECTED, function (param) {
      var selected = param.selected;
      var str = "当前选择： ";
      for (var p in selected) {
        if (selected[p]) {
          str += p + " ";
        }
      }
      // document.getElementById("wrong-message").innerHTML = str;
      alert(str);
    });
  },
};
</script>

<style></style>
