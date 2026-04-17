<template>
  <view class="home-container">
    <!-- 顶部搜索栏 -->
    <view class="search-section">
      <view class="search-box" @tap="goToSearch">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <text class="search-placeholder">搜索家电维修服务</text>
      </view>
      <view class="location-info" @tap="selectLocation">
        <u-icon name="map-fill" size="16" color="#007AFF"></u-icon>
        <text class="location-text">{{currentLocation}}</text>
        <u-icon name="arrow-down" size="12" color="#999"></u-icon>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <u-swiper
        :list="bannerList"
        :autoplay="true"
        :interval="3000"
        :duration="1000"
        height="320"
        border-radius="20"
        @click="handleBannerClick"
      ></u-swiper>
    </view>

    <!-- 服务分类 -->
    <view class="service-categories">
      <view class="section-header">
        <text class="section-title">服务分类</text>
        <text class="section-more" @tap="goToServiceList">全部服务 ></text>
      </view>
      <view class="category-grid">
        <view 
          class="category-item" 
          v-for="(item, index) in categories" 
          :key="index"
          @tap="goToCategory(item)"
        >
          <view class="category-icon">
            <image :src="item.icon" mode="aspectFit"></image>
          </view>
          <text class="category-name">{{item.name}}</text>
        </view>
      </view>
    </view>

    <!-- 热门服务 -->
    <view class="hot-services">
      <view class="section-header">
        <text class="section-title">热门服务</text>
        <text class="section-more" @tap="goToServiceList">更多服务 ></text>
      </view>
      <view class="service-list">
        <view 
          class="service-item" 
          v-for="(item, index) in hotServices" 
          :key="index"
          @tap="goToServiceDetail(item)"
        >
          <view class="service-image">
            <image :src="item.image" mode="aspectFill"></image>
          </view>
          <view class="service-info">
            <text class="service-name">{{item.name}}</text>
            <view class="service-price">
              <text class="price-symbol">¥</text>
              <text class="price-number">{{item.price}}</text>
              <text class="price-unit">起</text>
            </view>
            <view class="service-meta">
              <text class="service-sales">已服务{{item.sales}}次</text>
              <view class="service-rating">
                <u-rate :value="item.rating" size="12" disabled></u-rate>
                <text class="rating-text">{{item.rating}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠活动 -->
    <view class="promotion-section">
      <view class="section-header">
        <text class="section-title">优惠活动</text>
        <text class="section-more" @tap="goToPromotions">全部活动 ></text>
      </view>
      <view class="promotion-list">
        <view 
          class="promotion-item" 
          v-for="(item, index) in promotions" 
          :key="index"
          @tap="goToPromotionDetail(item)"
        >
          <view class="promotion-image">
            <image :src="item.image" mode="aspectFill"></image>
          </view>
          <view class="promotion-content">
            <text class="promotion-title">{{item.title}}</text>
            <text class="promotion-desc">{{item.description}}</text>
            <view class="promotion-footer">
              <text class="promotion-time">{{item.time}}</text>
              <text class="promotion-action">立即参与</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 服务保障 -->
    <view class="service-guarantee">
      <view class="section-header">
        <text class="section-title">服务保障</text>
      </view>
      <view class="guarantee-grid">
        <view class="guarantee-item" v-for="(item, index) in guarantees" :key="index">
          <view class="guarantee-icon">
            <image :src="item.icon" mode="aspectFit"></image>
          </view>
          <text class="guarantee-title">{{item.title}}</text>
          <text class="guarantee-desc">{{item.desc}}</text>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
import {
  loadAMapSDK as loadAMapSDKService,
  getAMapLocation,
  reverseGeocode,
  searchNearbyPOI
} from '@/common/function/amapService.js'

export default {
  data() {
    return {
      currentLocation: '北京市朝阳区',
      locationInfo: null, // 保存完整的定位信息
      _retryCount: 0, // 高德地图重试计数
      _nativeRetryCount: 0, // 原生定位重试计数
      bannerList: [
        {
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=750&h=320&fit=crop',
          title: '专业家电维修服务'
        },
        {
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=750&h=320&fit=crop',
          title: '24小时快速响应'
        },
        {
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=750&h=320&fit=crop',
          title: '价格透明 服务优质'
        }
      ],
      categories: [
        {
          id: 1,
          name: '空调维修',
          icon: '/static/category/air-conditioner.svg'
        },
        {
          id: 2,
          name: '冰箱维修',
          icon: '/static/category/refrigerator.svg'
        },
        {
          id: 3,
          name: '洗衣机维修',
          icon: '/static/category/washing-machine.svg'
        },
        {
          id: 4,
          name: '电视维修',
          icon: '/static/category/tv.svg'
        },
        {
          id: 5,
          name: '热水器维修',
          icon: '/static/category/water-heater.svg'
        },
        {
          id: 6,
          name: '燃气灶维修',
          icon: '/static/category/gas-stove.svg'
        },
        {
          id: 7,
          name: '微波炉维修',
          icon: '/static/category/microwave.svg'
        },
        {
          id: 8,
          name: '全部服务',
          icon: '/static/category/all.svg'
        }
      ],
      hotServices: [
        {
          id: 1,
          name: '空调清洗保养',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
          price: '89',
          sales: 1250,
          rating: 4.8
        },
        {
          id: 2,
          name: '冰箱不制冷维修',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
          price: '120',
          sales: 856,
          rating: 4.9
        },
        {
          id: 3,
          name: '洗衣机故障检修',
          image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=150&fit=crop',
          price: '95',
          sales: 2100,
          rating: 4.7
        },
        {
          id: 4,
          name: '电视屏幕维修',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop',
          price: '280',
          sales: 680,
          rating: 4.6
        }
      ],
      promotions: [
        {
          id: 1,
          title: '新用户专享优惠',
          description: '首次下单立减30元，专业师傅上门服务',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop',
          time: '2024-12-31截止'
        },
        {
          id: 2,
          title: '空调清洗套餐',
          description: '两台空调清洗仅需168元，赠送空调罩',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop',
          time: '2024-11-30截止'
        }
      ],
      guarantees: [
        {
          icon: '/static/guarantee/quality.svg',
          title: '品质保证',
          desc: '专业认证师傅'
        },
        {
          icon: '/static/guarantee/fast-response.svg',
          title: '快速响应',
          desc: '30分钟上门'
        },
        {
          icon: '/static/guarantee/price-transparent.svg',
          title: '价格透明',
          desc: '无隐形消费'
        },
        {
          icon: '/static/guarantee/after-sales.svg',
          title: '售后保障',
          desc: '90天质保'
        }
      ]
    }
  },
  onLoad() {
    this.loadHomeData()
    // 加载高德地图定位SDK
    this.loadAMapSDK()
  },
  methods: {
    // 加载高德地图SDK（由 amapService.js 统一处理）
    async loadAMapSDK() {
      // #ifdef H5
      try {
        await loadAMapSDKService()
        console.log('高德地图SDK加载成功')
      } catch (error) {
        console.error('高德地图SDK加载失败', error)
      }
      // #endif
    },

    // 加载首页数据
    async loadHomeData() {
      // 这里可以调用API获取真实数据
      console.log('加载首页数据')
    },
    
    // 搜索
    goToSearch() {
      uni.navigateTo({
        url: '/pages/common/search/search'
      })
    },
    
    // 选择位置
    async selectLocation() {
      // H5 环境：先使用浏览器高精度定位，如失败再回退到高德SDK定位
      // #ifdef H5
      if (navigator && navigator.geolocation) {
        uni.showLoading({
          title: '定位中...'
        })

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            uni.hideLoading()
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const accuracy = position.coords.accuracy

            console.log('原生浏览器定位结果:', position.coords)
            console.log('定位精度:', accuracy, '米')

            if (accuracy > 100 && !this._retryCount) {
              this._retryCount = 1
              uni.showToast({
                title: '定位精度较低，正在重新定位...',
                icon: 'loading',
                duration: 2000
              })
              setTimeout(() => {
                this.selectLocation()
              }, 2000)
              return
            }

            this._retryCount = 0
            const [gcjLng, gcjLat] = this.wgs84ToGcj02(longitude, latitude)
            console.log('WGS84 转 GCJ02:', gcjLat, gcjLng)
            this.getAddressFromLocation(gcjLat, gcjLng, accuracy)
          },
          (error) => {
            uni.hideLoading()
            console.error('浏览器定位失败，将回退到高德SDK定位', error)
            this.fallbackToAMapSDKLocation()
          },
          {
            enableHighAccuracy: true,
            timeout: 45000,
            maximumAge: 0
          }
        )
        return
      }

      this.fallbackToAMapSDKLocation()
      return
      // #endif

      // 小程序 / App 环境：使用真实的定位API
      uni.getLocation({
        type: 'gcj02',
        altitude: false,
        success: (res) => {
          console.log('小程序定位成功:', res)
          this.getAddressFromLocation(res.latitude, res.longitude, res.accuracy)
        },
        fail: (err) => {
          console.error('小程序定位失败:', err)
          uni.showToast({
            title: '定位失败，请检查位置权限',
            icon: 'none'
          })
        }
      })
    },

    // H5回退：使用高德SDK定位
    async fallbackToAMapSDKLocation() {
      try {
        uni.showLoading({
          title: '定位中...'
        })

        const result = await getAMapLocation()
        uni.hideLoading()

        if (result && result.position) {
          const position = result.position
          const latitude = position.lat
          const longitude = position.lng
          const accuracy = position.accuracy

          console.log('高德SDK定位结果:', result)
          console.log('定位精度:', accuracy, '米')

          if (accuracy > 100 && !this._retryCount) {
            this._retryCount = 1
            uni.showToast({
              title: '定位精度较低，正在重新定位...',
              icon: 'loading',
              duration: 2000
            })
            setTimeout(() => {
              this.fallbackToAMapSDKLocation()
            }, 2000)
            return
          }

          this._retryCount = 0
          this.getAddressFromLocation(latitude, longitude, accuracy)
          return
        }

        throw new Error('高德SDK定位结果不完整')
      } catch (error) {
        uni.hideLoading()
        console.error('高德SDK定位失败', error)
        this.fallbackToNativeLocation()
      }
    },
    
    // 坐标系转换：WGS84转GCJ02（用于H5环境）
    wgs84ToGcj02(lng, lat) {
      const a = 6378245.0
      const ee = 0.00669342162296594323

      if (this.outOfChina(lng, lat)) {
        return [lng, lat]
      }

      let dlat = this.transformLat(lng - 105.0, lat - 35.0)
      let dlng = this.transformLng(lng - 105.0, lat - 35.0)

      const radlat = lat / 180.0 * Math.PI
      let magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      const sqrtmagic = Math.sqrt(magic)

      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI)

      const gcjLng = lng + dlng
      const gcjLat = lat + dlat

      return [gcjLng, gcjLat]
    },

    transformLat(x, y) {
      let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
      ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
      ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
      return ret
    },

    transformLng(x, y) {
      let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
      ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
      ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0
      return ret
    },

    outOfChina(lng, lat) {
      return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
    },

    // 使用高德地图PlaceSearch获取更详细的地址信息
    async getDetailedAddressInfo(latitude, longitude, accuracy = null) {
      // #ifdef H5
      try {
        const result = await searchNearbyPOI(longitude, latitude)
        if (result && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
          const poi = result.poiList.pois[0]
          console.log('POI详细信息:', poi)

          const enhancedAddress = `${poi.cityname || ''}${poi.adname || ''}${poi.address || ''}${poi.name || ''}`
          if (enhancedAddress && enhancedAddress.length > this.currentLocation.length) {
            this.currentLocation = enhancedAddress
            if (this.locationInfo) {
              this.locationInfo.displayAddress = enhancedAddress
            }
            console.log('使用POI信息增强地址:', enhancedAddress)
          }
        }
      } catch (error) {
        console.error('POI搜索失败', error)
      }
      // #endif
    },

    // 从经纬度获取详细地址信息
    async getAddressFromLocation(latitude, longitude, accuracy = null) {
      // #ifdef H5
      try {
        const regeocode = await reverseGeocode(longitude, latitude)
        const addressComponent = regeocode.addressComponent
        const formattedAddress = regeocode.formattedAddress

        console.log('高德SDK逆地理编码结果:', regeocode)

        let displayAddress = formattedAddress
        if (!displayAddress || displayAddress.length < 15) {
          const parts = []
          if (addressComponent.province && addressComponent.province !== addressComponent.city) {
            parts.push(addressComponent.province)
          }
          if (addressComponent.city) parts.push(addressComponent.city)
          if (addressComponent.district) parts.push(addressComponent.district)
          if (addressComponent.township) parts.push(addressComponent.township)
          if (addressComponent.street) parts.push(addressComponent.street)
          if (addressComponent.streetNumber) parts.push(addressComponent.streetNumber)
          displayAddress = parts.join('')
        }

        if ((!displayAddress || displayAddress.length < 12) && regeocode.roads && regeocode.roads.length > 0) {
          const road = regeocode.roads[0]
          displayAddress = `${addressComponent.city || ''}${addressComponent.district || ''}${road.name}附近`
        }

        if ((!displayAddress || displayAddress.length < 10) && regeocode.pois && regeocode.pois.length > 0) {
          const poi = regeocode.pois[0]
          displayAddress = `${addressComponent.city || ''}${addressComponent.district || ''}${poi.name}附近`
        }

        if (!displayAddress || displayAddress.trim().length === 0) {
          displayAddress = addressComponent.city || '未知位置'
        }

        if (displayAddress.length < 8 && !displayAddress.includes('附近')) {
          displayAddress += '附近'
        }

        this.locationInfo = {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy,
          province: addressComponent.province,
          city: addressComponent.city,
          district: addressComponent.district,
          township: addressComponent.township,
          street: addressComponent.street,
          streetNumber: addressComponent.streetNumber,
          address: formattedAddress,
          displayAddress: displayAddress
        }

        this.currentLocation = displayAddress
        console.log('最终显示地址:', displayAddress)
        uni.showToast({
          title: accuracy ? `定位成功 (精度:${Math.round(accuracy)}米)` : '定位成功',
          icon: 'success'
        })
        this.getDetailedAddressInfo(latitude, longitude, accuracy)
      } catch (error) {
        console.error('高德SDK逆地理编码失败', error)
        this.fallbackToCloudFunction(latitude, longitude, accuracy)
      }
      // #endif

      // #ifndef H5
      // 小程序环境：优先使用云函数调用高德API
      this.fallbackToCloudFunction(latitude, longitude, accuracy)
      // #endif
    },

    // 调用云函数进行高德地图逆地理编码
    fallbackToCloudFunction(latitude, longitude, accuracy = null) {
      console.log('调用云函数进行地址解析:', { latitude, longitude, accuracy })

      // 调用云函数
      vk.callFunction({
        url: 'client/location.regeo',
        data: {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy
        },
        success: (res) => {
          console.log('云函数调用成功:', res)

          if (res.result && res.result.code === 0 && res.result.data) {
            const data = res.result.data

            this.locationInfo = {
              latitude: data.latitude,
              longitude: data.longitude,
              accuracy: data.accuracy,
              province: data.province,
              city: data.city,
              district: data.district,
              township: data.township,
              street: data.street,
              streetNumber: data.streetNumber,
              address: data.address,
              displayAddress: data.displayAddress
            }

            this.currentLocation = data.displayAddress

            console.log('云函数地址解析成功:', data.displayAddress)
            uni.showToast({
              title: accuracy ? `定位成功 (精度:${Math.round(accuracy)}米)` : '定位成功',
              icon: 'success'
            })

            // 尝试获取更详细的地址信息
            this.getDetailedAddressInfo(latitude, longitude, accuracy)
          } else {
            console.error('云函数地址解析失败:', res.result)
            this.fallbackToIPLocation()
          }
        },
        fail: (err) => {
          console.error('云函数调用失败:', err)
          this.fallbackToIPLocation()
        }
      })
    },

    // IP定位作为最后备选方案
    fallbackToIPLocation() {
      console.log('调用云函数进行IP定位')

      // 调用云函数
      vk.callFunction({
        url: 'client/location.ipLocation',
        data: {},
        success: (res) => {
          console.log('IP定位云函数调用成功:', res)

          if (res.result && res.result.code === 0 && res.result.data) {
            const data = res.result.data

            this.locationInfo = {
              latitude: null,
              longitude: null,
              accuracy: null,
              province: data.province,
              city: data.city,
              district: data.district,
              address: data.displayAddress,
              displayAddress: data.displayAddress
            }

            this.currentLocation = data.displayAddress

            uni.showToast({
              title: 'IP定位成功（大概位置）',
              icon: 'success'
            })
          } else {
            console.error('IP定位云函数调用失败:', res.result)
            this.setDefaultLocation(null, null, null)
          }
        },
        fail: (err) => {
          console.error('IP定位云函数调用失败:', err)
          this.setDefaultLocation(null, null, null)
        }
      })
    },

    // 设置默认位置信息
    setDefaultLocation(latitude, longitude, accuracy = null) {
      // 基于经纬度判断城市
      let defaultProvince = '北京市'
      let defaultCity = '北京市'
      let defaultDistrict = '朝阳区'

      // 北京: 39.4-41.1N, 115.7-117.4E
      if (latitude >= 39.4 && latitude <= 41.1 && longitude >= 115.7 && longitude <= 117.4) {
        defaultProvince = '北京市'
        defaultCity = '北京市'
        defaultDistrict = '朝阳区'
      }
      // 上海: 30.7-31.8N, 120.9-122.1E
      else if (latitude >= 30.7 && latitude <= 31.8 && longitude >= 120.9 && longitude <= 122.1) {
        defaultProvince = '上海市'
        defaultCity = '上海市'
        defaultDistrict = '浦东新区'
      }
      // 广州: 22.5-23.8N, 112.9-114.3E
      else if (latitude >= 22.5 && latitude <= 23.8 && longitude >= 112.9 && longitude <= 114.3) {
        defaultProvince = '广东省'
        defaultCity = '广州市'
        defaultDistrict = '天河区'
      }
      // 深圳: 22.4-22.9N, 113.7-114.6E
      else if (latitude >= 22.4 && latitude <= 22.9 && longitude >= 113.7 && longitude <= 114.6) {
        defaultProvince = '广东省'
        defaultCity = '深圳市'
        defaultDistrict = '南山区'
      }
      // 杭州: 29.1-30.7N, 118.2-120.6E
      else if (latitude >= 29.1 && latitude <= 30.7 && longitude >= 118.2 && longitude <= 120.6) {
        defaultProvince = '浙江省'
        defaultCity = '杭州市'
        defaultDistrict = '西湖区'
      }
      // 南京: 31.2-32.6N, 118.2-119.2E
      else if (latitude >= 31.2 && latitude <= 32.6 && longitude >= 118.2 && longitude <= 119.2) {
        defaultProvince = '江苏省'
        defaultCity = '南京市'
        defaultDistrict = '鼓楼区'
      }

      this.currentLocation = `${defaultCity}${defaultDistrict}附近`
      this.locationInfo = {
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        province: defaultProvince,
        city: defaultCity,
        district: defaultDistrict,
        address: `${defaultCity}${defaultDistrict}附近`
      }

      uni.showToast({
        title: '定位成功（大概位置）',
        icon: 'success'
      })
    },

    // 备用的原生定位方法
    fallbackToNativeLocation() {
      if (navigator && navigator.geolocation) {
        uni.showLoading({
          title: '定位中...'
        })

        navigator.geolocation.getCurrentPosition(
          (position) => {
            uni.hideLoading()
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const accuracy = position.coords.accuracy

            console.log('原生定位精度:', accuracy, '米')

            // 如果精度太低（超过100米），尝试重新定位一次
            if (accuracy > 100 && !this._nativeRetryCount) {
              this._nativeRetryCount = 1
              uni.showToast({
                title: '定位精度较低，正在重新定位...',
                icon: 'loading',
                duration: 2000
              })
              setTimeout(() => {
                this.fallbackToNativeLocation()
              }, 2000)
              return
            }

            this._nativeRetryCount = 0

            // 转换坐标系（WGS84转GCJ02）
            const [gcjLng, gcjLat] = this.wgs84ToGcj02(longitude, latitude)

            this.getAddressFromLocation(gcjLat, gcjLng, accuracy)
          },
          (error) => {
            uni.hideLoading()
            console.error('原生定位失败', error)
            let message = '定位失败，请检查浏览器定位权限'
            switch (error.code) {
              case error.PERMISSION_DENIED:
                message = '请允许浏览器位置权限'
                break
              case error.POSITION_UNAVAILABLE:
                message = '位置信息不可用，请检查GPS或网络'
                break
              case error.TIMEOUT:
                message = '定位超时，请在开阔地带重试'
                break
            }
            uni.showToast({
              title: message,
              icon: 'none'
            })
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
          }
        )
      } else {
        uni.showToast({
          title: '浏览器不支持定位功能',
          icon: 'none'
        })
      }
    },

    // 轮播图点击
    handleBannerClick(index) {
      console.log('点击轮播图:', index)
    },
    
    // 服务分类
    goToCategory(category) {
      if (category.id === 8) {
        // 全部服务跳转到服务列表页面
        this.goToServiceList()
      } else {
        uni.navigateTo({
          url: `/pages/customer/service/list?categoryId=${category.id}&categoryName=${category.name}`
        })
      }
    },
    
    // 服务列表
    goToServiceList() {
      uni.navigateTo({
        url: '/pages/customer/service/list'
      })
    },
    
    // 服务详情
    goToServiceDetail(service) {
      uni.navigateTo({
        url: `/pages/customer/service/detail?id=${service.id}`
      })
    },
    
    // 优惠活动列表
    goToPromotions() {
      uni.navigateTo({
        url: '/pages/customer/service/list'
      })
    },
    
    // 优惠活动详情
    goToPromotionDetail(promotion) {
      uni.navigateTo({
        url: '/pages/customer/service/detail'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 20rpx;
}

// 搜索栏
.search-section {
  background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
  padding: 20rpx 30rpx 40rpx;
  
  .search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    margin-bottom: 20rpx;
    
    .search-placeholder {
      margin-left: 10rpx;
      color: #999;
      font-size: 28rpx;
    }
  }
  
  .location-info {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24rpx;
    
    .location-text {
      margin: 0 10rpx;
    }
  }
}

// 轮播图
.banner-section {
  padding: 0 30rpx;
  margin-top: -20rpx;
}

// 服务分类
.service-categories {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30rpx;
    
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .category-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
      
      .category-name {
        font-size: 24rpx;
        color: #333;
        text-align: center;
      }
    }
  }
}

// 热门服务
.hot-services {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .service-list {
    .service-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .service-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
        overflow: hidden;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .service-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .service-name {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 10rpx;
        }
        
        .service-price {
          display: flex;
          align-items: baseline;
          margin-bottom: 10rpx;
          
          .price-symbol {
            font-size: 24rpx;
            color: #ff6b35;
          }
          
          .price-number {
            font-size: 36rpx;
            color: #ff6b35;
            font-weight: bold;
          }
          
          .price-unit {
            font-size: 24rpx;
            color: #999;
            margin-left: 5rpx;
          }
        }
        
        .service-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .service-sales {
            font-size: 24rpx;
            color: #999;
          }
          
          .service-rating {
            display: flex;
            align-items: center;
            
            .rating-text {
              font-size: 24rpx;
              color: #ff6b35;
              margin-left: 5rpx;
            }
          }
        }
      }
    }
  }
}

// 优惠活动
.promotion-section {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .promotion-list {
    .promotion-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .promotion-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
        overflow: hidden;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .promotion-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .promotion-title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 10rpx;
        }
        
        .promotion-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 15rpx;
          flex: 1;
        }
        
        .promotion-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .promotion-time {
            font-size: 22rpx;
            color: #999;
          }
          
          .promotion-action {
            font-size: 24rpx;
            color: #007AFF;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 服务保障
.service-guarantee {
  background: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .section-header {
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .guarantee-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;
    
    .guarantee-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 15rpx;
      
      .guarantee-icon {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10rpx;
        
        image {
          width: 48rpx;
          height: 48rpx;
        }
      }
      
      .guarantee-title {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
        margin: 10rpx 0 5rpx;
      }
      
      .guarantee-desc {
        font-size: 22rpx;
        color: #666;
      }
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>