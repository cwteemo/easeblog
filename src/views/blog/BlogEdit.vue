<template>
  <div>
    <Windows :show="windowsConfig.show" :buttons="windowsConfig.buttons" @close="closeWindows">
      <el-form :model="blogFormData" :rules="rules" ref="blogFormRef">
        <el-form-item prop="title">
          <div class="title-input">
            <el-input placeholder="请输入博客标题" v-model="blogFormData.title"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="content">
          <div :style="{'width':'100%'}">
            <EditorHtml
                v-if="blogFormData.editor_type==0"
                :height="editorHtmlHeight"
                :width="editorHtmlWidth"
                v-model="blogFormData.content"></EditorHtml>
            <EditorMarkdown
                v-else
                :height="editorMarkdownHeight"
                v-model="blogFormData.content"
                @click="setHtmlContent"></EditorMarkdown>
          </div>
        </el-form-item>
      </el-form>
      <Dialog :show="dialogConfig.show"
              :title="dialogConfig.title"
              :buttons="dialogConfig.buttons"
              width="800px"
              :roleback="type"
              @close="dialogConfig.show=false"
      >
        <el-form class="blog-setting-form" :model="blogFormData" :rules="rules" ref="settingFormRef"
                 label-width="80px">
          <el-form-item prop="category_id" label="博客分类">
            <el-select v-model="blogFormData.category_id" clearable placeholder="请选择分类" :style="{width:'100%'}">
              <el-option :value="item.category_id" :label="item.category_name"
                         v-for="item in categoryList">{{ item.category_name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cover" label="封面">
            <FileUpload v-model="blogFormData.cover"></FileUpload>
          </el-form-item>
          <el-form-item prop="type" label="博客类型">
            <el-radio-group v-model="blogFormData.type">
              <el-radio :label="1">原创</el-radio>
              <el-radio :label="0">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reprint_url" label="原文地址" v-if="blogFormData.type==0">
            <el-input v-model="blogFormData.reprint_url" placeholder="请输入原文地址"></el-input>
          </el-form-item>
          <el-form-item prop="allow_comment" label="评论">
            <div class="allow_comment">
              <el-radio-group v-model="blogFormData.allow_comment">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
              <span class="info">请先在评论设置里设置好相关参数，评论才会生效</span>
            </div>
          </el-form-item>
          <el-form-item prop="summary" label="博客摘要">
            <el-input v-model="blogFormData.summary" type="textarea"
                      :autosize="{minRows:4,maxRows:4}" placeholder="请输入摘要"></el-input>
          </el-form-item>
          <el-form-item prop="tag" label="博客标签">
            <div class="tag-input-panner">
              <div class="tag-list">
                <el-tag class="tag-item" v-for="(item,index) in blogFormData.tag" @close="tagClose(index)" closable>
                  {{ item }}
                </el-tag>
              </div>
              <span class="info" v-if="blogFormData.tag.length==0">添加标签更容易被搜索引擎搜索</span>
              <span class="iconfont icon-file-upload" @click="showTagInputHandler" v-if="!showTagInput"></span>
              <el-input class="tag-input" v-if="showTagInput" v-model="tagInputValue" @blur="tagInputResult"
                        @keyup.enter="$event.target.blur()"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </Dialog>
    </Windows>
  </div>
</template>

<script setup>
//新增
import {nextTick, onMounted, reactive, ref} from "vue";
// 先引入文件
import useCurrentInstance from "@/hooks/useCurrentInstance";
import VueCookies from "vue-cookies";
// 在setup 中使用处理
const {globalProperties} = useCurrentInstance();

const editorMarkdownHeight = window.innerHeight - 220
const editorHtmlHeight = window.innerHeight - 300
const editorHtmlWidth = window.innerWidth - 160
const windowsConfig = reactive({
  show: false,
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        showSettings()
      }
    }
  ]
})

const emit = defineEmits()

const closeWindows = () => {
  windowsConfig.show = false
  emit("callback")
}

const addEdit = (data) => {
  console.log(data);
}

const blogFormRef = ref(null)

const blogFormData = ref({tag: []})

const setHtmlContent = (htmlContent) => {
  blogFormData.value.content = htmlContent
}
const showSettings = () => {
  blogFormRef.value.validate(async (valid) => {
    if (!valid) {
      console.log(111);

      return
    }
    console.log(123);
    dialogConfig.show = true
  })
}

const settingFormRef = ref()


const rules = {
  title: [{required: true, message: "请输入标题"}],
  content: [{required: true, message: "请输入正文"}],
  category_id: [{required: true, message: "请选择博客分类"}],
  type: [{required: true, message: "请选择博客类型"}],
  allow_comment: [{required: true, message: "请选择是否允许评论"}],
  reprint_url: [{required: true, message: "请输入原文地址"}],
}


//博客设置
const dialogConfig = reactive({
  show: false,
  title: "标题",
  type: 'add',
  buttons: [
    /*{
      type: 'danger',
      text: '删除',
      click: (e) => {
        console.log("xx");
        submitForm()
      }
    },*/
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        submitBlog()
      }
    }
  ]
})

//博客分类
const categoryList = ref({})
const api = {
  'loadDataList': '/category/index',
  'addBlog': '/blog/add',
  'saveBlog': '/blog/update',
  'getUserInfo': '/user/info',
}

const init = (type, data) => {
  windowsConfig.show = true

  nextTick(() => {
    blogFormRef.value.resetFields()
    blogFormData.value = {tag:[]};
    if (type === "add") {
      getUserInfo();
      addEdit(data)
    }
  })

}

defineExpose({init})

const userInfo = VueCookies.get('userInfo')
const params = {
  user_id: userInfo.user_id
}
const getUserInfo = async () => {
  let result = await globalProperties.Request({
    url: api.getUserInfo,
    params
  })
  if (!result) {
    return
  }
  blogFormData.value.editor_type = result.editor_type
}

const categoryLists = async () => {
  let result = await globalProperties.Request({
    url: api.loadDataList
  })
  if (!result) {
    return
  }
  categoryList.value = result;
}
onMounted(() => {
  categoryLists();
})


const tagClose = (index) => {
  blogFormData.value.tag.splice(index, 1)
}

//tag输入框是否显示
const showTagInput = ref(false)
const showTagInputHandler = () => {
  showTagInput.value = true
}

//tag输入框的值
const tagInputValue = ref(null)

const tagInputResult = () => {
  if (tagInputValue.value == undefined) {
    return;
  }
  if (blogFormData.value.tag.indexOf(tagInputValue.value) === -1) {
    blogFormData.value.tag.push(tagInputValue.value)
  }
  showTagInput.value = false
  tagInputValue.value = undefined

}

const submitBlog = () => {
  settingFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }

    const params = {}
    Object.assign(params, blogFormData.value)
    let result = await globalProperties.Request({
      url: api.addBlog,
      params
    })
    if (!result) {
      return
    }
    globalProperties.Message.success("保存成功")
    closeWindows()
  })
}
</script>

<style lang="scss">

.is-error .title-input .el-input__wrapper {
  box-shadow: none;
}

.title-input {
  width: 100%;
  border-bottom: 1px solid #ddd;

  .el-input__wrapper {
    box-shadow: none;
    font-size: 18px;
  }
}


.blog-setting-form {
  .allow_comment {
    display: flex;

    .info {
      margin-left: 10px;
      color: rgb(175, 175, 175);
      font-size: 10px;
    }
  }

  .tag-input-panner {
    display: flex;
    align-items: center;

    .tag-list {
      display: flex;

      .tag-item {
        margin-right: 10px;
      }
    }

    .info {
      margin-right: 10px;
      color: rgb(175, 175, 175);
      font-size: 10px;
    }

    .icon-file-upload {
      color: red;
      margin-right: 10px;
      cursor: pointer;
    }

    .tag-input {
      width: 100px;
    }
  }
}
</style>