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
    :remote-method="remoteMethod"
    :loading="loading"
    @change="change">
    <el-option
      v-for="item in options"
      :key="item.storeNo"
      :label="item.storeName"
      :value="item.storeNo">
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
      this.remoteMethod(' ')
    },
    methods: {
      // 获取所有，暂时先不用
      // async loadData () {
      //   const result = await post("/srm/sh/information/getInformationList");
      //   if (result.code == 200) {
      //     this.sourceData = result.data.list;
      //   } else {
      //     this.$message.error(result.msg);
      //   }
      // },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          post("/srm/sh/stores/listByPageNo", {storeName: query, pageNum: 1, pageSize: 20}).then(res => {
            if (res.code === '200') {
              this.loading = false;
              this.options = res.data?.list || []
            }
          })
        } else {
          this.options = [];
        }
      },
      change(val) {
        console.log(val)
        const res = this.options.find(item => item.storeNo == val)
        this.$emit('input', val)
        this.$emit('change', res)
      }
    }
  }
</script>