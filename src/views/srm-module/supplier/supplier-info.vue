<template>
  <div class="main-content">
     <el-dialog
      class="dialog"
      title="商家详情"
      width="700px"
      :visible.sync="showDialog">

      <div class="content">
        <div class="wrap">
          <div v-if="info.respectFlag" class="header-title">
            <div>敬老商户：{{info.respectLevelName}}</div>
            <div>敬老商户编号：{{info.respectNo}}</div>
          </div>
          <el-descriptions title="" :column="1" size="medium">
              <el-descriptions-item label="所属合伙人">{{info.respectName}}</el-descriptions-item>
              <el-descriptions-item label="所属区域">{{info.actualProvinceName}}, {{info.actualCityName}},{{info.actualAreaName}}</el-descriptions-item>
              <el-descriptions-item label="账号">{{info.loginName}}</el-descriptions-item>
              <el-descriptions-item label="联系人姓名">{{info.contactPerson}}</el-descriptions-item>
              <el-descriptions-item label="联系人手机">{{info.mobile}}</el-descriptions-item>
              <el-descriptions-item label="联系人电子邮箱">{{info.email}}</el-descriptions-item>
              <el-descriptions-item label="营业执照类型">{{info.businessCertificatesType === "0"? "企业": "个人"}}</el-descriptions-item>
              <el-descriptions-item label="营业执照照片">
                <el-image 
                  style="width: 120px; height: 120px"
                  :src="info.businessCertificatesImg" 
                  :preview-src-list="[info.businessCertificatesImg]">
                </el-image>
              </el-descriptions-item>
              <el-descriptions-item label="公司名称">{{info.companyName}}</el-descriptions-item>
              <el-descriptions-item label="证件号码">{{info.businessCertificatesNo}}</el-descriptions-item>
              <el-descriptions-item label="住所/经营场所">{{info.address}}</el-descriptions-item>
              <el-descriptions-item label="成立/注册日期">{{info.businessRegDate.split(" ")[0]}}</el-descriptions-item>
              <el-descriptions-item label="营业期限">{{info.businessStartDate.split(" ")[0]}} 至 {{info.businessEndDate.split(" ")[0]}}</el-descriptions-item>
              <el-descriptions-item label="经营范围">{{info.businessScope}}</el-descriptions-item>
              <el-descriptions-item label="注册资本">{{info.registeredCapital}}万元</el-descriptions-item>
              <el-descriptions-item label="法定代表人姓名">{{info.companyOwner}}</el-descriptions-item>
              <el-descriptions-item label="法人证件照片">
                <el-image 
                  style="width: 120px; height: 120px;margin-right: 15px;"
                  :src="info.idCardFront" 
                  :preview-src-list="[info.idCardFront]">
                </el-image>
                <el-image 
                  style="width: 120px; height: 120px"
                  :src="info.idCardBack" 
                  :preview-src-list="[info.idCardBack]">
                </el-image>
              </el-descriptions-item>
          </el-descriptions>
      </div>
      </div>

      
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { post } from "@/utils/http-client"
export default {
  name: "Supplier-Info",
  data() {
    return {
      showDialog: false,
      info: {}
    }
  },
   async created(){
   
  },
  async mounted() {
  },
  methods: {
   async showInfo(id) {
     const result = await post("/srm/supplier/getByPk", {id})
     if(result.code === "200"){
       this.info = result.data
       this.showDialog = true
     }else{
       this.$message.error(result.msg)
     }
   }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  .content {
    width: 100%;
    display: flex;
    justify-content: center;
    .wrap {
      width: 400px;
      .header-title {
        background: #f6f6f6;
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 4px;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
</style>
