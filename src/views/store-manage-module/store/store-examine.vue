<template>
  <div class="div-layout">
    <!-- type = 1审核  = 0详情 -->
    <el-page-header
      @back="back2Prev"
      :content="`门店${routeParamsType == 1 ? '审核' : '详情'}`"
    ></el-page-header>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form class="data-form" label-position="right" size="small">
      <el-divider content-position="left" style="width: 80%">
        <i class="el-icon-postcard" style="color: blue"></i>&nbsp;
        <font style="color: blue">基本信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="门店编号：">
              <p class="_text">{{ dataForm.storeNo }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店名称：">
              <p class="_text">{{ dataForm.storeName }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店地址：">
              <!-- <p class="_text">{{ dataForm.districtArea }}</p> -->
              <el-cascader
                class="_cascader _border_none"
                disabled
                v-model="dataForm.districtArea"
                :options="areaList"
                :props="{
                  value: 'code',
                  label: 'name',
                  leaf: 'pid',
                  children: 'children',
                  expandTrigger: 'hover',
                }"
                size="small"
                clearable
                placeholder=""
                style="width: 40%; float: left"
              />
              <p class="_text" style="width: 40%; float: left">
                {{ dataForm.address }}
              </p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="店长姓名：">
              <p class="_text">{{ dataForm.storeManagerName }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="联系电话/登录账号：">
              <p class="_text">{{ dataForm.contactPhone }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <!-- <el-form-item label="支持电话：">
              <p class="_text">{{ dataForm.supportPhone }}</p>
            </el-form-item> -->
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="开店时间：">
              <p class="_text">{{ dataForm.openingTime }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="门店有效期：">
              <p class="_text">
                {{ dataForm.periodStartValidity }} 至
                {{ dataForm.periodEndValidity }}
              </p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="所属加盟商：">
              <!-- <p class="_text">{{ dataForm.infomationNo }}</p> -->
              <franchisee-select
                class="_border_none"
                disabled
                v-model="dataForm.infomationNo"
                placeholder=" "
                style="width: 80%"
                size="small"
              />
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="售卖区域：">
              <!-- <p class="_text">{{ dataForm.salesArea }}</p> -->
              <p
                v-if="routeParamsType == 0 && $route.params.id == 1"
                class="_text"
              >
                全国
              </p>
              <el-cascader
                v-else
                class="_cascader _border_none"
                disabled
                v-model="dataForm.salesArea"
                :options="areaList"
                :props="{
                  multiple: true,
                  value: 'code',
                  label: 'name',
                  leaf: 'pid',
                  children: 'children',
                  expandTrigger: 'hover',
                }"
                size="small"
                clearable
                placeholder=""
                style="width: 80%"
              />
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="经营范围：">
              <!-- <p class="_text">{{ dataForm.businessScopeStr }}</p> -->
              <p
                v-if="routeParamsType == 0 && $route.params.id == 1"
                class="_text"
              >
                全部
              </p>
              <el-cascader
                v-else
                class="_cascader _border_none"
                disabled
                v-model="dataForm.businessScope"
                :options="categoryOptions"
                placeholder=""
                clearable
                :props="{
                  multiple: true,
                  value: 'id',
                  label: 'name',
                  leaf: 'parentCode',
                  children: 'children',
                  expandTrigger: 'hover',
                }"
                style="width: 80%"
              />
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="经营品牌：">
              <!-- <p class="_text">{{ dataForm.operatingBrand }}</p> -->
              <p
                v-if="routeParamsType == 0 && $route.params.id == 1"
                class="_text"
              >
                全部
              </p>
              <el-select
                v-else
                class="_border_none"
                v-model="dataForm.operatingBrand"
                multiple
                disabled
                filterable
                style="width: 80%"
                clearable
                placeholder=""
              >
                <el-option
                  v-for="item in brandOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>

      <!-- <el-divider content-position="left" style="width: 80%">
        <i class="el-icon-postcard" style="color: blue"></i>&nbsp;
        <font style="color: blue">企业佣金</font>
      </el-divider> -->
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <!-- <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="佣金计算方式：">
              <p class="_text">{{ dataForm.commissionCalculation }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="佣金结算方式：">
              <p class="_text">{{ dataForm.commissionSettlement }}</p>
            </el-form-item>
          </td>
          <td width="30%"></td>
          <td width="5%"></td>
        </tr>
      </table> -->

      <el-divider content-position="left" style="width: 80%">
        <i class="el-icon-postcard" style="color: blue"></i>&nbsp;
        <font style="color: blue">企业对公账户信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="对公账户户名：">
              <p class="_text">{{ dataForm.corporateAccount }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="对公银行卡号：">
              <p class="_text">{{ dataForm.corporateBank }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="开户银行及支行：">
              <p class="_text">{{ dataForm.corporateBankBranch }}</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>

      <el-divider content-position="left" style="width: 80%">
        <i class="el-icon-postcard" style="color: blue"></i>&nbsp;
        <font style="color: blue">企业信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="90%" colspan="3">
            <el-form-item label="" prop="name" class="item">
              <p class="_text">{{ dataForm.enterpriseInformation }}</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form>

    <!-- 审核显示 -->
    <el-form
      class="data-form"
      v-if="routeParamsType == 1"
      :model="dataForm"
      :rules="dataRules"
      :v-loading="loading"
      ref="dataFormInfor"
      label-position="top"
      size="small"
    >
      <el-divider content-position="left" style="width: 80%">
        <i class="el-icon-postcard" style="color: blue"></i>&nbsp;
        <font style="color: blue">审核信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="3%"></td>
          <td width="20%">
            <el-form-item
              label="审核状态："
              prop="reviewStatus"
              class="item"
              label-position="top"
            >
              <el-select
                v-model="dataForm.reviewStatus"
                collapse-tags
                filterable
                style="width: 80%"
                size="mini"
                clearable
                placeholder="请选择审核状态..."
              >
                <el-option
                  v-for="item in checkStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item
              label="审核意见："
              prop="reviewComments"
              class="item"
              label-position="top"
            >
              <el-input
                size="mini"
                v-model="dataForm.reviewComments"
                placeholder="请输入审核意见..."
                maxlength="32"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form>

    <!-- 详情显示 -->
    <el-form
      class="data-form"
      v-if="
        routeParamsType == 0 &&
        (dataForm.reviewStatus == 1 || dataForm.reviewStatus == 0)
      "
      ref="dataFormInfor"
      label-position="right"
      size="small"
    >
      <el-divider content-position="left" style="width: 80%">
        <i class="el-icon-postcard" style="color: blue"></i>&nbsp;
        <font style="color: blue">审核信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>

      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item
              label="审核状态："
              prop="reviewStatus"
              class="item"
              label-position="top"
            >
              <p class="_text">{{ getStatusLabel(dataForm.reviewStatus) }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item
              label="审核意见："
              prop="reviewComments"
              class="item"
              label-position="top"
            >
              <p class="_text">{{ dataForm.reviewComments }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item
              label="审核时间："
              prop="reviewDate"
              class="item"
              label-position="top"
            >
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
    <el-row
      type="flex"
      style="height: 30px; text-align: center"
      v-if="routeParamsType == 1"
    >
      <el-col :span="24" style="align: center">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button
          type="primary"
          :loading="sending"
          :disabled="sending"
          @click="save"
          >{{ sending ? "正在保存..." : "提交审核" }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import { fetch, post } from "@/utils/http-client";
import { deepClone } from "@/utils/index";
import FranchiseeSelect from "@/components/FranchiseeSelect";

export default {
  name: "",
  data() {
    return {
      routeParamsType: "-1",
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
        // reviewStatus: '1', // 审核状态
        // reviewComments: '通过', // 审核意见
        storeNo: "", // 门店编号
        storeName: "", // 门店名称
        districtArea: "", // 所属区域
        openingTime: "", // 开店时间
        periodStartValidity: "", // 有效期开始
        periodEndValidity: "", // 有效期结束
        periodData: [], // 有效期开始结束
        salesArea: "", // 销售区域
        infomationNo: "", // 所属加盟商
        businessScope: "", //经营范围
        operatingBrand: "", // 经营品牌
        commissionCalculation: "", // 佣金计算规则
        commissionSettlement: "", // 佣金结算方式
        corporateAccount: "", // 对公账户名
        corporateBank: "", // 对公银行卡号
        corporateBankBranch: "", // 对公银行卡开户行
        enterpriseInformation: "", // 企业信息
        storeManagerName: "", // 店长姓名
        contactPhone: "", // 登录电话
        supportPhone: "", // 支持电话
      },
      dataRules: {
        reviewStatus: [
          {
            required: true,
            message: "审核状态不能为空，请选择！",
            trigger: "blur",
          },
        ],
        reviewComments: [
          {
            required: true,
            message: "审核意见不能为空，请输入！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  async created() {},
  components: {
    FranchiseeSelect,
  },
  async mounted() {
    const user = localStorage.getItem("userInfor");
    this.userObject = JSON.parse(user);
    this.loadAreaTree();
    this.loadBrandOptions();
    this.loadCategoryOptions();
    this.routeParamsType = this.$route.params.type;

    if (this.$route.params.id) {
      this.loadData(this.$route.params.id);
    }
  },
  methods: {
    getStatusLabel(val) {
      const res = this.checkStatusOptions.find((item) => item.value == val);
      return res ? res.label : "";
    },

    formatSalesArea(str, level = 2) {
      const arr = str.split(",");
      const areaList = [];
      let item = [];
      while (arr.length) {
        const obj = arr.shift();
        if (item.length < level) {
          item.push(obj);
        }
        if (item.length == level) {
          areaList.push(item);
          item = [];
        }
      }
      return areaList;
    },

    addLevel(tree, level = 1) {
      tree.forEach((node) => {
        node.level = level;
        node.leaf = level === 2;
        // 删除第三层级
        if (level === 2) {
          delete node.children;
        }
        if (node.children) {
          this.addLevel(node.children, level + 1);
        }
      });
    },

    async loadAreaTree() {
      const result = await fetch("/area/getAreaTree", {});
      if (result.code == 200) {
        this.addLevel(result.data);
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

    async loadData(productId) {
      if (productId && productId == -1) {
        return;
      }
      this.loading = true;
      const result = await post("/srm/sh/stores/getStoreById", {
        id: productId,
      });
      this.loading = false;
      if (result.code == 200) {
        // 审核
        if (this.routeParamsType == 1) {
          result.data.reviewStatus = 1; // 审核状态
          result.data.reviewComments = "通过"; // 审核意见
        }
        result.data.periodData = [
          result.data.periodStartValidity,
          result.data.periodEndValidity,
        ];
        result.data.districtArea = result.data.districtArea.split(",");
        result.data.salesArea = this.formatSalesArea(result.data.salesArea);
        // result.data.businessScope = this.formatSalesArea(result.data.businessScope, 3)
        try {
          result.data.businessScope = JSON.parse(result.data.businessScope);
        } catch (err) {
          console.log(err);
        }
        result.data.operatingBrand = result.data.operatingBrand.split(",");

        this.dataForm = { ...result.data };
      } else {
        this.$message.error(result.msg);
      }
    },
    save() {
      this.$refs.dataFormInfor.validate(async (valid) => {
        if (valid) {
          this.sending = true;

          if (this.$route.params.id != -1) {
            this.dataForm.id = this.$route.params.id;
          }
          const params = deepClone(this.dataForm);
          params.periodStartValidity = params.periodData[0];
          params.periodEndValidity = params.periodData[1];
          delete params.periodData;
          params.districtArea = params.districtArea.join();
          params.salesArea = params.salesArea.join();
          // params.businessScope = params.businessScope.join()
          params.businessScope = JSON.stringify(params.businessScope);
          params.operatingBrand = params.operatingBrand.join();

          const result = await post("/srm/sh/stores/saveStores", params);
          this.sending = false;
          if (result.code == 200) {
            this.$message.success("审核信息提交成功！");
            this.back2Prev();
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
      if (!response || response.code != 0) {
        return;
      }
      this.dataForm.mainImgUrl = file.response.data.absoluteUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
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
._text {
  transform: translateY(-5px);
}
._border_none {
  transform: translate(-10px, -5px);
  .el-input.is-disabled .el-input__inner {
    background-color: #ffffff;
    color: #383838;
    cursor: default;
  }
  .el-input__suffix {
    display: none;
  }
  .el-input__inner {
    border: none !important;
  }
  .el-tag {
    background-color: #ffffff;
    color: #383838;
    border-color: transparent;
  }
}
</style>
