<template>
  <div class="app-container">
    123123
  <image-upload label-width="6em" label="测试" url="https://httpbin.org/post" :params="{'type' : 11}" :defaultImg="backImg" ></image-upload>
  </div>
</template>

<script>
import ImageUpload from '@/utils/ksutils/imageUpload/index.vue'

export default {
  data() {
    return {
      "backImg": "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=477576474,3698736735&fm=173&s=03E6DC054440F75156B8518E0300C091&w=600&h=431&img.JPEG"
    }
  },
  components: { ImageUpload },
  methods: {
    
  }
}
</script>
