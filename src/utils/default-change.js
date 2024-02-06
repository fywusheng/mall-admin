import Vue from 'vue'
import ElementUI from 'element-ui';

/**
 * @Date: 2022-05-23 
 * @Description: 统一格式化去空格
*/
Vue.component('el-input', {
  extends: ElementUI.Input,
  created() {
    this.$on('change', (value) => {
      this.$emit('input', value.replace(/\s/g,""))
    })
  }
})