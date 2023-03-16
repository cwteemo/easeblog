<template>
  <div class="windows" :style="{width:width+'px'}" v-if="show">
    <div class="title">
      <span class="iconfont icon-back" @click="close"></span>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <template v-if="buttons&&buttons.length>0||showCancel">
      <div class="footer">
        <el-button link @click="close">取消</el-button>
        <el-button v-for="btn in buttons" :type="btn.type" @click="btn.click">{{btn.text}}</el-button>
      </div>
    </template>

  </div>
</template>

<script setup>
import {ref} from "vue";

const width = window.innerWidth - 290;
const props = defineProps({
  buttons:{
    type:Array
  },
  showCancel:{
    type:Boolean,
    default:true
  },
  show:{
    type:Boolean,
    default:false
  }
})

const emit = defineEmits(['close'])
const close = ()=>{
  emit("close")
}
</script>

<style lang="scss">
.windows {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  background: #ffffff;
  z-index: 50;
  .title{
    height: 30px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    .icon-back{
      font-size: 20px;
      cursor: pointer;
    }
  }
  .body{
    height: calc(100vh - 150px);
  }
  .footer{
    border-top: 1px solid #ddd;
    text-align: center;
    line-height: 50px;
  }
}
</style>