<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" :content="`${routeParamsId == '-1' ? '创建' : '编辑'}加盟商`"></el-page-header>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form class="data-form" :model="dataForm" :rules="dataRules" :v-loading="loading" ref="dataFormInfor" label-position="top" size="small">
      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">基本信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="加盟商编号" prop="" class="item required-item">
              <el-input v-model="dataForm.informationNo" disabled :placeholder="`${routeParamsId != -1 ? '请输入加盟商编号...' : '无需手工录入，后台自动生成...'}`" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="加盟商名称" prop="informationName" class="item">
              <el-input v-model="dataForm.informationName" maxlength="30" placeholder="请输入加盟商名称..." style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="授权范围" prop="authorityScope" class="item">
              <el-select v-model="dataForm.authorityScope" collapse-tags filterable style="width:80%" size="mini" clearable placeholder="请选择授权范围...">
                <el-option v-for="item in agentTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="联系人" prop="contacts" class="item">
              <el-input v-model="dataForm.contacts"  placeholder="请输入联系人姓名..." maxlength="20" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="联系方式" prop="contactsPhone" class="item">
              <el-input v-model="dataForm.contactsPhone" placeholder="请输入联系方式..." maxlength="12" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="加盟费" prop="initialFee" class="item custom-input-number">
              <el-input-number v-model="dataForm.initialFee" placeholder="请输入加盟费..." controls-position="right" :min="0" :max="9999999999" :precision="2" style="width:80%"></el-input-number>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="销售额" prop="salesVolume" class="item custom-input-number">
              <el-input-number v-model="dataForm.salesVolume" placeholder="请输入销售额..." controls-position="right" :min="0" :max="9999999999" :precision="2" style="width:80%"></el-input-number>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item label="地址" prop="address" class="item">
              <el-input v-model="dataForm.address" placeholder="请输入加盟地址..." maxlength="150" style="width:90%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="合同文件" prop="contractFileUrl" class="item">
              <el-upload class="upload-demo" style="width: 80%" action="#"  :limit="1" 
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form>


    <el-form v-if="routeParamsId != '-1'" class="data-form" :v-loading="loading"  label-position="right" size="small">
      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">审核信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="审核状态：" prop="status" class="item" label-position="top">
              <p class="_text">{{ getStatusLabel(dataForm.status) }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="审核意见：" prop="reviewComments" class="item" label-position="top">
              <p class="_text">{{ dataForm.reviewComments }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="审核时间：" prop="reviewDate" class="item" label-position="top">
              <p class="_text">{{ dataForm.reviewDate }}</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form>

    <!-- 编辑显示 -->
    <!-- <el-form v-if="routeParamsId != '-1'" class="data-form" :model="dataForm" :rules="dataRules" :v-loading="loading" ref="dataFormInfor1" label-position="top" size="small">
      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">审核信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="3%"></td>
          <td width="20%">
            <el-form-item label="审核状态：" prop="status" class="item" label-position="top">
              <el-select v-model="dataForm.status" collapse-tags filterable style="width:80%" size="mini" clearable placeholder="请选择审核状态...">
                <el-option v-for="item in checkStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item label="审核意见：" prop="reviewComments" class="item" label-position="top">
              <el-input size="mini" v-model="dataForm.reviewComments" placeholder="请输入审核意见..." maxlength="50" style="width:100%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form> -->


    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-row type="flex" style="height:30px;text-align:center">
      <el-col :span="24" style="align:center">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button v-if="dataForm.saleState!=5" type="primary" :loading="sending"
          :disabled="sending" @click="save">{{ sending ? '正在保存...' : '提交申请' }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { fetch, post } from "@/utils/http-client"
import { deepClone } from '@/utils/index'

export default {
  name: "",
  data() {
    const validateNumber = (rule, value, callback) => {
      let str = ''
      if (rule.field === 'initialFee') {
        str = '加盟费'
      } else if (rule.field === 'salesVolume') {
        str = '销售额'
      }
      if (value == 0) {
        callback(new Error(`${str}数值需要大于零！`))
      }
      const patter = /^[-+]?\d*\.?\d{0,2}$/
      if (!patter.test(value)) {
        callback(new Error(`${str}数值只能为整数或者两位小数！`))
      } else {
        callback()
      }
    }

    // 手机 或者 座机号码
    const isPhoneNumber = (rule, value, callback) => {
      const patter = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$|^0\d{2,3}-\d{7,8}(-\d{1,4})?$/
      if (!patter.test(value)) {
        callback(new Error(`请输入正确的手机号码或者座机号码！`))
      } else {
        callback()
      }
    }

    return {
      routeParamsId: '',
      checkStatusOptions: [
        { label: "通过", value: 1 },
        { label: "不通过", value: 0 },
      ],
      agentTypeOptions: [
        { label: "省代", value: 1 },
        { label: "市代", value: 2 },
        { label: "区县代", value: 3 },
        { label: "城乡代", value: 4 },
        { label: "个体", value: 5 },
      ],
      userObject: {},
      areaList: [],
      loading: false,
      sending: false,
      brandOptions: [],
      categoryOptions: [],
      supplierOptions: [],
      dataForm: {
        informationNo: '',
        informationName: '',
        authorityScope: '',
        contacts: '',
        contactsPhone: '',
        initialFee: '',
        salesVolume: '',
        contractFileUrl: '',
        status: '',
        reviewComments: '',
      },
      dataRules: {
        informationNo: [{ required: true, message: "加盟商编号不能为空，请完整输入！", trigger: "blur" }],
        informationName: [{ required: true, message: "加盟商名称不能为空，请完整输入！", trigger: "blur" }],
        authorityScope: [{ required: true, message: "授权范围不能为空，请选择！", trigger: "change" }],
        contacts: [{ required: true, message: "联系人不能为空，请完整输入！", trigger: "change" }],
        contactsPhone: [
          { required: true, message: "联系方式不能为空，请完整输入！", trigger: "change" },
          // { required: true, validator: isPhoneNumber, trigger: "change" }
        ],
        initialFee: [
          { required: true, message: "加盟费不能为空，请完整输入！", trigger: "change" },
          { required: true, validator: validateNumber, trigger: "change" }
        ],
        salesVolume: [
          { required: true, message: "销售额不能为空，请完整输入！", trigger: "change" },
          { required: true, validator: validateNumber, trigger: "change" }  
        ],
        // 上传文件接口报错，暂时 注释这里，保证正常测试，最后需要打开
        contractFileUrl: [{ required: true, message: "合同文件不能为空，请上传！", trigger: ["change", "blur"] }],
        // status: [{ required: true, message: "审核状态不能为空，请选择！", trigger: "blur" }],
        // reviewComments: [{ required: true, message: "审核意见不能为空，请输入！", trigger: "blur" }],
      },
    };
  },
  async created() {
  },
  components: {
  },
  async mounted() {
    this.routeParamsId = this.$route.params.id
    const user = localStorage.getItem('userInfor')
    this.userObject = JSON.parse(user)
    if (this.$route.params.id > '-1') {
      this.loadData(this.$route.params.id)
    }
  },
  methods: {
    getStatusLabel(val) {
      const res = this.checkStatusOptions.find(item => item.value == val)
      return res ? res.label : ''
    },

    async loadData(productId) {
      if (productId && productId == -1) {
        return;
      }
      post('/srm/sh/information/getInformationById', {id: productId}).then(res => {
        if (res.code == '200') {
          this.dataForm = {...res.data}
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    save() {
      // 编辑 验证审核数据
      // let res = true
      // if (this.routeParamsId > -1) {
      //   this.$refs.dataFormInfor1.validate(valid => {
      //     res = valid
      //   })
      // }
      // if (!res) return
      this.$refs.dataFormInfor.validate(async valid => {
        if (valid) {
          this.sending = true;
          const params = deepClone(this.dataForm)
          // 编辑传 id，审核状态 和 审核信息传 “”
          if (this.routeParamsId > -1) {
            params.id = this.routeParamsId
            params.status = ''
            params.reviewComments = ''
            // 添加 不传 审核相关的两个字段
          } else {
            delete params.status
            delete params.reviewComments
          }
          const result = await post("/srm/sh/information/saveInformation", params)
          this.sending = false;
          if (result.code == 200) {
            this.$message.success("加盟商数据保存成功！");
            this.back2Prev()
          } else {
            this.$message.error(result.msg);
          }
        } else {
          return false;
        }
      });
    },
    back2Prev() {
      this.$router.back();
    },
    handleAvatarSuccess(response, file) {
      if (response?.code == 0) {
        this.dataForm.contractFileUrl = response.data.absoluteUrl;
      }
    },
    beforeAvatarUpload(file) {
      let fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isFile = ['word', 'pdf', 'doc', 'docx'].includes(fileType);
      const isLt30M = file.size / 1024 / 1024 < 30;
      if (!isFile) {
        this.$message.error('上传文件只能是 word、pdf、docx 格式!');
      }
      if (!isLt30M) {
        this.$message.error('上传文件大小不能超过 30MB!');
      }
      return isFile && isLt30M;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.add_store {
  margin-bottom: 23px;
}
.lineFlex {
  display: flex;
}
._line {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  ._name {
    color: #99a9bf;
  }
}
._left {
  width: 40%;
}
._right {
  width: 605；;
}
.line_right {
  text-align: right;
  margin-top: 27px;
}
.service {
  background-color: #fdfdfd;
}
.autoProvice {
  min-width: 80%;
  max-height: 100px;
  overflow: auto;
}
.div-layout {
  padding: 10px 20px;
}
.avatar-uploader .el-upload {
  border: 0.5px dashed #5f5d5d;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

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
.item .el-form-item__label {
  height: 35px;
}
.el-form-item__error {
  margin-top: 10px !important;
  display: block !important;
}
._label {
  margin-left: 25px;
}
.required-item {
  .el-form-item__label::before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
.custom-input-number {
  .el-input {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
}
._text {
  transform: translateY(-5px);
}
</style>