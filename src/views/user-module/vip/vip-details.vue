<template>
  <div class="page-user-detail app-container">
    <!-- 用户信息开始 -->
    <div class="user-info  clearfix">
        <div class="left-info flex-c-s flex-col">
          <img class="imgs" :src="info && info.userIcon" alt="">
          <h3 class="name">{{info && info.psnName}}</h3>
          <div class="status">{{info && info.crtfStas === "0" ? "未认证" : "已认证"}}</div>
        </div>
        <div class="right-info clearfix">
          <div class="block fl clearfix" v-for="(item,index) in fiedlList" :key="index" >
            <div class="field fl">{{item.value}}</div>
            <div class="content">{{info[item.key] || "--"}}</div>
          </div>
        </div>
    </div>
    <!-- 用户信息结束 -->
    <div class="page-title">会员开通记录</div>
    <!-- 查询结果区开始 -->
    <!-- TODO 表头字段调整，需核对 -->
    <div class="table-wrap ">
      <el-table ref="table" v-loading="listLoading" height="446px" :data="list" element-loading-text="加载中..."   highlight-current-row>
        <el-table-column align="center" label="序号" prop="id" min-width="75">
            <template slot-scope="scope">
            {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
            </template>
        </el-table-column>
        <el-table-column label="序号" prop="code_biz_info" show-overflow-tooltip />
        <el-table-column label="开通时间" prop="opter_name"  show-overflow-tooltip />
        <el-table-column label="开通类型" prop="org_location" show-overflow-tooltip />
        <el-table-column label="开通卡类型" prop="create_time"  show-overflow-tooltip />
        <el-table-column label="会员费" prop="create_time"  show-overflow-tooltip />
      </el-table>
      <!-- 分页 -->
      <!-- <y-pagination v-show="total>0" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" @pagination="fetchData" /> -->
      <el-pagination background v-show="total > 10" @size-change="changeSize" @current-change="changePage" :page-size="formSearch.pageSize" layout="total, slot, jumper, prev, pager, next" :total="total"></el-pagination>
    </div>
    <!-- 查询结果区结束 -->
  </div>
</template>

<script>
// import { getAllArr} from "@utils/getRouterList"
// import {appUserManageApi} from "@/api"
import { post } from "@/utils/http-nepsp"

export default {
  name: "",
  props: {
    psnId: {
      type: String,
      require: true
    }
  },
  data(){
    return {
      info: {}, //用户信息
      fiedlList: [
        {
          key: "psnName",
          value: "姓名"
        },
        {
          key: "idCard",
          value: "证件号码"
        },
        {
          key: "tel",
          value: "绑定手机"
        },
        {
          key: "gend",
          value: "性别"
        },
        {
          key: "brdy",
          value: "出生年月"
        },
        // TODO 字段调整，需要核对
        {
          key: "hsregAddr",
          value: "默认地址"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "年龄"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "所属门店"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "门店地址"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "疾病情况"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "使用状态"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "会员有效期"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "会员续费次数"
        },
        // TODO 字段调整，需要核对
        {
          key: "email",
          value: "会员累计已省金额"
        },
      ],
      listLoading: false,
      list: [],
      formSearch: {
        psnId: "",
        pageNum: 1,
        pageSize: 10
      },
      acctId: "", //用户ID
      total: 0
    }
  },
  computed: {
    // permissionAllMenuNameList(){
    //   const copyArr = JSON.parse(JSON.stringify(this.$store.getters.menuTree))
    //   const nameArr = getAllArr(copyArr, {wantField: "name"})
    //   return nameArr
    // }
  },
  async created() {
    // await this.checkPermission()
    this.acctId = this.$route.params.acctId
    this.formSearch.psnId = this.$route.params.psnId
    const len = (14 - this.fiedlList.length) > 0 ? (14 - this.fiedlList.length) : 0
    console.log("created -> len", len)
    for (let i = 0; i < len; i++){
      const obj = {key: "", value: ""}
      this.fiedlList.push(obj)
    }

    //查询扫码记录
    this.handleSearch()

    //获取用户详情
    this.getUserDetail()
  },
  methods: {
    /**
     * @description: 查询是否有市民列表权限
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    // checkPermission(){
    //   if (!this.permissionAllMenuNameList.includes("appUserCitizenUserManage")){
    //     const view = this.$route
    //     //去除市民详情 菜单页签
    //     this.$store.dispatch("tagsView/delView", view).then(() => {
    //       this.$router.replace({name: "page401"})
    //     })
    //   }
    // },
    /**
     * @description: 获取用户详情
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getUserDetail(){
      post("/api/userPerson/getPageUserInfoList", {data: {memberType: 1, memberId: this.acctId}}).then(data => {
      // post("/nun/api/userWeb/userDetail", {acctId: this.acctId}).then(data => {
        this.info = data.data&&data.data.userDetail
        this.info.gend = this.info.gend === "1" ? "男" : "女"
      })
    },
    /**
     * @description: 触发搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleSearch(){
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    /**
     * @description: 搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */  
    fetchData(){
      this.listLoading = false
      post("/nun/api/userWeb/userDetailScanList", this.formSearch).then(data => {
        this.listLoading = false
        if (data.data){
          this.list = data.data.ecUserList && data.data.ecUserList.list || []
          this.total = data.data.ecUserList && data.data.ecUserList.total || 0
        } else {
          this.list = []
          this.total = 0
        }
      })
    },
    changeSize(pageSize) {
      this.formSearch.pageSize = pageSize
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    changePage(pageNum) {
      this.formSearch.pageNum = pageNum
      this.fetchData()
    },
  }

}
</script>

<style lang="scss" scoped>
.page-user-detail{
  width: 100%;
  .user-info{
    width: 100%;
    height: 300px;
    background: #fff;
    margin-bottom: 10px;
    padding: 10px;
    .left-info{
      float:left;
      width: 300px;
      height: 100%;
      border: 1px solid #b6b7b9;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .imgs{
        width: 160px;
        height: 160px;
        border-radius: 50%;
        margin-top: 10px;
      }
      .name{
        line-height: 24px;
        font-size: 18px;
      }
      .status{
        padding: 0 16px;
        height: 26px;
        line-height: 26px;
        border-radius: 8px;
        font-size: 14px;
        color: #fff;
        background: #e7562c;
      }
    }
    .right-info {
      height:100%;
      margin-left: 300px;
      // background: yellow;
       border-top: 1px solid #b6b7b9;
      .block{
        width: 50%;
        height: 40px;
        font-size: 14px;
        border-bottom: 1px solid #b6b7b9;
        border-right: 1px solid #b6b7b9;
        .field{
          width: 140px;
          height: 100%;
          border-right: 1px solid #b6b7b9;
          line-height: 40px;
          text-align: right;
          padding-right: 14px;
          background: #f0f2f5;
          color: #606266;
        }
        .content{
          line-height: 40px;
          margin-left: 140px;
          padding-left: 10px;
          height: 100%;
        }
      }
    }
  }
  .page-title {
    padding: 20px;
    font-size: 20px;
    font-weight: 500
  }
}
</style>