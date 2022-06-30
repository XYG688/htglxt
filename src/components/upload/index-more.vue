<template>
  <div id="app">
    <template>
      <!-- 多张(multiple) -->
      <ele-upload-image
        v-model="images"
        multiple
        :response-fn="handleResponse"
        action="https://jsonplaceholder.typicode.com/posts/"
      />
    </template>
  </div>
</template>
<script>
import EleUploadImage from 'vue-ele-upload-image'

export default {
  components: {
    EleUploadImage
  },
  data() {
    return {
      images: ''
    }
  },
  methods: {
    handleResponse(response, file, fileList) {
      console.log(response)
      // 根据响应结果, 设置 URL
      return 'https://xxx.xxx.com/image/' + response.id
    }
  }
}

</script>
