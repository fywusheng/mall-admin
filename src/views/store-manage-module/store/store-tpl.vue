<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" :content="`${routeParamsId == -1 ? '创建' : '编辑'}门店`"></el-page-header>
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
            <el-form-item label="门店编号：" prop="storeNo" class="item required-item">
              <el-input v-model="dataForm.storeNo" disabled :placeholder="`${routeParamsId != -1 ? '请输入门店编号...' : '无需手工录入，后台自动生成...'}`" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店名称：" prop="storeName" class="item">
              <el-input v-model="dataForm.storeName" placeholder="请输入门店名称..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店地址：" prop="districtArea" class="item">
              <el-cascader class="_cascader" v-model="dataForm.districtArea" :options="areaList" :props="{ value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}" size='small'  clearable placeholder="请选择所属地区..." style="width:40%"/>
              <el-input v-model="dataForm.address" placeholder="请输入详细地址..." style="width: 40%" />
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="店长姓名：" prop="storeManagerName" class="item">
              <el-input v-model="dataForm.storeManagerName" placeholder="请输入店长姓名..." maxlength="20" style="width:80%"></el-input>              
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="联系电话/登录账号：" prop="contactPhone" class="item">
              <el-input v-model="dataForm.contactPhone" placeholder="请输入联系电话/登录账号..." maxlength="12" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="支持电话：" prop="supportPhone" class="item">
              <el-input v-model="dataForm.supportPhone" placeholder="请输入支持电话..." maxlength="12" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="开店时间：" prop="openingTime" class="item">
              <el-date-picker v-model="dataForm.openingTime" type="date" value-format="yyyy-MM-dd" placeholder="选择开店时间" style="width: 80%" >
              </el-date-picker>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店有效期：" prop="periodData" class="item">
              <el-date-picker v-model="dataForm.periodData" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 80% !important">
              </el-date-picker>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="所属加盟商：" prop="infomationNo" class="item">
              <franchisee-select v-model="dataForm.infomationNo" placeholder="请输入加盟商名称..." style="width: 80%" size="small"/>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="售卖区域：" prop="salesArea" class="item">
              <el-select v-if="$route.params.id == 1" disabled multiple :value="['0']" size='small'  clearable placeholder="请选择售卖区域..." style="width:80%">
                <el-option key="0" label="全国" value="0">全国</el-option>
              </el-select>
              <el-cascader v-else class="_cascader" v-model="dataForm.salesArea" :options="areaList" :props="{multiple:true, value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}" size='small'  clearable placeholder="请选择售卖区域..." style="width:80%"/>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="经营范围：" prop="businessScope" class="item">
              <el-select v-if="$route.params.id == 1" disabled multiple :value="['0']" size='small'  clearable placeholder="请选择售卖区域..." style="width:80%">
                <el-option key="0" label="全部" value="0">全部</el-option>
              </el-select>
              <el-cascader v-else class="_cascader"  v-model="dataForm.businessScope" :options="categoryOptions" placeholder="请选择经营范围..." clearable :props="{multiple:true, value:'id',label:'name',leaf:'parentCode',children: 'children',expandTrigger: 'hover'}" style="width:80%"/>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="经营品牌：" prop="operatingBrand" class="item">
              <el-select v-if="$route.params.id == 1" disabled multiple :value="['0']" size='small'  clearable placeholder="请选择售卖区域..." style="width:80%">
                <el-option key="0" label="全部" value="0">全部</el-option>
              </el-select>
              <el-select v-else v-model="dataForm.operatingBrand" multiple filterable style="width:80%" clearable placeholder="请选择经营品牌...">
                <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>

      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">企业佣金</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="佣金计算方式：" prop="commissionCalculation" class="item">
              <el-input v-model="dataForm.commissionCalculation" placeholder="请输入佣金计算方式..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="佣金结算方式：" prop="commissionSettlement" class="item">
              <el-input v-model="dataForm.commissionSettlement" placeholder="请输入佣金结算方式..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%"></td>
          <td width="5%"></td>
        </tr>
      </table>

      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">企业对公账户信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="对公账户户名：" prop="corporateAccount" class="item">
              <el-input v-model="dataForm.corporateAccount" placeholder="请输入对公账户户名..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="对公银行卡号：" prop="corporateBank" class="item">
              <el-input v-model="dataForm.corporateBank" placeholder="请输入对公银行卡号..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="开户银行及支行：" prop="corporateBankBranch" class="item">
              <el-input v-model="dataForm.corporateBankBranch" placeholder="请输入开户银行及支行..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>

      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">企业信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="90%" colspan="3">
            <el-form-item label="" prop="enterpriseInformation" class="item">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="dataForm.enterpriseInformation" placeholder="请输入企业信息..." maxlength="32" style="width:93%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>

      <!-- 审核未通过展示 -->
    </el-form>
      <!-- <el-form class="data-form" v-if="reviewStatusValue == 0" :model="dataForm" :rules="dataRules" :v-loading="loading" ref="dataFormInfor1" label-position="top" size="small">
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
            <el-form-item label="审核状态：" prop="reviewStatus" class="item" label-position="top">
              <el-select v-model="dataForm.reviewStatus" collapse-tags filterable style="width:80%" size="mini" clearable placeholder="请选择审核状态...">
                <el-option v-for="item in checkStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item label="审核意见：" prop="reviewComments" class="item" label-position="top">
              <el-input size="mini" v-model="dataForm.reviewComments" placeholder="请输入审核意见..." maxlength="32" style="width:100%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form> -->
    <el-form class="data-form" v-if="reviewStatusValue == 0" label-position="right" size="small">
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
            <el-form-item label="审核状态：" prop="reviewStatus" class="item" label-position="top">
              <p class="_text">{{ getStatusLabel(dataForm.reviewStatus) }}</p>
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


    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-row type="flex" style="height:30px;text-align:center">
      <el-col :span="24" style="align:center">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button v-if="dataForm.saleState!=5" type="primary" :loading="sending"
          :disabled="sending" @click="save">{{ sending ? '正在保存...' : '提交审核' }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
import FranchiseeSelect from '@/components/FranchiseeSelect'
import { deepClone } from '@/utils/index'

export default {
  name: "",
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value) {
        const patter = /^\d+$/
        if (!patter.test(value)) {
          callback(new Error('对公银行卡号只能为数字'))
        } else {
          callback()
        }
      }
    }

    // 手机 或者 座机号码
    const isPhoneNumber = (rule, value, callback) => {
      // const patter = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$|^0\d{2,3}-\d{7,8}(-\d{1,4})?$/
      const patter = /^((13[0-9])|(17[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$/
      if (!patter.test(value)) {
        callback(new Error(`请输入正确的手机号码！`))
      } else {
        callback()
      }
    }

    return {
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
      routeParamsId: '-1',
      reviewStatusValue: 1, // 审核状态值，默认通过，详情数据获取后，从新赋值
      userObject: {},
      areaList: [],
      loading: false,
      sending: false,
      brandOptions: [],
      categoryOptions: [],
      supplierOptions: [],
      dataForm: {
        storeNo: "", // 门店编号
        storeName: "", // 门店名称
        districtArea: '', // 所属区域
        address: '', // 详细地址
        openingTime: '', // 开店时间
        periodStartValidity: '', // 有效期开始
        periodEndValidity: '', // 有效期结束
        periodData: [], // 有效期开始结束
        salesArea: '', // 销售区域
        infomationNo: '', // 所属加盟商
        businessScope: '', //经营范围
        operatingBrand: '', // 经营品牌
        commissionCalculation: '', // 佣金计算规则
        commissionSettlement: '', // 佣金结算方式
        corporateAccount: '', // 对公账户名
        corporateBank: '', // 对公银行卡号
        corporateBankBranch: '', // 对公银行卡开户行
        enterpriseInformation: '', // 企业信息
        storeManagerName: '', // 店长姓名
        contactPhone: '', // 登录电话
        supportPhone: '', // 支持电话
      },
      dataRules: {
        // storeNo: [{ required: true, message: "门店编号不能为空，请完整输入！", trigger: "blur" }],
        storeName: [{ required: true, message: "门店名称不能为空，请完整输入！", trigger: "blur" }],
        districtArea: [{ required: true, message: "门店地区不能为空，请选择！", trigger: "change" }],
        openingTime: [{ required: true, message: "开店时间不能为空，请选择！", trigger: "change" }],
        periodData: [{ required: true, message: "门店有效期不能为空，请选择！", trigger: "change" }],
        infomationNo: [{ required: true, message: "所属加盟商不能为空，请完整输入！", trigger: "change" }],
        salesArea: [{ required: true, message: "售卖区域不能为空，请选择！", trigger: "change" }],
        businessScope: [{ required: true, message: "经营范围不能为空，请选择！", trigger: "change" }],
        operatingBrand: [{ required: true, message: "经营品牌不能为空，请选择！", trigger: "blur" }],
        commissionCalculation: [{ required: true, message: "佣金计算方式不能为空，请完整输入！", trigger: "blur" }],
        commissionSettlement: [{ required: true, message: "佣金结算方式不能为空，请完整输入！", trigger: "blur" }],
        corporateAccount: [{ required: true, message: "对公账户户名不能为空，请完整输入！", trigger: "blur" }],
        storeManagerName: [
          { required: true, message: "店长姓名不能为空，请完整输入！", trigger: "blur" }
        ], // 店长姓名
        contactPhone: [
          { required: true, message: "联系电话/登录账号不能为空，请完整输入！", trigger: "change" },
          { required: true, validator: isPhoneNumber, trigger: "change" }
        ], // 登录电话
        supportPhone: [
          { required: true, message: "支持电话不能为空，请完整输入！", trigger: "change" },
          // { required: true, validator: isPhoneNumber, trigger: "change" }
        ],
        corporateBank: [
          { required: true, message: "对公银行卡号不能为空，请完整输入！", trigger: "blur" },
          { required: true, validator: validateNumber, trigger: ["blur", "change"] }
        ],
        corporateBankBranch: [{ required: true, message: "开户银行及支行不能为空，请完整输入！", trigger: "blur" }],
        // reviewStatus: [{ required: true, message: "审核状态不能为空，请选择！", trigger: "blur" }],
        // reviewComments: [{ required: true, message: "审核意见不能为空，请输入！", trigger: "blur" }],
      },
      props: { multiple: true },
    };
  },
  async created() {},
  components: {
    FranchiseeSelect
  },
  async mounted() {
    const user = localStorage.getItem('userInfor')
    this.userObject = JSON.parse(user)
    this.loadAreaTree()
    this.loadBrandOptions();
    this.loadCategoryOptions();
    this.routeParamsId = this.$route.params.id

    if (this.$route.params.id) {
      this.loadData(this.$route.params.id)
    }
  },
  methods: {
    getStatusLabel(val) {
      const res = this.checkStatusOptions.find(item => item.value == val)
      return res ? res.label : ''
    },
    formatSalesArea(str, level = 2) {
      const arr = str.split(',')
      const areaList = []
      let item = []
      while(arr.length) {
        const obj = arr.shift()
        if (item.length < level) {
          item.push(obj)
        } 
        if (item.length == level) {
          areaList.push(item)
          item = []
        }
      }
      return areaList
    },

    addLevel(tree, level = 1) {
      tree.forEach(node => {
        node.level = level;
        node.leaf = (level === 2)
        // 删除第三层级
        if (level === 2) {
          delete node.children
        }
        if (node.children) {
          this.addLevel(node.children, level + 1);
        }
      });
    },

    async loadAreaTree() {
      const result = await fetch("/area/getAreaTree", {});
      if (result.code == 200) {
        this.addLevel(result.data)
        this.areaList = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },

    async loadBrandOptions() {
      const result = await fetch("/brand/listAll", {});
      if (result.code == 200) {
        this.brandOptions = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },
    async loadCategoryOptions() {
      const result = await fetch("/category/list.sales", {});
      if (result.code == 200) {
        this.categoryOptions = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },

    // 获取详情
    async loadData(productId) {
      if (productId && productId == -1) {
        return;
      }
      this.loading = true
      const result = await post('/srm/sh/stores/getStoreById', { id: productId });
      this.loading = false
      if (result.code == 200) {
        result.data.periodData = [result.data.periodStartValidity, result.data.periodEndValidity]
        result.data.districtArea = result.data.districtArea.split(',')
        result.data.salesArea = this.formatSalesArea(result.data.salesArea)
        // result.data.businessScope = this.formatSalesArea(result.data.businessScope, 3)
        try {
          result.data.businessScope = JSON.parse(result.data.businessScope)
        } catch (err) {
          console.log(err)
        }
        result.data.operatingBrand = result.data.operatingBrand.split(',')
        this.dataForm = { ...result.data }

        this.reviewStatusValue = result.data.reviewStatus
      } else {
        this.$message.error(result.msg);
      }
    },
    save() {
      // 编辑 验证审核数据
      // let res = true
      // if (this.routeParamsId > -1) {
      //   this.$refs.dataFormInfor1.validate(valid => {
      //     res = valid
      //   })
      // }
      this.$refs.dataFormInfor.validate(async valid => {
        if (valid) {
          
          if (!this.dataForm.address) return this.$message.warning('门店详细地址不能为空，请输入！')


          if (this.dataForm.businessScope) {
            console.log(this.dataForm.businessScope)
            if (this.dataForm.businessScope.length > 60) {
              return this.$message.warning('经营范围选择数量超出限制，请重新选择！')
            }
          }
          this.sending = true;

          const params = deepClone(this.dataForm)
          // 编辑
          if (this.$route.params.id != -1) {
            params.id = this.$route.params.id
            // 审核相关字段不传
            params.reviewStatus = ''
            params.reviewComments = ''
          }

          params.periodStartValidity = params.periodData[0]
          params.periodEndValidity = params.periodData[1]
          delete params.periodData
          params.districtArea = params.districtArea.join()
          params.salesArea = params.salesArea.join()
          // params.businessScope = params.businessScope.join()
          params.businessScope = JSON.stringify(params.businessScope)
          params.operatingBrand = params.operatingBrand.join()
          console.log(params)
          const result = await post("/srm/sh/stores/saveStores", params)
          this.sending = false;
          if (result.code == 200) {
            this.$message.success("门店信息保存成功！");
            this.back2Prev()
          } else if (result.code == 500) {
            this.$message.warning(result.data);
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
._label {
  margin-left: 25px;
}
._cascader {
  .el-input {
    width: 100% !important;
  }
}
.required-item {
  .el-form-item__label::before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
._text {
  transform: translateY(-5px);
}
</style>