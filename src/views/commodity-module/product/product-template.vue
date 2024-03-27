<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="创建/修改商品信息"></el-page-header>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form class="data-form" :model="dataForm" :rules="dataRules" :v-loading="loading"
      ref="dataFormInfor" label-position="top" size="small">
      <el-divider content-position="left" style="width:80%">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">基本信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="商品名称" prop="name" class="item">
              <el-input :disabled="dataForm.saleState==5" v-model="dataForm.name"
                placeholder="请输入商品名称..." maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="50%" rowspan="4" align="center" valian="middle">
            <table width="100%">
              <tr>
                <td width="10%"></td>
                <td>
                  <el-form-item prop="mainImgUrl">
                    <el-upload :disabled="dataForm.saleState==5" class="avatar-uploader"
                      :show-file-list="false" :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload" :auto-upload="true">
                      <img v-if="dataForm.mainImgUrl" :src="dataForm.mainImgUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="商品简称(短名)" prop="subName" class="item">
              <el-input v-model="dataForm.subName" placeholder="请输入商品简称..."
                :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="名称前缀" prop="prefixName" class="item">
              <el-input v-model="dataForm.prefixName" placeholder="请输入商品名称前缀..."
                :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="名称后缀" prop="suffixName" class="item">
              <el-input v-model="dataForm.suffixName" placeholder="请输入商品名称后缀..."
                :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="搜索关键字" prop="keywords" class="item">
              <el-input v-model="dataForm.keywords" placeholder="请输入商品搜索关键字，多关键字以','隔开..."
                :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="商品推荐语" prop="summarized" class="item">
              <el-input v-model="dataForm.summarized" placeholder="请输入商品推荐语或卖点，50个字以内..."
                :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="所属品牌" prop="brandId" class="item">
              <el-select v-model="dataForm.brandId" collapse-tags filterable style="width:80%"
                placeholder="请选择商品所属品牌信息..." :disabled="dataForm.saleState==5">
                <el-option v-for="item in brandOptions" :key="item.id" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="基础类目" prop="categoryNode" class="item _custom_cascader">
              <el-cascader v-model="dataForm.categoryNode" :options="categoryOptions"
                placeholder="请选择商品所属类目信息..." :disabled="dataForm.saleState==5"
                @change="categorySelectionOnChange"
                :props="{value:'id',label:'name',leaf:'parentCode',children: 'children',expandTrigger: 'hover'}"
                style="width:80%"></el-cascader>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="计量单位" prop="valuationUnit" class="item">
              <el-select v-model="dataForm.valuationUnit" placeholder="请选择商品计量单位..."
                :disabled="dataForm.saleState==5" style="width:80%">
                <el-option v-for="item in valuationUnitOptions" :key="item.key" :label="item.label"
                  :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="计量值(数字)" prop="unitVal" class="item">
              <el-input v-model="dataForm.unitVal" placeholder="请输入商品计量值..."
                :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="适用人群" prop="targetAudience" class="item">
              <el-select v-model="dataForm.targetAudience" multiple :multiple-limit="2" clearable placeholder="请选择最多不超过2个适用人群标签..."
                :disabled="dataForm.saleState==5" style="width:80%">
                <el-option v-for="item in targetAudienceOptions" :key="item.key" :label="item.label"
                  :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%"></td>
        </tr>
      </table>

      <el-divider content-position="left">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">属性参数</font>
      </el-divider>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%">
        <tr>
          <td align="center">
            <el-table ref="attr_mytable" :data="attr_tableData" style="width:90%;font-size:12px">
              <el-form-item prop="attributeMap">
                <el-table-column type="index" label="序号" align="center"
                  width="60px"></el-table-column>
                <el-table-column prop="name" label="属性项" width="150px"></el-table-column>
                <el-table-column label="属性值">
                  <div slot-scope="scope">
                    <el-radio-group v-if="scope.row.type===0" v-model="scope.row.attrValSelected"
                      @change="checkAttr(scope.row)">
                      <el-radio v-for="attrVal in scope.row.attrValList" :label="attrVal.id"
                        :key="attrVal.id"
                        style="font-size:10px;width:70px;height:25px">{{ attrVal.val }}</el-radio>
                    </el-radio-group>
                    <el-checkbox v-if="scope.row.type===1"
                      :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checkAll"
                      @change="checkAllAttr(scope.row)">全选</el-checkbox>
                    <el-checkbox-group v-if="scope.row.type===1" @change="checkAttr(scope.row)"
                      v-model="scope.row.attrValSelected">
                      <el-checkbox v-for="attrVal in scope.row.attrValList" :label="attrVal.id"
                        :key="attrVal.id" style="font-size:10px">{{ attrVal.val }}</el-checkbox>
                    </el-checkbox-group>

                    <el-input v-if="scope.row.type===2" v-model="scope.row.attrValSelected"
                      @change="checkAttr(scope.row)" maxlength="32" style="width:90%"
                      placeholder="请输入自定义属性值！"></el-input>
                  </div>
                </el-table-column>
              </el-form-item>
            </el-table>
          </td>
        </tr>
      </table>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <el-divider content-position="left" v-if="dataForm.saleState==5">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">商品状态</font>
      </el-divider>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%" v-if="dataForm.saleState==5">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="销售状态" prop="saleState" class="item">销售中(销售中商品不可编辑)</el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="数据状态" prop="delFlag" class="item">正常</el-form-item>
          </td>
        </tr>
      </table>
    </el-form>

    <el-divider content-position="left">
      <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
      <font style="color:blue">供货信息</font>
    </el-divider>
    <el-row style="height: 20px">
      <el-col :span="24"></el-col>
    </el-row>
    <!-- 校验规则处理 -->
    <el-form label-width="160px" class="data-form" :model="oldMoneyForm" :rules="oldMoneyFormRule"
      :v-loading="loading" ref="oldMoneyForm" label-position="right" size="small">
      <el-form-item label="是否支持会员优惠:" prop="memberDiscount">
        <el-radio-group v-model="oldMoneyForm.memberDiscount">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
        <el-input v-if="oldMoneyForm.memberDiscount == 1" v-model="oldMoneyForm.discountAmount" maxlength="5"
          placeholder="请输入会员优惠金额" @blur="limitFiveStr">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="是否支持积分抵扣:" prop="isCreditPoints">
        <el-radio-group v-model="oldMoneyForm.isCreditPoints">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
        <template v-if="oldMoneyForm.isCreditPoints == 1">
          <span class="_label">会员用户积分抵扣</span>
          <el-input v-model="oldMoneyForm.pointDiscountPoint" maxlength="5"  @blur="limitFiveStr"
            placeholder="请输入会员用户抵扣积分">
            <template slot="append">元</template>
          </el-input>
        </template>
        <template v-if="oldMoneyForm.isCreditPoints == 1">
          <span class="_label">注册用户积分抵扣</span>
          <el-input v-model="oldMoneyForm.registerPoint" maxlength="5" @blur="limitFiveStr"
            placeholder="请输入注册用户抵扣积分">
            <template slot="append">元</template>
          </el-input>
        </template>
      </el-form-item>
      <!-- 9自营 0供应商 1合伙人 -->
      <el-form-item v-if="userObject.accountType == 9" label="是否返现养老金:" prop="money">
        <el-radio-group v-model="oldMoneyForm.money">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
        <el-input v-if="oldMoneyForm.money == 1" v-model="moneyValue" placeholder="请输入金额">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品类型:" prop="shop">
        <el-radio-group v-model="oldMoneyForm.shop" @change="changeRadio">
          <el-radio label="0">商品</el-radio>
          <el-radio label="1">服务</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!--商品  -->
    <el-form v-show="oldMoneyForm.shop == '0'" label-width="190px" class="service" :model="shopForm"
      :rules="shopRules" ref="shopForm" label-position="right" size="small">
      <el-form-item label="售卖地区:" prop="area">
        <el-radio-group v-model="shopForm.area">
          <el-radio label="0">全国</el-radio>
          <el-radio label="1">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 省市区 collapse-tags-->
      <el-form-item v-if="shopForm.area == '1'" label="请选择地区:" prop="selfSelectArray">
        <el-cascader ref="provinceSP" class="autoProvice" v-model="shopForm.selfSelectArray"
          placeholder="请选择地区" :options="areaList"
          :props="{multiple:true, value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}"
          size='small' @change="handlerAreaSP">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商家货号:" prop="goodsCode" class="item">
        <el-input v-model="shopForm.goodsCode" placeholder="请输入商家货号..."
          :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="商家款号:" prop="styleCode" class="item">
        <el-input v-model="shopForm.styleCode" placeholder="请输入商家款号..."
          :disabled="dataForm.saleState==5" maxlength="32" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="发货地类型:" prop="deliveryType" class="item">
        <el-select v-model="shopForm.deliveryType" style="width:80%" placeholder="请选择商品发货地类型..."
          :disabled="dataForm.saleState==5" maxlength="100">
          <el-option v-for="item in DeliveryTypeOptions" :key="item.key" :label="item.label"
            :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货地:" prop="deliveryRegion" class="item">
        <el-input v-model="shopForm.deliveryRegion" placeholder="请输入商品发货地城市名称..."
          :disabled="dataForm.saleState==5" maxlength="100" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="发货时长(N1至N2天送达):" prop="deliveryMinDays" class="item">
        <div class="lineFlex">
          <el-input-number v-model="shopForm.deliveryMinDays" controls-position="right" placeholder="请输入最小送达天数..."
            :disabled="dataForm.saleState==5" :min="1" maxlength="32" style="width:38%; text-align:left;"></el-input-number>
          -至-
          <el-input-number v-model="shopForm.deliveryMaxDays" controls-position="right" placeholder="请输入最大送达天数..."
            :disabled="dataForm.saleState==5" :min="2" :max="100" maxlength="32" style="width:38%; text-align:left;"></el-input-number>
        </div>

      </el-form-item>
    </el-form>
    <!-- 服务 -->
    <el-form v-show="oldMoneyForm.shop == '1'" label-width="190px" class="service"
      :model="serviceForm" :rules="serviceRules" ref="serviceForm" label-position="right"
      size="small">
      <el-form-item label="是否为到店服务:" prop="store">
        <el-radio-group v-model="serviceForm.store">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务所在地:" prop="place">
        <el-radio-group v-model="serviceForm.place" @change="fwAutoChange">
          <el-radio label="0">全国</el-radio>
          <el-radio label="1">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="serviceForm.store == '0' && serviceForm.place == '1'" label="请选择地区:"
        prop="selfSelectArray">
        <el-cascader ref="proviceFW" class="autoProvice" v-model="serviceForm.selfSelectArray"
          placeholder="请选择地区" :options="areaList"
          :props="{multiple: true,value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}"
          size='small' @change="handlerAreaFW">
        </el-cascader>
      </el-form-item>
      <div v-if="serviceForm.store == '1'">
        <el-form-item label="选择门店及地区:" required>
          <el-button type="primary" @click="openStore">选择</el-button>
        </el-form-item>
        <el-collapse style="width:80%;margin:0 auto;" v-model="activeName">
          <el-collapse-item v-for="(item,index) in listItem" :name="index+''" :title="item.title"
            :key="index">
            <el-table :data="item.list" border style="width:50%;">
              <el-table-column prop="storesName" label="门店名称" width="180">
              </el-table-column>
              <el-table-column prop="storesAddress" label="门店地址" width="180">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="delLine(scope.row,index)" type="text"
                    size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
    <el-divider content-position="left">
      <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
      <font style="color:blue">商品详情</font>
    </el-divider>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <table width="100%">
      <tr>
        <td style="width:5%"></td>
        <td align="center">
          <editor class="editor" id="editor" @onInit="initEditor"
            apiKey="n6lxhfc42kw4ihomm7bg3sm81oxv33otyiwukx8y15x8ncbd" v-model="productDetail"
            style="width:100%" :init="editorOptions">
          </editor>
        </td>
        <td style="width:5%"></td>
      </tr>
    </table>

    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-row type="flex" style="height:30px;text-align:center">
      <el-col :span="24" style="align:center">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button v-if="dataForm.saleState!=5" type="primary" :loading="sending"
          :disabled="sending" @click="save">{{ sending ? '正在保存...' : '保存信息' }}</el-button>
      </el-col>
    </el-row>
    <!-- 选择门店弹框 -->
    <el-dialog title="选择门店" :visible.sync="dialogTableVisible">
      <el-cascader ref="tkProvince" v-if="serviceForm.place == '1'" class="autoProvice"
        v-model="tkPriveArray" placeholder="请选择地区" :options="areaList"
        :props="{multiple: false,value:'code',label:'name',leaf:'pid',children: 'children',expandTrigger: 'hover'}"
        size='small' @change="handlerArea">
      </el-cascader>
      <div class="add_store">
        <el-button type="primary" @click="addStore">添加门店</el-button>
      </div>
      <el-table :data="gridData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="storesName" label="门店名称" width="200"></el-table-column>
        <el-table-column prop="storesAddress" label="地址"></el-table-column>
      </el-table>
      <div class="line_right">
        <el-button type="primary" @click="confirmTable">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import { fetch, post } from "@/utils/http-client"
import Editor from "@/components/Tinymce"
import Template from '../brand/template.vue';

export default {
  name: "",
  data() {
    const validateParam = (rule, value, callback) => {
      if (Object.keys(value).length == 0) {
        this.$message.warning('商品属性参数不能为空，请选择！')
      } else {
        callback()
      }
    }
    const validateAttributes = (rule, value, callback) => {
      if (!value) {
        callback(new Error('商品计量值不能为空,请输入'))
      } else {
        const patter = /^\d+$/
        if (!patter.test(value)) {
          callback(new Error('商品计量值只能为数字'))
        } else {
          callback()
        }
      }
    }

    return {
      activeName: [],
      productDetail: '',//详情
      selectAddressNames: [],
      selectAddressCodes: [],
      selectAddress: '',
      listItem: [],
      tkQueryByAddress: '',//弹框选择的地址进行门店查询
      tkPriveArray: [],//弹框选择省市区
      seletedList: [],
      userObject: {},
      gridData: [],//需要初始化门店列表数据
      dialogTableVisible: false,
      areaList: [],
      dialogTitle: "新增岗位",
      loading: false,
      sending: false,
      templateTitle: '创建商品',
      brandOptions: [],
      attr_tableData: [],
      categoryOptions: [],
      categoryAttrList: [],
      supplierOptions: [],
      valuationUnitOptions: [
        { key: 1, label: "件" },
        { key: 2, label: "重量" },
        { key: 3, label: "体积" }
      ],
      targetAudienceOptions: [
        { key: 1, label: "高血压" },
        { key: 2, label: "高血脂" },
        { key: 3, label: "高血糖" },
        { key: 4, label: "高尿酸" },
        { key: 5, label: "脂肪肝" },
        { key: 6, label: "肾囊肿" },
      ],
      SuppliedTypeOptions: [
        { key: 0, label: "平台自营" },
        { key: 1, label: "商家供货" }
      ],
      DeliveryTypeOptions: [
        { key: 0, label: "国内发货" },
        { key: 1, label: "香港发货" },
        { key: 2, label: "海外发货" }
      ],
      oldMoneyForm: {
        money: '0',
        shop: '0',
        isCreditPoints: '0',
        memberDiscount: '1', // 是否支持会员优惠 0 否 1 是
        discountAmount: '', // 会员优惠金额
        pointDiscountPoint: '',//会员积分抵扣
        registerPoint: '', // 注册用户积分
      },
      moneyValue: '',//输入金额
      oldMoneyFormRule: {
        money: [{ required: true, trigger: "blur" }],
        shop: [{ required: true, trigger: "blur" }],
        isCreditPoints: [{ required: true, trigger: "blur" }],
        memberDiscount: [{ required: true, trigger: "blur" }]
      },
      shopForm: {
        area: '0',
        selfSelectArray: [],//自定义选择地区
        goodsCode: '',//商家货号
        styleCode: '',//商家款号
        deliveryType: '',
        deliveryRegion: '',
        deliveryMinDays: '',
        deliveryMaxDays: ''
      },
      shopRules: {
        area: [{ required: true, trigger: "blur" }],
        selfSelectArray: [{ required: true, message: '地区选择不能为空,请选择！', trigger: "blur" }],
        deliveryType: [{ required: true, message: "发货地类型不能为空，请选择！", trigger: "blur" }],
        deliveryMinDays: [{ required: true, message: "最小配送时常不能为空，请完整输入！", trigger: "blur" }],
        deliveryMaxDays: [{ required: true, message: "最大配送时常不能为空，请完整输入！", trigger: "blur" }],
      },
      serviceForm: {
        place: '0',
        store: '0',
        selfSelectArray: []
      },
      serviceRules: {
        place: [{ required: true, trigger: "blur" }],
        store: [{ required: true, trigger: "blur" }],
        selfSelectArray: [{ required: true, message: '地区选择不能为空,请选择！', trigger: "change" }],

      },
      dataForm: {
        id: "",
        name: "",
        subName: "",
        prefixName: "",
        suffixName: "",
        code: "",
        keywords: "",
        summarized: "",
        brandId: "",
        categoryId: "",
        categoryNode: [],
        valuationUnit: "",
        unitVal: "",
        tariffType: "",
        mainImgUrl: "",
        delFlag: "",
        saleState: '',
        attributeMap: new Map(),
        targetAudience: [],
      },
      dataRules: {
        name: [{ required: true, message: "商品名称不能为空，请完整输入！", trigger: "blur" }],
        subName: [{ required: true, message: "商品简称不能为空，请完整输入！", trigger: "blur" }],
        brandId: [{ required: true, message: "商品品牌不能为空，请选择品牌！", trigger: "change" }],
        categoryNode: [{ required: true, message: "商品类目不能为空，请选择类目！", trigger: "change" }],
        valuationUnit: [{ required: true, message: "计量单位不能为空，请选择！", trigger: "change" }],
        targetAudience: [{ required: true, message: "适用人群不能为空，请选择！", trigger: "change" }],
        unitVal: [{ required: true, validator: validateAttributes, trigger: "blur" }],
        attributeMap: [{ required: true, trigger: "blur", validator: validateParam }]
      },
      uploading: false,
      editorOptions: {
        height: 500,
        language: "zh_CN",
        branding: false,
        menubar: false,
        elementpath: false,
        plugins:
          "searchreplace autolink directionality visualblocks visualchars fullscreen link table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists imagetools textpattern emoticons autosave formatpainter",
        toolbar:
          "undo redo restoredraft | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                     styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote removeformat | table charmap emoticons hr pagebreak insertdatetime",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif",
        template_cdate_format: "[CDATE: %m/%d/%Y : %H:%M:%S]",
        template_mdate_format: "[MDATE: %m/%d/%Y : %H:%M:%S]",
        autosave_ask_before_unload: false,
        toolbar_mode: "wrap"
      }
    };
  },
  async created() {
    const result = await fetch("/area/getAreaTree", {});
    if (result.code == 200) {
      this.areaList = result.data;
    } else {
      this.$message.error(result.msg);
    }
  },
  components: {
    Editor
  },
  async mounted() {
    const user = localStorage.getItem('userInfor')
    this.userObject = JSON.parse(user)
    this.loadBrandOptions();
    this.loadCategoryOptions();
    this.loadSupplierOptions();
    if (this.$route.params.id) {
      this.loadData(this.$route.params.id)
    }
  },
  methods: {
    limitFiveStr (e) {
      const val = e.target.value
      console.log(val)
      // const regex = /^\d{0,5}$/
      const regex = /^\d+$/
      if (!regex.test(val)) {
        this.$message.warning('请输入数字！')
        e.target.value = ''
      }
    },
    fwAutoChange(value) {
      if (this.serviceForm.store == '1') {
        this.listItem = []
        this.selectAddress = ''
      }
    },
    openStore() {
      this.tkPriveArray = []
      this.dialogTableVisible = true
      if (this.serviceForm.place == '0') {
        this.tkQueryByAddress = ''
        this.tkPriveArray = []
        this.queryStoreList();
      } else {
        this.gridData = []
      }
    },
    handleSelectionChange(option) {
      this.seletedList = option
    },
    compare(array) {
      const result = array.reduce((pre, cur) => {
        const ids = pre.map(item => item.id)
        return ids.includes(cur.id) ? pre : [...pre, cur]
      }, [])
      return result
    },
    confirmTable() {
      this.dialogTableVisible = false
      const item = {
        title: this.selectAddress ? this.selectAddress : '全国',
        addressCodes: this.selectAddressCodes,
        selectAddressNames: this.selectAddressNames,
        list: this.seletedList
      }
      this.listItem = this.listItem.concat(item)
      let obj = {}
      let concatArray = []
      let preList = this.listItem.reduce((pre, cur) => {
        if (!pre[cur.title]) {
          pre[cur.title] = cur.list
        } else {
          pre[cur.title] = pre[cur.title].concat(cur.list)
        }
        return pre
      }, {})

      Object.keys(preList).forEach(key => {
        obj = {
          title: key,
          addressCodes: this.selectAddressCodes,
          selectAddressNames: this.selectAddressNames,
          list: preList[key]
        }
        concatArray.push(obj)
      })
      concatArray.forEach(item => {
        item.list = this.compare(item.list)
      })
      this.listItem = concatArray
      concatArray.forEach((item, index) => {
        this.activeName.push(index + '')
      })
      console.log("===激活的那么---", this.activeName)
    },
    //门店列表查询
    async queryStoreList() {
      const url = '/srm/stores/listByPageNo'
      //目前不做分页 prd
      const params = {
        pageNum: 1,
        pageSize: 10000,
        queryObject: {
          storesAddress: this.tkQueryByAddress,
          storesName: ''
        }
      }
      const result = await post(url, params)
      if (result.code == 200) {
        const data = result.data || {}
        // const total = result.totalCount
        const list = data.list || []
        console.log("==门店列表list--", list)
        this.gridData = list
      }
    },
    changeRadio(radio) {
      if (radio == '1') {
        this.$refs.shopForm.clearValidate()
      } else {
        this.$refs.serviceForm.clearValidate()
      }
    },

    addStore() {
      this.$router.push({ path: '/apps/store/storeList' })
    },

    delLine(row, index) {
      let listArray = this.listItem[index]['list'] || []
      let key = listArray.findIndex((item) => {
        return item.id == row.id
      })
      listArray.splice(key, 1)
      if (listArray.length == 0) {
        this.listItem.splice(index, 1)
      }
    },
    handlerArea(value) {
      const tk = this.$refs.tkProvince.getCheckedNodes()
      const provice = tk[0].parent.parent.label
      const s = tk[0].parent.label
      const q = tk[0].label
      this.selectAddress = provice + '/' + s + '/' + q
      this.selectAddressNames = [provice, s, q]
      this.tkQueryByAddress = q
      this.selectAddressCodes = value
      this.queryStoreList()
    },
    handlerAreaFW(value) {
      const fw = this.$refs.proviceFW
    },
    handlerAreaSP(value) {
      const sp = this.$refs.provinceSP
    },
    handlerArea2(value) {
      let tree = this.$refs['province']
    },
    beforeEditorUpload() {
      this.uploading = true;
    },
    uploadEditorSuccess(res) {
      if (!res.code) {
        return false;
      }
      this.uploading = false;
      if (res.code === 200) {
        this.editor.insertContent(
          `<img class="wscnph" src="${res.data.url}" >`
        );
      } else {
        this.$message.error(res.msg);
      }
    },
    initEditor(e, obj) {
      this.editor = obj;
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

    async loadSupplierOptions() {
      const result = await post("/srm/supplier/listByPageNo", { pageNum: 1, pageSize: 1000 });
      if (result.code == 200) {
        this.supplierOptions = result.data.list;
      } else {
        this.$message.error(result.msg);
      }
    },
    checkAttr(data) {
      if (data.type === 0) {//单选框
        Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected)
      }
      else if (data.type === 1) {//复选框
        data.isIndeterminate = data.attrValSelected.length !== data.attrValList.length;
        data.checkAll = !data.isIndeterminate;
        Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected.join(','))
      }
      else if (data.type === 2) {//输入框
        Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected)
      }
      else {
        console.warn('不支持改类型！')
      }
    },

    checkAllAttr(data) {
      if (data.checkAll) {
        const ids = [];
        data.attrValList.forEach(attr => {
          ids.push(attr.id)
        })
        data.attrValSelected = ids;
        data.isIndeterminate = false;
      } else {
        data.attrValSelected = [];
        data.isIndeterminate = true;
      }
      Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected.join(','))
    },

    async categorySelectionOnChange(val, attributes) {
      this.dataForm.attributeMap = {}
      var data = { categoryNode: val.join(','), attrType: 2 };
      const result = await fetch("/attr/getProductAttrListByCategoryId", data);
      if (result.code != 200) {
        this.$message.error(result.msg);
        return;
      }
      let resultArr = result.data;
      resultArr.forEach(ele => {
        if (!ele.hasOwnProperty("checkAll")) {
          this.$set(ele, "checkAll", false);
        }
        if (!ele.hasOwnProperty("attrValSelected")) {
          if (ele.type === 2 || ele.type === 0) {
            this.$set(ele, "attrValSelected", '');
          }
          else {
            this.$set(ele, "attrValSelected", []);
          }
        }
        if (attributes) {
          attributes.forEach(attr => {
            if (ele.id == attr.attrId) {
              if (ele.type === 0) {
                ele.attrValSelected = Number(attr.attrValIds)
                Vue.set(this.dataForm.attributeMap, ele.id, ele.attrValSelected)
                console.log("radio value: " + attr.attrValIds)
              }
              else if (ele.type === 1) {
                var attrValSelected = []
                attr.attrValIds.split(',').forEach(valId => {
                  attrValSelected.push(Number(valId))
                })
                ele.attrValSelected = attrValSelected
                Vue.set(this.dataForm.attributeMap, ele.id, attrValSelected.join(','))
              }
              else if (ele.type === 2) {
                ele.attrValSelected = attr.attrValContent
                Vue.set(this.dataForm.attributeMap, ele.id, ele.attrValSelected)
              }
            }
          })
        }
        if (!ele.hasOwnProperty("attrValList")) {
          this.$set(ele, "attrValList", []);
        }
        if (!ele.hasOwnProperty("isIndeterminate")) {
          this.$set(ele, "isIndeterminate", true);
        }
      });
      this.attr_tableData = resultArr;
    },

    async loadData(productId) {
      if (productId && productId == -1) {
        return;
      }
      this.loading = true
      const result = await fetch('/product/getByPK', { productId: productId });
      this.loading = false
      if (result.code == 200) {
        const dataForm = {
          id: result.data.id,
          name: result.data.name,
          subName: result.data.subName,
          prefixName: result.data.prefixName,
          suffixName: result.data.suffixName,
          code: result.data.code,
          keywords: result.data.keywords,
          summarized: result.data.summarized,
          brandId: result.data.brandId,
          categoryId: result.data.categoryId,
          categoryNode: result.data.categoryNode.split(',').splice(1, 3),
          valuationUnit: result.data.valuationUnit,
          unitVal: result.data.unitVal,
          tariffType: result.data.tariffType,
          mainImgUrl: result.data.mainImgUrl,
          delFlag: result.data.delFlag,
          attributes: result.data.attributes,
          saleState: result.data.saleState,
          attributeMap: new Map,
          targetAudience: result.data.targetAudience?.split(',')
        };
        
        this.oldMoneyForm.isCreditPoints = result.data.isCreditPoints + '',
          this.oldMoneyForm.pointDiscountPoint = result.data.pointDiscountPoint,
          this.oldMoneyForm.registerPoint = result.data.registerPoint,
          this.productDetail = result.data.productDetail,
          this.dataForm = dataForm,
          this.oldMoneyForm.money = result.data.isRebate + '',
          this.moneyValue = result.data.rebateMoney,//返利
          this.shopForm.goodsCode = result.data.goodsCode,
          this.shopForm.styleCode = result.data.styleCode,
          this.shopForm.deliveryType = result.data.deliveryType,
          this.shopForm.deliveryRegion = result.data.deliveryRegion,
          this.shopForm.deliveryMinDays = result.data.deliveryMinDays,
          this.shopForm.deliveryMaxDays = result.data.deliveryMaxDays,
          this.serviceForm.place = result.data.isAreaService + '',
          this.serviceForm.store = result.data.isStoreService + '',
          this.shopForm.area = result.data.isAreaService + '',
          this.oldMoneyForm.shop = result.data.productType + '',
          this.listItem = []
        const saleAreas = result.data.saleAreas || []
        let codes = []
        saleAreas.forEach(item => {
          const obj = {
            title: item.area_name ? item.area_name : '全国',
            addressCodes: item.area_code ? item.area_code.split('/') : [],
            selectAddressNames: item.area_name ? item.area_name.split('/') : [],
            list: item.product_sale_stoles
          }
          this.listItem.push(obj)
          if (item.area_code) {
            codes.push(item.area_code.split('/').map(Number))
          }
        })
        this.serviceForm.selfSelectArray = codes
        this.shopForm.selfSelectArray = codes
        //回显属性参数
        this.categorySelectionOnChange(this.dataForm.categoryNode, result.data.attributes)
      } else {
        this.$message.error(result.msg);
      }
    },
    save() {
      this.$refs.dataFormInfor.validate(async valid => {
        if (valid) {
          let flag = false
          if (this.oldMoneyForm.shop == '1') {
            this.$refs.serviceForm.validate(res => {
              if (res) { flag = true }
            })
          } else {
            this.$refs.shopForm.validate(res => {
              if (res) { flag = true }
            })
          }
          if (!flag) return
          if (this.userObject.accountType == 9 && this.oldMoneyForm.money == 1) {
            const patter = /^-?\d+\.?\d{0,2}$/
            if (!this.moneyValue) {
              this.$message.warning('输入的金额不能为空！')
              return
            }
            if (!patter.test(this.moneyValue)) {
              this.$message.warning('返老金额为数字或者数字保留2位小数！')
              return
            }
          }
          // 
          if (this.oldMoneyForm.memberDiscount == 1) {
            if (!this.oldMoneyForm.discountAmount) {
              return this.$message.warning('会员优惠金额不能为空！')
            }
          }
          if (this.oldMoneyForm.isCreditPoints == 1) {
            const patter = /^-?\d+\.?\d{0,2}$/
            if (!this.oldMoneyForm.pointDiscountPoint) {
              this.$message.warning('会员用户积分抵扣值不能为空！')
              return
            }
            if (!patter.test(this.oldMoneyForm.pointDiscountPoint)) {
              this.$message.warning('会员用户积分抵扣值为数字或者数字保留2位小数！')
              return
            }
            // 会员用户抵扣积分 & 注册用户抵扣积分，两项都必须填写，如只写其中一项，需要提示： 积分抵扣设置不完整，请重新设置
            // 最后需要替换字段
            if (!this.oldMoneyForm.registerPoint) {
              this.$message.warning('注册用户积分抵扣值不能为空！')
              return
            }
            if (!patter.test(this.oldMoneyForm.registerPoint)) {
              this.$message.warning('注册用户积分抵扣值为数字或者数字保留2位小数！')
              return
            }
          }
          if (this.oldMoneyForm.shop == '1' && this.serviceForm.store == '1' && this.listItem.length == 0) {
            this.$message.warning('门店选择不能为空!')
            return
          }
          if (this.productDetail.length == 0) {
            this.$message.warning('商品详情不能为空！')
            return
          }
          // if(this.dataForm.categoryNode.length > 0){
          //   console.log("===shuj--",this.dataForm.attributeMap.keys().length)
          //   if(this.dataForm.attributeMap.keys().length == 0)
          //    this.$message.error('属性参数不能为空!') 
          //   return
          // }

          if (this.dataForm.categoryNode.length > 0) {
            this.dataForm.categoryNode = '1,' + this.dataForm.categoryNode.join(',')
          }
          let points = {
            isCreditPoints: this.oldMoneyForm.isCreditPoints,
            memberDiscount: this.oldMoneyForm.memberDiscount,
            discountAmount: this.oldMoneyForm.discountAmount,
            pointDiscountPoint: this.oldMoneyForm.pointDiscountPoint,
            registerPoint: this.oldMoneyForm.registerPoint
          }
          // if (this.oldMoneyForm.isCreditPoints == 1) {
          //   points['pointDiscountPoint'] = this.oldMoneyForm.pointDiscountPoint
          // }
          var shopData = {}
          let params = Object.assign(points, { productDetail: this.productDetail, productType: this.oldMoneyForm.shop })
          if (this.userObject.accountType == 9) {
            //平台自营 是否返现养老金
            let obj = {
              isRebate: this.oldMoneyForm.money
            }
            if (this.oldMoneyForm.money == 1) {
              obj['rebateMoney'] = this.moneyValue
            }
            params = Object.assign(params, obj)
          }
          if (this.oldMoneyForm.shop == '0') {
            //商品
            //售卖地区
            const area = this.shopForm.area
            const productSaleAreas = []
            if (this.shopForm.area == '1') {
              //自定义地区
              this.shopForm.selfSelectArray.forEach(item => {
                const object = {
                  provinceCode: item[0],
                  cityCode: item[1],
                  areaCode: item[2]
                }
                productSaleAreas.push(object)
              })
            }
            shopData = {
              productSaleAreas: productSaleAreas,
              isAreaService: area
            }
            params = Object.assign(params, this.dataForm, this.shopForm, shopData)
          } else {
            //服务
            const dstore = this.serviceForm.store //到店服务
            let productSaleAreas = []
            const areaFW = this.serviceForm.place //服务所在地
            if (this.serviceForm.store == '1') {
              //到店服务
              if (this.serviceForm.place == '1') {
                //自定义
                let storeids = []
                this.listItem.forEach(item => {
                  const ids = []
                  item.list.forEach(line => {
                    ids.push(line.id)
                  })
                  const obj = {
                    provinceCode: item.addressCodes[0],
                    provinceName: item.selectAddressNames[0],
                    cityCode: item.addressCodes[1],
                    cityName: item.selectAddressNames[1],
                    areaCode: item.addressCodes[2],
                    areaName: item.selectAddressNames[2],
                    storeIds: ids.join(',')
                  }
                  storeids.push(obj)
                })
                productSaleAreas = storeids
              } else {
                //全国
                let saleArea = []
                this.listItem.forEach(item => {
                  const ids = []
                  item.list.forEach(line => {
                    ids.push(line.id)
                  })
                  const obj = {
                    storeIds: ids.join(',')
                  }
                  saleArea.push(obj)
                })
                console.log("==全国--", this.listItem)
                console.log("---saleArea--", saleArea)
                productSaleAreas = saleArea
              }
            } else {
              //否
              if (this.serviceForm.place == '1') {
                //自定义
                let saleArea = []
                this.serviceForm.selfSelectArray.forEach(item => {
                  const obj = {
                    provinceCode: item[0],
                    cityCode: item[1],
                    areaCode: item[2]
                  }
                  saleArea.push(obj)
                })
                productSaleAreas = saleArea
              }
            }
            let serviceData = {
              isStoreService: dstore,
              isAreaService: areaFW,
              productSaleAreas: productSaleAreas
            }
            params = Object.assign(params, this.dataForm, serviceData)
          }
          const targetAudience = this.dataForm.targetAudience.join()
          params.targetAudience = targetAudience

          this.sending = true;
          var url = this.dataForm.id ? '/product/update' : '/product/add'
          const result = await post(url, params)
          this.sending = false;
          if (result.code == 200) {
            this.$message.success("商品信息保存成功！");
            this.back2Prev()
          } else {
            this.$message.error(result.msg);
          }
        } else {
          return false;
        }
      });
    },
    back2Prev() {
      this.$router.back();
    },
    handleAvatarSuccess(response, file) {
      if (!response || response.code != 0) {
        return;
      }
      this.dataForm.mainImgUrl = file.response.data.absoluteUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.add_store {
  margin-bottom: 23px;
}
.lineFlex {
  display: flex;
}
._line {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  ._name {
    color: #99a9bf;
  }
}
._left {
  width: 40%;
}
._right {
  width: 605；;
}
.line_right {
  text-align: right;
  margin-top: 27px;
}
.service {
  background-color: #fdfdfd;
}
.autoProvice {
  min-width: 80%;
  max-height: 100px;
  overflow: auto;
}
.div-layout {
  padding: 10px 20px;
}
.avatar-uploader .el-upload {
  border: 0.5px dashed #5f5d5d;
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
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.item .el-form-item__label {
  height: 35px;
}
._label {
  margin-left: 25px;
}
._custom_cascader {
  .el-input {
    width: 100%;
  }
}
.lineFlex {
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
  }
}
</style>