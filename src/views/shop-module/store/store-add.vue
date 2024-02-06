<template>
<!-- 门店管理 -->
  <div class="store">
    <el-page-header @back="back2Prev" content="创建/修改门店信息"></el-page-header>
    <div class="contain">
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" limit="1" label-width="100px" class="set-form">
        <el-form-item label="门店名称" prop="storesName">
          <el-input v-model="ruleForm.storesName" placeholder="请输入门店名称" ></el-input> 
        </el-form-item>  
        <el-form-item label="分店名称" prop="storesSubName">
          <el-input v-model="ruleForm.storesSubName" placeholder="请输入分店名称"></el-input>
        </el-form-item>
        <el-form-item label="门店地址" prop="storesAddress">
          <el-input id="input_address"  v-model="ruleForm.storesAddress"></el-input>
        </el-form-item>
        <!-- <div>详细地址:{{ruleForm.storesAddress}}</div>
        <div>经纬度:{{lnglat}}</div> -->
        <div id="container" class="center_map"></div>
        <el-form-item label="门店类目" prop="categoryId" class="typeSelect">
          <el-select @visible-change="changeSelect" v-model="ruleForm.categoryId" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.serviceId"
              :label="item.serviceName"
              :value="item.serviceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店图" required>
          <!--  :limit="limitNum" TODO 后期去掉不需要的东西 -->
          <el-upload
            :show-file-list="false"
            :auto-upload="true"
            :disabled="ruleForm.storesPic !== ''"
            :file-list="fileList"
            list-type="picture-card"
            :on-success="handleLogoAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-exceed="exceedFile">
            <div class="boxImg" v-if="ruleForm.storesPic">
               <img  :src="ruleForm.storesPic" class="avatar">
               <i  class="el-icon-circle-close icon-delete delIcon" @click.stop="deletImg"></i>
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i> 
         </el-upload>
          <!-- 之后删除 -->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="ruleForm.storesPic" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="门店负责人" prop="storesHead">
          <el-input  v-model="ruleForm.storesHead"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话" prop="storesHeadPhone">
          <el-input  v-model="ruleForm.storesHeadPhone"></el-input>
        </el-form-item>
        <el-form-item label="门店电话" prop="storesPhone">
          <el-input  v-model="ruleForm.storesPhone"></el-input>
        </el-form-item>
        <el-form-item label="营业状态" prop="radioValue">
           <el-radio-group v-model="ruleForm.radioValue">
              <el-radio label="1" >正在营业</el-radio>
              <el-radio label="2" >尚未营业</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="business" v-if="ruleForm.radioValue === '1'">
          <el-form :model="businessForm" :rules="businessRule" ref="business" label-width="100px">
                <el-form-item label="营业时间" prop="startTime">
                    <el-time-select
                      placeholder="起始时间"
                      v-model="businessForm.startTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }">
                    </el-time-select>
                    <el-time-select
                      placeholder="结束时间"
                      v-model="businessForm.endTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00',
                        minTime: businessForm.startTime
                      }">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="使用天" prop="dayValues">
                <el-checkbox-group v-model="businessForm.dayValues">
                  <el-checkbox v-for="day in daysArray" :label="day.key" :key="day.key">{{day.value}}</el-checkbox>
                </el-checkbox-group>
               </el-form-item>
          </el-form>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  
  </div>
</template>
<script>
import { fetch, post } from '@/utils/http-client'
import Vue from "vue"

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

const day = [{key:1,value:'星期一'},{key:2,value:'星期二'},{key:3,value:'星期三'},{key:4,value:'星期四'},{key:5,value:'星期五'},{key:6,value:'星期六'},{key:7,value:'星期日'}]
export default {
  name: '',
  data() {
      /**
       * 手机号码校验
       */
      var validateTelphone = (rule,value,callback) => {
        if(value){
          let mobile = /^(13|18|14|17|15|0)[0-9]{9}$/;
          if (value&&!mobile.test(value)){
            return callback(new Error('请输入正确的联系电话...'));
          }
          else{
            callback()
          }
        }
        else{
          return callback(new Error('联系电话不能为空,请输入...'));
        }
      };
      const validateAttributes = (rule, value, callback) => {
      if(!value){
       callback(new Error('门店电话不能为空,请输入'))
      }else{
        const patter =  /^\d+$/
        if(!patter.test(value)){
          callback(new Error('门店电话只能为数字'))
        }else{
          callback()
        }
      }
    }
    return {
       typeUseCity:'',
       fileList:[],
       id:'',
       lnglat:[116.477131, 39.932174],
       locationName:'',
       daysArray:day,
       //类目字段
       options: [],
       ruleForm: {
          storesName: '',
          storesSubName:'',
          storesAddress:'',
          categoryId:'',
          storesPic:'',
          storesHead:'',
          storesPhone:'',
          storesHeadPhone:'',
          radioValue:'1'
        },
       businessForm:{
          startTime:'',
          endTime:'',
          dayValues:[]
       },
       businessRule:{
         startTime: [
            { required: true, message: '营业时间为必填项', trigger: 'change' },
          ],
          dayValues: [
            { required: true, message: '使用天数为必填项', trigger: 'change' },
          ]
       },
        limitNum:1,
        dialogVisible: false,
        disabled: false,
        rules: {
          storesName: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在50个字符以内', trigger: 'blur' }
          ],
           storesAddress: [
            { required: true, message: '请输入门店地址', trigger: 'blur' },
          ],
           storesHead: [
            { required: true, message: '请输入门店负责人', trigger: 'blur' },
          ],
          radioValue: [
            { required: true, message: '营业状态为必填项', trigger: 'change' },
          ],
           storesPhone: [
            { required: true,validator:validateAttributes, trigger: 'blur' },
          ],
           storesHeadPhone: [
            { required: true, validator:validateTelphone, trigger: 'blur' },
          ],
          categoryId:[{ required: true, message: '请选择类目', trigger: 'change'}]
        }
    }
  },
  created(){
    const id = this.$route.params.id
    this.id = id
    if(id>0){
     this.updateByid()
    }
    this.queryCatetory()
  },
  mounted() {
    this.initMap()
  },
  methods: {
    changeSelect(status){
      if(status){
       this.queryCatetory()
      }
    },
    async queryCatetory(){
      const url = '/srm/stores/getOfficeTypes' 
      const params = {areaCode:this.typeUseCity}
      const result =  await post(url,params)
      if(result.code == 200){
        const list =  result.data || []
        this.options = list
      }else{
        this.$message.error(result.msg)
      }
    },
    async updateByid(){
        const url = '/srm/stores/getStoreById'
        const params ={id:this.id}
        const result =  await post(url,params)
        if(result.code == 200){
          const data  =  result.data
          this.ruleForm.storesName = data.storesName,
          this.ruleForm.storesSubName = data.storesSubName,
          this.ruleForm.storesAddress = data.storesAddress,
          this.ruleForm.categoryId = data.categoryId,
          this.ruleForm.storesPic = data.storesPic,
          this.fileList = [{url:data.storesPic}],
          this.ruleForm.storesHead = data.storesHead,
          this.ruleForm.storesPhone = data.storesPhone,
          this.ruleForm.storesHeadPhone = data.storesHeadPhone,
          this.ruleForm.radioValue = data.status+'',
          this.businessForm.startTime = data.startTime,
          this.businessForm.endTime = data.endTime
          if(data.useDay){
            this.businessForm.dayValues = data.useDay.split(',').map(Number)
           } 
        }
      },
      handleLogoAvatarSuccess(response,file){
        if(!response || response.code != 0){
         return;
        }
        this.ruleForm.storesPic  =  file.response.data.absoluteUrl
      },
      initMap(){
         lazyAMapApiLoaderInstance.load().then(() => {
          this.map = new AMap.Map('container', {
            center: this.lnglat,
            resizeEnable:true,
            zoom:14
          });
          this.handlerAddMarker()
          this.map.on('click',(ev)=>{
           var lnglat = ev.lnglat
           this.lnglat = [lnglat.lng,lnglat.lat]
           this.map.clearMap()
           this.handlerAddMarker()
           this.map.setCenter(this.lnglat)
           AMap.plugin('AMap.Geocoder',()=>{
            var geocoder =  new AMap.Geocoder({
               extensions:'all',
               //city:''
             })
             geocoder.getAddress(this.lnglat,(status,result) =>{
               if(status === 'complete' && result.info === 'OK'){
                 this.ruleForm.storesAddress = result.regeocode.formattedAddress
                 let province = result.regeocode.addressComponent.province
                  const provinces = ['北京市','上海市','天津市','重庆市']
                  if(provinces.includes(province)){
                    this.typeUseCity = province
                  }else{
                    this.typeUseCity = result.regeocode.addressComponent.city
                  }
               }
             })
           })
          })
          AMapUI.loadUI(['misc/PoiPicker'],(PoiPicker)=>{
            var poiPicker =  new PoiPicker({
               input:'input_address'
             })
            poiPicker.on('poiPicked',(poiResult)=>{
              // this.ruleForm.storesAddress = poiResult.item.district + poiResult.item.name + poiResult.item.address
               var lnglat = poiResult.item.location
               this.lnglat =[lnglat.lng,lnglat.lat] 
               this.map.clearMap()
               this.handlerAddMarker()
               this.map.setCenter(this.lnglat)
               this.addressQuery()
            }) 
          })
        });
      },
      handlerAddMarker(){
       const marker = new AMap.Marker({
          icon:'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
          position:this.lnglat
        })  
        this.map.add(marker)
      },
      //详细地址查询
      addressQuery(){
          AMap.plugin('AMap.Geocoder',()=>{
            var geocoder =  new AMap.Geocoder({
               extensions:'all',
               //city:''
             })
             geocoder.getAddress(this.lnglat,(status,result) =>{
               if(status === 'complete' && result.info === 'OK'){
                this.ruleForm.storesAddress = result.regeocode.formattedAddress
                let province = result.regeocode.addressComponent.province
                const provinces = ['北京市','上海市','天津市','重庆市']
                if(provinces.includes(province)){
                   this.typeUseCity = province
                }else{
                   this.typeUseCity = result.regeocode.addressComponent.city
                }
               }
             })
           })
      },
      back2Prev(){
        this.$router.back();
      },
      async submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            let passFlag = false
            if(this.ruleForm.radioValue == 1){
              this.$refs.business.validate((res)=>{
                if(res) {passFlag = true}
              })
              if(!passFlag){
                return
              }
            }
            if(!this.ruleForm.storesPic){
              this.$message.error('请上传门店图片！')
              return
            }
            if(!this.ruleForm.categoryId){
              this.$message.error('请选择门店类目！')
              return
            }
            const url = '/srm/stores/saveSuppliesStores'
            const param = {
              storesName:this.ruleForm.storesName,
              storesSubName:this.ruleForm.storesSubName,
              storesAddress:this.ruleForm.storesAddress,
              categoryId:this.ruleForm.categoryId, 
              //目前经纬度传入的是地址详情的经纬度
              latitude:this.lnglat[1],
              longitude:this.lnglat[0],
              storesPic:this.ruleForm.storesPic,
              storesHead:this.ruleForm.storesHead,
              storesPhone:this.ruleForm.storesPhone,
              storesHeadPhone:this.ruleForm.storesHeadPhone,
              status:this.ruleForm.radioValue,
            }
           if(this.id && this.id != -1) {
             param['id'] = this.id
           } 
           const addParam = {
              startTime:this.businessForm.startTime,
              endTime:this.businessForm.endTime,
              useDay:this.businessForm.dayValues.join(',')
           } 
           if(this.ruleForm.radioValue == 1){Object.assign(param,addParam)}
           const result =  await post(url,param)
           if(result.code == 200){
             this.$message.success('新增/更新门店成功!')
             this.$router.back();
           }else{
             this.$message.warning(result.msg)
           }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        //this.$refs[formName].resetFields();
        this.$router.back()
      },
      handlePictureCardPreview(file) {
        this.ruleForm.storesPic = file.url;
        this.dialogVisible = true;
      },
      exceedFile(file){
        // this.$message({
        //   message: '只能上传一张图片',
        //   type: 'warning'
        // });
      },
      deletImg(){
        this.ruleForm.storesPic = ""
      }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.boxImg{
  position:relative;
  .avatar {
    width: 146px;
    height: 146px;
    display: block;
    border-radius: 6px;
  }
  .delIcon{
    position: absolute;
    right: 4px;
    top: 3px;
    font-size: 19px;
  }
}
  
 .store{
    padding: 20px;
   .contain{
     width:60%;
     margin-top:40px;
     .center_map{
       width:800px;
       height:500px;
     }
     .typeSelect{
       margin-top:30px;
      width:100%;
     }
   }
 }
</style>
