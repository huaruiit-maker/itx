<template>
  <view class="master-order-detail">
    <!-- 订单状态 -->
    <view class="status-bar" :style="{ backgroundColor: getStatusBgColor(orderInfo.status) }">
      <view class="status-info">
        <text class="status-text">{{ getStatusText(orderInfo.status) }}</text>
        <text class="status-desc">{{ getStatusDesc(orderInfo.status) }}</text>
      </view>
      <view class="status-icon">
        <u-icon :name="getStatusIcon(orderInfo.status)" size="40" color="#fff"></u-icon>
      </view>
    </view>

    <!-- 服务信息 -->
    <view class="info-card">
      <view class="card-title">服务信息</view>
      <view class="service-info">
        <image :src="orderInfo.serviceImage" mode="aspectFill"></image>
        <view class="service-details">
          <text class="service-name">{{ orderInfo.serviceName }}</text>
          <text class="service-desc">{{ orderInfo.serviceDesc }}</text>
          <view class="service-tags">
            <text class="tag" v-for="(tag, index) in orderInfo.tags" :key="index">{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 预约信息 -->
    <view class="info-card">
      <view class="card-title">预约信息</view>
      <view class="info-item">
        <text class="item-label">预约时间</text>
        <text class="item-value">{{ orderInfo.serviceDate }} {{ orderInfo.serviceTime }}</text>
      </view>
      <view class="info-item">
        <text class="item-label">服务地址</text>
        <text class="item-value">{{ orderInfo.serviceAddress }}</text>
      </view>
      <view class="info-item">
        <text class="item-label">联系人</text>
        <text class="item-value">{{ orderInfo.contactName }} {{ orderInfo.contactPhone }}</text>
      </view>
      <view class="info-item" v-if="orderInfo.remark">
        <text class="item-label">备注</text>
        <text class="item-value">{{ orderInfo.remark }}</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-card">
      <view class="card-title">订单信息</view>
      <view class="info-item">
        <text class="item-label">订单编号</text>
        <text class="item-value">{{ orderInfo.orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="item-label">下单时间</text>
        <text class="item-value">{{ orderInfo.createTime }}</text>
      </view>
      <view class="info-item" v-if="orderInfo.acceptTime">
        <text class="item-label">接单时间</text>
        <text class="item-value">{{ orderInfo.acceptTime }}</text>
      </view>
      <view class="info-item" v-if="orderInfo.startTime">
        <text class="item-label">开始时间</text>
        <text class="item-value">{{ orderInfo.startTime }}</text>
      </view>
      <view class="info-item" v-if="orderInfo.completeTime">
        <text class="item-label">完成时间</text>
        <text class="item-value">{{ orderInfo.completeTime }}</text>
      </view>
    </view>

    <!-- 客户信息 -->
    <view class="info-card">
      <view class="card-title">客户信息</view>
      <view class="customer-info">
        <image :src="orderInfo.customerInfo.avatar" mode="aspectFill"></image>
        <view class="customer-details">
          <text class="customer-name">{{ orderInfo.customerInfo.name }}</text>
          <text class="customer-phone">{{ orderInfo.customerInfo.phone }}</text>
          <text class="customer-desc">下单次数：{{ orderInfo.customerInfo.orderCount }}次</text>
        </view>
        <view class="customer-actions">
          <u-button size="normal" plain @tap="callCustomer">联系客户</u-button>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="info-card">
      <view class="card-title">价格明细</view>
      <view class="price-item">
        <text class="item-label">服务费用</text>
        <text class="item-value">¥{{ orderInfo.servicePrice }}</text>
      </view>
      <view class="price-item" v-if="orderInfo.extraFee > 0">
        <text class="item-label">额外费用</text>
        <text class="item-value">¥{{ orderInfo.extraFee }}</text>
      </view>
      <view class="price-item" v-if="orderInfo.discount > 0">
        <text class="item-label">优惠金额</text>
        <text class="item-value discount">-¥{{ orderInfo.discount }}</text>
      </view>
      <view class="price-total">
        <text class="total-label">实付金额</text>
        <text class="total-value">¥{{ orderInfo.totalPrice }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer-actions">
      <view class="action-btn" @tap="navigateToAddress">
        <u-icon name="map" size="24" color="#666"></u-icon>
        <text>导航</text>
      </view>
      
      <view class="action-btn" @tap="callCustomer">
        <u-icon name="phone" size="24" color="#666"></u-icon>
        <text>联系客户</text>
      </view>
      
      <template v-if="orderInfo.status === 1">
        <u-button type="default" plain @tap="rejectOrder">拒单</u-button>
        <u-button type="primary" @tap="acceptOrder">接单</u-button>
      </template>
      
      <template v-else-if="orderInfo.status === 2">
        <u-button type="primary" @tap="startService">开始服务</u-button>
      </template>
      
      <template v-else-if="orderInfo.status === 3">
        <u-button type="primary" @tap="completeService">完成服务</u-button>
      </template>
      
      <template v-else-if="orderInfo.status === 4">
        <u-button type="default" plain @tap="viewEvaluation">查看评价</u-button>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: null,
      orderInfo: {
        id: 1,
        orderNo: 'WD202401150001',
        status: 2,
        createTime: '2024-01-15 13:30:45',
        acceptTime: '2024-01-15 13:35:20',
        startTime: '',
        completeTime: '',
        serviceName: '空调维修清洗服务',
        serviceDesc: '专业空调维修、清洗、加氟等服务',
        serviceImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        tags: ['上门服务', '专业维修', '质保30天'],
        serviceDate: '2024-01-15',
        serviceTime: '14:00-16:00',
        serviceAddress: '北京市朝阳区建国门外大街1号国贸大厦A座1001室',
        contactName: '张先生',
        contactPhone: '13800138000',
        remark: '空调不制冷，需要尽快处理',
        servicePrice: '89.00',
        extraFee: '0.00',
        discount: '10.00',
        totalPrice: '79.00',
        customerInfo: {
          id: 1,
          name: '张先生',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          phone: '13800138000',
          orderCount: 5
        }
      }
    }
  },
  onLoad(options) {
    this.orderId = options.id || 1
    this.loadOrderDetail()
  },
  methods: {
    // 加载订单详情
    async loadOrderDetail() {
      console.log('加载订单详情，订单ID：', this.orderId)
      // 这里可以调用API获取真实数据
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        1: '待接单',
        2: '待开始',
        3: '进行中',
        4: '待确认',
        5: '已完成',
        6: '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    
    // 获取状态描述
    getStatusDesc(status) {
      const descMap = {
        1: '等待师傅接单',
        2: '已接单，等待开始服务',
        3: '服务进行中',
        4: '服务已完成，等待确认',
        5: '订单已完成',
        6: '订单已取消'
      }
      return descMap[status] || ''
    },
    
    // 获取状态背景色
    getStatusBgColor(status) {
      const colorMap = {
        1: '#ff9800', // 待接单 - 橙色
        2: '#2196f3', // 待开始 - 蓝色
        3: '#4caf50', // 进行中 - 绿色
        4: '#9c27b0', // 待确认 - 紫色
        5: '#607d8b', // 已完成 - 灰色
        6: '#f44336'  // 已取消 - 红色
      }
      return colorMap[status] || '#666'
    },
    
    // 获取状态图标
    getStatusIcon(status) {
      const iconMap = {
        1: 'clock',
        2: 'checkmark-circle',
        3: 'person',
        4: 'flag',
        5: 'checkmark',
        6: 'close-circle'
      }
      return iconMap[status] || 'help-circle'
    },
    
    // 接单
    acceptOrder() {
      uni.showModal({
        title: '接单确认',
        content: '确定要接这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟接单操作
            this.orderInfo.status = 2
            this.orderInfo.acceptTime = this.getCurrentTime()
            
            uni.showToast({
              title: '接单成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 拒单
    rejectOrder() {
      uni.showModal({
        title: '拒单确认',
        content: '确定要拒绝这个订单吗？请说明原因',
        editable: true,
        placeholderText: '请输入拒单原因',
        success: (res) => {
          if (res.confirm && res.content) {
            // 模拟拒单操作
            this.orderInfo.status = 6
            
            uni.showToast({
              title: '拒单成功',
              icon: 'success'
            })
          } else if (res.confirm && !res.content) {
            uni.showToast({
              title: '请输入拒单原因',
              icon: 'none'
            })
          }
        }
      })
    },
    
    // 开始服务
    startService() {
      uni.showModal({
        title: '开始服务',
        content: '确定要开始服务吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟开始服务操作
            this.orderInfo.status = 3
            this.orderInfo.startTime = this.getCurrentTime()
            
            uni.showToast({
              title: '操作成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 完成服务
    completeService() {
      uni.showModal({
        title: '完成服务',
        content: '确定要完成服务吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟完成服务操作
            this.orderInfo.status = 4
            this.orderInfo.completeTime = this.getCurrentTime()
            
            uni.showToast({
              title: '操作成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 联系客户
    callCustomer() {
      uni.makePhoneCall({
        phoneNumber: this.orderInfo.customerInfo.phone
      })
    },
    
    // 导航到地址
    navigateToAddress() {
      const address = this.orderInfo.serviceAddress
      uni.openLocation({
        latitude: 39.9042,  // 这里应该是解析地址后的纬度
        longitude: 116.4074, // 这里应该是解析地址后的经度
        name: this.orderInfo.serviceAddress,
        address: address,
        success: function() {
          console.log('导航成功')
        },
        fail: function(error) {
          console.error('导航失败', error)
          uni.showToast({
            title: '导航失败，请重试',
            icon: 'none'
          })
        }
      })
    },
    
    // 查看评价
    viewEvaluation() {
      uni.navigateTo({
        url: `/pages/master/evaluation/detail?orderId=${this.orderId}`
      })
    },
    
    // 获取当前时间
    getCurrentTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style lang="scss" scoped>
.master-order-detail {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 150rpx;
}

// 状态栏
.status-bar {
  padding: 40rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  
  .status-info {
    .status-text {
      font-size: 36rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .status-desc {
      font-size: 26rpx;
      opacity: 0.8;
    }
  }
}

// 信息卡片
.info-card {
  background: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin: 20rpx;
  
  .card-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  // 服务信息
  .service-info {
    display: flex;
    
    image {
      width: 160rpx;
      height: 120rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
      flex-shrink: 0;
    }
    
    .service-details {
      flex: 1;
      
      .service-name {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .service-desc {
        font-size: 26rpx;
        color: #666;
        display: block;
        margin-bottom: 15rpx;
      }
      
      .service-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        
        .tag {
          font-size: 22rpx;
          color: #007AFF;
          background: #e6f2ff;
          padding: 5rpx 15rpx;
          border-radius: 20rpx;
        }
      }
    }
  }
  
  // 信息项
  .info-item {
    display: flex;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .item-label {
      font-size: 28rpx;
      color: #666;
      width: 160rpx;
      flex-shrink: 0;
    }
    
    .item-value {
      font-size: 28rpx;
      color: #333;
      flex: 1;
    }
  }
  
  // 客户信息
  .customer-info {
    display: flex;
    align-items: center;
    
    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      flex-shrink: 0;
    }
    
    .customer-details {
      flex: 1;
      
      .customer-name {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .customer-phone {
        font-size: 26rpx;
        color: #666;
        display: block;
        margin-bottom: 5rpx;
      }
      
      .customer-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
    
    .customer-actions {
      flex-shrink: 0;
    }
  }
  
  // 价格明细
  .price-item {
    display: flex;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 30rpx;
    }
    
    .item-label {
      font-size: 28rpx;
      color: #666;
    }
    
    .item-value {
      font-size: 28rpx;
      color: #333;
      
      &.discount {
        color: #4caf50;
      }
    }
  }
  
  .price-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .total-label {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }
    
    .total-value {
      font-size: 36rpx;
      color: #ff6b35;
      font-weight: bold;
    }
  }
}

// 底部操作栏
.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    color: #666;
    
    text {
      margin-top: 5rpx;
    }
  }
  
  .u-btn {
    flex: 1;
  }
}
</style>