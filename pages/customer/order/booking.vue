<template>
  <view class="booking-container">
    <!-- 服务信息 -->
    <view class="service-info">
      <image :src="serviceInfo.image" mode="aspectFill"></image>
      <view class="service-content">
        <text class="service-name">{{serviceInfo.name}}</text>
        <text class="service-price">¥{{serviceInfo.price}}</text>
      </view>
    </view>

    <!-- 预约表单 -->
    <view class="booking-form">
      <!-- 服务时间 -->
      <view class="form-section">
        <view class="section-title">
          <u-icon name="calendar" size="20" color="#007AFF"></u-icon>
          <text>服务时间</text>
        </view>
        <view class="time-selection">
          <view class="date-selector" @tap="showDatePicker = true">
            <text>{{selectedDate || '请选择日期'}}</text>
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
          <view class="time-selector" @tap="showTimePicker = true">
            <text>{{selectedTime || '请选择时间'}}</text>
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
      </view>

      <!-- 服务地址 -->
      <view class="form-section">
        <view class="section-title">
          <u-icon name="map" size="20" color="#007AFF"></u-icon>
          <text>服务地址</text>
        </view>
        <view class="address-selector" @tap="selectAddress">
          <view class="address-info" v-if="selectedAddress">
            <text class="address-detail">{{selectedAddress.detail}}</text>
            <text class="address-contact">{{selectedAddress.contact}} {{selectedAddress.phone}}</text>
          </view>
          <view class="address-empty" v-else>
            <text>请选择服务地址</text>
          </view>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>

      <!-- 联系人信息 -->
      <view class="form-section">
        <view class="section-title">
          <u-icon name="account" size="20" color="#007AFF"></u-icon>
          <text>联系人信息</text>
        </view>
        <view class="contact-form">
          <view class="form-item">
            <text class="form-label">联系人</text>
            <input 
              v-model="contactForm.name" 
              placeholder="请输入联系人姓名"
              class="form-input"
            />
          </view>
          <view class="form-item">
            <text class="form-label">手机号</text>
            <input 
              v-model="contactForm.phone" 
              type="number"
              placeholder="请输入手机号码"
              class="form-input"
            />
          </view>
        </view>
      </view>

      <!-- 服务需求 -->
      <view class="form-section">
        <view class="section-title">
          <u-icon name="edit-pen" size="20" color="#007AFF"></u-icon>
          <text>服务需求</text>
        </view>
        <view class="requirement-form">
          <textarea 
            v-model="requirementText"
            placeholder="请详细描述您的服务需求（选填）"
            class="requirement-textarea"
            maxlength="200"
          />
          <text class="text-count">{{requirementText.length}}/200</text>
        </view>
      </view>

      <!-- 优惠券 -->
      <view class="form-section">
        <view class="section-title">
          <u-icon name="coupon" size="20" color="#007AFF"></u-icon>
          <text>优惠券</text>
        </view>
        <view class="coupon-selector" @tap="selectCoupon">
          <text v-if="selectedCoupon">{{selectedCoupon.title}} - 减¥{{selectedCoupon.discount}}</text>
          <text v-else>选择优惠券</text>
          <u-icon name="arrow-right" size="16" color="#999"></u-icon>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="form-section">
        <view class="section-title">
          <u-icon name="rmb" size="20" color="#007AFF"></u-icon>
          <text>支付方式</text>
        </view>
        <view class="payment-methods">
          <view 
            class="payment-item" 
            v-for="(item, index) in paymentMethods" 
            :key="index"
            @tap="selectPayment(item)"
          >
            <view class="payment-left">
              <u-icon :name="item.icon" size="24" :color="item.color"></u-icon>
              <view class="payment-info">
                <text class="payment-name">{{item.name}}</text>
                <text class="payment-desc" v-if="item.desc">{{item.desc}}</text>
              </view>
            </view>
            <u-icon 
              name="checkmark-circle-fill" 
              size="20" 
              :color="selectedPayment === item.value ? '#007AFF' : '#ccc'"
            ></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-detail">
      <view class="price-header">
        <text>价格明细</text>
      </view>
      <view class="price-item">
        <text>服务费用</text>
        <text>¥{{serviceInfo.price}}</text>
      </view>
      <view class="price-item" v-if="selectedCoupon">
        <text>优惠券</text>
        <text class="discount">-¥{{selectedCoupon.discount}}</text>
      </view>
      <view class="price-total">
        <text>合计</text>
        <text class="total-price">¥{{finalPrice}}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <view class="price-info">
        <text class="price-label">合计：</text>
        <text class="price-number">¥{{finalPrice}}</text>
      </view>
      <u-button type="primary" shape="circle" @tap="submitBooking">提交预约</u-button>
    </view>

    <!-- 日期选择器 -->
    <u-picker 
      v-model="showDatePicker"
      mode="time"
      :params="dateParams"
      @confirm="onDateConfirm"
      :start-year="currentYear"
      :end-year="currentYear + 1"
    ></u-picker>

    <!-- 时间选择器 -->
    <u-picker 
      v-model="showTimePicker"
      mode="selector"
      :range="timeRanges"
      @confirm="onTimeConfirm"
    ></u-picker>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      serviceId: '',
      serviceInfo: {
        id: 1,
        name: '空调维修清洗服务',
        price: '89',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop'
      },
      selectedDate: '',
      selectedTime: '',
      selectedAddress: null,
      contactForm: {
        name: '',
        phone: ''
      },
      requirementText: '',
      selectedCoupon: null,
      selectedPayment: 'wechat',
      showDatePicker: false,
      showTimePicker: false,
      currentYear: new Date().getFullYear(),
      dateParams: {
        year: true,
        month: true,
        day: true
      },
      timeRanges: [
        '08:00-10:00',
        '10:00-12:00',
        '12:00-14:00',
        '14:00-16:00',
        '16:00-18:00',
        '18:00-20:00'
      ],
      paymentMethods: [
        {
          name: '微信支付',
          value: 'wechat',
          icon: 'weixin-circle-fill',
          color: '#07c160',
          desc: '推荐'
        },
        {
          name: '支付宝',
          value: 'alipay',
          icon: 'zhifubao-circle-fill',
          color: '#1677ff'
        },
        {
          name: '现金支付',
          value: 'cash',
          icon: 'rmb-circle-fill',
          color: '#ff9500',
          desc: '服务完成后支付'
        }
      ]
    }
  },
  onLoad(options) {
    if (options.serviceId) {
      this.serviceId = options.serviceId
      this.serviceInfo.name = options.serviceName || this.serviceInfo.name
      this.serviceInfo.price = options.price || this.serviceInfo.price
    }
    // 加载用户默认信息
    this.loadDefaultInfo()
  },
  computed: {
    finalPrice() {
      let price = parseFloat(this.serviceInfo.price)
      if (this.selectedCoupon) {
        price -= parseFloat(this.selectedCoupon.discount)
      }
      return Math.max(price, 0).toFixed(2)
    }
  },
  methods: {
    // 加载默认信息
    async loadDefaultInfo() {
      // 这里可以调用API获取用户默认地址和联系信息
      // 模拟数据
      this.contactForm.name = '张三'
      this.contactForm.phone = '13800138000'
    },
    
    // 选择地址
    selectAddress() {
      uni.navigateTo({
        url: '/pages/customer/address/list?selectMode=true',
        events: {
          selectAddress: (data) => {
            this.selectedAddress = data.address
          }
        }
      })
    },
    
    // 日期确认
    onDateConfirm(e) {
      const { year, month, day } = e
      this.selectedDate = `${year}-${month}-${day}`
    },
    
    // 时间确认
    onTimeConfirm(e) {
      this.selectedTime = this.timeRanges[e[0]]
    },
    
    // 选择优惠券
    selectCoupon() {
      uni.navigateTo({
        url: '/pages/customer/coupon/list?selectMode=true',
        events: {
          selectCoupon: (data) => {
            this.selectedCoupon = data.coupon
          }
        }
      })
    },
    
    // 选择支付方式
    selectPayment(method) {
      this.selectedPayment = method.value
    },
    
    // 提交预约
    async submitBooking() {
      // 表单验证
      if (!this.selectedDate) {
        uni.showToast({
          title: '请选择服务日期',
          icon: 'none'
        })
        return
      }
      
      if (!this.selectedTime) {
        uni.showToast({
          title: '请选择服务时间',
          icon: 'none'
        })
        return
      }
      
      if (!this.selectedAddress) {
        uni.showToast({
          title: '请选择服务地址',
          icon: 'none'
        })
        return
      }
      
      if (!this.contactForm.name.trim()) {
        uni.showToast({
          title: '请输入联系人姓名',
          icon: 'none'
        })
        return
      }
      
      if (!this.contactForm.phone.trim()) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none'
        })
        return
      }
      
      // 验证手机号格式
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.contactForm.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      
      // 构建订单数据
      const orderData = {
        serviceId: this.serviceId,
        serviceDate: this.selectedDate,
        serviceTime: this.selectedTime,
        address: this.selectedAddress,
        contact: this.contactForm,
        requirement: this.requirementText,
        coupon: this.selectedCoupon,
        paymentMethod: this.selectedPayment,
        totalPrice: this.finalPrice
      }
      
      console.log('提交预约数据:', orderData)
      
      // 显示加载中
      uni.showLoading({
        title: '提交中...'
      })
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        
        // 跳转到订单详情页
        uni.redirectTo({
          url: '/pages/customer/order/detail?orderId=123456&status=success'
        })
        
        uni.showToast({
          title: '预约成功',
          icon: 'success'
        })
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
}

// 服务信息
.service-info {
  background: #fff;
  padding: 30rpx;
  display: flex;
  margin-bottom: 20rpx;
  
  image {
    width: 120rpx;
    height: 90rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }
  
  .service-content {
    flex: 1;
    
    .service-name {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .service-price {
      font-size: 36rpx;
      color: #ff6b35;
      font-weight: bold;
    }
  }
}

// 表单区域
.booking-form {
  .form-section {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      text {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        margin-left: 10rpx;
      }
    }
    
    // 时间选择
    .time-selection {
      display: flex;
      gap: 20rpx;
      
      .date-selector,
      .time-selector {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background: #f8f8f8;
        border-radius: 10rpx;
        
        text {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
    
    // 地址选择
    .address-selector {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 10rpx;
      
      .address-info {
        flex: 1;
        
        .address-detail {
          font-size: 28rpx;
          color: #333;
          display: block;
          margin-bottom: 5rpx;
        }
        
        .address-contact {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .address-empty {
        flex: 1;
        
        text {
          font-size: 28rpx;
          color: #999;
        }
      }
    }
    
    // 联系表单
    .contact-form {
      .form-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .form-label {
          font-size: 28rpx;
          color: #333;
          width: 120rpx;
          flex-shrink: 0;
        }
        
        .form-input {
          flex: 1;
          font-size: 28rpx;
          color: #333;
          margin-left: 20rpx;
        }
      }
    }
    
    // 需求描述
    .requirement-form {
      position: relative;
      
      .requirement-textarea {
        width: 100%;
        height: 150rpx;
        padding: 20rpx;
        background: #f8f8f8;
        border-radius: 10rpx;
        font-size: 28rpx;
        color: #333;
        border: none;
        resize: none;
      }
      
      .text-count {
        position: absolute;
        bottom: 10rpx;
        right: 20rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
    
    // 优惠券选择
    .coupon-selector {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 10rpx;
      
      text {
        font-size: 28rpx;
        color: #333;
        
        &.discount {
          color: #ff6b35;
        }
      }
    }
    
    // 支付方式
    .payment-methods {
      .payment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .payment-left {
          display: flex;
          align-items: center;
          
          .payment-info {
            margin-left: 15rpx;
            
            .payment-name {
              font-size: 28rpx;
              color: #333;
              display: block;
              margin-bottom: 5rpx;
            }
            
            .payment-desc {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
  }
}

// 价格明细
.price-detail {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .price-header {
    margin-bottom: 20rpx;
    
    text {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
  }
  
  .price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    
    text {
      font-size: 28rpx;
      color: #333;
      
      &.discount {
        color: #ff6b35;
      }
    }
  }
  
  .price-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;
    margin-top: 20rpx;
    
    text {
      font-size: 32rpx;
      color: #333;
      
      &.total-price {
        color: #ff6b35;
        font-weight: bold;
      }
    }
  }
}

// 底部操作栏
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1rpx solid #f0f0f0;
  
  .price-info {
    display: flex;
    align-items: baseline;
    
    .price-label {
      font-size: 28rpx;
      color: #333;
    }
    
    .price-number {
      font-size: 36rpx;
      color: #ff6b35;
      font-weight: bold;
      margin-left: 10rpx;
    }
  }
  
  .u-btn {
    width: 200rpx;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>