import Vue from 'vue';
import {Upload} from 'element-ui';
import { clientUpload, clientFileUpload } from '@/api/sys'

let _handleStart = Upload.methods.handleStart;
let _uploader = Upload.components.Upload

// let _ajax = _uploader.props.httpRequest.default

_uploader.props.httpRequest.default = async function (options) {
  console.log('1111', options)
  // const onSuccess = options.onSuccess;
  // options.onSuccess = function(result){
  //   if(result.code){
  //     result.code = parseInt(result.code);
  //     onSuccess(result)
  //   }
  // }
  const fileName = options.file.name
  const fileExt =  fileName.split('.').pop()

  if ( !['jpg','jpeg','png'].includes(fileExt)) {
    // 文件上传
    const formData = new FormData()
    formData.append('file', options.file)
    formData.append('fileName', fileName)
    formData.append('fileExt', fileExt)
    const result = await clientFileUpload(formData)
    if (result.code == 0) {
      options.onSuccess(result)
    }else{
      options.onError(result)
    }
  } else {
    // 图片上传
    const base64String = await _uploader.getBase64(options.file)
    const result = await clientUpload({
      base64String: base64String.split(',')[1],
      imageName: Date.now() + '.' + fileName,
      imageExt: fileExt
      })
      // console.log(result)
    if (result.data.code == 0) {
      options.onSuccess(result.data)
    }else{
      options.onError(result.data)
    }
  }
  
 
}

_uploader.getBase64 =function (file) {
  return new Promise(function(resolve, reject) {
      let reader = new FileReader();
      let imgResult = "";
      reader.readAsDataURL(file);
      reader.onload = function() {
          imgResult = reader.result;
      };
      reader.onerror = function(error) {
          reject(error);
      };
      reader.onloadend = function() {
          resolve(imgResult);
      };
  });
}


export default function () {
  Vue.component(Upload.name, {
    props: {
      action: {
        required: false,
        default() {
          return process.env.VUE_APP_UPLOAD_BASE_API || ''
        }
      },
      // 图片上传大小限制(默认5M)
      maxSize: {
        type: Number,
        default: 100
      }
    },
    methods: {
      handleStart(rawFile) {
        // if (this.maxSize && rawFile.size > this.maxSize * 1024 * 1024) {
        //   if (this.$message) {
        //     this.$message({
        //       message: `图片不能超过 ${this.maxSize} M`,
        //       type: 'warning'
        //     })
        //   } else {
        //     console.log(`图片不能超过${this.maxSize}M`);
        //   }
        //   return;
        // }
        _handleStart.call(this, rawFile);
      }
    },
    extends: Upload
  })
}
