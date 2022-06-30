<!--suppress ALL -->
<template>
  <div class="flex">   //直接隐藏掉就好了，用功能不用样式
    <span>商品详细说明：</span>
    <el-upload
      v-show="false"
      id="quill-upload"
      :action="serverUrl"
      multiple
      list-type="picture"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-error="uploadError"
      :on-success="handleExceed"
    >
      <el-button size="small" type="primary"></el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-row v-loading="uillUpdateImg">
      <quill-editor v-model="saveModel.remark" :options="editorOption" ref="myQuillEditor"></quill-editor>
    </el-row>
  </div>
</template>

<script>
  import { quillEditor } from "vue-quill-editor";
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  export default {
    data() {
      return {
        dialogVisible: false,
        uillUpdateImg: false, //根据图片上传状态来确定是否显示loading动画
        imgUrl: "http://lottery.gobuywin.com",  //  上传图片后路径的前缀
        serverUrl: "http://lottery.gobuywin.com/lottery/file/upload", //上传的图片服务器地址
        remark: "", //富文本内容
        editorOption: {
          //符文本编辑器的配置
          placeholder: "",
          theme: "snow",
          modules: {
            toolbar: {
              container: [
                // 工具栏配置, 默认是全部
                ["bold"],
                ["italic"],
                ["underline"],
                ["strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote"],
                ["code-block"],
                ["link"],
                ["image"],
                [{ list: "ordered" }, { list: "bullet" }]
              ],
              handlers: {
                image: function(value) {
                  if (value) {
                    // 给个点击触发Element-ui，input框选择图片文件
                    document.querySelector("#quill-upload input").click();
                  } else {
                    this.quill.format("image", false);
                  }
                }
              }
            }
          }
        }
      }
    },
    methods: {//   上传图片部分
      beforeUpload() {
        //上传图片之前开启loading
        this.uillUpdateImg = true;
      },
      uploadError() {
        //图片上传失败,关闭loading
        this.uillUpdateImg = false;
        this.$message.error("图片插入失败");
      },
      handleExceed(response, file, fileList) {
        //图片添加成功
        let quill = this.$refs.myQuillEditor.quill;
        if (response.result == "success") {
          let length = quill.getSelection().index;
          // 插入图片 response.data.url为服务器返回的图片地址
          quill.insertEmbed(length, "image", this.imgUrl + response.msg);
          // 调整光标到最后
          quill.setSelection(length + 1);
        } else {
          this.$message.error("图片插入失败");
        }
        this.uillUpdateImg = false;
      },
    }
  }
</script>

<style scoped>

</style>
