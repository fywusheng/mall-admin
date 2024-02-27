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
            <el-form-item label="门店编号" prop="storeNo" class="item">
              <el-input v-model="dataForm.storeNo" placeholder="请输入门店编号..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店名称" prop="storeName" class="item">
              <el-input v-model="dataForm.storeName" placeholder="请输入门店名称..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="所属地区" prop="districtArea" class="item">
              <el-select v-model="dataForm.districtArea" collapse-tags filterable style="width:80%" size="mini" clearable placeholder="请选择所属地区...">
                <el-option v-for="item in agentTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="开店时间" prop="openingTime" class="item">
              <el-date-picker v-model="dataForm.openingTime" type="date" placeholder="选择开店时间" style="width: 80%">
              </el-date-picker>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店有效期" prop="periodData" class="item">
              <el-date-picker v-model="dataForm.periodData" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 80% !important">
              </el-date-picker>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="所属加盟商" prop="xxxxx" class="item">
              <el-input v-model="dataForm.xxxx" placeholder="请输入所属加盟商..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="售卖区域" prop="salesArea" class="item">
              <el-cascader class="_cascader" v-model="dataForm.salesArea" :options="options" :props="props" clearable placeholder="请选择售卖区域..." style="width:80%"/>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="经营范围" prop="businessScope" class="item">
              <el-cascader class="_cascader" v-model="dataForm.businessScope" :options="options" :props="props" clearable placeholder="请选择经营范围..." style="width:80%"/>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="经营品牌" prop="operatingBrand" class="item">
              <el-cascader class="_cascader" v-model="dataForm.operatingBrand" :options="options" :props="props" clearable placeholder="请选择经营品牌..." style="width:80%"/>
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
            <el-form-item label="佣金计算方式" prop="commissionCalculation" class="item">
              <el-input v-model="dataForm.commissionCalculation" placeholder="请输入佣金计算方式..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="佣金结算方式" prop="commissionSettlement" class="item">
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
            <el-form-item label="对公账户户名" prop="corporateAccount" class="item">
              <el-input v-model="dataForm.corporateAccount" placeholder="请输入对公账户户名..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="对公银行卡号" prop="corporateBank" class="item">
              <el-input v-model="dataForm.corporateBank" placeholder="请输入对公银行卡号..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="开户银行及支行" prop="corporateBankBranch" class="item">
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

    return {
      agentTypeOptions: [
        { label: "省代", value: 1 },
        { label: "市代", value: 2 },
        { label: "区县代", value: 3 },
        { label: "城乡代", value: 4 },
        { label: "个体", value: 5 },
      ],
      routeParamsId: '-1',
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
        openingTime: '', // 开店时间
        periodStartValidity: '', // 有效期开始
        periodEndValidity: '', // 有效期结束
        periodData: [], // 有效期开始结束
        salesArea: '', // 销售区域
        businessScope: '', //经营范围
        operatingBrand: '', // 经营品牌
        commissionCalculation: '', // 佣金计算规则
        commissionSettlement: '', // 佣金结算方式
        corporateAccount: '', // 对公账户名
        corporateBank: '', // 对公银行卡号
        corporateBankBranch: '', // 对公银行卡开户行
        enterpriseInformation: '', // 企业信息
      },
      dataRules: {
        storeNo: [{ required: true, message: "门店编号不能为空，请完整输入！", trigger: "blur" }],
        storeName: [{ required: true, message: "门店名称不能为空，请完整输入！", trigger: "blur" }],
        area: [{ required: true, message: "所属地区不能为空，请选择！", trigger: "change" }],
        openingTime: [{ required: true, message: "开店时间不能为空，请选择！", trigger: "change" }],
        periodData: [{ required: true, message: "门店有效期不能为空，请选择！", trigger: "change" }],
        franchisee: [{ required: true, message: "所属加盟商不能为空，请完整输入！", trigger: "change" }],
        salesArea: [{ required: true, message: "售卖区域不能为空，请选择！", trigger: "change" }],
        businessScope: [{ required: true, message: "经营范围不能为空，请选择！", trigger: "change" }],
        operatingBrand: [{ required: true, message: "经营品牌不能为空，请选择！", trigger: "change" }],
        commissionCalculation: [{ required: true, message: "佣金计算方式不能为空，请完整输入！", trigger: "blur" }],
        commissionSettlement: [{ required: true, message: "佣金结算方式不能为空，请完整输入！", trigger: "blur" }],
        corporateAccount: [{ required: true, message: "对公账户户名不能为空，请完整输入！", trigger: "blur" }],
        corporateBank: [
          { required: true, message: "对公银行卡号不能为空，请完整输入！", trigger: "blur" },
          { required: true, validator: validateNumber, trigger: ["blur", "change"] }
        ],
        corporateBankBranch: [{ required: true, message: "开户银行及支行不能为空，请完整输入！", trigger: "blur" }],
      },
      props: { multiple: true },
      options: [{
        value: 1,
        label: '东南',
        children: [{
          value: 2,
          label: '上海',
          children: [
            { value: 3, label: '普陀' },
            { value: 4, label: '黄埔' },
            { value: 5, label: '徐汇' }
          ]
        }, {
          value: 7,
          label: '江苏',
          children: [
            { value: 8, label: '南京' },
            { value: 9, label: '苏州' },
            { value: 10, label: '无锡' }
          ]
        }, {
          value: 12,
          label: '浙江',
          children: [
            { value: 13, label: '杭州' },
            { value: 14, label: '宁波' },
            { value: 15, label: '嘉兴' }
          ]
        }]
      }, {
        value: 17,
        label: '西北',
        children: [{
          value: 18,
          label: '陕西',
          children: [
            { value: 19, label: '西安' },
            { value: 20, label: '延安' }
          ]
        }, {
          value: 21,
          label: '新疆维吾尔族自治区',
          children: [
            { value: 22, label: '乌鲁木齐' },
            { value: 23, label: '克拉玛依' }
          ]
        }]
      }]
    };
  },
  async created() {
    const result = await fetch("/area/getAreaTree", {});
    if (result.code == 200) {
      this.areaList = result.data;
    } else {
      this.$message.error(result.msg);
    }
  },
  components: {
  },
  async mounted() {
    const user = localStorage.getItem('userInfor')
    this.userObject = JSON.parse(user)
    this.loadBrandOptions();
    this.loadCategoryOptions();
    this.loadSupplierOptions();
    this.routeParamsId = this.$route.params.id
    if (this.$route.params.id) {
      this.loadData(this.$route.params.id)
    }
  },
  methods: {
    compare(array) {
      const result = array.reduce((pre, cur) => {
        const ids = pre.map(item => item.id)
        return ids.includes(cur.id) ? pre : [...pre, cur]
      }, [])
      return result
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
      const result = await fetch("/category/list.basic", {});
      if (result.code == 200) {
        this.categoryOptions = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },

    async loadSupplierOptions() {
      const result = await post("/srm/supplier/listByPageNo", { pageNum: 1, pageSize: 1000 });
      if (result.code == 200) {
        this.supplierOptions = result.data.list;
      } else {
        this.$message.error(result.msg);
      }
    },

    async loadData(productId) {
      if (productId && productId == -1) {
        return;
      }
      this.loading = true
      const result = await post('/srm/sh/stores/getStoreById', { id: productId });
      this.loading = false
      if (result.code == 200) {
        this.dataForm = { ...result.data }
      } else {
        this.$message.error(result.msg);
      }
    },
    save() {
      this.$refs.dataFormInfor.validate(async valid => {
        if (valid) {
          this.sending = true;
          const result = await post("/srm/sh/stores/saveStores", this.dataForm)
          this.sending = false;
          if (result.code == 200) {
            this.$message.success("商品信息保存成功！");
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
</style>