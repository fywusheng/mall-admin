<template>
  <div v-loading="loading">
    <div class="_body">
      <div class="store">
        <!-- <div class="_left">
          <el-image class="_img" :src="storeData.src">
            <div slot="error" class="image-slot spaceImg">无图</div>
          </el-image>
          <div class="_txt">
            <div class="_title">
              {{ storeData.title ? storeData.title : "未设置店铺名称" }}
            </div>
            <el-button
              class="btn-set"
              @click="goStore(storeData.goStore)"
              v-if="storeData.goStore"
              type="primary"
              >进入店铺设置</el-button
            >
          </div>
        </div> -->
        <!-- TODO -->
        <!-- 最后确认 是否需要根据类型不同来显示加盟商管理的内容，暂时先放开，把限制去掉 -->
        <!-- v-if="userObject.accountType == 9 || userObject.accountType == 1" -->
        <div
          class="_right"
        >
          <div class="_title">加盟商管理</div>
          <div class="body">
            <div class="_item" v-for="(item, i) in GYManage.list" :key="i">
              <div class="_icon">
                <img :src="item.icon" alt="" style="width: 35px" />
              </div>
              <div class="_lable">
                {{ item.t }}
                <!-- <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="item.notice"
                >
                  <i slot="reference" class="el-icon-warning-outline"></i>
                </el-popover> -->
              </div>
              <div
                class="_num _marginTop _hover"
                @click="goPath(GYManageValues[i].url, item.t)"
              >
                {{ GYManageValues[i].number }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="_m">
        <div class="_manage" v-for="(item, i) in manage" :key="i">
          <div class="line">
            <div class="_t">
              <div class="change">{{ item.title }}</div>
              <div class="_line"></div>
            </div>
            <div class="_b">
              <div
                class="order"
                v-for="(block, index) in item.labelList"
                :key="index"
              >
                <div class="lable">
                  {{ block.label }}
                  <!-- <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="block.notice"
                  >
                    <i slot="reference" class="el-icon-warning-outline"></i>
                  </el-popover> -->
                </div>
                <div
                  class="num _hover"
                  @click="goPath(manageListV[i][index]['url'], block.label)"
                >
                  {{
                    manageListV[i][index]["num"]
                      ? manageListV[i][index]["num"]
                      : 0
                  }}
                </div>
              </div>
              <div class="order">
                <img
                  v-if="i === 0"
                  class="icon"
                  src="../../assets/imgs/icon-m.png"
                  alt=""
                />
                <img
                  v-else
                  class="icon"
                  src="../../assets/imgs/icon-p.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="showData">
        <div class="_t">
          <div class="_title">{{ showData.title }}</div>
          <div class="_line"></div>
        </div>
        <el-radio-group
          @change="brand"
          v-model="selectDay"
          size="small"
          class="top_line"
        >
          <el-radio-button label="1">全部</el-radio-button>
          <el-radio-button label="2">近一天</el-radio-button>
          <el-radio-button label="3">近7天</el-radio-button>
          <el-radio-button label="4">近30天</el-radio-button>
          <el-radio-button label="5">自定义时间</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-if="selectDay == '5'"
          class="datePicker"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="changeDateXS"
          v-model="defineDayXS"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button class="statistics-table" @click="showExportDialog">统计报表</el-button>
        <div class="_center">
          <div class="_item" v-for="(item, i) in showData.list" :key="i">
            <div class="_lable">
              {{ item.t }}
              <div class="_icon">
              <el-avatar
                :src="item.icon"
                style="width: 30px; height: 30px"
              ></el-avatar>
            </div>
            </div>
            <div class="_num _hover" @click="goPath(saleData[i].url)">
              {{ saleData[i].num }}
            </div>
          </div>
        </div>
      </div>

      <!-- TODO -->
      <!-- 排行榜 -->
      <div class="rank-list">
        <div class="rank-item">
          <div class="showData">
            <div class="_t">
              <div class="_title">加盟商销售额排行</div>
              <div class="_line"></div>
            </div>
            <div class="_table">
              <el-table
                :data="franchiseeSalePrice"
                height="600"
                stripe
                style="width: 100%">
                <el-table-column type="index" label="排名" width="60"/>
                <el-table-column prop="franchisee" label="加盟商名称"/>
                <el-table-column prop="salePrice" label="销售额" width="140"/>
              </el-table>
            </div>
          </div>
        </div>
        <div class="rank-item">
          <div class="showData">
            <div class="_t">
              <div class="_title">加盟商注册用户排行</div>
              <div class="_line"></div>
            </div>
            <div class="_table">
              <el-table
                :data="franchiseeRegisterCount"
                height="600"
                stripe
                style="width: 100%">
                <el-table-column type="index" label="排名" width="60"/>
                <el-table-column prop="franchisee" label="加盟商名称"/>
                <el-table-column prop="registerCount" label="注册数" width="140"/>
              </el-table>
            </div>
          </div>
        </div>
        <div class="rank-item">
          <div class="showData">
            <div class="_t">
              <div class="_title">加盟商会员客户排行</div>
              <div class="_line"></div>
            </div>
            <div class="_table">
              <el-table
                :data="franchiseeMemberCount"
                height="600"
                stripe
                style="width: 100%">
                <el-table-column type="index" label="排名" width="60"/>
                <el-table-column prop="franchisee" label="加盟商名称"/>
                <el-table-column prop="memberCount" label="会员数" width="140"/>
              </el-table>
            </div>
          </div>
        </div>
      </div>

      <!-- 导出弹窗 -->
      <export-modal v-model="visibleExportModal"/>
      
      <!-- <div
        class="showData"
        v-if="userObject.accountType == 9 || userObject.accountType == 1"
      >
        <div class="_t">
          <div class="_title">{{ GYData.title }}</div>
          <div class="_line"></div>
        </div>
        <el-radio-group
          @change="changeDay"
          v-model="GYSelect"
          size="small"
          class="top_line"
        >
          <el-radio-button label="1">全部</el-radio-button>
          <el-radio-button label="2">近一天</el-radio-button>
          <el-radio-button label="3">近7天</el-radio-button>
          <el-radio-button label="4">近30天</el-radio-button>
          <el-radio-button label="5">自定义时间</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-if="GYSelect == '5'"
          class="datePicker"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="changeDate"
          v-model="defineDay"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <div class="_center">
          <div class="_item" v-for="(item, i) in GYData.list" :key="i">
            <div class="_lable">
              {{ item.t }}
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="item.notice"
              >
                <i slot="reference" class="el-icon-warning-outline"></i>
              </el-popover>
            </div>
            <div class="_num">{{ GYSDataShow[i] }}</div>
            <div class="_icon">
              <el-avatar
                :src="item.icon"
                style="width: 30px; height: 30px"
              ></el-avatar>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
// import Production from './production'
// import Activate from './activate'
// import AreaMap from './area'
// import Status from './status'
import exportModal from './export-modal.vue'
import { fetch, post } from "@/utils/http-client";
export default {
  name: "DeviceStatics",
  data() {
    return {
      loading: false,
      saleData: [
        { num: "", url: "" },
        { num: "", url: "" },
        { num: "", url: "" },
        { num: "", url: "" },
        { num: "", url: "" },
        { num: "", url: "" },
        { num: "", url: "" },
        { num: "", url: "" },
      ],
      storeData: {
        src: "",
        title: "",
        goStore: "",
      },
      manageListV: [
        [
          { num: "", url: "" },
          { num: "", url: "" },
          { num: "", url: "" },
        ],
        [
          { num: "", url: "" },
          { num: "", url: "" },
          { num: "", url: "" },
        ],
      ],
      manage: [
        {
          title: "交易管理",
          labelList: [
            {
              label: "待发货订单",
              // notice:
              //   "订单需商家进行发货。请在订单支付后48小时内发货完成，若已完成发货，须将发货物流信息录入到仓储发货模块中，否则买家无法查看物流跟踪信息。",
            },
            {
              label: "超48小时发货",
              // notice:
              //   "订单支付成功后超过48小时未发货，请尽快发货，以免买家发起纠纷或投诉。",
            },
            {
              label: "待审核退款订单",
              // notice:
              //   "售后退款单需要商家进行人工审核，请尽快处理退款单，以免买家发起纠纷或投诉。",
            },
          ],
        },
        {
          title: "商品管理",
          labelList: [
            {
              label: "在售商品",
              notice: "当前在售且有库存的商品。",
            },
            {
              label: "待上架商品",
              notice: "当前可上架的商品，请关注并及时上架。",
            },
            {
              label: "审核不通过",
              notice: "您发布的商品平台审核未通过，请关注驳回原因并及时处理。",
            },
          ],
        },
      ],
      showData: {
        title: "销售数据看板",
        list: [
          {
            t: "订单总数",
            icon: require("../../../src/assets/imgs/xs-dt-01.png"),
          },
          {
            t: "订单GMV",
            icon: require("../../../src/assets/imgs/xs-dt-02.png"),
          },
          {
            t: "退款单",
            icon: require("../../../src/assets/imgs/xs-dt-03.png"),
          },
          {
            t: "已退款金额",
            icon: require("../../../src/assets/imgs/xs-dt-04.png"),
          },
          {
            t: "订单实付总金额",
            icon: require("../../../src/assets/imgs/xs-dt-05.png"),
          },
          {
            t: "注册用户",
            icon: require("../../../src/assets/imgs/xs-dt-06.png"),
          },
          {
            t: "会员客户",
            icon: require("../../../src/assets/imgs/xs-dt-07.png"),
          },
          {
            t: "平均客单价",
            icon: require("../../../src/assets/imgs/xs-dt-08.png"),
          },
        ],
      },
      selectDay: "1",
      // GYData: {
      //   title: "供应商数据看板",
      //   list: [
      //     {
      //       t: "订单总数",
      //       notice:
      //         "所有供应商产生的所有订单数量，统计订单状态包含“待付款、待发货、配送中、已完成、已退款”等状态的订单。",
      //       icon: require("../../../src/assets/imgs/order.png"),
      //     },
      //     {
      //       t: "订单GMV",
      //       notice:
      //         "所有供应商产生的订单实付金额（含运费，不含优惠），统计订单状态包含“待付款、待发货、配送中、已完成、已退款”等状态的订单。",
      //       icon: require("../../../src/assets/imgs/gmv.png"),
      //     },
      //     {
      //       t: "新增客户",
      //       notice:
      //         "合伙人管辖下的供应商的首单用户（首单用户：第一次在该店铺产生订单的用户)。",
      //       icon: require("../../../src/assets/imgs/xzkh.png"),
      //     },
      //     {
      //       t: "平均客单价",
      //       notice: "合伙人当前所有供应商的平均客单价。",
      //       icon: require("../../../src/assets/imgs/kdj.png"),
      //     },
      //   ],
      // },
      GYManage: {
        title: "加盟商管理",
        list: [
          {
            t: "已有加盟商",
            // notice: "合伙人当前所有已通过平台审核的供应商。",
            icon: require("../../../src/assets/imgs/index-supply-1.png"),
          },
          {
            t: "待审核加盟商",
            // notice:
            //   "合伙人新发展的供应商须平台进行人工审核，审核通过后，方可登录使用老龄宝系统。",
            icon: require("../../../src/assets/imgs/index-supply-2.png"),
          },
          {
            t: "审核未通过加盟商",
            // notice:
            //   "合伙人新发展的供应商须平台进行人工审核，审核未通过，无法登录使用老龄宝系统。",
            icon: require("../../../src/assets/imgs/index-supply-3.png"),
          },
        ],
      },
      GYSDataShow: [],
      GYSelect: "1",
      defineDay: [],
      startDate: "",
      startDateXS: "",
      endDate: "",
      endDateXS: "",
      defineDayXS: [],
      userObject: {},
      GYManageValues: [
        { number: "", url: "" },
        { number: "", url: "" },
        { number: "", url: "" },
      ],
      visibleExportModal: false,
      tableData: [],
      franchiseeSalePrice: [], // 销售排行
      franchiseeRegisterCount: [], // 注册排行
      franchiseeMemberCount: [], // 会员排行
    };
  },
  components: {
    // Production,
    // Activate,
    // Status,
    // AreaMap
    exportModal
  },
  created() {
    this.getStoreInfo();
    this.mange();
    this.supplierManagement();
    this.supplierDisplayBoard();
    this.indexOrderCount();
  },
  async mounted() {
    const user = localStorage.getItem("userInfor");
    this.userObject = JSON.parse(user);
  },
  methods: {
    //销售数据看板
    async indexOrderCount() {
      let params = {
        flag: this.selectDay,
      };
      if (this.selectDay == "5") {
        const obj = {
          selfDefinedStartTime: this.startDateXS,
          selfDefinedEndTime: this.endDateXS,
        };
        params = Object.assign(params, obj);
      }
      const res = await post("/order/indexOrderCount", params);
      if (res.code == "200") {
        const data = res.data || {};
        this.saleData = [
          data.orderNum,
          data.orderGmv,
          data.refundOrderCount,
          data.refundAmount,
          // 新增四个字段不跳转
          {...data.orderAmount, url: 'no-jump'},
          {...data.registerCount, url: 'no-jump'},
          {...data.memberCount, url: 'no-jump'},
          {...data.orderAmountAvg, url: 'no-jump'},
        ];
        this.franchiseeSalePrice = res.data.franchiseeSalePrice || []
        this.franchiseeRegisterCount = res.data.franchiseeRegisterCount || []
        this.franchiseeMemberCount = res.data.franchiseeMemberCount || []
      } else {
        this.$message.warning(res.msg);
      }
    },
    changeDate(days) {
      (this.startDate = days[0]),
        (this.endDate = days[1]),
        this.supplierDisplayBoard();
    },
    changeDateXS(value) {
      (this.startDateXS = value[0]),
        (this.endDateXS = value[1]),
        this.indexOrderCount();
    },
    brand(day) {
      this.selectDay = day;
      this.defineDayXS = [];
      if (day == "5") return;
      this.indexOrderCount();
    },
    changeDay(day) {
      this.GYSelect = day;
      this.defineDay = [];
      if (day == "5") return;
      this.supplierDisplayBoard();
    },
    // 统计报表
    showExportDialog () {
      console.log('统计报表显示')
      this.visibleExportModal = true
    },
    //供应商数据看板
    async supplierDisplayBoard() {
      let params = {
        flag: this.GYSelect,
      };
      if (this.GYSelect == "5") {
        const obj = {
          selfDefinedStartTime: this.startDate,
          selfDefinedEndTime: this.endDate,
        };
        params = Object.assign(params, obj);
      }
      const res = await post("/supplier/supplierDisplayBoard", params);
      if (res.code == "200") {
        const data = res.data || {};
        this.GYSDataShow = [
          data.orderNum ? data.orderNum : 0,
          data.orderGmv ? data.orderGmv : 0,
          data.newSupplierNum ? data.newSupplierNum : 0,
          data.averageFare ? data.averageFare : 0,
        ];
      } else {
        this.$message.warning(res.msg);
      }
    },
    goPath(url, name) {
      console.log(url, name)
      const queryParam = {
        在售商品: "1",
        待上架商品: "2",
        审核不通过: "3",
        已有供应商: "3",
        待审核供应商: "2",
        审核未通过供应商: "4",
        已有加盟商: "1",
        待审核加盟商: "2",
        审核未通过加盟商: "0",
      };
      // 下边四个字段点击不跳转
      if (url == 'no-jump') return
      if (!url) return;
      if (queryParam[name]) {
        this.$router.push({ path: url, query: { type: queryParam[name] } });
      } else {
        this.$router.push({ path: url });
      }
    },
    //供应商管理
    async supplierManagement() {
      const res = await post("/supplier/supplierManagement", {});
      if (res.code == "200") {
        const data = res.data || {};
        this.GYManageValues = [
          {...data.auditPassNum, url: '/apps/franchisee/franchisee-list'},
          {...data.auditDoingNum, url: '/apps/franchisee/franchisee-list'},
          {...data.auditNoPassNum, url: '/apps/franchisee/franchisee-list'},
        ];
      } else {
        this.$message.warning(res.msg);
      }
    },
    addValue(v1, v2) {
      const A = v1.noSendNum || { num: "", url: "" };
      const B = v1.longTimeSendNum || { num: "", url: "" };
      const C = v1.auditRefundNum || { num: "", url: "" };
      const A1 = {
        num: v2[0].countNum,
        // url: v2[0].url,
        url: '/apps/commodity/product',
      };
      const B1 = {
        num: v2[1].countNum,
        // url: v2[1].url,
        url: '/apps/commodity/product',
      };
      const C1 = {
        num: v2[2].countNum,
        // url: v2[2].url,
        url: '/apps/commodity/product',
      };
      this.manageListV = [
        [A, B, C],
        [A1, B1, C1],
      ];
    },
    mange() {
      const P1 = new Promise(async (resolve, reject) => {
        const res = await post("/order/indexOrderManageCount", {});
        if (res.code == "200") {
          resolve(res.data);
        } else {
          reject(res.msg);
        }
      });
      const P2 = new Promise(async (resolve, reject) => {
        const res = await post("/product/countProductSate", {});
        if (res.code == "200") {
          resolve(res.data);
        } else {
          reject(res.msg);
        }
      });
      Promise.all([P1, P2])
        .then((result) => {
          this.addValue(result[0], result[1]);
        })
        .catch((error) => {
          this.$message.warning(error);
        });
    },
    //店铺查询
    async getStoreInfo() {
      const res = await post("/supplier/getStoreInfo", {});
      if (res.code == "200") {
        const obj = res.data || {};
        let resObj = {
          src: obj.supplierStorePicUrl,
          title: obj.supplierStoreName,
          goStore: obj.url ? obj.url : "",
        };
        this.storeData = resObj;
      } else {
        this.$message.warning(res.msg);
      }
    },
    goStore(url) {
      this.$router.push({ path: url });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
._hover:hover {
  cursor: pointer;
}
._body {
  background-color: #f7f8fa;
  .store {
    display: flex;
    // justify-content: space-between;
    height: 240px;
    background-color: #fff;
    padding: 0px;
    background: url("../../assets/imgs/index-top-bg.png");
    background-size: 100% 240px;
    ._left {
      display: flex;
      ._img {
        width: 100px;
        height: 89px;
        margin: 38px 22px 0px 19px;
        border-radius: 8px;
        .spaceImg {
          width: 100%;
          height: 100%;
          background-color: #f5f7fa;
          font-size: 14px;
          color: #c0c4cc;
          text-align: center;
          line-height: 70px;
        }
      }
      ._title {
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        margin-top: 38px;
        margin-bottom: 17px;
      }
    }
    ._right {
      margin-left: 30px;
      color: #ffffff;
      ._title {
        margin-top: 38px;
        font-size: 18px;
        font-weight: 500;
      }
      .body {
        display: flex;
        ._item {
          height: 124px;
          border-radius: 4px;
          padding: 12px;
          ._icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 18px;
            margin-bottom: 4px;
          }
          ._lable {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
          }
          ._num {
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            margin-top: 12px;
            text-align: center;
          }
          ._icon {
            text-align: right;
          }
        }
      }
    }
  }
  ._m {
    display: flex;
    justify-content: space-between;
    margin: 0 15px;
    margin-top: -15px;
    ._manage {
      width: 49%;
      height: 140px;
      background: linear-gradient(314deg, #e1ecff 0%, #f9fbff 100%);
      padding: 16px;
      margin-bottom: 16px;
      .line {
        ._t {
          display: flex;
          .change {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #0b1d5f;
            letter-spacing: 2px;
            // width: 15%;
            flex-shrink: 0;
          }
          ._line {
            height: 0.5px;
            border: 1px solid rgba(11, 29, 95, 0.18);
            width: 84%;
            height: 0.5px;
            margin-top: 13px;
            margin-left: 15px;
          }
        }
        ._b {
          display: flex;
          justify-content: space-between;
          .order {
            width: 33%;
            .icon {
              width: 104px;
              height: 77px;
              margin-left: 34px;
              margin-top: 19px;
            }
            .lable {
              margin: 16px 0px 14px 0px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
            .num {
              font-size: 24px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #0b1d5f;
            }
          }
        }
      }
      &:last-child {
        background: linear-gradient(314deg, #fff1e1 0%, #fffbf9 100%);
        .line {
          ._t {
            .change {
              color: #5f320b;
            }
            ._line {
              border: 1px solid rgba(95, 50, 11, 0.18);
            }
          }
          ._b {
            .order {
              .num {
                color: #5f320b;
              }
            }
          }
        }
      }
    }
  }

  .showData {
    background-color: #fff;
    margin: 0 16px;
    margin-bottom: 16px;
    padding: 16px 16px 20px 16px;
    ._t {
      display: flex;
      ._line {
        height: 0.5px;
        border: 0.5px solid #e5e5e5;
        // width: 84%;
        height: 0.5px;
        margin-top: 13px;
        margin-left: 15px;
        width: 100%;
      }
    }
    .datePicker {
      width: 360px !important;
    }
    ._title {
      // width: 10%;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      flex-shrink: 0;
    }
    .top_line {
      margin: 12px 0px 16px 0px;
    }
    .statistics-table {
      float: right;
      margin-top: 12px;
    }
    ._center {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      ._item {
        width: 23%;
        height: 113px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #e5e5e5;
        padding: 12px;
        margin-bottom: 20px;
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(7),
        &:nth-child(8) {
          margin-bottom: 0px;
        }
        ._lable {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          display: flex;
          justify-content: space-between;
        }
        ._num {
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          margin-top: 12px;
        }
        ._icon {
          text-align: right;
        }
      }
    }
    ._flex {
      justify-content: center !important;
      text-align: center;
      ._item {
        width: 30%;
        border: none;
        height: auto;
        padding: 0px;
      }
      ._marginTop {
        margin-top: 14px;
      }
    }
  }
  .rank-list {
    display: flex;
    justify-content: space-between;
    .rank-item {
      width: 33.33%;
      .showData {
        margin: 0 16px !important;
      }
      &:nth-child(1) {
        .showData {
          margin-right: 0 !important;
        }
      }
      &:nth-child(3) {
        .showData {
          margin-left: 0 !important;
        }
      }
    }
    ._table {
      margin-top: 20px;
      ::v-deep .el-table__header-wrapper {
        table thead tr th.el-table__cell {
          background-color: #EBEDF0 !important;
          height: 56px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #323233;
        }
      }
      ::v-deep .el-table__body-wrapper {
        table tbody tr td {
          height: 80px;
          font-size: 14px !important;
          &:nth-child(1) {
            color: #FF5500 !important;
          }
        }
      }
      ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
        background: #FFFAF7;
        font-size: 14px;
        font-weight: 400;
        color: #323233;
      }

    }
  }
  ._padding {
    padding: 16px !important;
  }
}
</style>
