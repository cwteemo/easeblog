<template>
  <div class="cover">
    <img :src="globalProperties.globalInfo.imageUrl + cover" v-if="cover">
    <img v-else src="../assets/image/user-image.png">
  </div>
</template>

<script setup>

import useCurrentInstance from '@/hooks/useCurrentInstance'

const {globalProperties} = useCurrentInstance()

const props = defineProps({
  cover: {
    type: String
  }
})

</script>
<style lang="scss">
.cover {
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  overflow: hidden;

  img {
    width: 100%;
  }
}
</style>