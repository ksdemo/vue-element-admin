<template>
  <div class="iu_container">
    <input class="iu_file" type="file" ref="file" @change="handleFileChange">
    <label class="iu_label" v-if="label" :style="{width : labelWidth}" >{{label}}</label>
    <div class="iu_box" ref="wrap" @click="handleClickBox" >
      <img :src="imgsrc" alt="" class="iu_image" @load.native="revokeImg" >
    </div>
  </div>
</template>

<script>
import {imgReader} from '../common/image.js'
import {createObjectURL, revokeObjectURL, base64ToBlob} from '../common/transcode.js'

export default {
  name: 'ImageUpload',
  data() {
    return {
      imgsrc: '',
      initOnce: true
    }
  },
  mounted() {
    this.imgsrc = this.defaultImg
    
  },
  methods: {
    handleFileChange(){
      var vm = this;
      var file = vm.$refs.file.files[0]
      console.log(typeof vm.imgsrc)
      imgReader( file ,{}, function(base64){
        var blob = base64ToBlob(base64)
        vm.imgsrc = createObjectURL(blob);
        console.log(vm.imgsrc)
        console.log(vm.imgsrc.toString())
      })
    },
    handleClickBox(){
      console.log(this.$refs.file)
      this.$refs.file.click();
    },
    revokeImg(){
      if(false){
        revokeObjectURL(this.imgsrc);
      }
    }

  },
  props: {
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object
    },
    label: {
      type: String,
      default: ''
    },
    labelWidth:{
      type: String,
      default: '6em'
    },

    defaultImg: {
      default: false
    }
  }
}
</script>

<style>
    .iu_container{
      display:flex;
    }
    .iu_box {
        flex: 1;
        border: 2px solid #E5E5E5;
        font-family: 'Roboto', sans-serif;
        color: #777;
        transition: background-color .2s linear;
        padding: 5px;
        min-height: 150px;
    }
    
    .iu_box:hover {
        background-color: #F6F6F6;
    }

    i {
        color: #CCC;
    }

    .iu_box .iu_image_box img {
        width: 100%;
        height: 100%;
    }

    .iu_file {
        display: none;
    }

    .dropzone .dz-preview:hover .dz-image img {
        transform: none;
        -webkit-filter: none;
        width: 100%;
        height: 100%;
    }

    .iu_details {
        bottom: 0px;
        top: 0px;
        color: white;
        background-color: rgba(33, 150, 243, 0.8);
        transition: opacity .2s linear;
        text-align: left;
    }
    .iu-size{
      margin-bottom: 3em;
    }

    .dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
        border: none;
    }

    .dropzone .dz-preview .dz-details .dz-filename:hover span {
        background-color: transparent;
        border: none;
    }

    .dropzone .dz-preview .dz-remove {
        position: absolute;
        z-index: 30;
        color: white;
        margin-left: 15px;
        padding: 10px;
        top: inherit;
        bottom: 15px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 1.1px;
        opacity: 0;
    }

    .dropzone .dz-preview:hover .dz-remove {
        opacity: 1;
    }

    .dz-error-mark {
        margin-left: -40px;
        margin-top: -50px;
    }

    .dz-error-mark i {
        color: white;
        font-size: 5rem;
    }

</style>
