<template>
  <div>
    <el-dialog :show-close="false"
               :title="title"
               :draggable="true"
               :modelValue="show" :close-on-click-modal="false"
               :showClose="showClose"
               class="cust-dialog"
               :top="top"
               :width="width"
    >

      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="buttons&&buttons.length>0">
        <div class="dialog-footer">
          <el-button link @click="close">取消</el-button>
          <el-button v-for="btn in buttons" :type="btn.type" @click="btn.click" size="small">{{ btn.text }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  show: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  top: {
    type: String,
    default: '50px'
  },
  width: {
    type: String,
    default: '30%'
  },
  buttons: {
    type: Array
  }
})
const emit = defineEmits()
const close = ()=>{
  emit("close")
}
</script>

<style lang="scss">
.cust-dialog {
  .el-dialog__body {
    padding: 0;
  }

  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    min-height: 80px;
  }
  .dialog-footer{
    text-align: right;
    padding: 5px 20px;
  }
}
</style>