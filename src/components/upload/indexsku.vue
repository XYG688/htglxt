<template>
  <ele-upload-image
    v-model="image[0]"
    :size="sizeProp"
    action="https://jsonplaceholder.typicode.com/posts/"
    :response-fn="handleResponse"
  />
</template>
<script>
import EleUploadImage from 'vue-ele-upload-image'

export default {
  components: {
    EleUploadImage
  },
  props: {
    sizeProp: {
      default: 60,
      type: [Number, String]
    },
    image: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  methods: {
    handleResponse(response, file, fileList) {
      console.log(response.id)
      // 根据响应结果, 设置 URL
      this.$emit('handerUrlImg', response.id)
      return 'https://xxx.xxx.com/image/' + response.id
    }
  }
}
</script>
