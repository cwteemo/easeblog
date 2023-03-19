<template>
  <div>
    <v-md-editor
        :v-model="modelValue"
        :disabled-menus="[]"
        :include-level="[1, 2, 3, 4, 5, 6]"
        @upload-image="handleUploadImage"
        @change="change"
        :height="height + 'px'">

    </v-md-editor>
  </div>
</template>

<script setup>
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import useCurrentInstance from "@/hooks/useCurrentInstance";

const {globalProperties} = useCurrentInstance();
// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits()

const change = (markdownContent, htmlContent) => {
  emit("update:modelValue", markdownContent)
  emit("htmlContent", htmlContent)
}

const handleUploadImage = async (event, insertImage, files) => {
  let result = await globalProperties.Request({
    url: "file/upload",
    dataType: "file",
    params: {
      file: files[0],
      type: 2
    }
  })
  if (!result) {
    return;
  }
  const url = globalProperties.globalInfo.imageUrl + result.path
  // 此处只做示例
  insertImage({
    url: url,
    desc: '图片',
    // width: 'auto',
    // height: 'auto',
  });
}
</script>

<style lang="scss">

</style>