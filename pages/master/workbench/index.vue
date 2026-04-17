<template>
  <view class="master-workbench-container">
    <!-- 师傅个人信息 -->
    <view class="master-info">
      <view class="info-header">
        <u-avatar :src="masterInfo.avatar" size="80"></u-avatar>
        <view class="info-content">
          <text class="master-name">{{masterInfo.name}}</text>
          <view class="master-rating">
            <u-rate :value="masterInfo.rating" size="14" disabled></u-rate>
            <text class="rating-text">{{masterInfo.rating}}</text>
          </view>
          <text class="master-phone">{{masterInfo.phone}}</text>
        </view>
        <view class="info-actions">
          <u-button size="mini" plain @tap="editProfile">编辑资料</u-button>
        </view>
      </view>
      <view class="info-stats">
        <view class="stat-item">
          <text class="stat-number">{{masterInfo.totalOrders}}</text>
          <text class="stat-label">总订单</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{masterInfo.monthOrders}}</text>
          <text class="stat-label">本月订单</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{masterInfo.income}}</text>
          <text class="stat-label">本月收入</text>
        </view>
      </view>
    </view>

    <!-- 今日统计 -->
    <view class="today-stats">
      <view class="stats-card">
        <view class="card-header">
          <text class="card-title">今日订单</text>
          <u-icon name="list" size="24" color="#007AFF"></u-icon>
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
          <text class="card-title">待接单</text>
          <u-icon name="clock" size="24" color="#ff9800"></u-icon>
        </view>
        <text class="card-number">{{todayStats.pending}}</text>
        <text class="card-trend">{{todayStats.pendingTrend}}个</text>
      </view>
      
      <view class="stats-card">
        <view class="card-header">
          <text class="card-title">进行中</text>
          <u-icon name="play-circle" size="24" color="#9c27b0"></u-icon>
        </view>
        <text class="card-number">{{todayStats.processing}}</text>
        <text class="card-trend">{{todayStats.processingTrend}}个</text>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-header">
        <text class="section-title">快捷操作</text>
      </view>
      <view class="actions-grid">
        <view class="action-item" @tap="goToOrderList">
          <view class="action-icon">
            <u-icon name="list" size="32" color="#007AFF"></u-icon>
          </view>
          <text class="action-name">订单列表</text>
          <text class="action-badge" v-if="pendingOrders > 0">{{pendingOrders}}</text>
        </view>
        
        <view class="action-item" @tap="goToSchedule">
          <view class="action-icon">
            <u-icon name="calendar" size="32" color="#4caf50"></u-icon>
          </view>
          <text class="action-name">日程管理</text>
        </view>
        
        <view class="action-item" @tap="goToIncome">
          <view class="action-icon">
            <u-icon name="rmb" size="32" color="#ff9800"></u-icon>
          </view>
          <text class="action-name">收入统计</text>
        </view>
        
        <view class="action-item" @tap="goToEvaluation">
          <view class="action-icon">
            <u-icon name="star" size="32" color="#9c27b0"></u-icon>
          </view>
          <text class="action-name">客户评价</text>
        </view>
        
        <view class="action-item" @tap="toggleWorkStatus">
          <view class="action-icon">
            <u-icon :name="workStatus ? 'checkmark-circle' : 'close-circle'" size="32" :color="workStatus ? '#00bcd4' : '#607d8b'"></u-icon>
          </view>
          <text class="action-name">{{workStatus ? '接单中' : '休息中'}}</text>
        </view>
        
        <view class="action-item" @tap="goToProfile">
          <view class="action-icon">
            <u-icon name="account" size="32" color="#795548"></u-icon>
          </view>
          <text class="action-name">个人中心</text>
        </view>
      </view>
    </view>

    <!-- 待接单订单 -->
    <view class="pending-orders">
      <view class="section-header">
        <text class="section-title">待接单订单</text>
        <text class="section-more" @tap="goToOrderList">查看全部 ></text>
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

    <!-- 今日日程 -->
    <view class="today-schedule">
      <view class="section-header">
        <text class="section-title">今日日程</text>
        <text class="section-more" @tap="goToSchedule">查看全部 ></text>
      </view>
      <view class="schedule-list">
        <view 
          class="schedule-item" 
          v-for="(item, index) in todaySchedule" 
          :key="item.id"
          @tap="goToScheduleDetail(item)"
        >
          <view class="schedule-time">
            <text class="time-text">{{item.time}}</text>
            <text class="status-tag" :class="item.status">{{item.statusText}}</text>
          </view>
          <view class="schedule-content">
            <text class="service-name">{{item.serviceName}}</text>
            <text class="service-address">{{item.address}}</text>
          </view>
          <view class="schedule-actions">
            <u-button size="mini" plain @tap.stop="callCustomer(item)">联系客户</u-button>
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
      workStatus: true, // 接单状态
      masterInfo: {
        name: '李师傅',
        phone: '15600156000',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.8,
        totalOrders: 1250,
        monthOrders: 156,
        income: '12,580'
      },
      todayStats: {
        orders: 8,
        income: '680',
        pending: 3,
        processing: 2,
        orderTrend: 10,
        incomeTrend: 15,
        pendingTrend: 3,
        processingTrend: 2
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
        }
      ],
      todaySchedule: [
        {
          id: 1,
          time: '14:00-16:00',
          status: 'pending',
          statusText: '待服务',
          serviceName: '空调维修清洗',
          address: '朝阳区建国门外大街1号',
          customerPhone: '13800138000'
        },
        {
          id: 2,
          time: '16:00-18:00',
          status: 'pending',
          statusText: '待服务',
          serviceName: '冰箱维修清洗',
          address: '海淀区中关村大街1号',
          customerPhone: '13900139000'
        },
        {
          id: 3,
          time: '18:00-20:00',
          status: 'processing',
          statusText: '服务中',
          serviceName: '洗衣机维修',
          address: '西城区金融大街1号',
          customerPhone: '13700137000'
        }
      ]
    }
  },
  onLoad() {
    this.loadMasterWorkbenchData()
  },
  methods: {
    // 加载师傅工作台数据
    async loadMasterWorkbenchData() {
      console.log('加载师傅工作台数据')
      // 这里可以调用API获取真实数据
    },
    
    // 跳转到订单列表
    goToOrderList() {
      uni.navigateTo({
        url: '/pages/master/order/list'
      })
    },
    
    // 跳转到日程管理
    goToSchedule() {
      uni.navigateTo({
        url: '/pages/master/schedule/schedule'
      })
    },
    
    // 跳转到收入统计
    goToIncome() {
      uni.navigateTo({
        url: '/pages/master/order/list'
      })
    },
    
    // 跳转到客户评价
    goToEvaluation() {
      uni.navigateTo({
        url: '/pages/master/order/list'
      })
    },
    
    // 跳转到个人中心
    goToProfile() {
      uni.navigateTo({
        url: '/pages/master/profile/profile'
      })
    },
    
    // 编辑个人资料
    editProfile() {
      uni.navigateTo({
        url: '/pages/master/profile/profile'
      })
    },
    
    // 跳转到订单详情
    goToOrderDetail(order) {
      uni.navigateTo({
        url: `/pages/master/order/detail`
      })
    },
    
    // 跳转到日程详情
    goToScheduleDetail(item) {
      uni.navigateTo({
        url: `/pages/master/order/detail`
      })
    },
    
    // 联系客户
    callCustomer(item) {
      uni.makePhoneCall({
        phoneNumber: item.customerPhone
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
.master-workbench-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 20rpx;
}

// 师傅个人信息
.master-info {
  background: linear-gradient(135deg, #42a5f5, #2196f3);
  color: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  
  .info-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .info-content {
      flex: 1;
      margin: 0 20rpx;
      
      .master-name {
        font-size: 36rpx;
        font-weight: bold;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .master-rating {
        display: flex;
        align-items: center;
        margin-bottom: 5rpx;
        
        .rating-text {
          font-size: 24rpx;
          margin-left: 5rpx;
        }
      }
      
      .master-phone {
        font-size: 26rpx;
        opacity: 0.9;
      }
    }
    
    .info-actions {
      .u-btn {
        color: #fff;
        border-color: #fff;
      }
    }
  }
  
  .info-stats {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        font-size: 32rpx;
        font-weight: bold;
        display: block;
        margin-bottom: 5rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
  }
}

// 今日统计
.today-stats {
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

// 待接单订单
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

// 今日日程
.today-schedule {
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
  
  .schedule-list {
    .schedule-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .schedule-time {
        width: 150rpx;
        flex-shrink: 0;
        
        .time-text {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          display: block;
          margin-bottom: 5rpx;
        }
        
        .status-tag {
          font-size: 22rpx;
          padding: 4rpx 10rpx;
          border-radius: 5rpx;
          
          &.pending {
            background: #fff3cd;
            color: #856404;
          }
          
          &.processing {
            background: #d1ecf1;
            color: #0c5460;
          }
          
          &.completed {
            background: #d4edda;
            color: #155724;
          }
        }
      }
      
      .schedule-content {
        flex: 1;
        margin: 0 20rpx;
        
        .service-name {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          display: block;
          margin-bottom: 5rpx;
        }
        
        .service-address {
          font-size: 24rpx;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .schedule-actions {
        .u-btn {
          min-width: 120rpx;
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