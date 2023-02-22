<template>
  <div>
    <el-button type="primary">新增分类</el-button>
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
          <a href="javascript:void(0)" class="a-link">修改</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link">删除</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link">上移</a>
          <el-divider direction="vertical"></el-divider>
          <a href="javascript:void(0)" class="a-link">下移</a>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup>

import {getCurrentInstance, reactive} from "vue";
// @ts-ignore
//const {proxy} = getCurrentInstance();
// 先引入文件
import useCurrentInstance from "@/hooks/useCurrentInstance";
// 在setup 中使用处理
const {globalProperties} = useCurrentInstance();


const api = {
  'loadDataList': '/blog/index'
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
</script>

<style lang="scss">

</style>