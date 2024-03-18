<template>
  <div class="div-layout">
    <!--  = 1审核 = 0详情 -->
    <el-page-header @back="back2Prev" :content="`加盟商${routeParamsType == 1 ? '审核' : '详情'}`"></el-page-header>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form class="data-form" :v-loading="loading" label-position="right" size="small">
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
            <el-form-item label="加盟商编号：">
              <p class="_text">{{ detailData.informationNo }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="加盟商名称：">
              <p class="_text">{{ detailData.informationName }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="授权范围：">
              <p class="_text">{{  getAuthorityScopeLabel(detailData.authorityScope) }}</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="联系人：">
              <p class="_text">{{ detailData.contacts }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="联系方式：">
              <p class="_text">{{ detailData.contactsPhone }}</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="加盟费：">
              <p class="_text">{{ detailData.initialFee }}</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="销售额：">
              <p class="_text">{{ detailData.salesVolume }}</p>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item label="地址：">
              <p class="_text">{{ detailData.address }}</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="合同文件：">
              <el-button class="_text" type="text"><a :href="detailData.contractFileUrl" target="_blank" download>下载</a></el-button>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form>

    <!-- 审核显示 -->
    <el-form v-if="routeParamsType == 1" class="data-form" :model="dataForm" :rules="dataRules" :v-loading="loading" ref="dataFormInfor" label-position="top" size="small">
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
    </el-form>

    <!-- 详情显示 -->
    <el-form v-if="routeParamsType == 0 && detailData.status == 1" class="data-form" :v-loading="loading" ref="dataFormInfor" label-position="right" size="small">
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


    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <!-- 审核显示 -->
    <el-row v-if="routeParamsType == 1" type="flex" style="height:30px;text-align:center">
      <el-col :span="24" style="align:center">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button v-if="dataForm.saleState!=5" type="primary" :loading="sending"
          :disabled="sending" @click="save">{{ sending ? '正在保存...' : '提交审核结果' }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { fetch, post } from "@/utils/http-client"

export default {
  name: "",
  data() {
    return {
      routeParamsType: '',
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
      detailData: {},
      userObject: {},
      loading: false,
      sending: false,
      dataForm: {
        status: 1,
        reviewComments: "通过",
      },
      dataRules: {
        status: [{ required: true, message: "审核状态不能为空，请选择！", trigger: "blur" }],
        reviewComments: [{ required: true, message: "审核意见不能为空，请输入！", trigger: "blur" }],
      },
    };
  },
  async created() {
  },
  components: {
  },
  async mounted() {
    console.log(this.$route)
    this.routeParamsType = this.$route.params.type
    // const user = localStorage.getItem('userInfor')
    // this.userObject = JSON.parse(user)
    if (this.$route.params.id) {
      this.loadData(this.$route.params.id)
    }
  },
  methods: {
    getStatusLabel(val) {
      const res = this.checkStatusOptions.find(item => item.value == val)
      return res ? res.label : ''
    },
    getAuthorityScopeLabel(val) {
      const res = this.agentTypeOptions.find(item => item.value == val)
      return res ? res.label : ''
    },
    async loadData(productId) {
      this.loading = true
      const result = await post('/srm/sh/information/getInformationById', { id: productId });
      this.loading = false
      if (result.code == 200) {
        this.detailData = result.data
        if (this.routeParamsType == 0) {
          this.dataForm = result.data
        }
      } else {
        this.$message.error(result.msg);
      }
    },
    save() {
      this.$refs.dataFormInfor.validate(async valid => {
        if (valid) {
          this.sending = true;
          // 审核传 id
          if (this.routeParamsType) {
            this.dataForm.id = this.$route.params.id
          }
          const params = {
            ...this.detailData,
            ...this.dataForm
          }
          const result = await post("/srm/sh/information/saveInformation", params)
          this.sending = false;
          if (result.code == 200) {
            this.$message.success("加盟商数据提交审核成功！");
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
._text {
  transform: translateY(-5px);
}
</style>