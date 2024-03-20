<template>
  <header v-loading="loading">

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="content">
        <div v-for="nav in navList" :key="nav.id">
          <div class="menu" @click="menuClick(nav)">
            <svg-icon class="iconfont" :icon-class="getIconClassName(nav.name)" />
            {{nav.name}}
          </div>
          <div class="sub-menu">
            <div v-for="i in nav.children" :key="i.id" class="sub-item"
              :class="{active: i.url === activeIndex}" @click="menuClick(i)">
              {{i.name}}</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </header>
</template>

<script>
import { fetch, } from "@/utils/http-client"
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'

export default {
  name: 'Sidebar',
  data() {
    return {
      activeIndex: location.hash.substr(1),
      contentHeight: window.innerHeight - 100 + 'px',
      loading: false,
      navList: [],
      iconList: {
        '门店管理': 'menu-store',
        '商品管理': 'menu-product',
        '物流管理': 'menu-liu',
        '结算管理': 'menu-jiesuan',
        '用户管理': 'menu-kehu',
        '营销管理': 'menu-yingxiao',
        '交易管理': 'menu-jiaoyi',
        '加盟商管理': 'menu-jms',
        '内容管理': 'menu-content',
        '消息中心': 'menu-msg',
        '设置': 'menu-setting',
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'name']),
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // navList() {
    //   return this.$store.getters['sidebar/navList']
    // },
    variables() {
      return variables
    }
  },
  watch: {
    // 可以通过watch监听路由地址的变化, 只要路由地址发生变化, 就会自动调用对应的回调函数
    "$route.path": function (newValue, oldValue) {
      this.activeIndex = newValue
    }
  },
  async mounted() {
    const navRes = await fetch('/authority/getPermission')
    this.loading = false
    if (navRes.code == 200) {
      this.$store.dispatch('sidebar/updateNavList', navRes.data)
      this.navList = navRes.data
    } else {
      this.$message.error(navRes.msg)
    }
  },
  methods: {
    getIconClassName(name) {
      return this.iconList[name] ? this.iconList[name] : 'menu-setting'
    },
    menuClick(nav) {
      this.$router.push(nav.url)
    }
  }
}
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
.content {
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px;
  left: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 400;
  overflow-y: auto;
  .menu {
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 21px;
    box-sizing: border-box;
    background: #ffffff;
    .iconfont {
      margin-right: 8px;
    }
  }
  .sub-menu {
    display: flex;
    flex-wrap: wrap;
    background: #f9fafc;
    .sub-item {
      width: 100px;
      // height: 40px;
      margin: 12px 0 9px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        color: #ff5500;
      }
      &.active {
        color: #ff5500;
      }
    }
  }
}
</style>
