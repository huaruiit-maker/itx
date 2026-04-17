<template>
  <view class="business-workbench">
    <!-- 顶部统计卡片 -->
    <view class="stats-cards">
      <view class="stats-card">
        <view class="card-title">今日订单</view>
        <view class="card-value">{{todayStats.orders}}</view>
        <view class="card-trend">{{todayStats.orderTrend}}</view>
      </view>
      <view class="stats-card">
        <view class="card-title">今日收入</view>
        <view class="card-value">¥{{todayStats.income}}</view>
        <view class="card-trend">{{todayStats.incomeTrend}}</view>
      </view>
      <view class="stats-card">
        <view class="card-title">待处理</view>
        <view class="card-value">{{todayStats.pending}}</view>
        <view class="card-trend">{{todayStats.pendingTrend}}</view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-title">快捷操作</view>
      <view class="action-grid">
        <view class="action-item" @tap="navigateTo('order')">
          <u-icon name="list" size="32" color="#007AFF"></u-icon>
          <text>订单管理</text>
        </view>
        <view class="action-item" @tap="navigateTo('service')">
          <u-icon name="star" size="32" color="#4caf50"></u-icon>
          <text>服务管理</text>
        </view>
        <view class="action-item" @tap="navigateTo('finance')">
          <u-icon name="rmb" size="32" color="#ff9800"></u-icon>
          <text>财务概览</text>
        </view>
        <view class="action-item" @tap="navigateTo('profile')">
          <u-icon name="account" size="32" color="#9c27b0"></u-icon>
          <text>商家中心</text>
        </view>
      </view>
    </view>

    <!-- 待处理订单 -->
    <view class="pending-orders">
      <view class="section-header">
        <view class="section-title">待处理订单</view>
        <view class="section-more" @tap="navigateTo('order')">查看全部 ></view>
      </view>
      <view class="order-list">
        <view 
          class="order-item" 
          v-for="(order, index) in pendingOrders" 
          :key="order.id"
          @tap="goToOrderDetail(order)"
        >
          <view class="order-header">
            <text class="order-no">{{order.orderNo}}</text>
            <text class="order-time">{{order.createTime}}</text>
          </view>
          <view class="order-content">
            <image :src="order.serviceImage" mode="aspectFill"></image>
            <view class="order-details">
              <text class="service-name">{{order.serviceName}}</text>
              <text class="service-time">{{order.serviceDate}} {{order.serviceTime}}</text>
              <text class="service-address">{{order.serviceAddress}}</text>
            </view>
            <view class="order-price">¥{{order.totalPrice}}</view>
          </view>
          <view class="order-actions">
            <u-button size="mini" plain @tap.stop="rejectOrder(order)">拒单</u-button>
            <u-button type="primary" size="mini" @tap.stop="acceptOrder(order)">接单</u-button>
          </view>
        </view>
      </view>
    </view>

    <!-- 今日数据 -->
    <view class="today-data">
      <view class="section-header">
        <view class="section-title">今日数据</view>
      </view>
      <view class="data-grid">
        <view class="data-item">
          <text class="data-label">新订单</text>
          <text class="data-value">{{todayData.newOrders}}</text>
        </view>
        <view class="data-item">
          <text class="data-label">完成订单</text>
          <text class="data-value">{{todayData.completedOrders}}</text>
        </view>
        <view class="data-item">
          <text class="data-label">收入</text>
          <text class="data-value">¥{{todayData.income}}</text>
        </view>
        <view class="data-item">
          <text class="data-label">好评率</text>
          <text class="data-value">{{todayData.positiveRate}}%</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      todayStats: {
        orders: 12,
        orderTrend: '+10%',
        income: '1,280',
        incomeTrend: '+15%',
        pending: 3,
        pendingTrend: '3个待处理'
      },
      pendingOrders: [
        {
          id: 1,
          orderNo: 'WD202401150001',
          createTime: '13:30',
          serviceName: '空调维修清洗服务',
          serviceImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          serviceTime: '14:00-16:00',
          serviceAddress: '北京市朝阳区建国门外大街1号',
          totalPrice: '89.00'
        },
        {
          id: 2,
          orderNo: 'WD202401150002',
          createTime: '14:15',
          serviceName: '冰箱维修清洗服务',
          serviceImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          serviceTime: '16:00-18:00',
          serviceAddress: '北京市海淀区中关村大街1号',
          totalPrice: '120.00'
        }
      ],
      todayData: {
        newOrders: 8,
        completedOrders: 5,
        income: '1,280',
        positiveRate: 98
      }
    }
  },
  onLoad() {
    this.loadBusinessData()
  },
  methods: {
    // 加载商家工作台数据
    async loadBusinessData() {
      console.log('加载商家工作台数据')
      // 这里可以调用API获取真实数据
    },
    
    // 导航到指定页面
    navigateTo(page) {
      const routes = {
        'order': '/pages/business/order/list',
        'service': '/pages/business/service/manage',
        'finance': '/pages/business/finance/overview',
        'profile': '/pages/business/profile/profile'
      }
      
      uni.navigateTo({
        url: routes[page]
      })
    },
    
    // 跳转到订单详情
    goToOrderDetail(order) {
      uni.navigateTo({
        url: `/pages/business/order/detail?id=${order.id}`
      })
    },
    
    // 接单
    acceptOrder(order) {
      uni.showModal({
        title: '接单确认',
        content: '确定要接这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟接单操作
            const index = this.pendingOrders.findIndex(item => item.id === order.id)
            if (index > -1) {
              this.pendingOrders.splice(index, 1)
            }
            
            uni.showToast({
              title: '接单成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 拒单
    rejectOrder(order) {
      uni.showModal({
        title: '拒单确认',
        content: '确定要拒绝这个订单吗？请说明原因',
        editable: true,
        placeholderText: '请输入拒单原因',
        success: (res) => {
          if (res.confirm && res.content) {
            // 模拟拒单操作
            const index = this.pendingOrders.findIndex(item => item.id === order.id)
            if (index > -1) {
              this.pendingOrders.splice(index, 1)
            }
            
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
    }
  }
}
</script>

<style lang="scss" scoped>
.business-workbench {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
}

// 统计卡片
.stats-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  
  .stats-card {
    flex: 1;
    background: #fff;
    border-radius: 15rpx;
    padding: 30rpx 20rpx;
    margin: 0 10rpx;
    text-align: center;
    
    &:first-child {
      margin-left: 0;
    }
    
    &:last-child {
      margin-right: 0;
    }
    
    .card-title {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 15rpx;
    }
    
    .card-value {
      font-size: 36rpx;
      color: #333;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .card-trend {
      font-size: 24rpx;
      color: #4caf50;
    }
  }
}

// 快捷操作
.quick-actions {
  background: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
  
  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30rpx;
    
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      text {
        font-size: 26rpx;
        color: #333;
        margin-top: 15rpx;
      }
    }
  }
}

// 待处理订单
.pending-orders {
  background: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
    
    .section-more {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .order-list {
    .order-item {
      border: 1rpx solid #f0f0f0;
      border-radius: 10rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15rpx;
        
        .order-no {
          font-size: 24rpx;
          color: #999;
        }
        
        .order-time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .order-content {
        display: flex;
        align-items: center;
        margin-bottom: 15rpx;
        
        image {
          width: 80rpx;
          height: 60rpx;
          border-radius: 8rpx;
          margin-right: 15rpx;
          flex-shrink: 0;
        }
        
        .order-details {
          flex: 1;
          
          .service-name {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            display: block;
            margin-bottom: 5rpx;
          }
          
          .service-time {
            font-size: 24rpx;
            color: #666;
            display: block;
            margin-bottom: 3rpx;
          }
          
          .service-address {
            font-size: 24rpx;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        
        .order-price {
          font-size: 32rpx;
          color: #ff6b35;
          font-weight: bold;
        }
      }
      
      .order-actions {
        display: flex;
        justify-content: flex-end;
        gap: 15rpx;
        
        .u-btn {
          min-width: 120rpx;
        }
      }
    }
  }
}

// 今日数据
.today-data {
  background: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  
  .section-header {
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
  }
  
  .data-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .data-item {
      background: #f8f8f8;
      border-radius: 10rpx;
      padding: 20rpx;
      text-align: center;
      
      .data-label {
        font-size: 26rpx;
        color: #666;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .data-value {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
      }
    }
  }
}
</style>