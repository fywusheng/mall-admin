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
            @click="forward2ProductAddPage()"
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
      @selection-change="handleSelectionChange"
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
            @click="publishSingleSelection(scope.row)"
            >上移</el-button
          >
          <el-button
            :disabled="scope.row.isBottom"
            size="mini"
            icon="el-icon-bottom"
            @click="stopSingleSelection(scope.row)"
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
      layout="total, slot, jumper, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>
    <coupon-goods-template ref="goodsTemplate" v-on:addGoodsList="addGoodsList">
    </coupon-goods-template>
  </div>
</template>
<script>
import { fetch, downloadByPost, post } from "@/utils/http-client";
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
      multipleSelection: [],
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
      showDialog: false,
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
    formatSaleState: function (row, column) {
      return row.saleState === 5
        ? "在售中"
        : row.saleState === 51
        ? "上架中"
        : row.saleState === 6
        ? "已停售"
        : row.saleState === 61
        ? "下架中"
        : "--";
    },
    formatAuditState: function (row, column) {
      return row.auditState === 2
        ? "待审核"
        : row.auditState === 3
        ? "审核不通过"
        : row.auditState === 4
        ? "审核通过"
        : "--";
    },
    handleClick(tab, event) {
      this.dataList = [];
      this.pageNo = 1;
      this.searchParams = {};
      if (this.activeType === "1") {
        this.searchParams.queryType = 1;
      } else if (this.activeType === "2") {
        this.searchParams.queryType = 2;
      } else if (this.activeType === "3") {
        this.searchParams.queryType = 3;
      } else {
        this.searchParams.queryType = 4;
      }
      this.loadData();
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
      const result = await post("/product/listByPageNo", params);
      this.loading = false;
      if (result.code == 200) {
        this.$nextTick(() => {
          result.data.list.forEach((element, index) => {
            if (index === 0) {
              element.isTop = true;
            }
            if (index === result.data.list.length - 1) {
              element.isBottom = true;
            }
          });
          this.dataList = result.data.list;
          this.totalCount = result.data.totalCount * 1;
          //this.pageSize = result.data.limit;
        });
      } else {
        this.$message.error(result.msg);
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    publishSingleSelection(row) {
      this.multipleSelection = [];
      let line = row;
      line["categoryNode"] = row.categoryCode;
      this.multipleSelection.push(line);
      this.publishedSelling(row);
    },

    //上架
    async up() {
      const result = await post("/product/published.selling", {
        publishType: "onsale",
        productList: this.multipleSelection,
      });
      this.loading = false;
      if (result.code == 200) {
        this.$message.success(result.msg);
        this.$nextTick(() => {
          this.activeType = "2";
          this.queryType = 2;
          this.loadData();
        });
      } else {
        this.$message.error(result.msg);
      }
    },
    async allup() {
      const resArr = [];
      for (const item of this.multipleSelection) {
        const resp = await fetch("/product/sku/list", { productId: item.id });
        if (resp.code == 200) {
          this.loading = false;
          if (
            !resp.data ||
            (resp.data && Array.isArray(resp.data) && resp.data.length == 0)
          ) {
            this.$message.warning("请先设置SKU,设置成功后方可上架!");
            resArr.push(false);
            break;
          } else {
            resArr.push(true);
          }
        } else {
          this.loading = false;
          this.$message.error(resp.msg);
          resArr.push(false);
          break;
        }
      }
      if (
        resArr.length == this.multipleSelection.length &&
        !resArr.includes(false)
      ) {
        this.up();
      }

      // const endState = this.multipleSelection.some(async (item) => {
      //   const resp = await fetch("/product/sku/list", { productId: item.id });
      //   if (resp.code == 200) {
      //     this.loading = false
      //     if (!resp.data || (resp.data && Array.isArray(resp.data) && resp.data.length == 0)) {
      //       this.$message.warning('请先设置SKU,设置成功后方可上架!')
      //       return true
      //     }
      //   } else {
      //     this.loading = false
      //     this.$message.error(resp.msg)
      //     return
      //   }
      // })
      // console.log('123123', endState)
      // if (!endState) {
      //   this.up()
      // }
    },
    publishedSelling(row) {
      //校验sku
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.error("请选择需要上架销售的商品！");
        return;
      }
      this.$confirm("确定要上架销售所选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          if (row) {
            console.log("==当行操作--");
            const resp = await fetch("/product/sku/list", {
              productId: row.id,
            });
            if (resp.code == 200) {
              this.loading = false;
              const data = resp.data;
              if (data && Array.isArray(data) && data.length !== 0) {
                this.up();
              } else {
                this.$message.error("请先设置SKU,设置成功后方可上架!");
              }
            } else {
              this.loading = false;
              this.$message.error(result.msg);
              return;
            }
          } else {
            console.log("==多行操作--");
            this.allup();
          }
        })
        .catch(() => {});
    },

    stopSingleSelection(row) {
      //TODO 后端要求categoryNode的值为categoryCode
      console.log("==row--", row);
      this.multipleSelection = [];
      let line = row;
      line["categoryNode"] = row.categoryCode;
      this.multipleSelection.push(line);
      this.stopedSelling();
    },

    stopedSelling() {
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.error("请选择需要下架的商品！");
        return;
      }
      this.$confirm("确定要下架所选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          console.log("===3333===", this.multipleSelection);
          const result = await post("/product/published.selling", {
            publishType: "offsale",
            productList: this.multipleSelection,
          });
          this.loading = false;
          if (result.code == 200) {
            this.$message.success(result.msg);
            this.$nextTick(() => {
              this.activeType = "3";
              this.queryType = 3;
              this.loadData();
            });
          } else {
            this.$message.error(result.msg);
          }
        })
        .catch(() => {});
    },
    // 去审核处理 TODO 在平台处做审核处理，商家端不处理
    audit(row) {
      var auditState = 4;
      this.$confirm(
        "该商品资料完整度是否满足销售规则，符合则通过否则请驳回?",
        "审核确认提示",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "通过",
          cancelButtonText: "驳回",
          type: "warning",
        }
      )
        .then(async () => {
          this.loading = true;
          const result = await post("/product/audit", {
            id: row.id,
            auditState: 4,
          });
          this.loading = false;
          if (result.code == 200) {
            this.$message.success("商品审核成功！");
            this.loadData();
          } else {
            this.$message.error(result.msg);
          }
        })
        .catch(async (action) => {
          if (action === "cancel") {
            this.loading = true;
            const result = await post("/product/audit", {
              id: row.id,
              auditState: 3,
            });
            this.loading = false;
            if (result.code == 200) {
              this.$message.success("商品审核成功！");
              this.loadData();
            } else {
              this.$message.error(result.msg);
            }
          }
        });
    },
    async addGoodsList(data) {
      if (!data) return;
      let list = [...this.totalRecords, ...data];
      list = list.reduce((prev, item) => {
        const cur = prev.find((i) => i.id === item.id);
        if (cur) {
          return prev;
        }
        return [...prev, item];
      }, []);
      this.totalRecords = list;
      this.totalCount = this.totalRecords.length;
      this.changePage(1);
    },
    forward2ProductAddPage(row) {
      this.$refs.goodsTemplate.show(true);
    },
    forward2SpecPage(row) {
      //categoryNode:row.categoryNode
      this.$router.push({
        name: "SkuListDetails",
        params: { categoryNode: row.categoryCode, id: row.id },
      });
    },

    async exportProduct() {
      this.loading = true;
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams,
      };
      await downloadByPost("/product/export", "商品列表.xlsx", params);
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.item .el-form-item__label {
  height: 35px;
}
</style>
