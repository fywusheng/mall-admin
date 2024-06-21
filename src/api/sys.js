import request from '@/utils/request'
import requestUpload, {BlobHttpService} from '@/utils/http-nepsp'
// import HttpService from '@/utils/http-client'
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
    url: '/cms/iep/web/cms/imgUpload',
    method: 'post',
    data
  })
}

// 文件上传
// 图片文件上传，特殊处理，直接代理到 生产地址
export function clientFileUpload(formData) {
  return new Promise((resolve, reject) => {
    BlobHttpService.post('/cms/iep/web/cms/singleFileUpload', formData).then(response => {
      resolve(response.data);
    }, err => {
      reject(err)
    })
  })
  // return uploadFile('/cms/iep/web/cms/singleFileUpload', formData)
}

export function getPermissionTree(data){
  return request({
      url: 'permission/getPermissionTree',
      method: 'get',
      data
    })
}
