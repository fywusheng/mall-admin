<template>
<!-- 门店管理 -->
  <div class="store">
    <!-- <div class="query">查询区</div> -->
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店名称" prop="user">
        <el-input v-model="formInline.user" placeholder="请输入门店名称"></el-input>
      </el-form-item>
     <el-form-item label="门店地址" prop="address">
        <el-input v-model="formInline.address" placeholder="请输入门店地址"></el-input>
      </el-form-item>

      <el-form-item>
         <el-button @click="onReset('formInline')">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
   </el-form>
   <div class="_table">
     <div class="_btn"><el-button type="primary" @click="addStore()">新增门店</el-button></div>
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item,index) in tableLables"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
          </el-table-column>
          <el-table-column
            label="门店图">
            <template  slot-scope="scope" >
              <img style="width:50px;height:50px" :src="scope.row.storesPic"/>
            </template>
          </el-table-column>
          <el-table-column
            label="关联商品数">
            <template  slot-scope="scope" >
                <el-button @click="connetShop(scope.row)" type="text">{{scope.row.productNum == ''?0:scope.row.productNum}}</el-button>
            </template>
          </el-table-column>
           <el-table-column
            label="是否启用">
            <template  slot-scope="scope" >
                <el-switch
                  @change="switchValue(scope.row.id,scope.row.yn)"
                  v-model="scope.row.yn"
                  active-color="#13ce66"
                  inactive-color="#909399">
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
              <template slot-scope="scope">
                <el-button @click="addStore(scope.row)" type="text" size="small">编辑</el-button>
              </template>
         </el-table-column>
       </el-table>
        <el-pagination
          background
          v-show="totalCount > 10"
          @size-change="changeSizeStore"
          @current-change="changePageStore"
          :page-size="pageSize"
          layout="total, slot, jumper, prev, pager, next"
          :total="totalCount">
        </el-pagination>
   </div>
   <el-dialog class="_count" title="关联商品" :visible.sync="dialogTableVisible">
      <div class="_type">
        <span>所属类目:</span>
        <el-cascader
                v-model="categoryNode"
                :options="options"
                placeholder="请选择商品所属类目信息..."
                @change="categorySelectionOnChange"
                :props="{value:'id',label:'name',leaf:'parentCode',children: 'children',expandTrigger: 'hover'}"
                style="width:80%"
         ></el-cascader>
      </div>
      <el-table :data="gridData"> 
        <div v-for="(item,i) in CountLables" :key="i">
             <el-table-column v-if="item.label !== '商品主图'" :prop="item.prop" :label="item.label"></el-table-column>
             <el-table-column v-if="item.label == '商品主图'" :prop="item.prop" :label="item.label">
                <template slot-scope="scope" >
                   <el-image style="width:96px; height:84px" :src="scope.row.mainImgUrl" >
                    <div slot="error" class="image-slot" style="width:96px;line-height:84px; height:84px">无图</div>
                    </el-image>
                </template>
             </el-table-column>
        </div>
      </el-table>
       <el-pagination
          background
          v-show="totalCountGL > 10"
          @size-change="changeSize"
          @current-change="changePage"
          :page-size="pageSizeGL"
          layout="total, slot, jumper, prev, pager, next"
          :total="totalCountGL">
        </el-pagination>
        <div class="bottom">
          <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
        </div>
   </el-dialog>
  </div>
</template>
<script>
import { fetch, post , get} from "@/utils/http-client";
import template from '../../commodity-module/brand/template.vue';

export default {
  components: { template },
  name: '',
  data() {
    return {
       //关联商品数分页信息
       totalCountGL:0,
       pageSizeGL:10,
       pageNumGL:1,
       storeId:'',
       categoryNode:[],//选择的类目
       openValue:false,
      //所属类目
       options: [],
        CountLables:[{
          label:'商品ID',
          width:'',
          prop:'id'
        },
        {
          label:'商品编码',
          width:'',
          prop:'code'
        },
        {
          label:'商品主图',
          width:'',
          prop:'mainImgUrl'
        },
        {
          label:'商品名称',
          width:'',
          prop:'name'
        },
        {
          label:'所属类目',
          width:'',
          prop:'categoryNode'
        },
        {
          label:'所属品牌',
          width:'',
          prop:'brandName'
        }
      ],
      gridData: [{
          id: '2016-05-02',
          code:'1111',
          img:'图片地址',
          name: '商品名称',
          type: '所属类目',
          logo:'所属品牌',
          price:'商品价格'
        }, {
          id: '2016-05-02',
          code:'1111',
          img:'图片地址',
          name: '商品名称',
          type: '所属类目',
          logo:'所属品牌',
          price:'商品价格'
        }, {
           id: '2016-05-02',
          code:'1111',
          img:'图片地址',
          name: '商品名称',
          type: '所属类目',
          logo:'所属品牌',
          price:'商品价格'
        }],
      dialogTableVisible:false,
      totalCount:0,
      pageSize:10,
      formInline: {
          user: '',
          address:''
        },
        tableLables:[{
          label:'门店Id',
          width:'',
          prop:'id'
        },
        // {
        //   label:'门店图',
        //   width:'',
        //   prop:'storesPic'
        // },
        {
          label:'门店名称',
          width:'',
          prop:'storesName'
        },
        {
          label:'门店地址',
          width:'',
          prop:'storesAddress'
        },
        {
          label:'门店负责人',
          width:'',
          prop:'storesHead'
        },
        {
          label:'负责人电话',
          width:'',
          prop:'storesHeadPhone'
        },
        {
          label:'门店电话',
          width:'',
          prop:'storesPhone'
        }
        ],
        tableData: [],
        multipleSelection: []  
    }
  },
  async mounted() {
  },
  created(){
    this.pageNum =  1
    this.pageSize = 10
    this.queryList()
    this.queryStoreList()
  },
  methods: {
    connetShop(row){
     if(row.productNum == ''){
      return
     } 
     this.storeId = row.id 
     this.dialogTableVisible = true
     this.pageSizeGL = 10
     this.pageNumGL = 1
     this.queryBytype()
    }, 
   //根据商品进行查询
   async  queryBytype(){
      const url = '/product/listByPageNo'
      const params = {
        pageNum:this.pageNumGL,
        pageSize:this.pageSizeGL,
        categoryId:this.categoryNode.join(','),
        queryObject:{
            queryType:4,
            storeId:this.storeId,//商店id
        }  
       }
     const result =  await post(url,params)
     if(result.code == 200){
       const data = result.data || {}
       this.gridData =  data.list || []
       this.totalCountGL = data.totalCount
     }
    },
    categorySelectionOnChange(){
      console.log("===选择分类--",this.categoryNode)
      this.pageSizeGL = 10
      this.pageNumGL = 1
      this.queryBytype()
    },
   async queryStoreList(){
      const result = await fetch('/category/list.basic',{})
      if(result.code == 200){
        const list =  result.data
        this.options = list
      }else{
        this.$message.error(result.msg)
      }
    },
   async switchValue(id,status){
        const url = '/srm/stores/saveSuppliesStores'
        const param = {
              id:id,
              yn:status?1:0
         }
       const result =  await post(url,param)
       if(result.code == 200){
         this.$message.success('操作成功!')
       }else{
         this.$message.error(result.msg)
       }
    },
    changePageStore(curre){
      this.pageNum = curre
      this.queryList()
    },
    changeSizeStore(size){
      this.pageSize = size
      this.queryList()
    },
    async onSubmit() {
     this.pageNum =  1
     this.pageSize = 10
     this.queryList()
    },
    async queryList(){
       const params = {
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          queryObject:{
            storesAddress:this.formInline.address,
            storesName:this.formInline.user.length>50?this.formInline.user.substring(0,50):this.formInline.user
          }
      } 
      const result = await post('/srm/stores/listByPageNo',params)
         if(result.code == 200){
           const data =  result.data || {}
           this.totalCount = data.totalCount
           this.pageSize = data.pageSize
           this.tableData = data.list || []
         }else{
           this.$message.error(result.msg)
         }
    },
      onReset(formName){
        console.log('---reset--',formName)
        this.$refs[formName].resetFields();
        this.pageNum =  1
        this.pageSize = 10
        this.queryList()
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      addStore(row){
         if(row){
            this.$router.push({ name: 'StoreAddPage', params: { id: row.id } })
          }else{
            this.$router.push({ name: 'StoreAddPage', params: { id: -1} })
          }
      },
      changeSize(size){
        this.pageSizeGL  = size
        this.queryBytype()
      },
      changePage(curreNum){
        this.pageNumGL = curreNum
        this.queryBytype()
     }
  }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
 .store{
    padding: 20px;
   .query{
    font-size: 18px;
    margin-bottom: 10px;
   }
 }
 ._count{
  .bottom{
    display:flex;
    justify-content: right;
    margin-top:32px;
  }
  ._type{
    margin-bottom:14px;
  }
 }
</style>
