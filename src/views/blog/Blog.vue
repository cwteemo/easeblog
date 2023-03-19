<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="标题" prop="title">
              <el-input placeholder="请输入标题" v-model="searchFormData.title">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchFormData.status" clearable placeholder="请选择状态" :stype="{width:'100%'}">
                <el-option :value="0" label="草稿"></el-option>
                <el-option :value="1" label="已发布"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="category_id">
              <el-select v-model="searchFormData.category_id" clearable placeholder="请选择分类" :style="{width:'100%'}">
                <el-option :value="item.category_id" :label="item.category_name"
                           v-for="item in categoryList">{{ item.category_name }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="padding-left: 10px">
            <el-button type="primary" @click="loadDataList">搜索</el-button>
            <el-button type="primary" @click="addEdit(1)">新增</el-button>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <Table :columns="columns"
           :showPagination="true"
           :dataSource="tableData"
           :fetch="loadDataList"
           :options="tableOptions">
      <template #cover="{index,row}">
        <!--        <div class="cover">
                  <img :src="globalProperties.globalInfo.imageUrl + '?name=' + row.cover" alt="">
                </div>-->
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #category_desc="{index,row}">
        <div>标题：{{ row.category_name }}</div>
        <div>分类：{{ row.category_type }}</div>
        <div>作者：{{ row.nick_name }}</div>
      </template>
      <template #type="{index,row}">
        <div>类型：{{ row.type == 0 ? '原创' : '转载' }}</div>
        <div v-if="row.type == 1">转载：{{ row.reprint_url }}</div>
      </template>
      <template #allow_comment="{index,row}">
        <span>{{ row.allow_comment }}</span>
      </template>
      <template #status="{index,row}">
        <span v-if="row.status == 1" :style="{color:'green'}">已发布</span>
        <span v-else :style="{color:'red'}">原稿</span>
      </template>
      <template #time="{index,row}">
        <div>创建时间：{{ row.update_time }}</div>
        <div>更新时间：{{ row.update_time }}</div>
      </template>
      <template #op="{index,row}">
        <div class="op">
          <a href="javascript:void(0)" class="a-link" @click="showEdit(row)">修改</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link" @click="changeSort(index,'up')">预览</a>
          <el-divider direction="vertical"></el-divider>
        </div>
      </template>
    </Table>
    <Windows :show="windowsConfig.show" :buttons="windowsConfig.buttons" @close="closeWindows">
      <EditorMarkdown v-model="markdownContent"></EditorMarkdown>
    </Windows>
  </div>
</template>

<script setup>
import Table from "../../components/Table.vue";
import {reactive, ref} from "vue";
import useCurrentInstance from "@/hooks/useCurrentInstance";

const markdownContent = ref("# asdasd")

// 在setup 中使用处理
const api = {
  loadCategory: "/blog/select",
  loadIndex: "/blog/list",
}
const {globalProperties} = useCurrentInstance();

//搜索
const searchFormData = reactive({})
const categoryList = ref([])
const loadCategoryList = async () => {
  let result = await globalProperties.Request({
    url: api.loadCategory,
  })
  if (!result) {
    console.log(123);
    return;
  }
  categoryList.value = result
  console.log(categoryList);

}
loadCategoryList()

//列表
const columns = [
  {
    label: '封面',
    prop: 'cover',
    width: 80,
    scopedSlots: 'cover'
  },
  {
    label: '文章信息',
    prop: 'category_desc',
    width: 150,
    scopedSlots: 'category_desc'
  },
  {
    label: '编辑器',
    prop: 'category_name',
    width: 100,
  },
  {
    label: '类型',
    prop: 'type',
    width: 120,
    scopedSlots: 'type'
  },
  {
    label: '评论',
    prop: 'allow_comment',
    width: 80,
    scopedSlots: 'allow_comment'
  },
  {
    label: '状态',
    prop: 'status',
    width: 50,
    scopedSlots: 'status'
  },
  {
    label: '时间',
    prop: 'time',
    width: 220,
    scopedSlots: 'time'
  },
  {
    label: '操作',
    prop: 'op',
    width: 150,
    scopedSlots: 'op'
  },
]

const tableData = reactive({})
const tableOptions = {
  extHeight: 10
}
const loadDataList = async () => {
  let params = {
    pageSize: tableData.pageSize,
    pageNo: tableData.pageNo,
  }
  Object.assign(params, searchFormData)
  let result = await globalProperties.Request({
    url: api.loadIndex,
    params
  })
  if (!result) {
    return;
  }
  tableData.value = result
  Object.assign(tableData, result)
}

//新增
const windowsConfig = reactive({
  show: false,
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        console.log('xx');
      }
    }
  ]
})

const closeWindows = () => {
  windowsConfig.show = false
  loadDataList()
}

const showEdit = (data) => {
  windowsConfig.show = true
}

const addEdit = (data) => {
  windowsConfig.show = true
}

</script>

<style scoped>

</style>