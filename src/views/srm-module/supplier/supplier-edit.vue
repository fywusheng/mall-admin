<template>
  <div class="main-content">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px"
      class="demo-ruleForm" size="small">

      <el-form-item label="所属合伙人" prop="parentId">{{userInfo.supplierName}}</el-form-item>
      <el-form-item label="所属区域" prop="actualAreaCode">
        <div style="display:flex">
          <el-cascader v-model="ruleForm.actualCityCodg" :options="actualCityList"
            :props="cascaderProps" clearable ref="actualCityCodg" :disabled="true"
            style="width:100%" />
          <el-select v-model="ruleForm.actualAreaCode" placeholder="请选择区"
            @change="handleActualCityCodeChange" :disabled="!pageStatus" style="width:100%">
            <el-option v-for="item in areaCodeList" :label="item.name" :value="item.code"
              :key="item.code"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="登录账号" prop="loginName">
        <el-input v-model="ruleForm.loginName" :disabled="pageStatus >= 0"
          autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item v-if="pageStatus < 0" label="输入密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"
          autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item v-if="pageStatus < 0" label="确认密码" prop="validPassword">
        <el-input v-model="ruleForm.validPassword" type="password"
          autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contactPerson">
        <el-input v-model="ruleForm.contactPerson" :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机" prop="mobile">
        <el-input v-model="ruleForm.mobile" :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="联系人电子邮箱" prop="email">
        <el-input v-model="ruleForm.email" :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="营业执照类型" prop="businessCertificatesType">
        <el-radio-group v-model="ruleForm.businessCertificatesType" :disabled="!pageStatus">
          <el-radio label="0">企业法人营业执照</el-radio>
          <el-radio label="1">个体工商户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="营业执照照片" prop="businessCertificatesImg">
        <el-upload class="avatar-uploader" :show-file-list="false"
          :on-success="handleLogoAvatarSuccess" :before-upload="beforeAvatarUpload"
          :auto-upload="true" :disabled="!pageStatus || ruleForm.businessCertificatesImg !== ''">
          <div class="image-list" v-if="ruleForm.businessCertificatesImg">
            <el-image :src="ruleForm.businessCertificatesImg"
              :preview-src-list="[ruleForm.businessCertificatesImg]" class="avatar">
            </el-image>

            <i v-if="!auditId" class="el-icon-circle-close icon-delete"
              @click.stop="delBusinessCertificatesImg"></i>
          </div>
          <el-image v-else :src="require('@/assets/imgs/bg-busniess.png')"
            class="avatar-uploader-icon"></el-image>
        </el-upload>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="ruleForm.companyName" :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="证照号码" prop="businessCertificatesNo">
        <el-input v-model="ruleForm.businessCertificatesNo" :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="住所/经营场所" prop="cityCodg">
        <el-cascader v-model="ruleForm.cityCodg" :options="cityList" :props="cascaderProps"
          clearable ref="cityCode" :disabled="!pageStatus" style="width:100%"></el-cascader>
      </el-form-item>
      <el-form-item label=" " prop="address">
        <el-input v-model="ruleForm.address" placeholder="请输入详细地址"
          :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="成立注册日期" prop="businessRegDate">
        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.businessRegDate"
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:100%" @change="handleRegChange"
          :disabled="!pageStatus"></el-date-picker>
      </el-form-item>
      <el-form-item v-if="ruleForm.businessCertificatesType === '0'" label="营业期限"
        prop="businessStartDate">
        <el-col :span="9">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.businessStartDate"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;"
            @change="handleStartChange" :disabled="longTimeFlag || (!pageStatus)"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
        <el-col :span="9">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.businessEndDate"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;"
            :disabled="longTimeFlag || (!pageStatus)"></el-date-picker>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-checkbox v-model="longTimeFlag" :disabled="!pageStatus">长期</el-checkbox>
        </el-col>

      </el-form-item>
      <el-form-item label="经营范围" prop="businessScope">
        <el-input type="textarea" v-model="ruleForm.businessScope"
          :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.businessCertificatesType === '0'" label="注册资本"
        prop="registeredCapital">
        <el-input v-model="ruleForm.registeredCapital" type="number" :disabled="!pageStatus">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="法定代表人姓名" prop="companyOwner">
        <el-input v-model="ruleForm.companyOwner" :disabled="!pageStatus"></el-input>
      </el-form-item>
      <el-form-item label="法定代表人照片" prop="idCardFront">
        <el-upload class="avatar-uploader" :show-file-list="false"
          :on-success="handleIdCardFrontSuccess" :before-upload="beforeAvatarUpload"
          :auto-upload="true" :disabled="!pageStatus || ruleForm.idCardFront !== ''">
          <div class="image-list" v-if="ruleForm.idCardFront">
            <el-image :src="ruleForm.idCardFront" :preview-src-list="[ruleForm.idCardFront]"
              class="avatar">
            </el-image>

            <i v-if="!auditId" class="el-icon-circle-close icon-delete"
              @click.stop="delIdCardFront"></i>
          </div>
          <el-image v-else :src="require('@/assets/imgs/idcard-renxiang.png')"
            class="avatar-uploader-icon"></el-image>
        </el-upload>
        <el-upload class="avatar-uploader" :show-file-list="false"
          :on-success="handleIdCardBackSuccess" :before-upload="beforeAvatarUpload"
          :auto-upload="true" :disabled="!pageStatus || ruleForm.idCardBack !== ''">
          <div class="image-list" v-if="ruleForm.idCardBack">
            <el-image :src="ruleForm.idCardBack" :preview-src-list="[ruleForm.idCardBack]"
              class="avatar">
            </el-image>

            <i v-if="!auditId" class="el-icon-circle-close icon-delete"
              @click.stop="delIdCardBack"></i>
          </div>
          <el-image v-else :src="require('@/assets/imgs/idcard-guohui.png')"
            class="avatar-uploader-icon"></el-image>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button v-if="pageStatus !== 0" type="primary"
          @click="submitForm('ruleForm')">提交审核</el-button>
        <el-button v-if="pageStatus === 0" type="info" @click="showDialog = true">审核驳回</el-button>
        <el-button v-if="pageStatus === 0" type="info" @click="auditResolve">审核通过</el-button>
      </el-form-item>

    </el-form>

    <el-dialog class="dialog" title="审核驳回" width="550px" :visible.sync="showDialog">
      <el-form class="data-form" :model="dataForm" ref="dataForm" label-width="150px"
        label-position="top" size="small">
        <div>
          <el-form-item label="">
            确认要驳回吗？请输入原因
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="dataForm.auditRemark" type="textarea" maxlength="200" :rows="5"
              placeholder="请输入审核备注（200字以内）" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="auditReject">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { post, fetch } from "@/utils/http-client"
import { checkMobile, checkEmail } from "@/utils/check"
import dayjs from "dayjs"
import sha256 from 'crypto-js/sha256'
export default {
  name: "Supplier-Edit",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!checkMobile(value)) {
        callback(new Error("输入正确的手机号!"))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!checkEmail(value)) {
        callback(new Error("输入正确的邮箱！"))
      } else {
        callback()
      }
    }
    const validateNextImg = (rule, value, callback) => {
      if (this.ruleForm.idCardBack === "") {
        callback(new Error("请上传照片！"))
      } else {
        callback()
      }
    }
    return {
      cityList: [],
      actualCityList: [],
      areaCodeList: [],
      longTimeFlag: false,
      showDialog: false,
      // 页面状态 -1：新增 0: 审核 正整数：编辑
      pageStatus: 0,
      dataForm: {},
      ruleForm: {
        parentId: "",
        businessCertificatesType: "0",
        businessCertificatesImg: "",
        businessRegDate: "",
        businessStartDate: "",
        businessEndDate: "",
        idCardFront: "",
        idCardBack: "",
        loginName: "",
        password: "",
        supplierName: "",
        companyName: "",
        cityCodg: "",
        address: "",
        businessScope: "",
        companyOwner: "",
        contactPerson: "",
        mobile: "",
        email: "",
        registeredCapital: "",
        businessCertificatesNo: "",

        // 所属区域
        actualCityCodg: [],
        actualProvinceCode: "",
        actualCityCode: "",
        actualAreaCode: "",
        actualProvinceName: "",
        actualCityName: "",
        actualAreaName: ""
      },
      rules: {
        cityCodg: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        actualAreaCode: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        loginName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ],
        validPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        contactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        businessCertificatesType: [
          { required: true, message: "请选择", trigger: "blur" }
        ],
        businessCertificatesImg: [
          { required: true, message: "请上传营业执照照片", trigger: "change" }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        businessCertificatesNo: [
          { required: true, message: "请输入证件号码", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        businessRegDate: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
        businessStartDate: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
        businessEndDate: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
        businessScope: [
          { required: true, message: "请输入经营范围", trigger: "blur" }
        ],
        registeredCapital: [
          { required: true, message: "请输入注册资本", trigger: "blur" }
        ],
        companyOwner: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        idCardFront: [
          { required: true, message: "请上传照片", trigger: "blur" },
          { validator: validateNextImg, trigger: "change" }
        ]
      },
      productorList: [],
      respectList: [],
      /*地区传参 */
      cascaderProps: {
        value: "code",
        label: "name",
        leaf: "pid",
        children: "children",
        expandTrigger:
          "hover"
      },
      // 请求参数
      dataAttr: [
        "parentId",
        "loginName",
        "password",
        "id",
        "supplierName",
        "companyName",
        "provinceCode",
        "cityCode",
        "areaCode",
        "address",
        "businessScope",
        "businessRegDate",
        "businessStartDate",
        "businessEndDate",
        "companyOwner",
        "contactPerson",
        "mobile",
        "email",
        "registeredCapital",
        "idCardFront",
        "idCardBack",
        "businessCertificatesNo",
        "businessCertificatesType",
        "businessCertificatesImg",
        "actualProvinceCode",
        "actualCityCode",
        "actualAreaCode",
        "actualProvinceName",
        "actualCityName",
        "actualAreaName"
      ]
    }
  },
  created() {
    this.initArea()
  },
  async mounted() {

    this.pageStatus = this.$route.params.id // 操作类型
    this.auditId = this.$route.params.pageStatus // 审核id

    await this.loadRespectList()
    await this.getCityList()
    await this.getAreaCityList()
    await this.getProductInfo()
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    initArea() {
      this.ruleForm.actualProvinceName = this.userInfo.actualProvinceName
      this.ruleForm.actualProvinceCode = this.userInfo.actualProvinceCode
      this.ruleForm.actualCityName = this.userInfo.actualCityName
      this.ruleForm.actualCityCode = this.userInfo.actualCityCode
      this.ruleForm.actualAreaName = this.userInfo.actualAreaName
      this.ruleForm.actualAreaCode = this.userInfo.actualAreaCode
      this.ruleForm.actualCityCodg = [this.userInfo.actualProvinceCode, this.userInfo.actualCityCode]
    },
    cancel() {
      this.$router.back()
    },
    // 审核驳回
    async auditReject() {
      const params = {
        id: this.auditId,
        status: "4",
        auditRemark: this.dataForm.auditRemark
      }
      const res = await post("/srm/supplier/audit", params)
      if (res.code === "200") {
        this.$message.success(res.msg)
        setTimeout(() => {
          this.$router.push({ name: "Supplier-List" })
        }, 1000)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 审核通过
    auditResolve() {
      this.$confirm("确认要审核通过吗？", "提示", {
        type: "warning",
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const params = {
            id: this.auditId,
            status: "3",
            auditRemark: ""
          }
          const res = await post("/srm/supplier/audit", params)
          if (res.code === "200") {
            this.$message.success(res.msg)
            setTimeout(() => {
              this.$router.push({ name: "Supplier-List" })
            }, 1000)
          } else {
            this.$message.error(res.msg)
          }

        })
        .catch((action) => { })
    },
    // 保存设置
    submitForm(formName) {
      // const params = this.getParams(this.ruleForm)
      // debugger
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = this.getParams(this.ruleForm)
          let queryUrl = ""
          if (this.pageStatus > 0) {
            params.id = this.pageStatus
            queryUrl = "/srm/supplier/update"
          } else if (this.pageStatus < 0) {
            queryUrl = "/srm/supplier/add"
          }
          const res = await post(queryUrl, params)
          if (res.code === "200") {
            this.$message.success(res.msg)
            setTimeout(() => {
              this.$router.push({ name: "Supplier-List" })
            }, 1000)
          } else {
            this.$message.error(res.msg)
          }
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    getParams(data) {
      const result = Object.assign({}, data)
      const { businessRegDate, cityCodg, actualCityCodg } = result

      if (this.longTimeFlag) {
        const yyyy = parseInt(businessRegDate.split("-")[0]) + 100
        const MM = businessRegDate.split("-")[1]
        const dd = businessRegDate.split("-")[2]
        result.businessEndDate = `${yyyy}-${MM}-${dd}`
      }
      result.businessRegDate = new Date(result.businessRegDate).getTime()
      result.businessStartDate = new Date(result.businessStartDate).getTime()
      result.businessEndDate = new Date(result.businessEndDate).getTime()

      if (cityCodg.length) {
        const names = this.$refs.cityCode.getCheckedNodes()[0].pathLabels
        result.provinceName = names[0]
        result.provinceCode = cityCodg[0]
        result.cityName = names[1]
        result.cityCode = cityCodg[1]
        result.areaName = names[2]
        result.areaCode = cityCodg[2]
      }

      // 所属区域
      const names = this.$refs.actualCityCodg.getCheckedNodes()[0].pathLabels
      result.actualProvinceName = names[0]
      result.actualProvinceCode = actualCityCodg[0]
      result.actualCityName = names[1]
      result.actualCityCode = actualCityCodg[1]

      result.supplierName = result.companyName
      result.parentId = this.userInfo.supplierId
      result.password = sha256(result.password).toString()

      delete result["cityCodg"]
      delete result["actualCityCodg"]
      delete result["validPassword"]

      return result
    },

    // 获取区域列表
    async getCityList() {
      const result = await fetch("/area/getAreaTree", {});
      if (result.code == 200) {
        this.cityList = result.data;
        this.actualCityList = this.getThirdCityList(result.data)
      } else {
        this.$message.error(result.msg);
      }
    },

    // 获取省市下的所有区
    async getAreaCityList() {
      const params = {
        provinceCode: this.userInfo.actualProvinceCode,
        cityCode: this.userInfo.actualCityCode,
      }
      const result = await fetch("/area/getAreaByPCodeAndCCode", params)
      if (result.code === "200") {
        this.areaCodeList = result.data

      } else {
        this.$message.error(result.msg)
      }
    },
    getThirdCityList(list) {
      const col = JSON.parse(JSON.stringify(list))
      col.forEach(el => {
        el.children.forEach(item => {
          item.children = null
        })
      })
      return col
    },

    // 获取商家信息
    async getProductInfo() {
      let id = this.pageStatus
      if (id < 0) { return }
      if (id === 0) {
        id = this.auditId
      }
      const result = await post("/srm/supplier/getByPk", { id })
      if (result.code === "200") {
        this.formatData(result.data)
      } else {
        this.$message.error(result.msg)
      }
    },
    async formatData(allData) {
      this.dataAttr.forEach(key => {
        this.ruleForm[key] = allData[key]
      })
      this.ruleForm.parentId = allData.parentId + ""
      this.ruleForm.cityCodg = [allData.provinceCode, allData.cityCode, allData.areaCode]
      this.ruleForm.actualCityCodg = [allData.actualProvinceCode, allData.actualCityCode]
      const nextDate = dayjs(allData.businessStartDate).add(100, "year").format("YYYY-MM-DD")
      const businessEndDate = dayjs(allData.businessEndDate).format("YYYY-MM-DD")
      if (nextDate === businessEndDate) {
        this.longTimeFlag = true
      }
    },

    async loadRespectList() {
      const result = await post("srm/supplier/listRespectAll", {})
      if (result.code === "200") {
        this.respectList = result.data
      } else {
        this.$message.error(result.msg)
      }
    },
    handleActualCityCodeChange(val) {
      const obj = this.areaCodeList.find(el => el.code === val)
      this.ruleForm.actualAreaName = obj.name
    },
    handleRegChange() {
      this.ruleForm.businessStartDate = this.ruleForm.businessRegDate
    },
    handleStartChange() {
      this.ruleForm.businessRegDate = this.ruleForm.businessStartDate
    },
    handleLogoAvatarSuccess(response, file) {
      if (response.code != "0") {
        return
      }
      this.ruleForm.businessCertificatesImg = response.data.absoluteUrl
    },
    delBusinessCertificatesImg() {
      this.ruleForm.businessCertificatesImg = ""
    },
    handleIdCardFrontSuccess(response, file) {
      if (response.code != "0") {
        return
      }
      this.ruleForm.idCardFront = response.data.absoluteUrl
    },
    delIdCardFront() {
      this.ruleForm.idCardFront = ""
    },
    handleIdCardBackSuccess(response, file) {
      if (response.code != "0") {
        return
      }
      this.ruleForm.idCardBack = response.data.absoluteUrl
    },
    delIdCardBack() {
      this.ruleForm.idCardBack = ""
    },
    beforeAvatarUpload(file) {
      const isJPEG = file.name.split(".")[1] === "jpeg"
      const isJPG = file.name.split(".")[1] === "jpg"
      const isPNG = file.name.split(".")[1] === "png"
      const isLt500K = file.size / 1024 / 2000 < 2
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只支持上传JPG/PNG格式!")
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过2MB!")
      }
      return (isJPEG || isJPG || isPNG) && isLt500K
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  padding: 16px;
  background: #ffffff;
  .demo-ruleForm {
    width: 700px;
  }
  ::v-deep .avatar-uploader {
    display: inline-block;
    margin-right: 10px;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      &:hover {
        border-color: #ff5500;
      }
      .avatar {
        width: 160px;
        height: 110px;
        display: list-item;
      }
      .image-list {
        position: relative;
        .icon-delete {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 20px;
          color: black;
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 160px;
        height: 110px;
        line-height: 110px;
        text-align: center;
      }
    }
  }
}
</style>
