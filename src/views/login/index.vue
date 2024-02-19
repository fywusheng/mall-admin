<template>
  <div class="login-container">
    <div class="header">
      <!-- <img class="logo" :src="logo"> -->
      <img class="logo" src="" alt="">
      <h2 class="title">智慧康复平台业务管理系统</h2>
      <!-- <div class="header-right">商家帮助中心</div> -->
    </div>
    <div class="center">
      <!-- <div class="center-title">
        <div class="top">轻松开店 惠老惠己</div>
        <div class="btm">开拓市场 提升客流 助力经营</div>
      </div> -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"
        autocomplete="on" label-position="center" size="large">

        <div class="title-container">
          <h3 class="title">您好，欢迎登录</h3>
        </div>
        <el-form-item prop="userName">
          <el-input ref="userName" v-model="loginForm.userName" placeholder="请输入登录账号..."
            name="userName" type="text" tabindex="1" autocomplete="on">
            <i slot="prefix" class="el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" type="password"
            placeholder="请输入登陆密码..." name="password" tabindex="2" autocomplete="on">
            <img slot="prefix" src="./img/password_ic.png">
          </el-input>
        </el-form-item>
        <el-button class="btn-login" :loading="loading" size="large" type="primary"
          @click.native.prevent="handleLogin">{{
          loading ? '正在登录...' : '登录'
        }}</el-button>
      </el-form>
    </div>

    <div class="footer">
      <!-- <div class="lianxi">
        <div>关于我们</div>
        <div>联系我们</div>
        <div>公司官网</div>
      </div>
      <div class="copyright">Copyright ©2020-2022 gjllfw.com All rights reserved. 版权所有:国家老龄服务平台
      </div> -->
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import sha256 from 'crypto-js/sha256';
export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('登录账号不能为空，请输入...'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位，请检查！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      logo: require('@/assets/imgs/login-logo.png'),
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  async mounted() {
    // if (this.loginForm.userName === '') {
    //   this.$refs.userName.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
    await this.$store.dispatch('tagsView/delAllViews');
    // this.$nextTick(() => {
    //   particlesJS.load('particles', './particles.json', function () {
    //     console.log('callback - particles.js config loaded');
    //   });
    // })
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          var hash = sha256(this.loginForm.password)
          var newstr = hash.toString()
          const params = {
            userName: this.loginForm.userName,
            password: newstr
          }
          const result = await this.$store.dispatch('user/login', params)
          this.loading = false
          result && this.$router.push({ path: this.redirect || '/apps/dashboard', query: this.otherQuery })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/index.scss";

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background: url("../../assets/imgs/login-bg.png") 100% 100% no-repeat;
  overflow: hidden;
  .title-container {
    position: relative;
    .title {
      font-size: 20px;
      color: #373f55;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .header {
    width: 100%;
    height: 58px;
    background-color: #ff5500;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.02);
    display: flex;
    align-items: center;
    // justify-content: space-between;

    .logo {
      height: 43px;
      // width: 383px;
      width: 43px;
      margin-left: 73px;
    }
    .title {
//      width: 261px;
//      height: 28px;
      font-size: 20px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 28px;
      letter-spacing: 1px;
      margin-left: 15px;
    }
    .header-right {
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 28px;
      letter-spacing: 1px;
      margin-right: 93px;
    }
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .center-title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      .top {
        font-size: 28px;
      }
    }
  }

  .login-form {
    // @include middle-center();
    margin-top: 24px;
    width: 347px;
    padding: 50px;
    // margin: 0 auto;
    overflow: hidden;
    z-index: 500;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0px 2px 28px 0px rgba(148, 67, 31, 0.14);
    border-radius: 9px;

    .btn-login {
      display: block;
      width: 100%;
      margin-top: 30px;
      padding: 12px;
      font-size: 18px;
      letter-spacing: 5px;
    }
    .el-form-item {
      margin-bottom: 30px;
    }
    .el-form-item__error {
      margin-top: 5px;
      font-size: 14px;
    }
    .el-input--large {
      .el-input__prefix {
        display: flex;
        align-items: center;
        left: 15px;
        color: #656870;
        i {
          font-size: 18px;
        }
      }
      .el-input__inner {
        padding-left: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
      }
    }
  }

  .footer {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 64px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .lianxi {
      width: 278px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
