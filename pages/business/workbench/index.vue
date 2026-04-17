<template>
  <view class="business-workbench-container">
    <!-- 顶部统计卡片 -->
    <view class="stats-cards">
      <view class="stats-card">
        <view class="card-header">
          <text class="card-title">今日订单</text>
          <u-icon name="order" size="24" color="#007AFF"></u-icon>
        </view>
        <text class="card-number">{{todayStats.orders}}</text>
        <text class="card-trend">+{{todayStats.orderTrend}}%</text>
      </view>
      
      <view class="stats-card">
        <view class="card-header">
          <text class="card-title">今日收入</text>
          <u-icon name="rmb" size="24" color="#4caf50"></u-icon>
        </view>
        <text class="card-number">¥{{todayStats.income}}</text>
        <text class="card-trend">+{{todayStats.incomeTrend}}%</text>
      </view>
      
      <view class="stats-card">
        <view class="card-header">
          <text class="card-title">待处理</text>
          <u-icon name="clock" size="24" color="#ff9800"></u-icon>
        </view>
        <text class="card-number">{{todayStats.pending}}</text>
        <text class="card-trend">{{todayStats.pendingTrend}}个</text>
      </view>
      
      <view class="stats-card">
        <view class="card-header">
          <text class="card-title">客户评价</text>
          <u-icon name="star" size="24" color="#9c27b0"></u-icon>
        </view>
        <text class="card-number">{{todayStats.rating}}</text>
        <text class="card-trend">{{todayStats.ratingTrend}}</text>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-header">
        <text class="section-title">快捷操作</text>
      </view>
      <view class="actions-grid">
        <view class="action-item" @tap="goToOrderManage">
          <view class="action-icon">
            <u-icon name="order" size="32" color="#007AFF"></u-icon>
          </view>
          <text class="action-name">订单管理</text>
          <text class="action-badge" v-if="pendingOrders > 0">{{pendingOrders}}</text>
        </view>
        
        <view class="action-item" @tap="goToServiceManage">
          <view class="action-icon">
            <u-icon name="grid" size="32" color="#4caf50"></u-icon>
          </view>
          <text class="action-name">服务管理</text>
        </view>
        
        <view class="action-item" @tap="goToFinanceOverview">
          <view class="action-icon">
            <u-icon name="rmb" size="32" color="#ff9800"></u-icon>
          </view>
          <text class="action-name">财务概览</text>
        </view>
        
        <view class="action-item" @tap="goToMasterManage">
          <view class="action-icon">
            <u-icon name="account" size="32" color="#9c27b0"></u-icon>
          </view>
          <text class="action-name">师傅管理</text>
        </view>
        
        <view class="action-item" @tap="goToCustomerService">
          <view class="action-icon">
            <u-icon name="server-man" size="32" color="#00bcd4"></u-icon>
          </view>
          <text class="action-name">客服中心</text>
        </view>
        
        <view class="action-item" @tap="goToDataReport">
          <view class="action-icon">
            <u-icon name="chart" size="32" color="#607d8b"></u-icon>
          </view>
          <text class="action-name">数据报表</text>
        </view>
      </view>
    </view>

    <!-- 待处理订单 -->
    <view class="pending-orders">
      <view class="section-header">
        <text class="section-title">待处理订单</text>
        <text class="section-more" @tap="goToOrderManage">查看全部 ></text>
      </view>
      <view class="order-list">
        <view 
          class="order-item" 
          v-for="(order, index) in pendingOrderList" 
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
        <text class="section-title">今日数据</text>
        <text class="section-more" @tap="goToDataReport">查看详情 ></text>
      </view>
      <view class="data-charts">
        <view class="chart-item">
          <text class="chart-title">订单趋势</text>
          <view class="chart-placeholder">
            <u-icon name="chart" size="60" color="#ccc"></u-icon>
            <text>订单趋势图表</text>
          </view>
        </view>
        <view class="chart-item">
          <text class="chart-title">收入分析</text>
          <view class="chart-placeholder">
            <u-icon name="pie" size="60" color="#ccc"></u-icon>
            <text>收入分析图表</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      todayStats: {
        orders: 12,
        income: '2,580',
        pending: 3,
        rating: 4.8,
        orderTrend: 15,
        incomeTrend: 20,
        pendingTrend: 3,
        ratingTrend: '优秀'
      },
      pendingOrders: 3,
      pendingOrderList: [
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
        },
        {
          id: 3,
          orderNo: 'WD202401150003',
          createTime: '15:20',
          serviceName: '洗衣机维修服务',
          serviceImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          serviceTime: '18:00-20:00',
          serviceAddress: '北京市西城区金融大街1号',
          totalPrice: '95.00'
        }
      ]
    }
  },
  onLoad() {
    this.loadWorkbenchData()
  },
  methods: {
    // 加载工作台数据
    async loadWorkbenchData() {
      console.log('加载商家工作台数据')
      // 这里可以调用API获取真实数据
    },
    
    // 跳转到订单管理
    goToOrderManage() {
      uni.navigateTo({
        url: '/pages/business/order/manage'
      })
    },
    
    // 跳转到服务管理
    goToServiceManage() {
      uni.navigateTo({
        url: '/pages/business/service/manage'
      })
    },
    
    // 跳转到财务概览
    goToFinanceOverview() {
      uni.navigateTo({
        url: '/pages/business/finance/overview'
      })
    },
    
    // 跳转到师傅管理
    goToMasterManage() {
      uni.navigateTo({
        url: '/pages/business/master/manage'
      })
    },
    
    // 跳转到客服中心
    goToCustomerService() {
      uni.navigateTo({
        url: '/pages/business/service/chat'
      })
    },
    
    // 跳转到数据报表
    goToDataReport() {
      uni.navigateTo({
        url: '/pages/business/data/report'
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
            const index = this.pendingOrderList.findIndex(item => item.id === order.id)
            if (index > -1) {
              this.pendingOrderList.splice(index, 1)
              this.pendingOrders--
              this.todayStats.pending--
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
            const index = this.pendingOrderList.findIndex(item => item.id === order.id)
            if (index > -1) {
              this.pendingOrderList.splice(index, 1)
              this.pendingOrders--
              this.todayStats.pending--
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
.business-workbench-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 20rpx;
}

// 统计卡片
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
  
  .stats-card {
    background: #fff;
    border-radius: 15rpx;
    padding: 30rpx;
    text-align: center;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15rpx;
      
      .card-title {
        font-size: 26rpx;
        color: #666;
      }
    }
    
    .card-number {
      font-size: 36rpx;
      color: #333;
      font-weight: bold;
      display: block;
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
  margin: 0 20rpx 20rpx;
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
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30rpx;
    
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .action-icon {
        width: 80rpx;
        height: 80rpx;
        background: #f8f8f8;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15rpx;
      }
      
      .action-name {
        font-size: 26rpx;
        color: #333;
      }
      
      .action-badge {
        position: absolute;
        top: 0;
        right: 10rpx;
        background: #ff6b35;
        color: #fff;
        font-size: 20rpx;
        padding: 2rpx 8rpx;
        border-radius: 10rpx;
        min-width: 20rpx;
        text-align: center;
      }
    }
  }
}

// 待处理订单
.pending-orders {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 15rpx;
  padding: 30rpx;
  
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
  margin: 0 20rpx;
  border-radius: 15rpx;
  padding: 30rpx;
  
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
  
  .data-charts {
    .chart-item {
      margin-bottom: 30rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .chart-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        display: block;
        margin-bottom: 20rpx;
      }
      
      .chart-placeholder {
        height: 200rpx;
        background: #f8f8f8;
        border-radius: 10rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        text {
          font-size: 24rpx;
          color: #999;
          margin-top: 10rpx;
        }
      }
    }
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>