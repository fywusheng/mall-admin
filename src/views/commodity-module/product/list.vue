<template>
  <div class="main-content" style="padding-top:0px;padding-bottom:0px">

    <el-form :inline="true">
      <el-row class="mb-2">
        <el-form-item label="">
          <el-input v-model="searchParams.name" placeholder="请输入商品名称..." clearable
            size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.id" placeholder="请输入商品ID..." clearable
            size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParams.code" placeholder="请输入商品编码..." clearable
            size="mini"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchParams.brandId" size="mini" collapse-tags filterable clearable
            placeholder="请选择所属品牌...">
            <el-option v-for="item in brandOptions" :key="item.id" :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-cascader v-model="searchParams.categoryId" size="mini" :options="categoryOptions"
            clearable placeholder="请选择所属基础类目..."
            :props="{value:'id',label:'name',leaf:'parentCode',children: 'children',expandTrigger: 'hover',emitPath:false}"></el-cascader>
        </el-form-item>
        <!-- TODO 目前没有发现出现4的情况 -->
        <el-form-item label="" v-if="activeType==4">
          <el-select v-model="searchParams.auditState" size="mini" clearable
            placeholder="请选择审核状态...">
            <el-option value="1" label="草稿中"></el-option>
            <el-option value="2" label="待审核"></el-option>
            <el-option value="3" label="审核不通过"></el-option>
            <el-option value="4" label="审核通过"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row class="mb-2" style="height:38px">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData"
            size="mini">查询</el-button>
          <el-button v-if="activeType==1" type="default" icon="el-icon-bottom" size="mini"
            @click="stopedSelling()">下架</el-button>
          <el-button v-if="activeType==2" type="default" icon="el-icon-top" size="mini"
            @click="publishedSelling()">上架</el-button>
          <!-- allup publishedSelling-->
          <!-- <el-button v-if="activeType==3" type="default" size="small" @click="forward2ProductAddPage">审 批</el-button> -->
          <el-button v-if="activeType==3" type="default" icon="el-icon-circle-plus-outline"
            size="mini" @click="forward2ProductAddPage()">新增</el-button>
            <!-- 导出功能先注释 -->
          <!-- <el-button v-if="activeType==3" type="default" size="mini" @click="exportProduct"
            icon="el-icon-download">导出</el-button> -->
          <!-- <el-button v-if="activeType==4" type="default" size="small" @click="forward2ProductAddPage" icon="el-icon-upload">导 入</el-button> -->
        </el-form-item>
      </el-row>
    </el-form>
    <el-tabs v-model="activeType" @tab-click="handleClick" style="padding-top:0">
      <el-tab-pane label="销售中" name="1" :disabled="disabled"></el-tab-pane>
      <el-tab-pane label="待上架" name="2" :disabled="disabled"></el-tab-pane>
      <el-tab-pane label="待审核" name="3" :disabled="disabled"></el-tab-pane>
    </el-tabs>
    <el-table class="custom-table" :data="dataList"
      :header-cell-style="{background:'#FAF9F7',color:'#000000'}" size="mini" v-loading="loading"
      style="padding-top:0" @selection-change="handleSelectionChange">
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="selection" width="45px" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="45px" align="center"></el-table-column>
      <el-table-column label="LOGO" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.mainImgUrl" width="30px" height="30px" />
        </template>
      </el-table-column>
      <el-table-column prop="name" width="280px" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="id" label="商品ID" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="商品编码" width="200px"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="brandId" label="所属品牌" width="150px"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="categoryNode" label="所属类目" width="150px"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="saleState" label="销售状态" width="90px" align="center"
        :formatter="formatSaleState"></el-table-column>
      <el-table-column prop="saleOnlineTime" label="上架时间" width="150px" v-if="activeType==1"
        align="center"></el-table-column>
      <el-table-column prop="saleStopTime" label="下架时间" width="150px" v-if="activeType==2"
        align="center"></el-table-column>
      <!-- v-if="activeType==4" 把审核状态放出来-->
      <el-table-column prop="auditState" label="审核状态" align="center"
        :formatter="formatAuditState"></el-table-column>
      <el-table-column prop="auditTimeTime" label="审核时间" width="100px" v-if="activeType==3"
        align="center"></el-table-column>
      <el-table-column prop="updatedTime" label="修改时间" width="150px" v-if="activeType==4"
        align="center"></el-table-column>
      <!--el-table-column prop="delFlag" label="状态" width="80px" v-if="activeType==4">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.delFlag1"
            active-color="#FF5500"
            inactive-color="#909399"
          >
          </el-switch>
        </template>
      </el-table-column-->
      <el-table-column prop="" label="操作" align="center" width="280px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" v-if="activeType==2 || activeType==3"
            @click="forward2SpecPage(scope.row)">SKU管理</el-button>
          <el-button size="mini" v-if="activeType==2 || activeType==3" icon="el-icon-edit"
            @click="forward2ProductAddPage(scope.row)">编辑</el-button>
          <el-button size="mini" v-if="activeType==1" icon="el-icon-bottom"
            @click="stopSingleSelection(scope.row)">下架</el-button>
          <el-button size="mini" v-if="activeType==2" icon="el-icon-top"
            @click="publishSingleSelection(scope.row)">上架</el-button>
          <el-button size="mini" v-if="activeType==3" :disabled="scope.row.auditState!=2" icon="el-icon-success" @click="audit(scope.row)">审核</el-button>
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
import { fetch, downloadByPost, post } from '@/utils/http-client'

export default {
  name: '',
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      multipleSelection: [],
      totalCount: 20,
      loading: false,
      disabled: false,
      activeType: '3',
      brandOptions: [],
      categoryOptions: [],
      searchParams: {
        queryType: 3,
        name: '',
        id: '',
        code: '',
        brandId: '',
        categoryId: ''
        //saleState:5
      },
      showDialog: false
    }
  },
  created() {
    if (this.$route.query.type) {
      this.activeType = this.$route.query.type
    }
  },
  async mounted() {
    this.loadBrandOptions()
    this.loadCategoryOptions()
    this.loadData()
  },
  methods: {
    formatSaleState: function (row, column) {
      return row.saleState === 5 ? '在售中' : row.saleState === 51 ? '上架中' : row.saleState === 6 ? '已停售' : row.saleState === 61 ? '下架中' : '--'
    },
    formatAuditState: function (row, column) {
      return row.auditState === 2 ? '待审核' : row.auditState === 3 ? '审核不通过' : row.auditState === 4 ? '审核通过' : '--'
    },
    handleClick(tab, event) {
      this.dataList = []
      this.pageNo = 1
      this.searchParams = {}
      if (this.activeType === '1') {
        this.searchParams.queryType = 1
      } else if (this.activeType === '2') {
        this.searchParams.queryType = 2
      } else if (this.activeType === '3') {
        this.searchParams.queryType = 3
      } else {
        this.searchParams.queryType = 4
      }
      this.loadData();
    },
    changePage(pageNo) {
      this.pageNo = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.loadData()
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
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      const result = await post('/product/listByPageNo', params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          //this.pageSize = result.data.limit;
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    publishSingleSelection(row) {
      this.multipleSelection = []
      let line = row
      line['categoryNode'] = row.categoryCode
      this.multipleSelection.push(line)
      this.publishedSelling(row)
    },

    //上架
    async up() {
      const result = await post('/product/published.selling', { publishType: 'onsale', productList: this.multipleSelection })
      this.loading = false
      if (result.code == 200) {
        this.$message.success(result.msg)
        this.$nextTick(() => {
          this.activeType = '2'
          this.queryType = 2
          this.loadData()
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    allup() {
      const endState = this.multipleSelection.some(async (item) => {
        const resp = await fetch("/product/sku/list", { productId: item.id });
        if (resp.code == 200) {
          this.loading = false
          if (resp.data.length == 0) {
            this.$message.warning('请先设置SKU,设置成功后方可上架!')
            return true
          }
        } else {
          this.loading = false
          this.$message.error(resp.msg)
          return
        }
      })
      if (!endState) {
        this.up()
      }
    },
    publishedSelling(row) {
      //校验sku
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.error('请选择需要上架销售的商品！')
        return
      }
      this.$confirm("确定要上架销售所选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true
          if (row) {
            console.log("==当行操作--")
            const resp = await fetch("/product/sku/list", { productId: row.id });
            if (resp.code == 200) {
              this.loading = false
              const data = resp.data
              if (data && Array.isArray(data) && data.length !== 0) {
                this.up()
              } else {
                this.$message.error('请先设置SKU,设置成功后方可上架!')
              }
            } else {
              this.loading = false
              this.$message.error(result.msg)
              return
            }
          } else {
            console.log("==多行操作--")
            this.allup()
          }

        })
        .catch(() => { });
    },

    stopSingleSelection(row) {
      //TODO 后端要求categoryNode的值为categoryCode
      console.log("==row--", row)
      this.multipleSelection = []
      let line = row
      line['categoryNode'] = row.categoryCode
      this.multipleSelection.push(line)
      this.stopedSelling()
    },

    stopedSelling() {
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.error('请选择需要下架的商品！')
        return
      }
      this.$confirm("确定要下架所选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true
          console.log("===3333===", this.multipleSelection)
          const result = await post('/product/published.selling', { publishType: 'offsale', productList: this.multipleSelection })
          this.loading = false
          if (result.code == 200) {
            this.$message.success(result.msg)
            this.$nextTick(() => {
              this.activeType = '3'
              this.queryType = 3
              this.loadData()
            })
          }
          else {
            this.$message.error(result.msg)
          }
        })
        .catch(() => { });
    },
    // 去审核处理 TODO 在平台处做审核处理，商家端不处理
    audit(row) {
      var auditState = 4
      this.$confirm("该商品资料完整度是否满足销售规则，符合则通过否则请驳回?", "审核确认提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过",
        cancelButtonText: "驳回",
        type: "warning",
      })
        .then(async () => {
          this.loading = true
          const result = await post('/product/audit', { id: row.id, auditState: 4 })
          this.loading = false
          if (result.code == 200) {
            this.$message.success("商品审核成功！")
            this.loadData()
          }
          else {
            this.$message.error(result.msg)
          }
        })
        .catch(async action => {
          if (action === 'cancel') {
            this.loading = true
            const result = await post('/product/audit', { id: row.id, auditState: 3 })
            this.loading = false
            if (result.code == 200) {
              this.$message.success("商品审核成功！")
              this.loadData()
            }
            else {
              this.$message.error(result.msg)
            }
          }
        });
    },

    forward2ProductAddPage(row) {
      if (row) {
        this.$router.push({ name: 'ProductAddPage', params: { id: row.id } })
      }
      else {
        this.$router.push({ name: 'ProductAddPage', params: { id: -1 } })
      }
    },
    forward2SpecPage(row) {
      //categoryNode:row.categoryNode
      this.$router.push({ name: 'SkuListDetails', params: { categoryNode: row.categoryCode, id: row.id } })
    },

    async exportProduct() {
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      await downloadByPost('/product/export', '商品列表.xlsx', params)
      this.loading = false
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.item .el-form-item__label {
  height: 35px;
}
</style>