<template>
  <div class="main-content" style="padding-top: 0px; padding-bottom: 0px">
    <el-form :inline="true">
      <el-row class="mb-2">
        <el-form-item label="">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入商品名称..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.id"
            placeholder="请输入商品ID..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.code"
            placeholder="请输入商品编码..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="searchParams.brandId"
            size="mini"
            collapse-tags
            filterable
            clearable
            placeholder="请选择所属品牌..."
          >
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-cascader
            v-model="searchParams.categoryId"
            size="mini"
            :options="categoryOptions"
            clearable
            placeholder="请选择所属基础类目..."
            :props="{
              value: 'id',
              label: 'name',
              leaf: 'parentCode',
              children: 'children',
              expandTrigger: 'hover',
              emitPath: false,
            }"
          ></el-cascader>
        </el-form-item>
        <!-- TODO 目前没有发现出现4的情况 -->
        <el-form-item label="" v-if="activeType == 4">
          <el-select
            v-model="searchParams.auditState"
            size="mini"
            clearable
            placeholder="请选择审核状态..."
          >
            <el-option value="1" label="草稿中"></el-option>
            <el-option value="2" label="待审核"></el-option>
            <el-option value="3" label="审核不通过"></el-option>
            <el-option value="4" label="审核通过"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row class="mb-2" style="height: 38px">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="loadData"
            size="mini"
            >查询</el-button
          >
          <el-button
            type="default"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click="showGoods()"
            >导入</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>

    <el-table
      class="custom-table"
      :data="dataList"
      height="500"
      :header-cell-style="{ background: '#FAF9F7', color: '#000000' }"
      size="mini"
      v-loading="loading"
      style="padding-top: 0"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>

      <el-table-column
        type="index"
        label="序号"
        width="45px"
        align="center"
      ></el-table-column>
      <el-table-column label="LOGO" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.mainImgUrl" width="30px" height="30px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        width="280px"
        label="商品名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="id"
        label="商品ID"
        width="200px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="code"
        label="商品编码"
        width="200px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="brandName"
        label="所属品牌"
        width="150px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="categoryNode"
        label="所属类目"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column prop="" label="操作" align="center" width="280px">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.isTop"
            size="mini"
            icon="el-icon-top"
            @click="updateGoodsIndex(scope.row, 2)"
            >上移</el-button
          >
          <el-button
            :disabled="scope.row.isBottom"
            size="mini"
            icon="el-icon-bottom"
            @click="updateGoodsIndex(scope.row, 1)"
            >下移</el-button
          >
          <el-button size="mini" icon="el-icon-delete" @click="audit(scope.row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="totalCount > 10"
      @size-change="changeSize"
      @current-change="changePage"
      :page-size="pageSize"
      :current-page.sync="pageNo"
      layout="total, slot, jumper, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>
    <coupon-goods-template ref="goodsTemplate" v-on:addGoodsList="addGoodsList">
    </coupon-goods-template>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client";
import CouponGoodsTemplate from "./coupon-goods";
export default {
  name: "",
  components: {
    CouponGoodsTemplate,
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      dataList: [],
      totalCount: 20,
      loading: false,
      disabled: false,
      activeType: "1",
      brandOptions: [],
      categoryOptions: [],
      searchParams: {
        queryType: 1,
        name: "",
        id: "",
        code: "",
        brandId: "",
        categoryId: "",
        //saleState:5
      },
    };
  },
  created() {
    if (this.$route.query.type) {
      this.activeType = this.$route.query.type;
    }
  },
  async mounted() {
    this.loadBrandOptions();
    this.loadCategoryOptions();
    this.loadData();
  },
  methods: {
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.loadData();
    },
    changeSize(pageSize) {
      this.pageSize = pageSize;
      this.pageNo = 1;
      this.loadData();
    },

    async loadBrandOptions() {
      const result = await fetch("/brand/listAll", {});
      if (result.code == 200) {
        this.brandOptions = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },

    async loadCategoryOptions() {
      const result = await fetch("/category/list.basic", {});
      if (result.code == 200) {
        this.categoryOptions = result.data;
      } else {
        this.$message.error(result.msg);
      }
    },

    async loadData() {
      this.loading = true;
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams,
      };
      const result = await post("/product/getProductPageByType", params);
      this.loading = false;
      if (result.code == 200) {
        this.$nextTick(() => {
          result.data.list.forEach((element, index) => {
            element.index = (this.pageNo - 1) * this.pageSize + index;
            if (element.index === 0) {
              element.isTop = true;
            }
            if (element.index === result.data.totalCount - 1) {
              element.isBottom = true;
            }
          });
          this.dataList = result.data.list;
          this.totalCount = result.data.totalCount * 1;
        });
      } else {
        this.$message.error(result.msg);
      }
    },

    // 上移 or 下移
    async updateGoodsIndex(row, type) {
      const result = await post("/product/updateSort", {
        productId: row.id,
        type,
      });
      // this.pageNo = 1;
      this.loadData();
    },
    // 移除
    async audit(row) {
      const result = await post("/product/deleteProductModule", { id: row.id });

      // this.pageNo = 1;
      this.loadData();
    },
    // 导入商品
    async addGoodsList(data) {
      if (!data) return;
      const productIdList = [];
      data.forEach((item) => {
        productIdList.push(item.id);
      });
      const result = await post("/product/saveProductModule", {
        productIdList,
      });
      this.pageNo = 1;
      this.loadData();
    },
    // 商品弹窗
    showGoods(row) {
      this.$refs.goodsTemplate.show(true);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.item .el-form-item__label {
  height: 35px;
}
</style>
