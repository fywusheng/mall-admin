<template>
  <div class="page-citien-user app-container">
    <!-- 查询条件区开始 -->
    <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix"
      size="small">
      <el-form-item class="search-field fl" label="所在地市" prop="uactAttribution">
        <y-united-select size="mini" maxLevel="1" :delChildren="true" :settings="{ value:'code',label:'name',leaf:'pid'}" @codeChange="handdleSearch" :data="cityList" clearable v-model="formSearch.districtArea"></y-united-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="会员使用状态" prop="cardStatus">
        <el-select @change="handdleSearch" clearable v-model="formSearch.cardStatus" size="mini"
          placeholder="请选择会员使用状态.">
          <el-option :value="1" label="使用中"></el-option>
          <el-option :value="0" label="已失效"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="search-field fl" label="手机号" prop="phone">
        <el-input clearable v-model="formSearch.phone" placeholder="请输入手机号" size="mini"/>
      </el-form-item>
      <el-form-item class="search-field fl" label="开通日期" prop="startDate">
        <el-date-picker value-format="yyyy-MM-dd" @change="dateChange" v-model="daterange" size="mini"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="fl">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit('formSearch')">查询</el-button>
        <el-button class="two-words" icon="el-icon-refresh" size="mini" @click="onReset('formSearch')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件区结束 -->

    <!-- 查询结果区开始 -->
    <div class="table-wrap ">
      <el-table ref="table" v-loading="listLoading" max-height="490px" :data="list"
        element-loading-text="加载中..." highlight-current-row>
        <el-table-column align="center" label="序号" prop="id" width="50px">
          <template slot-scope="scope">
            {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" prop="psnName" show-overflow-tooltip />
        <el-table-column align="center" label="身份证号" prop="idCard" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.idCard ? '已录' : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所在地" prop="districtArea"
          show-overflow-tooltip />
        <el-table-column align="center" label="手机号" prop="phone" show-overflow-tooltip />
        <el-table-column align="center" label="会员使用状态" prop="cardStatus" show-overflow-tooltip :formatter="getcardStatus"></el-table-column>
        <el-table-column align="center" label="开通时间" prop="idCardTime" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.idCardTime || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="goDetail(scope.row)">详情</el-button>
            <el-button size="mini" @click="resetPwd(scope.row.memberId)">重置密码</el-button>
            <!-- <el-link type="warning" v-if="false" size="small" @click="goDetail(scope.row)">禁用</el-link> -->
            <!-- 删除功能去掉 -->
            <!-- <el-link type="danger" size="small" @click="deleteAccount(scope.row.uactId)">删除</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <y-pagination v-show="total>0" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" @pagination="fetchData" /> -->
      <!-- 查询结果区结束 -->
      <el-pagination background v-show="total > 10" @size-change="changeSize" @current-change="changePage" :page-size="formSearch.pageSize" layout="total, slot, jumper, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
// import { appUserManageApi, commonApi } from "@/api"
import { post } from "@/utils/http-nepsp"
import { fetch as clientFetch } from "@/utils/http-client"
import YUnitedSelect from "@/components/y-united-select/index"

export default {
  data() {
    return {
      showDetail: false, //展示详情
      cityList: [], //城市列表
      daterange: "", //选择的日期范围
      activateState: "", //激活状态
      formSearch: { //查询表单
        cardStatus: "", // 会员使用状态
        memberType: "1", // 0 用户 1会员
        phone: "", // 手机号
        districtArea: "", // 城市
        startDate: "", //开始日期
        endDate: "", //截止日期
        pageNum: 1,
        pageSize: 10
      },
      // 分页
      total: 0,
      // 表格
      list: [],
      isFirstLoadTable: true,
      listLoading: false, // 表格加载
      rfidDict: []
    }
  },
  components: {
    YUnitedSelect,
  },
  created() {
    //查询数据
    this.handdleSearch()
    //获取城市列表
    this.getCityList()
  },
  methods: {
    getcardStatus(row) {
      if ('cardStatus' in row && row.cardStatus !== '') {
        return row.cardStatus == 1 ? '使用中' : row.cardStatus == 0 ? '已失效' : ''
      } else {
        return '--'
      }
    },
    /**
     * @description: 重置密码
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    resetPwd(uactId) {
      this.$confirm("是否确认重置密码？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        post('/nun/api/userWeb/alterLoginPwd', { uactId }).then(data => {
          this.$message.success("重置密码成功")
          console.log("resetPwd -> data", data)
        })
      })
    },
    /**
     * @description: 删除用户
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    deleteAccount(uactId) {
      this.$confirm("是否确认删除？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        post('/nun/api/userWeb/deleteUser', { uactId }).then(data => {
          this.$message.success("删除用户成功")
          this.handdleSearch()
        })
      })
    },
    /**
     * @description: 获取城市列表
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getCityList() {
      clientFetch("/area/getAreaTree").then(res => {
        this.cityList = res.data  
      }).catch(e => {
        console.log(e)
      }).finally(() => {
      
      })
      // commonApi.getRegnAreaTree().then(data => {
      //   this.cityList = data.data
      // })
    },
    /**
     * @description: 搜索日期改变事件
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    dateChange(val) {
      this.formSearch.startDate = val && val[0] || ""
      this.formSearch.endDate = val && val[1] || ""
      this.handdleSearch()
    },
    // 前往用户详情
    goDetail(data) {
      this.$router.push({ name: "Vip-Details", params: { memberId: data.memberId, memberType: this.formSearch.memberType } })
    },
    // 重置表单
    onReset(formName) {
      // this.formSearch.startDate = "" 让resetFields清除
      this.formSearch.endDate = ""
      this.daterange = ""
      this.$refs[formName].resetFields()
      this.handdleSearch()
    },
    /**
     * @description: 触发搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handdleSearch() {
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    // 查询
    onSubmit(forName) {
      this.handdleSearch()
    },
    /**
     * @description: 获取数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    fetchData() {
      this.listLoading = false
      post('/nun/api/userPerson/getPageUserInfoList', {data: { data: this.formSearch }}).then(data => {
      // post('/nun/api/userWeb/findUserPage', this.formSearch).then(data => {
        this.listLoading = false
        if (data.data) {
          this.list = data.data.list || []
          this.total = data.data.total || 0
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
.content-box {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .content {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img {
    margin-left: 12px;
  }
}
</style>