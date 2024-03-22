<template>
    <div class="y-editor">
        <div style="border: 1px solid #ccc;">
              <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editor"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
              />
              <Editor
                  style="height: 500px; overflow-y: hidden;"
                  v-model="html"
                  :defaultConfig="editorConfig"
                  :mode="mode"
                  @onCreated="onCreated"
                  @onChange="onChange"
              />
        </div>
    </div>
</template>
<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import "@wangeditor/editor/dist/css/style.css"
import { clientUpload } from "@/api/sys.js"
export default {
  name: "y-editor",
  components: {Editor, Toolbar},
  props: {
    value: {
      type: String,
      default: ""
    },
    // 工具栏配置
    toolbarConfig: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      editor: null,
      editorConfig: {
        placeholder: "请输入内容...",
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          "uploadImage": {
            customUpload: this.customUpload
          }
        }
      },
      html: this.value|| ""
    }
  },
  watch: {
    value(value) {
      this.html = value 
    }
  },
  methods: {
    // 上传图片，返回结果，将图片插入到编辑器中
    async customUpload(file, insertImgFn) {
      console.log("上传成功", file, this)
      const fileName = file.name
      const fileExt = fileName.split(".").pop()
      const base64String = await this.getBase64(file)
      const result = await clientUpload({
        base64String: base64String.split(",")[1],
        imageName: Date.now() + "." + fileName,
        imageExt: fileExt
      })
      if (result.code == 0) {
        const url = result.data.absoluteUrl
        insertImgFn(url, "", url)
      } else {
        this.$emit("on-error")
      }
                
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ""
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错

      const editorConfig = { MENU_CONF: {} }
      editorConfig.MENU_CONF["uploadImage"] = {
        server: "/api/upload-img", // 上传图片地址
        timeout: 5 * 1000, // 5s
        fieldName: "custom-fileName",
        meta: { token: "xxx", a: 100 },
        metaWithUrl: true, // 参数拼接到 url 上
        headers: { Accept: "text/x-json" },

        maxFileSize: 10 * 1024 * 1024, // 10M

        base64LimitSize: 5 * 1024, // 5kb 以下插入 base64

        onBeforeUpload(files) {
          console.log("onBeforeUpload", files)

          return files // 返回哪些文件可以上传
        // return false 会阻止上传
        }
      }
    },
    onChange(editor) {
      this.$emit("input", editor.getHtml())
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) { return }
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>
