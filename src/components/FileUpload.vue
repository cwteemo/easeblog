<template>
  <el-upload name="file"
             :show-file-list="false"
             accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
             :multiple="false"
             :http-request="fileUpload"
  >
    <div class="cover-upload-btn">
      <template v-if="modelValue">
        <img :src="proxy.globalInfo.imageUrl + modelValue">
      </template>
      <span class="iconfont icon-file-upload" v-else></span>
    </div>
  </el-upload>
</template>

<script setup>
import {getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const api = {
  uploadUrl: "file/upload"
}
const emit = defineEmits()
const fileUpload = async (file) => {
  console.log(file);
  let result = await proxy.Request({
    url: api.uploadUrl,
    dataType: "file",
    params: {
      file: file.file,
      type: 1
    }
  })
  console.log(result);
  const fileName = result.path
  emit("update:modelValue", fileName)
}
</script>

<style lang="scss">
.cover-upload-btn {
  background: url("../assets/upload-bg.png");
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  .iconfont {
    font-size: 50px;
    color: rgb(164, 164, 164);
  }

  img{
    width: 100%;
  }
}
</style>