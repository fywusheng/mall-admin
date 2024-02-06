<template>  
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" limit="1" label-width="100px" class="set-form">
    <el-form-item label="店铺名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
   <el-form-item label="店铺电话" prop="phone">
      <el-input  v-model="ruleForm.phone"></el-input>
    </el-form-item>
    <!-- :limit="limitNum" -->
    <el-form-item label="店铺图片" required>
      <el-upload
        :disabled="ruleForm.dialogImageUrl !== ''"
        :show-file-list="false"
        list-type="picture-card"
        :on-success="handleLogoAvatarSuccess"
        :on-preview="handlePictureCardPreview"
        :on-exceed="exceedFile">
            <div class="boxImg" v-if="ruleForm.dialogImageUrl">
               <img  :src="ruleForm.dialogImageUrl" class="avatar">
               <i  class="el-icon-circle-close icon-delete delIcon" @click.stop="deletImg"></i>
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i> 
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="ruleForm.dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="店铺公告" prop="desc">
      <el-input type="textarea" placeholder="请输入店铺公告" v-model="ruleForm.desc" maxlength="500" show-word-limit></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="sending" :disabled="sending" @click="submitForm('ruleForm')">{{sending ? '提交中' :'提交'}}</el-button>
      <el-button @click="resetForm('ruleForm')">清空</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { fetch, post } from "@/utils/http-client";
 
  export default {
    data() {
       /**
       * 手机号码校验
       */
      var validateTelphone = (rule,value,callback) => {
        if(value){
          let mobile = /^(13|18|14|17|15)[0-9]{9}$/;
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
      }
      return {
        sending:false,
        ruleForm: {
          name: '',
          phone:'',
          desc:'',
          dialogImageUrl:''
        },
        limitNum:1,
        dialogVisible: false,
        disabled: false,
        rules: {
          name: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' },
            { min: 1, max: 24, message: '长度在24个字符以内', trigger: 'blur' }
          ],
          phone: [{ required: true, validator:validateTelphone, trigger: 'blur' }],
          dialogImageUrl: [
            { required: true, message: '请上传店铺照片', trigger: 'change' }
          ]
        },
        supplierId:''
      };
    },
    created(){
       const userinfor  =  localStorage.getItem('userInfor')
       const userinforObject = JSON.parse(userinfor)
       this.supplierId = userinforObject.supplierId
       this.storeInfor()
    },

    methods: {
     async storeInfor(){
        const result = await post("/srm/supplier/getByPk", {id:this.supplierId})
        if(result.code === "200"){
          const data = result.data
          this.ruleForm = {
              name: data.supplierStoreName,
              phone: data.supplierStorePhone,
              desc: data.supplierStoreNotice,
              dialogImageUrl:data.supplierStorePicUrl
          } 
          //TODO 店铺设置回显 等待接口字段对应
        }else{
          this.$message.error(result.msg)
        }
     }, 
     deletImg(){
       this.ruleForm.dialogImageUrl = ''
     },
     async submitForm(formName) {
        this.$refs[formName].validate( async(valid) => {
          if (valid) {
              if(this.ruleForm.name.length>24){
                this.$message.warning('店铺名称长度在24个字符以内!')
               return
              }
              if(!this.ruleForm.dialogImageUrl){
                this.$message.warning('请上传店铺照片!')
                return
              }
              this.sending = true
              const url = '/supplier/submit'
              const params = {
                supplierName:this.ruleForm.name,
                companyPhone:this.ruleForm.phone,
                picUrl:this.ruleForm.dialogImageUrl,
                supplierNotice:this.ruleForm.desc
              }  
              const result =  await post(url,params)
              if(result.code == 200){
                this.sending = false
                this.$message.success('店铺设置成功！')
              }else{
                this.$message.error(result.msg)
              }
            } else {
              return false;
            }
          });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleLogoAvatarSuccess(response,file){
        if(!response || response.code != 0){
              return;
        }
         this.ruleForm.dialogImageUrl  =  file.response.data.absoluteUrl
      },
      handlePictureCardPreview(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      exceedFile(file){
        this.$message({
          message: '只能上传一张图片',
          type: 'warning'
        });
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
 .set-form{
   width:40%;
     .avatar-uploader-icon {
    font-size: 28px;
    color: #609df3;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
 }
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
</style>