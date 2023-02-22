<template>
  <div>
    <el-button type="primary">新增分类</el-button>
    <Table :columns="columns"
           :showPagination="false"
           :dataSource="tableData"
           :fetch="loadDataList"
           :options="tableOptions">

    </Table>
  </div>
</template>

<script setup>

import {getCurrentInstance, reactive} from "vue";

const {proxy} = getCurrentInstance();

const api = {
  'loadDataList': '/blog/index'
}
const columns = [
  {
    label: '封面',
    prop: 'cover',
    width: 80,
  },
  {
    label: '名称',
    prop: 'category_name',
    width: 80,
  },
  {
    label: '简介',
    prop: 'category_desc',
    width: 150,
  },
  {
    label: '博客数量',
    prop: 'cover',
    width: 80,
  },
  {
    label: '操作',
    prop: 'cover',
    width: 150,
  },
]

const tableData = reactive({})
const tableOptions = {
  extHeight: 10
}

const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList
  })
}
</script>

<style lang="scss">

</style>