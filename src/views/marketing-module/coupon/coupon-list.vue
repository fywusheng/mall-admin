<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input v-model="searchParams.name" placeholder="请输入优惠券名称..." clearable size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.code" placeholder="请输入优惠券编码..." clearable size="mini">
          </el-input>
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
      <el-table-column type="expand" width="20px" align="center">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="优惠券编码">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="允许转赠">
              <span>{{ formatShareState(props.row) }}</span>
            </el-form-item>
            <el-form-item label="成本归属">
              <span>{{ props.row.costOwner }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="批次号" width="60px" align="center"> </el-table-column>
      <el-table-column prop="name" label="优惠券名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="type" label="优惠券类型" width="100px" align="center"
        :formatter="formatCouponType"></el-table-column>
      <el-table-column prop="denomination" label="面值" width="80px"> </el-table-column>
      <el-table-column prop="num" label="发放数量" width="80px" align="center"> </el-table-column>
      <el-table-column prop="gettingMethod" label="发放方式" :formatter="formatGettingMethod"
        align="center" width="100px"></el-table-column>
      <el-table-column prop="approveState" label="审核状态" align="center" width="100px"
        :formatter="formatApproveState"></el-table-column>
      <!-- <el-table-column prop="modifier" label="操作人" align="center" width="100px"></el-table-column>
      <el-table-column prop="updatedTime" label="操作时间" align="center" width="150px"
        show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="delFlag" label="启用状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.delFlag" active-color="#FF5500" :active-value="0"
            inactive-color="#909399" :inactive-value="1" @change="resetting(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" size="mini" @click="edit(scope.row)">编 辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background v-show="totalCount > 10" @size-change="changeSize"
      @current-change="changePage" :page-size="pageSize"
      layout="total, slot, jumper, prev, pager, next" :total="totalCount">
    </el-pagination>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client";

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      searchParams: {},
      dialogList: []
    };
  },

  async mounted() {
    this.loadData();
  },
  methods: {
    formatCouponType: function (row, column) {
      return row.type == 0 ? '满减券' : row.type == 1 ? '折扣券' : row.type == 2 ? '代金券' : '--'
    },
    formatGettingMethod: function (row, column) {
      return row.gettingMethod == 0 ? '系统发放' : row.gettingMethod == 1 ? '会员领取' : '--'
    },
    formatShareState: function (row, column) {
      return row.shareState == 0 ? '不支持' : row.shareState == 1 ? '支持' : '--'
    },
    formatApproveState: function (row, column) {
      return row.approveState === 0 ? '待审核' : row.approveState === 1 ? '审核通过' : row.approveState === -1 ? '草稿' : row.approveState === -2 ? '审核不通过' : '--'
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
        queryObject: this.searchParams
      };
      const result = await post('/marketing/coupon/listByPageNo', params);
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
    add() {
      this.$router.push({ name: 'Coupon-Template', params: { id: -1 } })
    },
    edit(row) {
      this.$router.push({ name: 'Coupon-Template', params: { id: row.id } })
    },
    async resetting(row) {
      const { id, delFlag } = row
      const result = await post("/marketing/coupon/enablePromotionById", { id, delFlag })
      if (result.code === "200") {
        this.$message.success("重置启用状态成功!")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>