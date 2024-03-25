import request from '@/utils/request'
import requestUpload from '@/utils/request-upload'
import Qs from 'qs'

export function fetchMenuList(params) {
  return request({
    url: '/authority/getPermissionByBizCode',
    method: 'get',
    params
  })
}

export function bizList() {
  return request({
    url: '/biz/list.active',
    method: 'get',
  })
}



export function getUserInfo() {
  // return request({
  //   url: '/admin/sys-user/myInfo',
  //   method: 'get',
  // })
  return {
    "code":200,
    "data":{},
    "msg":"",
    "timestamp":"1586167527103"
  }
}

export function login(data) {
  return request({
    url: '/authority/login',
    method: 'post',
    data
  })
}

export function getAll() {
  // return request({
  //   url: 'admin/sys-user/listAll',
  //   method: 'get',
  // })
  return {
    "code":200,
    "data":"",
    "msg":"",
    "timestamp":"1586167641994"
  }
}

export function resetPassword(data) {
  // return request({
  //   url: 'admin/sys-user/resetPassword',
  //   method: 'post',
  //   data
  // })
  return {
    "code":200,
    "data":"",
    "msg":"",
    "timestamp":"1586167641994"
  }
}

// 图片上传
// 图片文件上传，特殊处理，直接代理到 生产地址
export function clientUpload(data) {
  return requestUpload({
    // url: '/nepsp-api/cms/iep/web/cms/imgUpload',
    url: '/nepsp-api/cms/iep/web/cms/imgUpload',
    method: 'post',
    data
  })
}

// 文件上传
// 图片文件上传，特殊处理，直接代理到 生产地址
export function clientFileUpload(formData) {
  return requestUpload({
    // url: '/nepsp-api/cms/iep/web/cms/singleFileUpload',
    url: '/nepsp-api/cms/iep/web/cms/singleFileUpload',
    method: 'post',
    data: formData
  })
}

export function getPermissionTree(data){
  return request({
      url: 'permission/getPermissionTree',
      method: 'get',
      data
    })
}
