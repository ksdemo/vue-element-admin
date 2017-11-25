<template>
  <div class="ddz_container">
    <label class="ddz_label" :style="{width : labelWidth}" >{{label}}</label>
    <div class="ddz_wrap">
      <div :ref="id" :action="url" class="dropzone" :id="id" >
        <input type="file" :name="paramName" class="file">
      </div>
    </div>
  </div>

</template>

<script>
import 'dropzone/dist/dropzone.css'
import {imgReader} from '@/utils/ksutils/common/image.js'


export default {
  data() {
    return {
      dropzone: '',
      initOnce: true
    }
  },
  mounted() {
    const element = document.getElementById(this.id)
    const vm = this
    // var dataURL = file.dataURL
    // var pos = dataURL.indexOf(",")+1;
    // dataURL = dataURL.substring(pos, dataURL.length - pos);//去掉base64头
    // formData.imageBase64 = dataURL.
    let suffix = file.type.replace('image/','')
    formData.append('suffix', suffix);
    console.log(suffix)
    console.log(file)
        // formData.append('token', file.token);
        // formData.append('key', file.key);
    xhr.setRequestHeader('Authorization', '');
    vm.initOnce = false
  /**/
    
  },
  methods: {
    removeAllFiles() {
      this.dropzone.removeAllFiles(true)
    },
    processQueue() {
      this.dropzone.processQueue()
    },
    pasteImg(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      if (items[0].kind === 'file') {
        this.dropzone.addFile(items[0].getAsFile())
      }
    },
    initImages(val) {
      if (!val) return
      if (Array.isArray(val)) {
        val.map((v, i) => {
          const mockFile = { name: 'name' + i, size: 12345, url: v }
          this.dropzone.options.addedfile.call(this.dropzone, mockFile)
          this.dropzone.options.thumbnail.call(this.dropzone, mockFile, v)
          mockFile.previewElement.classList.add('dz-success')
          mockFile.previewElement.classList.add('dz-complete')
          return true
        })
      } else {
        const mockFile = { name: 'name', size: 12345, url: val }
        this.dropzone.options.addedfile.call(this.dropzone, mockFile)
        this.dropzone.options.thumbnail.call(this.dropzone, mockFile, val)
        mockFile.previewElement.classList.add('dz-success')
        mockFile.previewElement.classList.add('dz-complete')
      }
    }

  },
  destroyed() {
    document.removeEventListener('paste', this.pasteImg)
    this.dropzone.destroy()
  },
  watch: {
    defaultImg(val) {
      if (val.length === 0) {
        this.initOnce = false
        return
      }
      if (!this.initOnce) return
      this.initImages(val)
      this.initOnce = false
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    paramName: {
      type: String,
      default: 'imageBase64'
    },
    url: {
      type: String,
      required: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    defaultMsg: {
      type: String,
      default: '上传图片'
    },
    label: {
      type: String,
      default: '图片:'
    },
    labelWidth:{
      type: String,
      default: '6em'
    },
    acceptedFiles: {
      type: String
    },
    thumbnailHeight: {
      type: Number,
      default: 263
    },
    thumbnailWidth: {
      type: Number,
      default: 420
    },
    showRemoveLink: {
      type: Boolean,
      default: true
    },
    maxFilesize: {
      type: Number,
      default: 2 //MB
    },
    maxFiles: {
      type: Number,
      default: 1
    },
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    useCustomDropzoneOptions: {
      type: Boolean,
      default: false
    },
    defaultImg: {
      default: false
    },
    couldPaste: {
      default: false
    },
    addData:{
      type: Object,
      default: {}
    }
  }
}
</script>

<style>
    .dropzone {
        border: 2px solid #E5E5E5;
        font-family: 'Roboto', sans-serif;
        color: #777;
        transition: background-color .2s linear;
        padding: 5px;
    }

    .dropzone:hover {
        background-color: #F6F6F6;
    }

    i {
        color: #CCC;
    }

    .dropzone .dz-image img {
        width: 100%;
        height: 100%;
    }

    .dropzone input[name='file'] {
        display: none;
    }

    .dropzone input.file {
        display: none;
    }

    .dropzone .dz-preview .dz-image {
        border-radius: 0px;
    }

    .dropzone .dz-preview:hover .dz-image img {
        transform: none;
        -webkit-filter: none;
        width: 100%;
        height: 100%;
    }

    .dropzone .dz-preview .dz-details {
        bottom: 0px;
        top: 0px;
        color: white;
        background-color: rgba(33, 150, 243, 0.8);
        transition: opacity .2s linear;
        text-align: left;
    }
    .dropzone .dz-preview .dz-details .dz-size{
      margin-bottom: 3em;
    }
    .dropzone .dz-preview .dz-details .dz-filename span, .dropzone .dz-preview .dz-details .dz-size span {
        background-color: transparent;
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

    .dropzone .dz-preview .dz-success-mark, .dropzone .dz-preview .dz-error-mark {
        margin-left: -40px;
        margin-top: -50px;
    }

    .dropzone .dz-preview .dz-success-mark i, .dropzone .dz-preview .dz-error-mark i {
        color: white;
        font-size: 5rem;
    }

    .ddz_container{
      display:flex;
    }
    .ddz_wrap{
      flex: 1
    }
</style>
