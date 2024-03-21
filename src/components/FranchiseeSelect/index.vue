<!-- :remote-method="remoteMethod" -->
<template>
  <el-select
    v-model="val"
    :size="size"
    filterable
    remote
    clearable
    :disabled="disabled"
    reserve-keyword
    :placeholder="placeholder"
    :loading="loading"
    @change="change">
    <el-option
      v-for="item in options"
      :key="item.informationNo"
      :label="item.informationName"
      :value="item.informationNo">
    </el-option>
  </el-select>
</template>

<script>
import { post } from "@/utils/http-client"
  export default {
    props: {
      value: {
        type: [String, Array, Number]
      },
      placeholder: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: 'size'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        val: '',
        options: [],
        list: [],
        loading: false,
      }
    },
    watch: {
      value (nVal) {
        this.val = nVal
      }
    },
    mounted() {
      // this.remoteMethod(' ')
      this.loadData()
    },
    methods: {
      // 获取所有，暂时先不用
      async loadData () {
        const result = await post("/srm/sh/information/getInformationList");
        if (result.code == 200) {
          this.options = result.data || [];
        } else {
          this.$message.error(result.msg);
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          post("/srm/sh/information/listByPageNo", {informationName: query}).then(res => {
            if (res.code == '200') {
              this.loading = false;
              this.options = res.data?.list || []
            } else {
              this.$message.error(result.msg);
            }
          })
        } else {
          this.options = [];
        }
      },
      change(val) {
        console.log(val)
        const res = this.options.find(item => item.informationNo == val)
        this.$emit('input', val)
        this.$emit('change', res)
      }
    }
  }
</script>