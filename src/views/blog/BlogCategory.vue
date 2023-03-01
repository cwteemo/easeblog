<template>
  <div>
    <el-button type="primary" @click="showAdd()">新增分类</el-button>
    <Table :columns="columns"
           :showPagination="false"
           :dataSource="tableData"
           :fetch="loadDataList"
           :options="tableOptions">
      <template #cover="{index,row}">
        <!--        <div class="cover">
                  <img :src="globalProperties.globalInfo.imageUrl + '?name=' + row.cover" alt="">
                </div>-->
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #op="{index,row}">
        <div class="op">
          <a href="javascript:void(0)" class="a-link" @click="showEdit(row)">修改</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link">删除</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link">上移</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link">下移</a>
        </div>
      </template>
    </Table>
    <Dialog :show="dialogConfig.show"
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
            width="500px"
            :roleback="type"
            @close="dialogConfig.show=false"
    >
      <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px">
        <el-form-item prop="category_name" label="名称">
          <el-input placeholder="请输入名称" v-model="formData.category_name"></el-input>
        </el-form-item>
        <el-form-item prop="cover" label="封面">
          <FileUpload v-model="formData.cover"></FileUpload>
        </el-form-item>
        <el-form-item prop="category_desc" label="简介">
          <el-input v-model="formData.category_desc" type="textarea" :autosize="{minRows:4,maxRows:4}"></el-input>
        </el-form-item>

      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import FileUpload from "../../components/FileUpload.vue";

import {getCurrentInstance, nextTick, reactive, ref} from "vue";
// @ts-ignore
//const {proxy} = getCurrentInstance();
// 先引入文件
import useCurrentInstance from "@/hooks/useCurrentInstance";
// 在setup 中使用处理
const {globalProperties} = useCurrentInstance();


const api = {
  'loadDataList': '/blog/index',
  'saveBlog': '/blog/update',
  'addBlog': '/blog/add',
}
const columns = [
  {
    label: '封面',
    prop: 'cover',
    width: 100,
    scopedSlots: 'cover'
  },
  {
    label: '名称',
    prop: 'category_name',
    width: 200,
  },
  {
    label: '简介',
    prop: 'category_desc',
    width: 300,
  },
  {
    label: '博客数量',
    prop: 'blog_count',
    width: 100,
  },
  {
    label: '操作',
    prop: 'op',
    width: 200,
    scopedSlots: 'op'
  },
]

const tableData = reactive({})
const tableOptions = {
  extHeight: 10
}

const loadDataList = async () => {
  let result = await globalProperties.Request({
    url: api.loadDataList
  })
  if (!result) {
    return
  }
  tableData.list = result;
}


//新增、修改
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
        console.log(e);
        console.log(12312323);
        submitForm(dialogConfig.type)
      }
    }
  ]
})

const formData = reactive({})
const rules = {
  category_name: [
    {
      required: true,
      message: '请输入分类名称'
    }
  ]
}
const formDataRef = ref();
const showAdd = () => {
  dialogConfig.type = 'add'
  dialogConfig.show = true
  nextTick(() => {
    formDataRef.value.resetFields();
    dialogConfig.title = '新增分类';
  })
}

const showEdit = (data) => {
  dialogConfig.type = 'update'
  dialogConfig.show = true
  nextTick(() => {
    formDataRef.value.resetFields();
    dialogConfig.title = '编辑分类';
    Object.assign(formData, data)
  })
}

const submitForm = (fun_name) => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {}
    Object.assign(params, formData)
    let path = null;
    console.log(fun_name);
    if (fun_name == 'add') {
      path = api.addBlog
    } else {
      path = api.saveBlog
    }
    let result = await globalProperties.Request({
      url: path,
      params
    })
    if (!result) {
      return;
    }
    dialogConfig.show = false
    globalProperties.message.success("保存成功")
    loadDataList()
  })
}
</script>

<style lang="scss">

</style>