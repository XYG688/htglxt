<template>
  <div>
    <el-upload
      :class="{uoloadSty: showBtnImg,disUoloadSty:noneBtnImg}"
      :multiple="limit>1"
      :limit="limit"
      :accept="accept"
      :headers="headers"
      :action="uploadPath"
      :data="qiniuData"
      :file-list="imgList"
      :on-success="uploadPicUrl"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
      :on-remove="handleRemove"
    >
      <!-- <i class="el-icon-plus" /> -->
      <el-button class="el-icon-plus"> 上传视频</el-button>
      <div slot="tip" class="el-upload__tip">只能上传视频件，且不超过100M</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" destroy-on-close>
      <!-- <img width="100%" :src="dialogImageUrl" alt=""> -->
      <video v-if="imgList&&imgList[0]" style="width:100%;height:300px" :src="imgList[0].link" />
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Upload',
  props: {
    accept: {
      default: 'video/*',
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
      url: this.GLOBAL.qiniuUrl,
      domain: this.GLOBAL.cnameUrl,
      tokenUrl: process.env.VUE_APP_BASE_API + '/api/v1/qiniu/token', // 'http://127.0.0.1:8082/api/v1/qiniu/token',
      uploadPath: this.GLOBAL.qiniuUrl, // process.env.VUE_APP_BASE_API + '/api/v1/qiniu/token',
      qiniuData: {}
    }
  },
  computed: {
    headers() {
      return {
        token: this.getToken()
      }
    }
  },
  created() {
    this.noneBtnImg = this.imgList.length >= this.limit
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    getToken() { // 上传之前获取 token
      return new Promise((resolve, reject) => {
        axios.get(this.tokenUrl)
          .then(response => {
          // 获取 token
            console.log(response.data)
            if (response.data.code === 0) {
              var token = response.data
              console.log(token.data)
              resolve(token.data)
            } else {
              reject(response.status)
            }
          })
      })
    },
    // durations(link) {
    //   var videoElement = document.createElement('video')
    //   videoElement.src = link
    //   console.log(videoElement.duration)

    //   return videoElement.duration
    // },
    async uploadPicUrl(response, file, fileList) {
      this.noneBtnImg = fileList.length >= this.limit
      if (response.hash) {
        response.link = `${this.domain}/${response.hash}`
        response.url = `${this.domain}/${response.hash}`
        response.name = `${file.name}`
        response.size = `${file.size}`
        response.duration = await this.checkSize(file)
        console.log(response.duration, 'response.duration')
        if (response.duration > 0) {
          this.imgList.push(response)
          this.$emit('success', this.imgList)
        } else {
          this.handleRemove(file, fileList)
          // this.$message('上传成功,视频时长获取失败')
        }
      }
    },
    gettime(video, size) {
      const promise = new Promise(resolve => {

      })
      return promise
    },
    checkSize(files, size) {
      return new Promise((resolove, reject) => {
        const video = document.createElement('video')
        video.src = `${this.domain}/${files.response.hash}`
        var duration = 0
        video.addEventListener('canplaythrough', e => {
          duration = e.target.duration
          resolove(duration)
        })
        video.addEventListener('error', function(e) {
          reject(duration)
        })
      })
    },
    handleRemove(file, fileList) {
      this.noneBtnImg = fileList.length >= this.limit
      var fileHash = file.hash
      const index = this.imgList.indexOf(fileHash)
      this.imgList.splice(index, 1)
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
    async beforeUpload(file,fileList) {
      if (this.imgList.length >= this.limit) {
        this.$message({
          type: 'error',
          message: '超出最大张数限制'
        })
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('超出最大限制大小,视频最大上传100M')
        fileList.forEach((item, index) => {
          if (file.uid === item.uid) {
            fileList.splice(index, 1)
          }
        })
        return false
      } else {
        this.qiniuData = {
          token: await this.getToken()
        }
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
