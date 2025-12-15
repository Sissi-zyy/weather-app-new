<template>
  <div class="city-tabs">
    <!-- 遍历props.cities，获取city和索引idx -->
    <el-tag
  v-for="(city, idx) in props.cities"
  :key="city.id"
  @close="handleClose(idx)"
  @click="handleSwitch(idx)"
>
  {{ city.name }}
</el-tag>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  cities: {
    type: Array,
    required: true
  },
  currentIdx: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['switch-city', 'remove-city'])

const handleSwitch = (idx) => {
  emit('switch-city', idx)
}
const handleClose = (idx) => {
  emit('remove-city', idx)
}
</script>

<style scoped>
.city-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.el-tag {
  cursor: pointer;
}
</style>