<template>
<div class="app-container">
  <el-form class="notice-search-box-body search-form clearfix" v-show="showSearchBox" :inline="true" size="mini">
    <el-form-item label="活动标题：" label-width="110px" class="search-field fl">
      <el-input v-model="searchData.notcTtl" placeholder="请输入公告标题" clearable size="mini"/>
    </el-form-item>
    <el-form-item label="生效时间：" label-width="110px" class="search-field fl">
      <el-date-picker 
        size="mini"
       v-model="searchData.time" 
       type="daterange"
       range-separator="-"
       value-format="timestamp"
       start-placeholder="开始日期"
       end-placeholder="结束日期"
       clearable
      ></el-date-picker>
    </el-form-item>
    <el-form-item class="fr">
      <!-- <el-button class="two-words" plain size="small" @click="onClickReset">重置</el-button> -->
      <el-button class="two-words" icon="el-icon-search" type="primary" size="mini" @click="onClickSearch">查询</el-button>
      <el-button class="head-item" type="default" icon="el-icon-circle-plus-outline" size="mini" @click="onClickAddNotice">添加</el-button>
    </el-form-item>
  </el-form>

  <div class="table-wrap">
    <el-table ref="noticeTable" v-loading="listLoading" :data="noticeList" element-loading-text="加载中..." highlight-current-row>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="活动编码" align="center" prop="notcTtl"></el-table-column>
      <el-table-column label="活动标题" align="center" prop="notcTtl"></el-table-column>
      <el-table-column label="活动时间" align="center" prop="notcInfo" show-overflow-tooltip></el-table-column>
      <el-table-column label="启用状态" align="center" prop="runStas">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.runStas"
            @change="onChangeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" prop="pshCnt"></el-table-column> 
      <el-table-column align="center" label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button :underline="false" size="mini" @click="onClickEditNotice(scope.row, 2)">编辑</el-button>
          <el-button :underline="false" size="mini" @click="onClickEditNotice(scope.row, 3)">详情</el-button>
          <!-- <el-button :underline="false" size="mini" @click="onClickSendNotice(scope.row)">推送</el-button> -->
          <!-- <el-button :underline="false" size="mini" @click="onClickDeleteNotice(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background v-show="total > 10" @size-change="changeSize" @current-change="changePage" :page-size="searchData.pageSize" layout="total, slot, jumper, prev, pager, next" :total="total"></el-pagination>
  </div>

  <!-- 新增/编辑活动通知 dialog -->
  <el-dialog :close-on-click-modal="false" :title="titleObj[curType]" :visible.sync="addEditDialogVisible" width="600px" class="add-notice-dialog">
    <el-form ref="noticeDialogForm" :model="noticeInfo" :rules="dialogRule" label-width="140px" size="small">
      <el-form-item label="活动通知标题：" prop="notcTtl">
        <el-input v-model="noticeInfo.notcTtl" placeholder="请输入活动通知标题" maxlength="50" :disabled="curType == 3"/>
      </el-form-item>
      <el-form-item label="活动通知摘要：" prop="notcTtl">
        <el-input v-model="noticeInfo.notcTtl" placeholder="请输入活动通知摘要" maxlength="200" :disabled="curType == 3"/>
      </el-form-item>
      <el-form-item label="活动时间：" prop="expiryDate">
        <el-date-picker
          style="width: 100% !important; "
          v-model="noticeInfo.expiryDate" 
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期"
          clearable
          :disabled="curType == 3"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动描述：" prop="notcInfo">
        <el-input type="textarea" v-model="noticeInfo.notcInfo" maxlength="1000" placeholder="请输入活动描述" :autosize="{ minRows: 3, maxRows: 3 }" :disabled="curType == 3"/>
      </el-form-item>
      <el-form-item label="活动通知图片：" prop="imgUrl">
        <el-upload class="avatar-uploader"
          :disabled="curType == 3"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="true">
            <img v-if="noticeInfo.imgUrl" :src="noticeInfo.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="重定向URL：">
        <el-input v-model="noticeInfo.notcTtl" placeholder="请输入重定向URL" :disabled="curType == 3"/>
      </el-form-item>
      <el-form-item label="门店所属地区：" prop="districtArea">
        <el-cascader v-model="noticeInfo.districtArea" :disabled="curType == 3" :options="areaList" :props="{ value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}" size='small'  clearable placeholder="请选择门店所属地区..." style="width:100%"/>
      </el-form-item>
      <el-form-item label="适用门店：" prop="msgType">
        <el-select style="width: 100%;" v-model="noticeInfo.msgType" :disabled="curType == 3" placeholder="请选择适用门店" clearable>
          <el-option label="系统通知" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="()=>{ addEditDialogVisible = false }">取 消</el-button>
      <el-button v-if="curType != 3" type="primary" size="small" @click="handleAddEditNotice">保 存</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
// import { msgManageApi as msgApi } from "@/api"

import { fetch, post } from "@/utils/http-nepsp"
import { fetch as clientFetch } from "@/utils/http-client"

// const path = "/ngcmn"

export default {
  name: "messageNoticeManage",
  data() {
    return {
      listLoading: false, // loading 效果
      showSearchBox: true, // 是否展示搜索框
      searchData: {
        pageNum: 1, // 当前页码
        pageSize: 10, // 当前页面最大显示条数
        notcTtl: "", // 标题
        time: [] // 时间范围
      }, // 筛选器内容
      rlsChnlStr: [], // 发布类型
      noticeInfo: {
        crterTime: "", // 创建时间
        msgTypeStr: "", // 消息类型
        notcInfo: "", // 公告内容
        notcTtl: "", // 公告标题
        rediAddr: "", // 重定向地址
        imgUrl: '', // 公告图片
        districtArea: '', // 门店所属地区
      },
      noticeList: [], // 公告列表
      total: 0, // 公告数量
      addEditDialogVisible: false, // 添加编辑弹窗是否显示
      // isEdit: false, // 弹窗是否为编辑弹窗
      curType: 1, // 新增 = 1， 编辑 = 2， 详情 = 3。
      titleObj: {
        1: '创建活动通知',
        2: '编辑活动通知',
        3: '活动通知详情',
      },
      areaList: [], // 门店所属地区数据
      dialogRule: {
        notcTtl: [{ required: true, message: "活动通知标题不能为空，请输入！", trigger: "blur" }],
        msgType: [{ required: true, message: "适用门店不能为空，请选择！", trigger: ["change", "blur"] }],
        notcInfo: [{ required: true, message: "活动描述不能为空，请输入！", trigger: "blur" }],
        imgUrl: [{ required: true, message: "活动通知图片不能为空，请选择！", trigger: "change" }],
        expiryDate: [{ required: true, message: "活动时间不能为空，请选择！", trigger: "change" }],
        districtArea: [{ required: true, message: "门店所属地区不能为空，请选择！", trigger: "change" }],
      } // 弹窗表单校验规则
    }
  },
  created() {
    // 加载公告列表
    this.loadNoticeList()
    this.loadAreaTree()
  },
  watch: {
    // 监听dialog的是否显示按钮选项, 如果不显示按钮的话, 就清空以下内容
    "noticeInfo.showButton": {
      handler(newVal) {
        if (!newVal) {
          this.noticeInfo.btnTitle = ""
          this.noticeInfo.triggerEvent = ""
          this.noticeInfo.redirectUrl = ""
          this.noticeInfo.expiryDate = ""
        }
      } 
    },
    // 监听 dialog 的发布渠道字段
    rlsChnlStr(newVal) {
      this.noticeInfo.rlsChnlStr = newVal
      // 判断是否有选中值, 如果有选中值就移除校验结果
      if (newVal.length) {
        setTimeout(() => {
          this.$refs.noticeDialogForm.clearValidate("rlsChnlStr")
        })
      }
    },
    // 监听 dialog 的隐藏时清空表单内容
    addEditDialogVisible(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.$refs.noticeDialogForm.resetFields()
        })
      }
    }
  },
  methods: {
    addLevel(tree, level = 1) {
      tree.forEach(node => {
        node.level = level;
        node.leaf = (level === 2)
        // 删除第三层级
        if (level === 2) {
          delete node.children
        }
        if (node.children) {
          this.addLevel(node.children, level + 1);
        }
      });
    },

    async loadAreaTree() {
      const result = await clientFetch("/area/getAreaTree", {});
      if (result.code == 200) {
        this.addLevel(result.data)
        this.areaList = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },
    /**
     * @description: 点击查询时重置页数
     * @author: chenwz
     */
    onClickSearch() {
      this.searchData.pageNum = 1
      this.loadNoticeList()
    },
    /**
     * @description: 点击筛选器重置事件
     * @author: chenwz
     */
    onClickReset() {
      this.searchData = {
        pageNum: 1,
        pageSize: 10
      }
      this.loadNoticeList()
    },
    /**
     * @description: 分页器事件
     * @param {type} page Number 当前页
     * @author: chenwz
     */
    handlePagination({ page, limit }) {
      this.searchData.pageNum = page
      this.searchData.pageSize = limit
      this.loadNoticeList()
    },
    /**
     * @description: 加载公告列表
     * @author: chenwz
     */
    async loadNoticeList() {
      this.listLoading = true
      try {
        const { type, data } = await post("/ngcmn/notice/sys/selectNotice", {data: {data: this.searchData}})
        if (type === "success") {
          this.noticeList = data.list
          this.total = data.total
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 点击添加按钮
     * @author: chenwz
     */
    onClickAddNotice() {
      // 清空数据再打开dialog
      this.noticeInfo = {
        notcCfgDTO: {
          lginFlag: "",
          popUpFlag: "",
          notcType: "",
          clikType: "",
          clikStas: "",
          beginTime: "",
          clikCont: "",
          clikUrl: "",
          crteTime: "",
          invdTime: "",
          poolarea: null,
          popNotcTtl: "",
          imgUrl: ""
        }
      }
      // this.isEdit = false
      this.curType = 1
      this.addEditDialogVisible = true
    },
    /**
     * @description: 编辑公告记录状态
     * @param status String 编辑的数据
     * @author: chenwz
     */
    async onChangeStatus(row) {
      // 修改状态时显示loading效果, 防止重复操作
      this.listLoading = true
      try {
        const { type } = await post("/ngcmn/notice/sys/updtNotcRunStas", {data: {data: { notcId: row.notcId, runStas: row.runStas ? 0 : 1 }}})
        if (type === "success") {
          this.listLoading = false
          this.$message({
            type: "success",
            message: "修改成功!"
          })
        }
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 编辑公告记录
     * @param row Object 编辑的数据
     * @author: chenwz
     */
    onClickEditNotice(row, type) {
      // this.isEdit = true
      this.curType = type
      this.addEditDialogVisible = true
      this.noticeInfo = row
    },
    /**
     * @description: 处理编辑公告记录事件
     * @author: chenwz
     */
    async handleEditNotice() {
      this.$refs.noticeDialogForm.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.noticeInfo, { runStas: this.noticeInfo.runStas ? 0 : 1 })
          try {
            const { type } = await post("/ngcmn/notice/sys/addOrUpdateSysNoticeService", {data: {data: params}})
            if (type === "success") {
              this.addEditDialogVisible = false
              this.$message({
                type: "success",
                message: "保存成功!"
              })
              this.loadNoticeList()
            }
          } catch (e) {
            this.addEditDialogVisible = true
          }
        }
      })
    },
    /**
     * @description: 点击删除公告操作
     * @param row Object 删除数据
     * @author: chenwz
     */
    onClickDeleteNotice(row) {
      this.$confirm("是否删除该公告", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.handleDeleteNotice(row.notcId)
      }).catch(() => { })
    },

    /**
     * @description: 处理删除公告操作
     * @param id String 删除数据的id
     * @author: chenwz
     */
    async handleDeleteNotice(id) {
      this.listLoading = true
      try {
        const { type } = await post("/ngcmn/notice/sys/deleteNoticeService", {data: {data: { notcId: id }}})
        if (type === "success") {
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          this.loadNoticeList()
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 处理保存或者新建公告操作
     * @author: chenwz
     */
    handleAddEditNotice() {
      if (this.curType == 2) {
        this.handleEditNotice()
      } else if (this.curType == 1) {
        this.handleAddNotice()
      }
    },
    /**
     * @description: 添加公告
     * @author: chenwz
     */
    async handleAddNotice() {
      this.$refs.noticeDialogForm.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.noticeInfo, { runStas: this.noticeInfo.runStas ? 0 : 1 })
          try {
            const { type, message } = await post("/ngcmn/notice/sys/addOrUpdateSysNoticeService", {data: {data: params}})
            if (type === "success") {
              this.addEditDialogVisible = false
              this.$message({
                type: "success",
                message: "添加公告成功!"
              })
              this.loadNoticeList()
            } else {
              this.$message.error(message)
            }
          } catch (e) { 
            this.addEditDialogVisible = true
          }
        }
      })
    },
    /**
     * @description: 推送公告
     * @param row Object 推送数据内容
     * @author: chenwz
     */
    // 平台系统没找到对应的接口
    async onClickSendNotice(row) {
      this.listLoading = true
      try {
        const { type } = await post("/ngcmn/mock/api/notice/push", {data: {data: { id: row.notcId }}})
        if (type === "success") {
          this.$message({
            type: "success",
            message: "推送成功!"
          })
          this.loadNoticeList()
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
        this.$message({
          type: "error",
          message: "推送失败!"
        })
      }
    },
     changeSize(pageSize) {
      this.searchData.pageSize = pageSize
      this.searchData.pageNum = 1
      this.loadNoticeList()
    },
    changePage(pageNum) {
      this.searchData.pageNum = pageNum
      this.loadNoticeList()
    },
    handleAvatarSuccess(response, file) {
      if (!response || response.code != 0) {
        return;
      }
      // this.noticeInfo.imgUrl = file.response.data.absoluteUrl;
      this.$set(this.noticeInfo, 'imgUrl', file.response.data.absoluteUrl)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPEG/JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style lang="scss" scoped>
.table-edit-box {
  background-color: #ffffff;
  &-title {
    display: flex;
    margin-left: 5px;
    font-size: 18px;   
    align-items: center;
  }
  &-operator {
    display: flex;
    .head-item {
      margin-right: 10px;
    }
    .head-item:last-child {
      margin-right: 0;  
    }
    .head-item-selector {
      width: 120px;
    }
  }
}

.add-notice-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      height: 350px;
      // overflow: hidden;
      overflow-y: auto;
    }
  }
}

.avatar-uploader .el-upload {
  border: 0.5px dashed #DCDFE6;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #609df3;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 0.5px dashed #DCDFE6;
  border-radius: 10px;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}

.check-notice-dialog {
  &-container {
    .check-notice-dialog-title {
      font-size: 18px;
      line-height: 35px;
      border-bottom: 1px solid #f3f3f3;
    }
    .check-notice-dialog-content {
      padding: 5px 0;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

.notice-upload {
  ::v-deep .el-upload {
    width: 100%;
  }
}

</style>
