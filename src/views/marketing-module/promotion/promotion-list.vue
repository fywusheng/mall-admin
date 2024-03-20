<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="searchParams.queryObject.name" placeholder="请输入促销活动名称..." clearable
            size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.queryObject.code" placeholder="请输入促销活动编码..." clearable
            size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini">查询
          </el-button>
          <el-button type="default" icon="el-icon-circle-plus-outline" size="mini" @click="add">新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table class="custom-table" :data="dataList"
      :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading">
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号" width="50px" align="center"> </el-table-column>
      <el-table-column prop="name" label="活动名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="code" label="活动编码" width="100px" align="center"> </el-table-column>
      <el-table-column prop="type" label="活动类型" width="100px" align="center"
        :formatter="formatActivityTypeMethod"></el-table-column>
      <el-table-column prop="beginTime" label="生效时间" width="300px" align="center"
        :formatter="formatActivityTime"></el-table-column>
      <el-table-column prop="auditState" label="审核状态" width="100px" align="center"
        :formatter="formatAuditState"></el-table-column>
      <el-table-column prop="moidifier" label="操作人" width="100px"></el-table-column>
      <el-table-column prop="updatedTime" label="操作时间" width="150px" align="center">
      </el-table-column>
      <el-table-column prop="delFlag" label="启用状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.delFlag" active-color="#FF5500" :active-value="0"
            inactive-color="#909399" :inactive-value="1" @change="resetting(scope.row)">
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" size="mini" @click="forward2RulesPage(scope.row)">
            设置规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-show="totalCount > 10" @size-change="changeSize"
      @current-change="changePage" :page-size="pageSize"
      layout="total, slot, jumper, prev, pager, next" :total="totalCount">
    </el-pagination>
    <edit-template ref="template"></edit-template>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client";
import EditTemplate from "./promotion-template";

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      searchParams: {
        queryObject: {
          name: '',
          code: ''
        }
      },
      dialogList: []
    };
  },
  components: {
    EditTemplate,
  },
  async mounted() {
    this.loadData();
  },
  methods: {
    formatActivityTypeMethod: function (row, column) {
      return row.type === 0 ? '平台促销' : row.type === 1 ? '优惠券' : '--'
    },
    formatAuditState: function (row, column) {
      return row.auditState === 0 ? '待审核' : row.auditState === 1 ? '审核通过' : row.auditState === -1 ? '草稿' : row.auditState === -2 ? '审核不通过' : '--'
    },
    formatActivityTime: function (row, column) {
      return row.beginTime + ' - ' + row.endTime
    },
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.loadData();
    },
    changeSize(pageSize) {
      this.pageSize = pageSize;
      this.pageNo = 1;
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
      };
      Object.keys(this.searchParams).forEach((key) => {
        params[key] = this.searchParams[key];
      });
      Object.keys(this.searchParams.queryObject).forEach((key) => {
        if (this.searchParams.queryObject[key] === '') {
          delete this.searchParams.queryObject[key]
        }
      });
      const result = await post('/marketing/promotion/activity/list', params);
      this.loading = false;
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list;
          this.totalCount = result.data.totalCount * 1;
        });
      } else {
        this.$message.error(result.msg);
      }
    },
    async resetting(row) {
      const { id, delFlag } = row
      const result = await post("/marketing/promotion/enablePromotionActivityById", { id, delFlag })
      if (result.code === "200") {
        this.$message.success("重置启用状态成功!")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
    add() {
      this.$refs.template.show(true);
    },
    edit(row) {
      this.$refs.template.show(true, row);
    },
    forward2RulesPage(row) {
      this.$router.push({ name: 'Rules', params: { id: row.id } })
    }
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
</style>