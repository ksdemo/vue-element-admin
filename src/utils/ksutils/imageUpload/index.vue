<template>
  <div class="iu_box"  :style="{width: boxWidth}">
    <input class="iu_file" type="file" ref="file" @change="handleFileChange">
    <label class="iu_label" v-if="label" :style="{width : labelWidth}" >{{label}}</label>
    <div class="iu_preview" ref="wrap" @click="handleClickBox" @drop="handleDropBox" @dragover.prevent >
      <div v-if="imgsrc" class="iu_imgwrap" :style="{width: imgWidth}">
        <img :src="imgsrc" alt="" class="iu_img" @load="revokeImg" >
        <div class="iu_details" :class="temporary?'temporary': ''">
          <div class="iu_size">
            <span><strong>{{result.size | sizeFilter}}</strong></span>
          </div>
          <div class="iu_progress">
            <span class="iu_progress_inside" style="width: 100%;">
            </span>
          </div>
          <div class="iu_uploadtips">
            <span>{{uploadTips}}</span>
          </div>
          <a href="javascript:;" @click="handleCancel" class="iu_remove">{{cancelTips}}</a>
        </div>
      </div>
      <div v-else class="iu_noimg">{{noimgTips}}</div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {imgReader} from '../common/image.js'
import {createObjectURL, revokeObjectURL, base64ToBlob} from '../common/transcode.js'
import { request} from '../common/request.js'
function pxToNum(n){
  var s = n.match(/^(\d+)px$/)
  if(s){
    return s[1]-0
  }else{
    return undefined
  }
}

export default {
  name: 'ImageUpload',
  data() {
    return {
      imgsrc: '',
      result: {
        base64: '',
        width: '',
        height: '',
        str: '',
        mime: '',
        suffix: '',
        size: 0
      },
      temporary: false,
      noimgTips: '上传图片',
      isUploading: false,
      uploadTips: '上传中',
      cancelTips: '取消',
      initOnce: true
    }
  },
  filters: {
    sizeFilter(size) {
      size = size - 0
      if(!size){
        return ''
      }else if( size < 1e3){
        return size + ' B'
      }else if ( size < 1e6){
        return (size/1e3).toFixed(2) + ' KB' 
      }else{
        return (size/1e6).toFixed(2)+ ' MB'
      }
    },

  },
  mounted() {
    this.imgsrc = this.defaultImg
  },
  methods: {
    handleFileChange(){
      var file = this.$refs.file.files[0]
      this.readFile(file)
    },
    handleClickBox(){
      this.$refs.file.click();
    },
    handleDropBox(e){
      e.preventDefault();
      var file = e.dataTransfer.files[0]
      this.readFile(file)
    },
    handleCancel(e){
      this.imgsrc = '';
      this.$refs.file.value = '';
      e.cancelBubble = true;
    },
    revokeImg(){
      if(/blob/.test(this.imgsrc)){
        revokeObjectURL(this.imgsrc);
      }
    },
    readFile(file){
      var vm = this;
      imgReader( file ,{
        width: pxToNum(vm.imgWidth),
        height: pxToNum(vm.imgHeight),
      }, function(result){
        vm.readSuccess(result)
      })
    },
    readSuccess(result){
      console.log(result)
      this.result = result;
      var blob = base64ToBlob(result.base64)
      this.imgsrc = createObjectURL(blob);
      this.isUploading = true;
      this.uploadTips = '上传中...';
      this.cancelTips = '取消上传'
      this.uploadImg()
    },
    uploadSuccess(res){
      this.isUploading = false;
      this.uploadTips = '上传成功';
      this.cancelTips = '删除'
      this.temporary = true
      setTimeout(()=>{
        this.temporary = false
      },1000)
    },
    uploadFailed(res){
      this.isUploading = false;
      this.uploadTips = '上传失败';
      this.cancelTips = '删除'
      setTimeout(()=>{
        this.temporary = false
      },1000)
    },
    uploadImg(){
      var vm = this
      var url = this.url;
      var data = {
        'imageBase64': this.result.str,
        'suffix': this.result.suffix,
      }
      var params = this.params
      if(params){
        for(var key in params){
          if(params.hasOwnProperty(key) && params[key] !== undefined){
              data[key] = params[key]
            }
        }
      };
      request({
        url,
        data,
        dataType: 'formData',
        method: 'POST',
        headers:{
          Authorization: 'Bearer ' + getToken()
        }
      })
      .then((res) =>{
        vm.uploadSuccess(res)
      })
      .catch((res) =>{
        vm.uploadFailed(res)
      })
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
    boxWidth:{
      type: String,
      default: '100%'
    },
    imgWidth:{
      type: String,
      default: 'auto'
    },
    imgHeight:{
      type: String,
      default: 'auto'
    },
    defaultImg: {
      default: false
    }
  }
}
</script>

<style>
    .iu_box{
      display:flex;
      box-sizing: border-box;
    }
    .iu_box *{
      box-sizing: border-box;
    }
    .iu_preview {
        flex: 1;
        border: 2px solid #E5E5E5;
        font-family: 'Roboto', sans-serif;
        color: #777;
        transition: background-color .2s linear;
        padding: 5px;
        min-height: 150px;
        position: relative;
    }
    
    .iu_preview:hover {
        background-color: #F6F6F6;
    }

    .iu_file {
        display: none;
    }
    
    .iu_noimg{
      text-align: center;
      color: #CCC;
      margin: 3em 0 2em 0;
    }

    .iu_imgwrap{
      position: relative;
    }

    img.iu_img {
        transform: none;
        -webkit-filter: none;
        max-width: 100%;
    }

    .iu_preview:hover .iu_details {
        opacity: 1;
    }
    .iu_details.temporary{
        opacity: 1;
    }
    .iu_details {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right:0;
      color: white;
      background-color: rgba(33, 150, 243, 0.8);
      transition: opacity .2s linear;
      text-align: left;
      z-index: 20;
      opacity: 0;
      font-size: 13px;
      padding: 2em 1em;
      line-height: 150%;
    }
    .iu_size{
      font-size: 16px;
      margin-bottom: 3em;
    }
    .iu_uploadtips{
      pointer-events: none;
      z-index: 500;
      position: absolute;
      display: block;
      top: 50%;
      left: 50%;
      margin-left: -40px;
      margin-top: -40px;
      font-size: 30px;
    }
    .iu_remove {
      position: absolute;
      z-index: 30;
      color: white;
      margin-left: 15px;
      padding: 10px;
      bottom: 15px;
      border: 2px white solid;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 1.1px;
    }

    .dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
        border: none;
    }

    .dropzone .dz-preview .dz-details .dz-filename:hover span {
        background-color: transparent;
        border: none;
    }





</style>
