<template>
  <div class="page-user-detail app-container">
    <el-page-header @back="back2Prev" content="会员详情"></el-page-header>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <!-- 用户信息开始 -->
    <div class="user-info  clearfix">
        <div class="left-info flex-c-s flex-col">
          <img class="imgs" :src="info && info.userIcon" alt="">
          <h3 class="name">{{info.psnName || '--'}}</h3>
          <div class="status">{{info && info.crtfStas === "0" ? "未认证" : "已认证"}}</div>
        </div>
        <div class="right-info clearfix">
          <div class="block fl clearfix" v-for="(item,index) in fiedlList" :key="index" >
            <div class="field fl">{{item.value}}</div>
            <div class="content" v-if="item.key == 'idCard'">{{info[item.key] || "--"}}</div>
            <div class="content" v-else-if="item.key == 'storeName'">{{(info.shStoreDTO && info.shStoreDTO.storeName) || "--"}}</div>
            <div class="content" v-else-if="item.key == 'shStoreDTO-address'">{{(info.shStoreDTO && info.shStoreDTO.address) || "--"}}</div>
            <!-- <div class="content" v-else-if="item.key == 'shStoreDTO-expirationTime'">{{(info.shStoreDTO && info.shStoreDTO.expirationTime) || "--"}}</div> -->
            <!-- <div class="content" v-else-if="item.key == 'shStoreDTO-membeRenewals'">{{(info.shStoreDTO && info.shStoreDTO.membeRenewals) || "--"}}</div> -->
            <!-- <div class="content" v-else-if="item.key == 'shStoreDTO-memberAcount'">{{(info.shStoreDTO && info.shStoreDTO.memberAcount) || "--"}}</div> -->
            <div class="content" v-else>{{(info[item.key] || info[item.key] === 0 || info[item.key] === '0') ? info[item.key] : '--'}}</div>
          </div>
        </div>
    </div>
    <!-- 用户信息结束 -->
    <div class="page-title">会员开通记录</div>
    <!-- 查询结果区开始 -->
    <!-- TODO 表头字段调整，需核对 -->
    <div class="table-wrap">
      <el-table ref="table" v-loading="listLoading" height="446px" :data="list" element-loading-text="加载中..."   highlight-current-row>
        <el-table-column align="center" label="序号" prop="id" width="60px">
            <template slot-scope="scope">
            {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
            </template>
        </el-table-column>
        <el-table-column label="开通时间" prop="opter_name"  show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.orderDetailDTO.usageTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开通类型" prop="org_location" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.orderDetailDTO.productStatus == 1 ? '首次开通' : scope.row.orderDetailDTO.productStatus == 2 ? '续费开通' : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开通卡类型" prop="create_time"  show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.orderDetailDTO.scopeOfApplication }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员费" prop="create_time"  show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.orderDetailDTO.productPrice }}</span>
          </template>
        </el-table-column>
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
          key: "phone",
          value: "绑定手机"
        },
        {
          key: "sex", // 
          value: "性别"
        },
        {
          key: "brdy",
          value: "出生年月"
        },
        {
          key: "address",
          value: "默认地址"
        },
        {
          key: "age",
          value: "年龄"
        },
        {
          key: "storeName",
          value: "所属门店"
        },
        {
          key: "shStoreDTO-address",
          value: "门店地址"
        },
        {
          key: "disease",
          value: "疾病情况"
        },
        {
          key: "cardStatus",
          value: "使用状态"
        },
        {
          key: "expirationTime",
          value: "会员有效期"
        },
        {
          key: "memberRenewals",
          value: "会员续费次数"
        },
        {
          key: "memberAcount",
          value: "会员累计已省金额"
        },
      ],
      listLoading: false,
      list: [],
      formSearch: {
        pageNum: 1,
        pageSize: 10
      },
      memberId: "", //用户ID
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
    this.memberId = this.$route.params.memberId
    this.formSearch.psnId = this.$route.params.psnId
    const len = (14 - this.fiedlList.length) > 0 ? (14 - this.fiedlList.length) : 0
    console.log("created -> len", len)
    for (let i = 0; i < len; i++){
      const obj = {key: "", value: ""}
      this.fiedlList.push(obj)
    }
    // console.log(this.fiedlList)

    //查询扫码记录
    this.handleSearch()

    //获取用户详情
    this.getUserDetail()
  },
  methods: {
    // 开通记录
    async loadVipData() {
      this.vipLoading = true
      const params = {
        pageNum: this.formSearch.pageNum,
        pageSize: this.formSearch.pageSize,
      }
      params.orderSource = 6
      params.userPhone = this.info.phone
      params.orderStatus = 3
      const result = await post('/offlineshopping/order/findOrderPage', {data: params})
      if (result.code == 0) {
        this.$nextTick(() => {
          this.total = result.data.total * 1
          this.list = result.data.list || []
        })
      } else {
        this.$message.error(result.msg)
      }
    },
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
      const parmas = {memberType: this.$route.params.memberType, memberId: this.memberId}
      post("/nun/api/userPerson/getUserInfoById", {data: {data: parmas}}).then(data => {
      // post("/nun/api/userWeb/userDetail", {acctId: this.acctId}).then(data => {
        this.info = data.data
        this.info.sex = this.info.sex == "0" ? "男" : this.info.sex == "1" ? "女" : '--'
        // 会员使用状态0  失效  1 使用
        this.info.cardStatus = this.info.cardStatus == 1 ? '使用' : this.info.cardStatus == 0 ? '失效' : '--'
        this.loadVipData()
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
        if (data.code == 200){
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
    back2Prev() {
      this.$router.back();
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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