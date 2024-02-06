<template>
  <el-dialog class="dialog" :title="dataForm.id ? '修改商家信息':'新增商家信息'" width="550px"
    :visible.sync="showDialog">
    <el-form class="data-form" :model="dataForm" :rules="dataRules" ref="dataForm"
      label-width="150px" size="mini">
      <el-form-item v-for="(item,index) in formLabels" :key="index" :label="item.label"
        :prop="item.prop">
        <el-input :type="item.type" v-if="item.id !== 8 && item.id !== 10 && item.id !== 14"
          v-model="dataForm[item.prop]" :placeholder="item.placeholder"></el-input>
        <el-radio-group v-if="item.id == 8" v-model="dataForm[item.prop]">
          <el-radio :label="1">企业法人营业执照</el-radio>
          <el-radio :label="2">个体工商户</el-radio>
        </el-radio-group>
        <div v-if="item.id == 10">
          <div class="provice_data">
            <!-- 省市区 -->
            <el-cascader v-model="dataForm.areaArray" placeholder="请选择所在的省/市/区" :options="areaList"
              :props="{value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}"
              size='small' @change="handlerArea">
            </el-cascader>
          </div>
        </div>
        <div v-if="item.id == 14">
          <el-upload :limit="limitNum" action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card" :on-preview="handlePictureCardPreview" :on-exceed="exceedFile">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dataForm[item.prop]" alt="">
          </el-dialog>
        </div>

      </el-form-item>
    </el-form>
    <el-form class="data-form" :model="businessData" :rules="busRuler" ref="dataForm"
      label-width="150px" size="mini">
      <!-- 企业类型 -->
      <div v-if="dataForm.radioBussis == 1">
        <el-form-item v-for="(item,index) in businessLabels" :key="index" :label="item.label"
          :prop="item.prop">
          <el-input :type="item.type" v-if="item.id !== 15 && item.id !== 17"
            v-model="businessData[item.prop]" :placeholder="item.placeholder"></el-input>
          <div v-if="item.id == 15">
            <el-upload :limit="limitNum" action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card" :on-preview="handlePictureCardPreview"
              :on-exceed="exceedFile">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="businessData[item.prop]" alt="">
            </el-dialog>
          </div>
          <div v-if="item.id == 17">
            <el-date-picker v-model="businessData[item.prop]" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-checkbox @change="changeDate" v-model="businessData.langTime">长期</el-checkbox>
          </div>
        </el-form-item>
      </div>

      <!-- <el-form-item label="商家描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="请输入商家描述..." maxlength="60" type="textarea" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="dataForm.companyName" placeholder="请输入公司名称..." maxlength="64" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="公司电话" prop="companyPhone">
        <el-input v-model="dataForm.companyPhone" placeholder="请输入联系电话..."  maxlength="256" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="companyOwner">
        <el-input v-model="dataForm.companyOwner" placeholder="请输入商家负责人..."  maxlength="256" style="width:100%"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">取消</el-button>
      <el-button type="primary" :loading="sending" :disabled="sending" @click="save">
        {{sending ?
        '正在保存...':'确定'}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { fetch, post } from "@/utils/http-client";

export default {
  name: "",
  data() {
    var validatorPassword02 = (rule, value, callback) => {
      if (this.dataForm.loginPassword.length == 0) {
        return callback(new Error('请再次重复输入，不能为空!'));
      }
      else if (this.dataForm.loginPassword != this.dataForm.confirmPassword) {
        return callback(new Error('密码输入不一致，请重新输入...'));
      }
      else {
        return callback();
      }
    };
    var checkRegistMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('注册资本不能为空'))
      }
      setTimeout(() => {
        var r = /^[1-9]*[1-9][1-9]*$/
        if (!r.test(value)) {
          callback(new Error('请输入大于0的整数'))
        }
      }, 1000);
    };
    var checkCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('证件号码不能为空，请输入'))
      }
      setTimeout(() => {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的身份证号'))
        }
      }, 1000);
    };
    var checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系人手机号不能为空，请输入'))
      }
      setTimeout(() => {
        var reg = /^[3-9]{1}[0-9]{9}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        }
      }, 1000);
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系人电子邮箱不能为空，请输入'))
      }
      setTimeout(() => {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
        }
      }, 1000);
    };
    return {
      dialogVisible: false,
      limitNum: 2,
      dialogTitle: "新增商家",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      dataForm: {
        areaArray: [],//城市选择集合
        partner: '',
        loginNum: '',
        loginPassword: '',
        confirmPassword: '',
        telName: '',
        tel: '',
        email: '',
        radioBussis: 1,//执照类型
        companyName: '',
        address: '',
        registTime: '',
        rangDescription: '',
        fdName: '',
        cardImg: ''//法人证件照片
      },

      formLabels: [
        {
          id: 1,
          label: '所属合伙人',
          prop: 'partner',
          placeholder: '',
          type: 'text'
        },
        {
          id: 2,
          label: '登录账号',
          prop: 'loginNum',
          placeholder: '请输入',
          type: 'text'
        },
        {
          id: 3,
          label: '输入密码',
          prop: 'loginPassword',
          placeholder: '6-16位包含数字和字母',
          type: 'password'
        },
        {
          id: 4,
          label: '确认密码',
          prop: 'confirmPassword',
          placeholder: '6-16位包含数字和字母',
          type: 'password'
        },
        {
          id: 5,
          label: '联系人姓名',
          prop: 'telName',
          placeholder: '请输入',
          type: 'text'
        },
        {
          id: 6,
          label: '联系人手机号',
          prop: 'tel',
          placeholder: '请输入',
          type: 'tel'
        }, {
          id: 7,
          label: '联系人电子邮箱',
          prop: 'email',
          placeholder: '请输入',
          type: 'email'
        },
        {
          id: 8,
          label: '营业执照类型',
          prop: 'radioBussis',
          placeholder: ''
        },
        {
          id: 9,
          label: '公司名称',
          prop: 'companyName',
          placeholder: '请输入',
          type: 'text'
        },
        {
          id: 10,
          label: '住所/经营场所',
          prop: 'areaArray',
          placeholder: '请输入'
        },
        {
          id: 15,
          label: '详细地址',
          prop: 'address',
          placeholder: '请输入'
        },
        {
          id: 11,
          label: '成立/注册日期',
          prop: 'registTime',
          placeholder: '请输入',
          type: 'text'
        },
        {
          id: 12,
          label: '经营范围',
          prop: 'rangDescription',
          placeholder: '请输入',
          type: 'textarea'
        },
        {
          id: 13,
          label: '法定代表人姓名',
          prop: 'fdName',
          placeholder: '请输入',
          type: 'text'
        },
        {
          id: 14,
          label: '法人证件照片',
          prop: 'cardImg',
          placeholder: '请输入'
        }
      ],
      businessLabels: [
        {
          id: 15,
          label: '营业执照照片',
          prop: 'busImg',
          placeholder: '请输入'
        },
        {
          id: 16,
          label: '证件号码',
          prop: 'cardNum',
          placeholder: '请输入',
          type: 'text'
        },
        {
          id: 17,
          label: '营业期限',
          prop: 'busRangTime',
          placeholder: '请输入'
        },
        {
          id: 18,
          label: '注册资本',
          prop: 'registMoney',
          placeholder: '请输入',
          type: 'number'
        },
      ],
      //企业类型的数据 之后按照类型选择传递企业数据
      businessData: {
        busImg: '',//营业执照照片
        cardNum: '',//证件号
        busRangTime: [],//营业期限
        langTime: '',//长期
        registMoney: ''//注册资本
      },
      dataRules: {
        areaArray: { required: true, message: "住所/经营场所不能为空，请输入", trigger: "blur" },//城市选择集合
        partner: { required: true, message: "所属合伙人不能为空，请输入", trigger: "blur" },
        loginNum: [
          { required: true, message: "登录账号不能为空，请输入", trigger: "blur" },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: "输入密码不能为空，请输入", trigger: "blur" },
          { min: 6, max: 163, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空，请输入", trigger: "blur" },
          { required: true, validator: validatorPassword02, trigger: 'blur' }
        ],
        telName: { required: true, message: "联系人姓名不能为空，请输入", trigger: "blur" },
        tel: { required: true, validator: checkTel, trigger: "blur" },
        email: { required: true, validator: checkEmail, trigger: "blur" },
        companyName: { required: true, message: "公司名称不能为空，请输入", trigger: "blur" },
        address: { required: true, message: "详细地址不能为空，请输入", trigger: "blur" },
        registTime: { required: true, message: "成立/注册日期不能为空，请输入", trigger: "blur" },
        rangDescription: { required: true, message: "经营范围不能为空，请输入", trigger: "blur" },
        fdName: { required: true, message: "法定代表人姓名不能为空，请输入", trigger: "blur" },
        cardImg: { required: true, message: "法人证件照片不能为空，请输入", trigger: "blur" }//法人证件照片
      },
      busRuler: {
        busImg: { required: true, message: "营业执照照片不能为空，请输入", trigger: "blur" },//营业执照照片
        cardNum: { required: true, validator: checkCard, trigger: "blur" },//证件号
        busRangTime: { required: true, message: "营业期限不能为空，请输入", trigger: "blur" },//营业期限
        registMoney: { required: true, validator: checkRegistMoney, trigger: "blur" }//注册资本
      },
      areaList: []
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
  async mounted() {
    console.log("===list--", this.areaList)
  },
  methods: {
    handlerArea(value) {
      console.log("===选择的省市区---", value)
    },
    show(flag, data) {
      this.showDialog = flag;
      if (flag && data) {
        this.loadData(data.id);
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      });
    },
    async loadData(id) {

    },
    changeDate(change) {
      if (change) {
        this.dataForm.busRangTime = []
      }
    },
    async save() {
      console.log("====dataForm---", this.dataForm)
      console.log("====businessData---", this.businessData)
      if (this.dataForm.radioBussis == 1) {
        //企业 this.dataForm + this.businessData  注意长期和营业期限的区别
        this.businessData.langTime ? this.businessData.langTime : this.businessData.busRangTime
      } else {
        //this.dataForm  只有个人
      }
      return
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true;
          let params = Object.assign({}, this.dataForm);
          const result = await post("/srm/supplier/add", params)
          this.sending = false
          if (result.code == 200) {
            this.show(false)
            this.$message.success("创建商家成功！")
            this.$parent.loadData()
          }
          else {
            this.$message.error(result.msg)
          }
        }
        else {
          return false;
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dataForm.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    exceedFile(file) {
      this.$message({
        message: '只能上传一张图片',
        type: 'warning'
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.provice_data {
  margin-bottom: 6px;
}
</style>