<template>
  <div>
    <el-upload
      :class="{uoloadSty: showBtnImg,disUoloadSty:noneBtnImg}"
      :multiple="limit>1"
      :limit="limit"
      :accept="accept"
      :action="uploadPath"
      :data="qiniuData"
      :file-list="imgList"
      list-type="picture-card"
      :on-success="uploadPicUrl"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
      :on-remove="handleRemove"
    ><i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import fileUtil from '@/utils/fileUtils'
import axios from 'axios'
export default {
  name: 'Upload',
  props: {
    accept: {
      default: '.jpg, .jpeg, .png, .gif',
      type: String
    },
    limit: {
      // 允许上传的最大张数
      default: 1,
      type: Number
    },
    title: {
      // 上传标题
      default: '图片',
      type: String
    },
    desc: {
      default: '',
      type: String
    },
    fit: {
      default: 'cover',
      type: String
    },
    imgList: {
      type: Array,
      default() {
        return []
      }
    },
    scopeIndex: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      showBtnImg: true,
      noneBtnImg: false,
      dialogVisible: false,
      dialogImageUrl: '',
      domain: this.GLOBAL.cnameUrl,
      uploadPath: this.GLOBAL.qiniuUrl, // process.env.VUE_APP_BASE_API + '/api/v1/qiniu/token',
      qiniuData: {
        token: ''
        // key: ''
      }
    }
  },
  // computed: {
  //   headers() {
  //     return {
  //       Authorization2: this.getToken()
  //     }
  //   }
  // },
  created() {
    this.noneBtnImg = this.imgList.length >= this.limit
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getToken() { // 上传之前获取 token
      var url1 = process.env.VUE_APP_BASE_API + 'api/v1/qiniu/token'
      return new Promise((resolve, reject) => {
        axios.get(url1)
          .then(response => {
          // 获取 token
            this.qiniuData.token = response.data.data
            resolve(true)
          })
      })
    },
    uploadPicUrl(response, file, fileList) {
      var that = this
      if (fileList > this.limit) {
        this.$message({
          type: 'error',
          message: '超出最大张数限制'
        })
      }
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].response.hash) {
          fileList[i].link = `${this.domain}/${fileList[i].response.hash}`
          fileList[i].url = `${this.domain}/${fileList[i].response.hash}`
          that.imgList.push(fileList[i])
        }
      }
      console.log(that.imgList)
      that.$emit('success', this.imgList)
      this.noneBtnImg = fileList.length >= this.limit
    },
    handleRemove(file, fileList) {
      this.noneBtnImg = fileList.length >= this.limit
      for (var i = 0; i < this.imgList.length; i++) {
        if (file.uid === this.imgList[i].uid) {
          this.imgList.splice(i, 1)
        }
      }
      this.$emit('success', this.imgList)
    },
    onExceed() {
      if (this.imgList.length >= this.limit) {
        this.$message({
          type: 'error',
          message: '超出最大张数限制'
        })
      }
    },
    async beforeUpload(file) {
      if (this.imgList.length >= this.limit) {
        this.$message({
          type: 'error',
          message: '超出最大张数限制'
        })
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('超出最大限制大小')
        return false
      } else {
        const token = await this.getToken()
        if (!token) return this.$message.error('上传有误，请重新上传')
        return new Promise((resolve, reject) => {
          fileUtil.getOrientation(file).then(orient => {
            if (orient && orient === 6) {
              const reader = new FileReader()
              const img = new Image()
              reader.onload = e => {
                img.src = e.target.result
                img.onload = function() {
                  const data = fileUtil.rotateImage(img, img.width, img.height)
                  const newFile = fileUtil.dataURLtoFile(data, file.name)
                  resolve(newFile)
                }
              }
              reader.readAsDataURL(file)
            } else {
              resolve(file)
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: #666;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  height: 50px;
  width: 50px;
}
/deep/.el-upload--picture-card {
  height: 50px;
  width: 50px;
  line-height: 60px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-actions {
  font-size: 12px;
}

</style>
<style>
.env-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.disUoloadSty .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
</style>
