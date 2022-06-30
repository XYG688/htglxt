<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click="toUpdateImgs">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <PictureUploadQns
        :disabled="sortSkus"
        equipment="pc"
        :width="100"
        file-id="detailupload"
        :border-radius="5"
        :max-num:="maxNum"
        :max-size="maxSize"
        :pic-listimg="picLists"
        max-num="20"
      />
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>
<script>
import PictureUploadQns from '@/components/upload/picture-upload-qns'
export default {
  name: 'Upload',
  components: {
    PictureUploadQns
  },
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      sortSkus: false,
      picLists: [],
      url: this.GLOBAL.qiniuUrl,
      domain: this.GLOBAL.cnameUrl,
      tokenUrl: process.env.VUE_APP_BASE_API + '/api/v1/qiniu/token', // 'http://127.0.0.1:8082/api/v1/qiniu/token',
      maxNum: 20,
      maxSize: 1024 * 1024 * 2,
      allowType: 'jpeg/jpg/png',
      listObj: {},
      showBtnImg: true,
      noneBtnImg: false,
      dialogVisible: false,
      // imgList: [],
      dialogImageUrl: '',
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
    this.picLists = []
  },
  methods: {
    toUpdateImgs() {
      this.dialogVisible = true
      this.picLists = []
    },
    handleSubmit() {
      console.log(this.picLists)
      var arr = this.picLists
      for (var i = 0; i < arr.length; i++) {
        if (!arr[i].load) {
          this.$message('请等待所有图片上传成功!')
          return false
        }
      }
      this.$emit('successCBK', arr)

      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    ::v-deep .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
