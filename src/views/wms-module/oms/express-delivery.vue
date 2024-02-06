<template>
  <el-dialog class="dialog" :title="'平台发货'" width="550px" :visible.sync="showDialog">
    <el-form class="data-form" :model="dataForm" :rules="dataRules" ref="dataForm"
      label-width="150px" label-position="top" size="mini">
      <el-form-item label="快递(物流)公司" prop="expressProviderCode">
        <el-select v-model="dataForm.expressProviderId" collapse-tags filterable style="width:100%"
          placeholder="请选择快递(物流)品牌...">
          <el-option v-for="item in expressOptions" :key="item.id" :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运单号" prop="trackingNumber">
        <el-input v-model="dataForm.trackingNumber" placeholder="请输入快递运单号信息..." maxlength="64"
          style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="所在省/市" prop="administrativeArea">
        <el-cascader ref="area" v-model="dataForm.administrativeArea"
          :options="administrativeAreaOptions" placeholder="请选择所在省/市/区..."
          :props="{value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}"
          style="width:100%">
        </el-cascader>
      </el-form-item>
      <el-form-item label="发货备注" prop="expressRemarks">
        <el-input v-model="dataForm.expressRemarks" placeholder="请输入发货备注信息..." maxlength="120"
          style="width:100%"></el-input>
      </el-form-item>
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
    return {
      dialogTitle: "平台发货",
      showDialog: false,
      sending: false,
      expressOptions: [],
      administrativeAreaOptions: [],
      dataForm: {
        orderId: '',
        expressProviderId: '',
        trackingNumber: "",
        expressRemarks: "",
        administrativeArea: []
      },
      dataRules: {
        expressProviderId: [{ required: true, message: "快递(物流)公司不能为空，请选择！", trigger: "blur" }],
        trackingNumber: [{ required: true, message: "快递单号不能为空，请输入！", trigger: "blur" }]
      }
    };
  },
  async mounted() {
    this.loadExpressList()
    this.loadAdministrativeAreaOptions()
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    async loadExpressList() {
      const result = await fetch("/tms/express/provider/list", {})
      if (result.code == 200) {
        this.expressOptions = result.data
      }
      else {
        this.$message.error(result.msg)
      }
    },


    async loadAdministrativeAreaOptions() {
      const result = await fetch("/area/getAreaTree", {});
      if (result.code == 200) {
        this.administrativeAreaOptions = this.makeAreaData(result.data);
      } else {
        this.$message.error(result.msg);
      }
    },
    makeAreaData(source) {
      source.forEach(first => {
        first.children.forEach(sec => {
          delete sec['children']
        })
      })
      return source
    },

    show(flag, data) {
      this.showDialog = flag;
      if (flag && data) {
        this.dataForm.orderId = data.id
        this.dataForm.orderCode = data.orderId
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.administrativeArea = [this.userInfo.actualProvinceCode, this.userInfo.actualCityCode]
      });

    },

    async save() {
      const check = this.$refs.area.getCheckedNodes()[0]
      const expressCity = check.label
      const expressProvince = check.parent.label
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true;
          let params = Object.assign({ expressCity, expressProvince }, this.dataForm);
          delete params['administrativeArea']
          const result = await post("/wms/order/delivery", params)
          this.sending = false
          if (result.code == 200) {
            this.show(false)
            this.$message.success("订单发货成功！")
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep .el-cascader .el-input {
  width: 100%;
}
</style>
