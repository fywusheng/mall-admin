<template>
<!-- 地图初始化 -->
  <div class="store">
    <div id="container"></div>
  </div>
</template>
<script>
import VueAMap from 'vue-amap';
import { lazyAMapApiLoaderInstance } from 'vue-amap';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '6a9f338fbaee119e05d8f0fdeece9979',
  plugin: [
    "AMap.Geocoder", // 点击地图获取经纬度和具体地址
    "AMap.Autocomplete", // 输入提示插件，POI搜索插件
    "AMap.PlaceSearch", // 地点搜索服务,提供了关键字搜索、周边搜索、范围内搜索等功能
    "AMap.Scale", // 比例尺，显示当前地图中心的比例尺
    "AMap.OverView", // 地图鹰眼插件 地图缩略图 
    "AMap.ToolBar", // 地图工具条
    "AMap.CitySearch", // 城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
    "AMap.LineSearch", // 公交路线服务，提供公交路线相关信息查询服务
    "AMap.StationSearch", // 公交站点查询服务，提供途经公交线路、站点位置等信息
    "AMap.Geolocation", // 定位，提供了获取用户当前准确位置、所在城市的方法
    "AMap.Driving", // 驾车路线规划服务，提供按照起、终点进行驾车路线的功能
    "AMap.Weather" // 天气预报插件，用于获取未来的天气信息
  ],
  uiVersion: '1.0.11', // ui库版本，不配置不加载,
  v: '1.4.4'
});



export default {
  name: '',
  data() {
    return {
      
       
    }
  },
  mounted(){
    this.initMap()
  },
  methods: {
      initMap(){
         lazyAMapApiLoaderInstance.load().then(() => {
          this.map = new AMap.Map('container', {
            center: new AMap.LngLat(121.59996, 31.197646),
            resizeEnable:true,
            zoom:14
          });
        });
      }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
 .store{
    padding: 20px;
   
 }
</style>
