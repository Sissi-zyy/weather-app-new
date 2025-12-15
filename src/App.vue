<template>
   <div class="app-container">
     <!-- 顶部导航 -->
     <el-header>
       <div class="header-content">
         <h1>智能天气助手</h1>
       </div>
     </el-header>
     <!-- 城市搜索组件 -->
     <CitySearch @add-city="addCity" />
     <!-- 城市标签组件 -->
     <CityTabs 
       v-if="savedCities.length"
       :cities="savedCities" 
       :current-idx="currentCityIdx"
       @switch-city="switchCity"
       @remove-city="removeCity"
     />
     <!-- 错误提示 -->
     <el-alert 
       v-if="errorMsg" 
       :title="errorMsg" 
       type="error" 
       show-icon 
       class="mb-4"
     />
     <!-- 实时天气组件 -->
     <CurrentWeather v-if="currentWeather" :weather="currentWeather" />
     <!-- 7日预报组件 -->
     <ForecastList v-if="forecastData" :forecastList="forecastData" />
     <!-- 空气质量+生活建议组件 -->
     <AirQuality 
       v-if="airData && lifeAdvice" 
       :air-data="airData" 
       :life-advice="lifeAdvice"
     />
   </div>
 </template>
 <script setup>
 import { ref, onMounted } from 'vue'
 import axios from 'axios'
 import CitySearch from './components/CitySearch.vue'
 import CityTabs from './components/CityTabs.vue'
 import CurrentWeather from './components/CurrentWeather.vue'
 import ForecastList from './components/ForecastList.vue'
 import AirQuality from './components/AirQuality.vue'
 const AMAP_KEY = 'f7e4ae10cb98e82b4c5557d46f68d104'
 const savedCities = ref(JSON.parse(localStorage.getItem('weatherCities') || '[]'))
 const currentCityIdx = ref(0)
 const currentWeather = ref(null)
 const forecastData = ref(null)
 const airData = ref(null)
 const lifeAdvice = ref(null)
 const errorMsg = ref('')
 onMounted(() => {
   if (savedCities.value.length === 0) {
     addCity('北京')
   } else {
     fetchAllData(savedCities.value[currentCityIdx.value].adcode)
   }
 })
 const switchCity = (idx) => {
   currentCityIdx.value = idx
   fetchAllData(savedCities.value[idx].adcode)
 }
 const addCity = async (cityName) => {
   try {
     const res = await axios.get('https://restapi.amap.com/v3/geocode/geo', {
       params: { address: cityName, key: AMAP_KEY }
     })
     const geocode = res.data.geocodes[0]
     if (!geocode) {
       errorMsg.value = '未找到该城市'
       return
     }
     const cityNameFinal = geocode.city || geocode.province
     const cityItem = { name: cityNameFinal, adcode: geocode.adcode }
     if (!savedCities.value.some(item => item.adcode === cityItem.adcode)) {
       savedCities.value.push(cityItem)
       localStorage.setItem('weatherCities', JSON.stringify(savedCities.value))
       currentCityIdx.value = savedCities.value.length - 1
       fetchAllData(cityItem.adcode)
     }
     errorMsg.value = ''
   } catch (err) {
     errorMsg.value = '添加失败，请检查网络或API Key'
     console.error(err)
   }
 }
 const removeCity = (idx) => {
   savedCities.value.splice(idx, 1)
   localStorage.setItem('weatherCities', JSON.stringify(savedCities.value))
   if (savedCities.value.length === 0) {
     currentWeather.value = null
     forecastData.value = null
     airData.value = null
     lifeAdvice.value = null
   } else {
     currentCityIdx.value = Math.min(idx, savedCities.value.length - 1)
     fetchAllData(savedCities.value[currentCityIdx.value].adcode)
   }
 }
 // 核心：修正数据请求逻辑
 const fetchAllData = async (adcode) => {
   try {
     // 1. 实时天气
     const weatherRes = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
       params: { city: adcode, key: AMAP_KEY }
     })
     currentWeather.value = weatherRes.data.lives?.[0] || null
     // 2. 7日预报
     const forecastRes = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
       params: { city: adcode, key: AMAP_KEY, extensions: 'all' }
     })
     forecastData.value = forecastRes.data.forecasts?.[0]?.casts || null
    
// 3. 空气质量（高德仅企业认证账号可获取pm25）
     const airRes = await axios.get('https://restapi.amap.com/v3/air/quality', {
       params: { city: adcode, key: AMAP_KEY }
     })
     console.log('高德空气质量数据：', airRes.data)
     if (airRes.data.status !== '1') {
       throw new Error('空气质量失败：' + airRes.data.info)
     }
     const airNow = airRes.data.airNowCity || {}
     airData.value = {
       pm25: airNow.pm25 || '暂无',
       qlty: airNow.qlty || '暂无',
       aqi: airNow.aqi || '暂无'
     }
     // 4. 生活建议（高德生活指数接口，需企业认证）
     const lifeRes = await axios.get('https://restapi.amap.com/v3/weather/life', {
       params: { city: adcode, key: AMAP_KEY, type: 'comf,cw,sport,trav,uv' }
     })
     console.log('高德生活建议数据：', lifeRes.data)
     if (lifeRes.data.status !== '1') {
       throw new Error('生活建议失败：' + lifeRes.data.info)
     }
     // 高德生活建议解析：info是二维数组，[0]是类型，[1]是建议
     const lifeInfo = lifeRes.data.life?.[0]?.info || []
     const lifeMap = {}
     lifeInfo.forEach(item => {
       lifeMap[item[0]] = item[1]
     })
     lifeAdvice.value = [
       `舒适度：${lifeMap['舒适度'] || '暂无数据'}`,
       `洗车建议：${lifeMap['洗车建议'] || '暂无数据'}`,
       `运动建议：${lifeMap['运动建议'] || '暂无数据'}`,
       `旅游建议：${lifeMap['旅游建议'] || '暂无数据'}`,
       `紫外线：${lifeMap['紫外线强度'] || '暂无数据'}`
     ]
   } catch (err) {
     errorMsg.value = '数据加载失败：' + err.message
     console.error('高德请求错误：', err)
     // 兜底数据
     airData.value = { pm25: '35', qlty: '良', aqi: '60' }
     lifeAdvice.value = [
       '舒适度：较舒适，建议穿薄外套',
       '洗车建议：适宜，未来三天无雨',
       '运动建议：推荐，户外锻炼佳',
       '旅游建议：适合，天气晴朗',
       '紫外线：中等，建议涂防晒霜'
     ]
   }

 }
 </script>
 <style scoped>
 .app-container {
   max-width: 1200px;
   margin: 0 auto;
   padding: 20px;
   display: flex;
   flex-direction: column;
   gap: 15px;
 }
 .el-header {
   padding: 0;
 }
 .header-content {
   text-align: center;
   padding: 10px 0;
 }
 </style>
