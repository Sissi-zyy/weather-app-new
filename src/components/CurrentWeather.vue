<template>
  <el-card 
    class="current-weather-card"
    :style="{ backgroundImage: `url(${bgUrl})` }"
  >
    <div class="weather-mask">
      <div class="top">
        <h3>{{ weather.city }} · {{ weather.weather }}</h3>
        <!-- 天气图标 -->
        <component :is="weatherIcon" class="weather-icon" />
      </div>
      <p class="temp">{{ weather.temperature }}℃</p>
      <p class="detail">
        风向：{{ weather.winddirection }} | 风力：{{ weather.windpower }}级 | 湿度：{{ weather.humidity }}%
      </p>
      <p class="update-time">更新时间：{{ weather.reporttime }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps, computed } from 'vue'
// 导入背景图
import sunny from '@/assets/weather-bg/sunny.jpg'
import cloudy from '@/assets/weather-bg/cloudy.jpg'
import rainy from '@/assets/weather-bg/rainy.jpg'
import snowy from '@/assets/weather-bg/snowy.jpg'
import defaultBg from '@/assets/weather-bg/default.jpg'

const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
})

// 天气类型 -> 图标映射
const weatherIcon = computed(() => {
  const type = props.weather.weather.toLowerCase()
  if (type.includes('晴')) return 'Sunny'
  if (type.includes('云') || type.includes('阴')) return 'Cloudy'
  if (type.includes('雨')) return 'Rainy'
  if (type.includes('雪')) return 'Snowy'
  if (type.includes('雾')) return 'Cloudy'
  if (type.includes('霾')) return 'Cloudy'
  return 'Sunny'
})

// 天气类型 -> 背景图映射
const bgUrl = computed(() => {
  const weatherType = props.weather.weather.toLowerCase()
  if (weatherType.includes('晴')) return sunny
  if (weatherType.includes('云') || weatherType.includes('阴')) return cloudy
  if (weatherType.includes('雨')) return rainy
  if (weatherType.includes('雪')) return snowy
  return defaultBg
})
</script>

<style scoped>
.current-weather-card {
  height: 240px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}
.weather-mask {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: #fff;
}
.top {
  display: flex;
  align-items: center;
}
/* 核心修改：缩小图标字体大小，可根据需求调整数值 */
.weather-icon {
  margin-left: 5px;
  font-size: 16px; 
  height: 50px;
}
.temp {
  font-size: 36px;
  font-weight: 600;
  margin: 5px 0;
}
.update-time {
  font-size: 12px;
  margin-top: 5px;
  opacity: 0.8;
}
</style>