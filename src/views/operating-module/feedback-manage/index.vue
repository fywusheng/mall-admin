<template>
  <div class="app-container">
    <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix"
      size="mini">
      <el-form-item class="search-field fl" label="回复状态" prop="replyStas">
        <el-select v-model="formSearch.replyStas" placeholder="全部">
          <el-option v-for="item in feedbackStatusOptions" :key="item.value" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="反馈人联系方式" prop="crterMob">
        <el-input v-model="formSearch.crterMob" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item class="search-field fl" label="反馈时间" prop="selectedDate">
        <el-date-picker v-model="formSearch.selectedDate" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="">
        <el-button class="two-words" type="primary" icon="el-icon-search" size="mini" @click="fetchData(1)">查询
        </el-button>
        <el-button class="two-words" plain size="mini" @click="onReset('formSearch')">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table v-loading="listLoading" min-height="460px" :data="formData"
        element-loading-text="加载中..." fit highlight-current-row>
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="反馈人姓名" prop="crterName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.crterName || '--' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系方式" prop="crterMob" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="反馈内容" prop="prbDscr" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="回复状态" show-overflow-tooltip prop="replyStas">
          >
          <template slot-scope="scope">
            <el-tag :type="toTagType(scope.row.replyStas)">{{
              toStatue(scope.row.replyStas)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="反馈时间" prop="crteTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.crteTime | toCrteTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="handlePreview(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <y-pagination v-show="total > 0" class="pageBox" :total="total"
        :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" @pagination="fetchData" /> -->
      <el-pagination background v-show="total > 10" @size-change="changeSize" @current-change="changePage" :page-size="formSearch.pageSize" layout="total, slot, jumper, prev, pager, next" :total="total"></el-pagination>
    </div>
    <el-dialog title="意见详情" :visible.sync="editVisible" width="600px" class="add-dialog">
      <el-form ref="formAdd" :model="formAdd" label-width="120px" :rules="formAddRule">
        <el-form-item label="反馈人:">
          {{ formAdd.crterName }}
        </el-form-item>
        <el-form-item label="反馈内容:">
          <el-input v-model="formAdd.prbDscr" disabled type="textarea">
          </el-input>
        </el-form-item>
        <el-form-item label="回复内容:">
          <el-input v-model="formAdd.replyDscr" type="textarea"> </el-input>
        </el-form-item>
        <el-form-item label="回复方式:" prop="replyWay">
          <el-radio-group v-model="formAdd.replyWay">
            <!-- <el-radio label="0">短信回复</el-radio> -->
            <el-radio :label="1">站内信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="反馈图片:">
          <el-image 
            style="width: 100px; height: 100px"
            :src="formAdd.imgList[0]" 
            :preview-src-list="formAdd.imgList">
          </el-image>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <!-- <el-button @click="handleSave('formAdd')" type="success">保 存</el-button> -->
        <el-button type="primary" @click="handleReply('formAdd')">回复</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { operatingApi } from "@/api"
import { parseTime } from "@/utils/index.js"
import { post } from '@/utils/http-nepsp'


// const {
//   getFeedbackList,
//   saveFeedback,
//   releaseFeedback
// } = operatingApi.feedbackApi

export default {
  name: "feedbackManage",
  data() {
    const userinfor = JSON.parse(localStorage.getItem('userInfor'));
    return {
      /* 回复状态 */
      feedbackStatusOptions: [
        { value: "", label: "全部" },
        { value: "0", label: "未回复" },
        // { value: "1", label: "待回复" },
        { value: "2", label: "已回复" }
      ],
      /* 查询依赖 */
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        replyStas: "",
        selectedDate: ""
      },
      listLoading: false,
      formData: [],
      /* 表单依赖 */
      formAdd: {
        prbDscr: "",
        crterId: "",
        crterName: "",
        replyWay: 1,
        rid: "",
        replyStas: "",
        replierId: userinfor.loginName,
        replierName: userinfor.userName,
        imgList: []
      },
      /* 表单验证 */
      formAddRule: {
        replyWay: [
          { required: true, message: "请选择回复方式", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        age: [{ required: true, message: "请选择状态", trigger: "blur" }],
        gender: [
          { required: true, message: "请选择所属平台", trigger: "change" }
        ]
      },
      total: 10,
      editVisible: false,
      editTitle: "",
      replied: false,
      selectStatus: "",
      contactInfo: "",
      reply: "",
      replyData: {
        ttl: "您的意见反馈已回复",
        msgType: 1,
        smsSender: "admin",
        noticeSender: "admin",
        smsTmplId: "340763856449340438",
        noticeTmplId: "340763859899155509",
        replyDscr: "回复内容XXXXX10月21日3点43"
      },
      userinfor: JSON.parse(localStorage.getItem('userInfor'))
    }
  },
  methods: {
    /**
     * @description: 重置
     * @param {type}
     * @return {type}
     * @author: camus
     */
    onReset(refsName) {
      this.$refs[refsName].resetFields()
      this.formSearch = {
        ...this.formSearch,
        startTime: "",
        endTime: "",
        current: 1
      }
      this._getFeedbackList()
    },
    /**
     * @description: 查询
     * @param {type}
     * @return {type}
     * @author: camus
     */
    fetchData(val) {
      if (val === 1) {
        const { selectedDate } = this.formSearch
        this.formSearch.pageSize = 10
        this.formSearch.pageNum = 1
        this.formSearch = {
          ...this.formSearch,
          startTime: selectedDate && selectedDate[0] ?  selectedDate[0] : '',
          endTime: selectedDate && selectedDate[1] ? selectedDate[1] : ''
        }
      }
      this._getFeedbackList()
    },
    /**
     * @description: 查看
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handlePreview(row) {
      this.editVisible = true
      this.editTitle = "意见详情"
      this.formAdd = {
        ...this.formAdd,
        ...row,
        replyWay: 1,
        imgList: row.img?.split(',') || []
      }
      console.log(11111, this.formAdd)
    },
    /**
     * @description: 回复
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleReply(value) {
      try {
        this.formAdd.replyStas = 2
        this.editVisible = false
        await this._saveFeedback({
          ...this.formAdd,
          // ...this.replyData
        })
        this.$message.success("已回复")
      } catch (error) {
        this.$message("回复未成功")
      }
    },
    /**
     * @description:保存
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleSave(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.formAdd.replyStas = 1
          this.$message.success("保存成功！")
          this.editVisible = false
          this._saveFeedback(this.formAdd)
        }
      })
    },
    /**
     * @description: 回复状态
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toStatue(status) {
      if (!status) {
        return ""
      }
      switch (status) {
        case "0":
          return "未回复"
        case "1":
          return "已保存，未回复"
        case "2":
          return "已回复"
        default:
          break
      }
    },
    /**
     * @description: 标签样式
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toTagType(status) {
      switch (status) {
        case "0":
          return "info"
        case "1":
          return "warning"
        case "2":
          return "success"
        default:
          break
      }
    },
    /**
     * @description: 查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _getFeedbackList() {
      try {
        this.listLoading = true
        const { data } = await post('/nun/app/prb/pageList', {data: this.formSearch})
        this.formData = data.list
        this.total = data.total
      } catch (error) {
        this.$message("未查询到相关数据")
        this.formData = []
        this.total = 0
      }
      this.listLoading = false
    },
    /**
     * @description: 保存请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _saveFeedback(data) {
      try {
        // data.replierId = this.userinfor.loginName
        // data.replierName = this.userinfor.userName
        // data.noticeTmplId  = 'bfck_id'
        // data.msgType  = '2'
        // delete data.imgList
        const params = {
          crterMob: data.crterMob,
          msgType: 2,
          noticeSender: this.userinfor.userName,
          noticeTmplId: 'bfck_id',
          noticeTtl: '意见反馈',
          opterId: this.userinfor.loginName,
          opterName: this.userinfor.userName,
          replyDscr: data.replyDscr,
          replyStas: data.replyStas,
          replyWay: data.replyWay,
          rid: data.rid,
        }
        await post('/nun/app/prb/publish', {data: params})
        await this._getFeedbackList()
      } catch (error) {
        this.$message("未保存成功")
      }
    },
    /**
     * @description: 发布请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _releaseFeedback(data) {
      try {
        await post('/common/app/prb/publish', {data: data})
        await this._getFeedbackList()
      } catch (error) {
        this.$message("发布未成功")
      }
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
  },
  created() {
    this._getFeedbackList()
  },
  filters: {
    /**
     * @description: 时间过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toCrteTime: (time) => {
      if (!time) {
        return ""
      }
      return time ? parseTime(time, "{y}-{m}-{d}") : ""
    }
  },
  watch: {
    editVisible(val) {
      console.log(val)
      console.log(this.userinfor)
      if (!val) {
        setTimeout(() => {
          this.formAdd = {
            prbDscr: "",
            img: "",
            crterId: "",
            crterName: "",
            replyWay: "",
            // replierId: this.$store.getters.id,
            // replierName: this.$store.getters.name
            replierId: this.userinfor.loginName,
            replierName: this.userinfor.userName,
            imgList: []
          }
        }, 1000)
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    }
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
