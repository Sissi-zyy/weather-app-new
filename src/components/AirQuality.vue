<template>
  <div class="air-life-container">
    <div class="air-card">
      <h3 class="card-title">空气质量</h3>
      <div class="air-info">
        <p class="air-item">
          PM2.5: <span class="value">{{ props.airData.pm25 || '暂无' }}</span>
        </p>
        <p class="air-item">
          空气质量等级: 
          <span class="value" :class="getAirClass(props.airData.qlty)">{{ props.airData.qlty || '暂无' }}</span>
        </p>
        <p class="air-item">
          AQI指数: <span class="value">{{ props.airData.aqi || '暂无' }}</span>
        </p>
      </div>
    </div>
    <div class="life-card">
      <h3 class="card-title">生活建议</h3>
      <div class="life-list">
        <ul>
          <li class="life-item" v-for="item in props.lifeAdvice" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  airData: {
    type: Object,
    default: () => ({ pm25: '暂无', qlty: '暂无', aqi: '暂无' })
  },
  lifeAdvice: {
    type: Array,
    default: () => [
      '舒适度：暂无数据',
      '洗车建议：暂无数据',
      '运动建议：暂无数据',
      '旅游建议：暂无数据',
      '紫外线：暂无数据'
    ]
  }
})

const getAirClass = (qlty) => {
  const classMap = {
    优: 'air-excellent',
    良: 'air-good',
    轻度污染: 'air-light',
    中度污染: 'air-moderate',
    重度污染: 'air-heavy',
    严重污染: 'air-severe'
  }
  return classMap[qlty] || ''
}
</script>

<style scoped>
.air-life-container {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  width: 100%;
}
.air-card, .life-card {
  flex: 1;
  border-radius: 12px;
  background: #f8f9fa;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.card-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.air-item {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}
.air-item .value {
  color: #333;
  font-weight: 500;
}
.air-excellent { color: #52c41a; }
.air-good { color: #1890ff; }
.air-light { color: #faad14; }
.air-moderate { color: #f5222d; }
.air-heavy { color: #8b008b; }
.air-severe { color: #660000; }
.life-list ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
.life-item {
  font-size: 14px;
  padding: 4px 0;
  line-height: 1.5;
  color: #555;
}
@media (max-width: 768px) {
  .air-life-container {
    flex-direction: column;
  }
}
</style>