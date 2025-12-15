<template>
  <div class="search-row">
    <el-input
      v-model="searchCity"
      placeholder="输入城市名（如：上海）"
      @keyup.enter="handleAdd"
      clearable
    />
    <el-button type="success" @click="handleAdd" class="ml-2">添加城市</el-button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['add-city'])
const searchCity = ref('')

const handleAdd = () => {
  if (!searchCity.value.trim()) return
  emit('add-city', searchCity.value.trim())
  searchCity.value = ''
}
</script>

<style scoped>
.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}
</style>