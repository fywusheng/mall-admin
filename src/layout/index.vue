<template>
  <div>
    <div class="header_top">
      <div class="logo-warpper">
        <el-image class="logoImg" :src="imgsrc" fit="fill"></el-image>
        <div class="left_title">
          <div class="comy">{{userObject.supplierName}}</div>
          <div class="people">{{autoObj[userObject.accountType]}}</div>
        </div>
      </div>

      <div class="_right">
        <div class="">欢迎! {{userObject.loginName}}</div>
        <div class="logout" @click="loginOut">退出</div>
      </div>
    </div>
    <!-- <div class="space"></div> -->
    <div :class="classObj" class="app-wrapper">
      <!-- <top-sidebar class="left-sidebar-container"></top-sidebar> -->
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TopSidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    //RightPanel,
    //Settings,
    Sidebar,
    //TagsView
    TopSidebar
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: true,
        // hideSidebar: !this.sidebar.opened,
        //openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  data() {
    return {
      autoObj: { 0: '供应商', 1: '合伙人', 9: '平台自营' },
      userObject: {},
      imgsrc: require('../layout/static/logo.png')
    }
  },
  mounted() {
    const user = localStorage.getItem('userInfor')
    this.userObject = JSON.parse(user)
  },
  methods: {
    loginOut() {
      this.$router.push(`/login`);
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.header_top {
  position: relative;
  height: 70px;
  width: 100%;
  // background-color: #fff;
  background: linear-gradient(to right, #ff8235, #ff5e17);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo-warpper {
    display: flex;
    align-items: center;
  }
  .left_title {
    // position: absolute;
    top: 14px;
    display: flex;
    left: 159px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #ffffff;
    .people {
      margin-left: 31px;
    }
  }

  // background-image: url('../layout/static/top_bg.png');
  .logoImg {
    width: 118px;
    height: 39px;
    margin-left: 20px;
    margin-right: 14px;
  }
  ._right {
    display: flex;
    // position: absolute;
    margin-right: 50px;
    color: #ffffff;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    top: 13px;
    .logout {
      margin-left: 29px;
    }
    .logout:hover {
      cursor: pointer;
    }
  }
}
.space {
  height: 7px;
  background-color: #f7f8fa;
}
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.left-sidebar-container,
.sidebar-container {
  top: 74px !important;
}
.main-container {
  height: 100vh;
  overflow: auto;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 70px;
  right: 0;
  z-index: 9;
  left: 235px;
  transition: width 0.28s;
  width: calc(100% - 235px);
}

.hideSidebar .fixed-header {
  width: calc(100% - 50px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
