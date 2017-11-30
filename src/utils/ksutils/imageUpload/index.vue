<template>
  <div class="iu_box"  :style="{width: boxWidth}">
    <input class="iu_file" type="file" ref="file" @change="handleFileChange">
    <label class="iu_label" v-if="label" :style="{width : labelWidth}" >{{label}}</label>
    <div class="iu_preview" ref="wrap" @click="handleClickBox" @drop="handleDropBox" @dragover.prevent >
      <div v-if="imgsrc" class="iu_imgwrap" :style="{width: imgWidth}">
        <img :src="imgsrc" alt="" class="iu_img" @load="revokeImg" >
        <div class="iu_details">
          <div class="iu_size">
            <span><strong>{{result.size | sizeFilter}}</strong></span>
          </div>
          <div class="iu_filename">
            <span><strong>{{result.filename}}</strong></span>
          </div>
          <div class="iu_uploadstate">
            <span>{{uploadstate}}</span>
          </div>
          <a href="javascript:;" @click="handleCancel" class="iu_remove">{{cancelTips}}</a>
        </div>
        <div class="iu_progress" v-show="showProgress">
          <span class="iu_progressbar" :style="{width: progressWidth}">
          </span>
        </div>
        <div class="iu_successmark" v-show="showSMark">
          <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <!-- Generator: Sketch 3.2.1 (9971) - http://www.bohemiancoding.com/sketch -->
            <title>Check</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
            </g>
          </svg>
        </div>
        <div class="iu_errormark" v-show="showEMark">
          <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
              <!-- Generator: Sketch 3.2.1 (9971) - http://www.bohemiancoding.com/sketch -->
              <title>error</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                  <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
                      <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>
                  </g>
              </g>
          </svg>
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
import { ajax, clearXhrEvent } from '../common/request.js'

function pxToNum(n){
  var s = n.match(/^(\d+)px$/)
  if(s){
    return s[1]-0
  }else{
    return undefined
  }
}

function cloneJSON(json){
  return JSON.parse(JSON.stringify(json))
}
var defaultResult = {
  base64: '',
  width: '',
  height: '',
  str: '',
  mime: '',
  suffix: '',
  filename: '',
  size: 0
}

export default {
  name: 'ImageUpload',
  data() {
    return {
      imgsrc: '',
      xhr: {},
      result: cloneJSON(defaultResult),
      progressWidth: '0%',
      noimgTips: '上传图片',
      uploadstate: '',
      cancelTips: '取消',
      showProgress: false,
      showSMark: false,
      showEMark: false,
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
    reset(){
      clearXhrEvent(this.xhr)
      this.result = cloneJSON(defaultResult)
      this.imgsrc = ''
      this.xhr= {}
      this.progressWidth = '0%'
      this.uploadstate = ''
      this.showProgress = false
      this.showSMark = false
      this.showEMark = false
      this.$refs.file.value = '';
    },
    handleFileChange(){
      if(this.$refs.file){
        var file = this.$refs.file.files[0]
        this.readFile(file)
      }
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
      this.reset();
      e.cancelBubble = true;
      this.$emit('oncancel')
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
      this.reset();
      this.result = result;
      var blob = base64ToBlob(result.base64)
      this.imgsrc = createObjectURL(blob);
      this.showProgress = true;
      this.uploadstate = '上传中...';
      this.cancelTips = '取消上传'
      this.$emit('onaccept', result)
      this.uploadImg()
    },
    uploadSuccess(res,xhr){
      this.uploadstate = '上传成功';
      this.cancelTips = '删除'
      this.setProgress('100%')
      setTimeout(()=>{
        this.showProgress = false;
        this.showSMark = false;
        this.showSMark = true;
        this.$emit('onsuccess', res)
      },200)
    },
    uploadFailed(res, xhr){
      this.uploadstate = '上传失败';
      this.cancelTips = '删除'
      this.setProgress('0%')
      setTimeout(()=>{
        this.showProgress = false;
        this.showEMark = false;
        this.showEMark = true;
        this.$emit('onerror', res)
      },200)
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
      this.xhr = ajax({
        url,
        data,
        requestType: 'xhr',
        method: 'POST',
        progress: vm.setProgress,
        // dataType: 'formData',
        headers:{ Authorization: 'Bearer ' + getToken() },
        success : vm.uploadSuccess,
        error: vm.uploadFailed
      })
    },
    setProgress(percent){
      this.progressWidth = percent
    }
  },
  props: {
    url: {
      type: String,
      default: "https://httpbin.org/post"
      //required: true
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
        cursor: pointer;
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
      max-width: 100%;
    }

    img.iu_img {
        transform: none;
        -webkit-filter: none;
        max-width: 100%;
    }

    .iu_preview:hover .iu_details {
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
      margin-bottom: 8px;
    }
    .iu_filename{
      font-size: 16px;
      margin-bottom: 16px;
    }
    .iu_uploadstate{
      pointer-events: none;
      z-index: 500;
      position: absolute;
      display: block;
      right: 1em;
      margin-top: -32px;
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
    .iu_progress{
      opacity: 1;
      z-index: 1000;
      pointer-events: none;
      position: absolute;
      height: 16px;
      left: 50%;
      top: 50%;
      width: 50%;
      min-width: 100px;
      transform: translate(-50%,-50%) scale(1);
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      overflow: hidden;
    }
    .iu_progressbar{
      background: #66aaff;
      background: linear-gradient(to bottom, #2580cb, #444);
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 0;
      transition: width 200ms ease-in-out;
    }
    .iu_successmark,
    .iu_errormark{
        pointer-events: none;
        opacity: 0;
        z-index: 500;
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        margin-left: -27px;
        margin-top: -27px;
        animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
    }
    .iu_successmark svg,
    .iu_errormark svg{
      display: block;
      width: 54px;
      height: 54px;
    }
</style>
