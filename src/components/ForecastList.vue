<template>
  <div class="forecast-container">
    <h3>7日预报</h3>
    <div class="forecast-scroll">
      <div class="forecast-list">
        <div class="forecast-item" v-for="(item, idx) in props.forecastList" :key="idx">
          <div class="date">{{ formatDate(item.date) }}</div>
          <div class="item-icon">{{ getWeatherIcon(item.dayweather) }}</div>
          <div class="temp">{{ item.nighttemp }}°C ~ {{ item.daytemp }}°C</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  forecastList: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => 
        item.date && item.dayweather && item.nightweather && item.daytemp && item.nighttemp
      )
    }
  }
})

const formatDate = (dateStr) => {
  return `日期：${dateStr}`
}

const getWeatherIcon = (weather) => {
  const iconMap = {
    '多云': '☁️ 多云',
    '中雪': '❄️ 中雪',
    '晴': '☀️ 晴',
    '阴': '☁️ 阴',
    '小雨': '🌧️ 小雨'
  }
  return iconMap[weather] || weather
}
</script>

<style scoped>
.forecast-container {
  margin-bottom: 20px;
  width: 100%;
}

/* 横向滚动容器 */
.forecast-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  /* 隐藏滚动条（可选，根据需求保留） */
  scrollbar-width: none;
}
.forecast-scroll::-webkit-scrollbar {
  display: none;
}

/* 横向排列的列表 */
.forecast-list {
  display: flex;
  gap: 12px;
  padding: 10px;
  white-space: nowrap;
}

.forecast-item {
  display: inline-block;
  text-align: center;
  padding: 8px 12px;
  background-color: #f9f9fa;
  border-radius: 8px;
  min-width: 80px;
}

.date {
  font-size: 14px;
  color: #666;
}

.item-icon {
  font-size: 20px;
  margin: 4px 0;
}

.temp {
  font-size: 13px;
  color: #333;
}
</style>