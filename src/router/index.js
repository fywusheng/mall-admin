import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: resolve => require(['../views/redirect/index'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['../views/login/index'], resolve),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: resolve => require(['../views/login/auth-redirect'], resolve),
    hidden: true
  },
  {
    path: '/password-reset',
    component: resolve => require(['../views/system-module/org/administrator/password_reset'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: resolve => require(['../views/error-page/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: resolve => require(['../views/error-page/401'], resolve),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: '/apps/dashboard',
        component: resolve => require(['../views/dashboard/index'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', affix: true }
      }
    ]
  },

  {
    path: '/apps/oss/commerce/commodity',
    component: Layout,
    children: [
      {
        path: 'approval-pending',
        component: resolve => require(['../views/commodity-module/product/approval-pending-list'], resolve),
        name: 'Approval-Pending',
        meta: { title: '商城 / 商品管理 / 商品审核' }
      }
    ]
  },

  {
    path: '/apps/commodity',
    component: Layout,
    children: [
      {
        path: 'brand',
        component: resolve => require(['../views/commodity-module/brand/list'], resolve),
        name: 'Brand',
        meta: { title: '商城 / 商品管理 / 品牌信息' }
      },
      {
        path: 'category',
        component: resolve => require(['../views/commodity-module/category/list'], resolve),
        name: 'Category',
        meta: { title: '商城 / 商品管理 / 基础类目' }
      },
      {
        path: ':id/categoryAttribute',
        component: resolve => require(['../views/commodity-module/category/category-attribute'], resolve),
        name: 'CategoryAttribute',
        meta: { title: '商城 / 商品管理 / 配置类目规格' }
      },
      {
        path: 'attribute',
        component: resolve => require(['../views/commodity-module/attribute/attr-list'], resolve),
        name: 'Attribute',
        meta: { title: '商城 / 预置属性 / 属性管理' }
      },
      {
        path: ':id/attributeVal',
        component: resolve => require(['../views/commodity-module/attribute/attrval-list'], resolve),
        name: 'AttributeVal',
        meta: { title: '商城 / 预置属性 / 属性值管理' }
      },
      {
        path: 'product',
        component: resolve => require(['../views/commodity-module/product/list'], resolve),
        name: 'Product',
        meta: { title: '商城 / 商品管理 / 商品列表' }
      },
      {
        path: 'productAddPage/:id',
        component: resolve => require(['../views/commodity-module/product/product-template'], resolve),
        name: 'ProductAddPage',
        meta: { title: '商城 / 商品管理 / 创建商品' }
      },
      {
        path: ':id/productDetails',
        component: resolve => require(['../views/commodity-module/product/product-details'], resolve),
        name: 'ProductDetails',
        meta: { title: '商城 / 商品管理 / 商品详情' }
      },
      {
        path: '/skuListDetails/:id/:categoryNode',
        component: resolve => require(['../views/commodity-module/product/sku-list'], resolve),
        name: 'SkuListDetails',
        meta: { title: '商城 / 商品管理 / 商品规格' }
      },
      {
        path: 'product-inventory-batchupdate',
        component: resolve => require(['../views/commodity-module/product/inventory-price-list'], resolve),
        name: 'Inventory-Batchupdate',
        meta: { title: '商城 / 商品管理 / 批量库存' }
      },
      {
        path: 'product-price-batchupdate',
        component: resolve => require(['../views/commodity-module/product/inventory-price-list'], resolve),
        name: 'Inventory-Batchupdate1',
        meta: { title: '商城 / 商品管理 / 批量价格' }
      },
      {
        path: ':id/inventoryPriceDetails',
        component: resolve => require(['../views/commodity-module/product/inventory-price-item-list'], resolve),
        name: 'InventoryPriceDetails',
        meta: { title: '商城 / 商品管理 / 价格、库存变更明细' }
      },
      {
        path: 'salescategory',
        component: resolve => require(['../views/commodity-module/salescategory/sales-category-list'], resolve),
        name: 'SalesCategory',
        meta: { title: '商城 / 商品运营 / 运营类目' }
      },
      {
        path: 'salescategory-product/:id',
        component: resolve => require(['../views/commodity-module/salescategory/sales-category-product-list'], resolve),
        name: 'SalesCategoryProduct',
        meta: { title: '商城 / 商品运营 / 运营类目 / 商品列表 ' }
      },
      {
        path: 'salesplanning',
        component: resolve => require(['../views/commodity-module/schedule/list'], resolve),
        name: 'SalesPlanning',
        meta: { title: '商城 / 商品运营 / 卖场排期' }
      },
      {
        path: 'salesplanning-item',
        component: resolve => require(['../views/commodity-module/schedule/list-item'], resolve),
        name: 'SalesPlanningItem',
        meta: { title: '商城 / 商品运营 / 卖场明细' }
      }
    ]
  },

  {
    path: '/apps/marketing/promotion',
    component: Layout,
    children: [
      {
        path: 'activity',
        component: resolve => require(['../views/marketing-module/promotion/promotion-list'], resolve),
        name: 'Activity',
        meta: { title: '商城 / 营销管理 / 优惠券活动' }
      },
      {
        path: 'rules/:id',
        component: resolve => require(['../views/marketing-module/promotion/promotion-rules'], resolve),
        name: 'Rules',
        meta: { title: '商城 / 营销管理 / 促销活动 / 活动规则' }
      },
      {
        path: 'coupon-list',
        component: resolve => require(['../views/marketing-module/coupon/coupon-list'], resolve),
        name: 'Coupon-List',
        meta: { title: '商城 / 营销管理 / 优惠券管理' }
      },
      {
        path: 'coupon-template/:id',
        component: resolve => require(['../views/marketing-module/coupon/coupon-template'], resolve),
        name: 'Coupon-Template',
        meta: { title: '商城 / 营销管理 / 优惠券信息' }
      }
    ]
  },

  {
    path: '/apps/trade/oms',
    component: Layout,
    children: [
      {
        path: 'order',
        component: resolve => require(['../views/trade-module/oms/order-list'], resolve),
        name: 'Order',
        meta: { title: '商城 / 交易管理 / 订单信息' }
      },
      {
        path: 'order-detail/:orderCode',
        component: resolve => require(['../views/trade-module/oms/order-template'], resolve),
        name: 'Order-Detail',
        meta: { title: '商城 / 订单中心 / 订单详情' }
      }
    ]
  },
  {
    path: '/apps/trade/aftersale',
    component: Layout,
    children: [
      {
        path: 'returns-list',
        component: resolve => require(['../views/trade-module/aftersales/returns-list'], resolve),
        name: 'Retruns-List',
        meta: { title: '商城  / 交易管理 / 售后申请' }
      },
      {
        path: 'refund-list',
        component: resolve => require(['../views/trade-module/aftersales/refund-list'], resolve),
        name: 'Refund-List',
        meta: { title: '商城 / 结算管理 / 退款记录' }
      }
    ]
  },

  {
    path: '/apps/finance',
    component: Layout,
    children: [
      {
        path: 'promotion-coupon-list',
        component: resolve => require(['../views/finance-module/promotion/coupon-list'], resolve),
        name: 'Promotion-Coupon-List',
        meta: { title: '商城 / 营销管理 / 优惠审批' }
      },
      {
        path: 'payment-flow-list',
        component: resolve => require(['../views/finance-module/payment/payment-list'], resolve),
        name: 'Payment-Flow-List',
        meta: { title: '商城 / 财务管理 / 交易流水' }
      }
    ]
  },

  {
    path: '/apps/tms',
    component: Layout,
    children: [
      {
        path: 'freight-template',
        component: resolve => require(['../views/tms-module/freight/freight-list'], resolve),
        name: 'Freight-Template',
        meta: { title: '商城 / 物流管理 / 运费模板' }
      },
      {
        path: 'freight-modify-template/:id',
        component: resolve => require(['../views/tms-module/freight/freight-update-template'], resolve),
        name: 'Freight-Modify-Template',
        meta: { title: '商城 / 物流配送 / 修改模板' }
      }
    ]
  },

  {
    path: '/apps/wms/oms',
    component: Layout,
    children: [
      {
        path: 'wms-order',
        component: resolve => require(['../views/wms-module/oms/order-list'], resolve),
        name: 'WMS-Order',
        meta: { title: '商城 / 交易管理 / 仓储发货' }
      }
    ]
  },

  {
    path: '/apps/wms/aftersale',
    component: Layout,
    children: [
      {
        path: 'exchanged-address',
        component: resolve => require(['../views/wms-module/exchanged-address/list'], resolve),
        name: 'Exchanged-Address',
        meta: { title: '商城 / 物流管理 / 退货地址' }
      }
    ]
  },

  {
    path: '/apps/srm/supplier',
    component: Layout,
    children: [
      {
        path: 'supplier-list',
        component: resolve => require(['../views/srm-module/supplier/supplier-list'], resolve),
        name: 'Supplier-List',
        meta: { title: '商城 / 客户管理 / 商家列表' }
      },
      {
        path: 'supplier-edit/:id',
        component: resolve => require(['../views/srm-module/supplier/supplier-edit'], resolve),
        name: 'Supplier-Edit',
        meta: { title: '商城 / 商家中心 / 新增/编辑商家' }
      }
    ]
  },

  {
    path: '/apps/member/user',
    component: Layout,
    children: [
      {
        path: 'profile',
        component: resolve => require(['../views/member-module/profile/list'], resolve),
        name: 'Profile',
        meta: { title: '会员 / 会员管理 / 会员信息' }
      },
      {
        path: 'details/:id',
        component: resolve => require(['../views/member-module/profile/details'], resolve),
        name: 'ProfileDetail',
        meta: { title: '会员 / 会员管理 / 会员详情' }
      }
    ]
  },
  {
    path: '/apps/member',
    component: Layout,
    children: [
      {
        path: 'grade',
        component: resolve => require(['../views/member-module/grade/grade-list'], resolve),
        name: 'Grade',
        meta: { title: '会员 / 会员权益 / 等级权益' }
      }
    ]
  },

  {
    path: '/apps/oss/commerce/mop',
    component: Layout,
    children: [
      {
        path: 'merchant',
        component: resolve => require(['../views/commerce/mop-module/merchant/merchant-list'], resolve),
        name: 'Merchant',
        meta: { title: '商户 / 商户管理 / 商户信息' }
      },
      {
        path: 'account',
        component: resolve => require(['../views/commerce/mop-module/account/user-list'], resolve),
        name: 'Account',
        meta: { title: '商户 / 商户管理 / 商品账号' }
      },
      {
        path: 'permission',
        component: resolve => require(['../views/commerce/mop-module/permission/role-list'], resolve),
        name: 'Permission',
        meta: { title: '商户 / 商户管理 /商户角色' }
      },
      {
        path: 'authorization2MopRole',
        component: resolve => require(['../views/commerce/mop-module/permission/role-permission'], resolve),
        name: 'Authorization2MOPRole',
        meta: { title: '权限管理 / 角色授权' }
      },
    ]
  },


  {
    path: '/apps/system/setting',
    component: Layout,
    children: [
      {
        path: 'dict',
        component: resolve => require(['../views/system-module/setting/dict/list'], resolve),
        name: 'Dictionary',
        meta: { title: '设置 / 系统管理 / 数据字典' }
      },
      {
        path: 'sub-dict',
        component: resolve => require(['../views/system-module/setting/dict/item-list'], resolve),
        name: 'Sub-Dictionary',
        meta: { title: '设置 / 系统管理 / 数据字典' }
      },
      {
        path: 'area',
        component: resolve => require(['../views/system-module/setting/area/list'], resolve),
        name: 'Area',
        meta: { title: '设置 / 系统管理 / 行政区域' }
      }
    ]
  },
  {
    path: '/apps/system/org/',
    component: Layout,
    children: [
      {
        path: 'hierarchy',
        component: resolve => require(['../views/system-module/org/hierarchy/list'], resolve),
        name: 'Hierarchy',
        meta: { title: '设置  / 组织架构' }
      },
      {
        path: 'position',
        component: resolve => require(['../views/system-module/org/position/position-list'], resolve),
        name: 'Position',
        meta: { title: '设置  / 岗位管理' }
      },
      {
        path: 'administrator',
        component: resolve => require(['../views/system-module/org/administrator/list'], resolve),
        name: 'Administrator',
        meta: { title: '设置  / 员工管理' }
      },
      {
        path: 'authorization2User/:id',
        component: resolve => require(['../views/system-module/org/administrator/authrization'], resolve),
        name: 'Authorization2User',
        meta: { title: '设置 / 组织管理 / 用户授权' }
      }
    ]
  },

  {
    path: '/apps/system/permission',
    component: Layout,
    meta: { title: '设置' },
    children: [
      {
        path: 'biz',
        component: resolve => require(['../views/system-module/permission/biz/list'], resolve),
        name: 'BIZ',
        meta: { title: '权限管理 / 角色管理' }
      },
      {
        path: 'role',
        component: resolve => require(['../views/system-module/permission/role/role-list'], resolve),
        name: 'Role',
        meta: { title: '权限管理 / 角色管理' }
      },
      {
        path: 'authorization2Role',
        component: resolve => require(['../views/system-module/permission/role/role-permission'], resolve),
        name: 'Authorization2Role',
        meta: { title: '权限管理 / 角色授权' }
      },
      {
        path: 'menu',
        component: resolve => require(['../views/system-module/permission/menu/list'], resolve),
        name: 'Menu',
        meta: { title: '权限管理 / 功能菜单' }
      }
    ]
  },
  {
    path: '/apps/topic',
    component: Layout,
    meta: { title: '专题' },
    children: [
      {
        path: 'list',
        component: resolve => require(['../views/topic-module/topic/index'], resolve),
        name: 'TopicList'
      },
      {
        name: 'topicEditor',
        path: 'edit/:id',
        component: resolve => require(['../views/topic-module/topic/editor/index'], resolve),
        meta: { title: '编辑', affix: true }
      },
      {
        name: 'topicPcEditor',
        path: 'pcEdit/:id',
        component: resolve => require(['../views/topic-module/topic/pc-editor/index'], resolve),
        meta: { title: '编辑', affix: true }
      }
    ]
  },
  {
    path: '/apps/operation',
    component: Layout,
    meta: { title: '运营位' },
    children: [{
      name: 'Operation',
      path: 'index',
      component: resolve => require(['../views/topic-module/operation/OperatePositionTable'], resolve),
    },
    {
      name: 'OperationContent',
      path: 'content',
      component: resolve => require(['../views/topic-module/operation/OperateContentTable'], resolve),
    }]
  },
  {
    path: '/apps/shop/',
    component: Layout,
    children: [{
      name: 'Set',
      path: 'set',
      meta: { title: '商城 / 店铺管理 / 店铺设置' },
      component: resolve => require(['../views/shop-module/shop/shop-seting'], resolve),

    }]
  },
  {
    path: '/apps/store/',
    component: Layout,
    children: [{
      name: 'StoreList',
      path: 'storeList',
      meta: { title: '商城 / 店铺管理 / 门店管理' },
      component: resolve => require(['../views/shop-module/store/store-manage'], resolve),
    },
    {
      path: 'storeAddPage/:id',
      component: resolve => require(['../views/shop-module/store/store-add'], resolve),
      name: 'StoreAddPage',
      meta: { title: '商城 / 店铺管理 / 新增门店' }
    }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
