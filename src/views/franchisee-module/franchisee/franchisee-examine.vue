<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="加盟商审核"></el-page-header>
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
            <el-form-item label="加盟商编号">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="加盟商名称">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="授权范围">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="联系人">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="联系方式">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="30%">
            <el-form-item label="加盟费">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="销售额">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item label="地址">
              <p class="_text">asdfasdf</p>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="30%">
            <el-form-item label="合同文件">
              <el-button class="_text" type="text"><a>下载</a></el-button>
            </el-form-item>
          </td>
          <td width="5%"></td>
        </tr>
      </table>
    </el-form>

    <el-form class="data-form" :model="dataForm" :rules="dataRules" :v-loading="loading" ref="dataFormInfor" label-position="top" size="small">
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
            <el-form-item label="审核状态" prop="name" class="item" label-position="top">
              <el-select v-model="dataForm.supplierId" collapse-tags filterable style="width:80%" size="mini" clearable placeholder="请选择授权范围...">
                <el-option v-for="item in checkStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="30%" colspan="2">
            <el-form-item label="审核意见" prop="name" class="item" label-position="top">
              <el-input :disabled="dataForm.saleState==5" size="mini" v-model="dataForm.name" placeholder="请输入加盟地址..." maxlength="32" style="width:100%"></el-input>
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
    const validateParam = (rule, value, callback) => {
      if (Object.keys(value).length == 0) {
        this.$message.warning('商品属性参数不能为空，请选择！')
      } else {
        callback()
      }
    }
    const validateAttributes = (rule, value, callback) => {
      if (!value) {
        callback(new Error('商品计量值不能为空,请输入'))
      } else {
        const patter = /^\d+$/
        if (!patter.test(value)) {
          callback(new Error('商品计量值只能为数字'))
        } else {
          callback()
        }
      }
    }

    return {
      checkStatusOptions: [
        { label: "通过", value: 1 },
        { label: "不通过", value: 2 },
      ],
      userObject: {},
      areaList: [],
      loading: false,
      sending: false,
      brandOptions: [],
      categoryOptions: [],
      supplierOptions: [],
      dataForm: {
        id: "",
        name: "",
      },
      dataRules: {
        name: [{ required: true, message: "商品名称不能为空，请完整输入！", trigger: "blur" }],
        subName: [{ required: true, message: "商品简称不能为空，请完整输入！", trigger: "blur" }],
        brandId: [{ required: true, message: "商品品牌不能为空，请选择品牌！", trigger: "change" }],
        categoryNode: [{ required: true, message: "商品类目不能为空，请选择类目！", trigger: "change" }],
        valuationUnit: [{ required: true, message: "计量单位不能为空，请选择！", trigger: "change" }],
        unitVal: [{ required: true, validator: validateAttributes, trigger: "blur" }],
        attributeMap: [{ required: true, trigger: "blur", validator: validateParam }]
      },
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
      const result = await fetch('/product/getByPK', { productId: productId });
      this.loading = false
      if (result.code == 200) {
        console.log(result)
      } else {
        this.$message.error(result.msg);
      }
    },
    save() {
      this.$refs.dataFormInfor.validate(async valid => {
        if (valid) {
          if (this.productDetail.length == 0) {
            this.$message.warning('商品详情不能为空！')
            return
          }

          this.sending = true;
          var url = this.dataForm.id ? '/product/update' : '/product/add'
          const result = await post(url, params)
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
    handleAvatarSuccess(response, file) {
      if (!response || response.code != 0) {
        return;
      }
      this.dataForm.mainImgUrl = file.response.data.absoluteUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
._label {
  margin-left: 25px;
}
._text {
  transform: translateY(-5px);
}
</style>