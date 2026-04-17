<template>
  <view class="master-workbench">
    <!-- 个人信息 -->
    <view class="profile-card">
      <view class="profile-header">
        <image :src="masterInfo.avatar" mode="aspectFill"></image>
        <view class="profile-info">
          <text class="master-name">{{ masterInfo.name }}</text>
          <view class="master-rating">
            <u-rate v-model="masterInfo.rating" size="20" readonly></u-rate>
            <text class="rating-text">{{ masterInfo.rating }}分</text>
          </view>
          <text class="master-desc">服务次数：{{ masterInfo.serviceCount }}次</text>
        </view>
        <view class="profile-actions">
          <u-button size="mini" plain @tap="callMaster">
            <u-icon name="phone" size="14"></u-icon>
            联系
          </u-button>
        </view>
      </view>
      
      <view class="profile-stats">
        <view class="stat-item">
          <text class="stat-value">{{ masterInfo.totalOrders }}</text>
          <text class="stat-label">总订单</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">¥{{ masterInfo.totalIncome }}</text>
          <text class="stat-label">总收入</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ masterInfo.completionRate }}%</text>
          <text class="stat-label">完成率</text>
        </view>
      </view>
    </view>

    <!-- 今日统计 -->
    <view class="stats-cards">
      <view class="stats-card">
        <view class="card-title">今日订单</view>
        <view class="card-value">{{ todayStats.orders }}</view>
        <view class="card-trend">{{ todayStats.orderTrend }}</view>
      </view>
      <view class="stats-card">
        <view class="card-title">今日收入</view>
        <view class="card-value">¥{{ todayStats.income }}</view>
        <view class="card-trend">{{ todayStats.incomeTrend }}</view>
      </view>
      <view class="stats-card">
        <view class="card-title">待接单</view>
        <view class="card-value">{{ todayStats.pending }}</view>
        <view class="card-trend">{{ todayStats.pendingTrend }}</view>
      </view>
      <view class="stats-card">
        <view class="card-title">进行中</view>
        <view class="card-value">{{ todayStats.inProgress }}</view>
        <view class="card-trend">{{ todayStats.inProgressTrend }}</view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="section-title">快捷操作</view>
      <view class="action-grid">
        <view class="action-item" @tap="navigateTo('orderList')">
          <u-icon name="order" size="32" color="#007AFF"></u-icon>
          <text>订单列表</text>
        </view>
        <view class="action-item" @tap="navigateTo('schedule')">
          <u-icon name="calendar" size="32" color="#4caf50"></u-icon>
          <text>日程管理</text>
        </view>
        <view class="action-item" @tap="navigateTo('income')">
          <u-icon name="rmb" size="32" color="#ff9800"></u-icon>
          <text>收入统计</text>
        </view>
        <view class="action-item" @tap="navigateTo('profile')">
          <u-icon name="account" size="32" color="#9c27b0"></u-icon>
          <text>个人中心</text>
        </view>
      </view>
    </view>

    <!-- 待接单订单 -->
    <view class="pending-orders">
      <view class="section-header">
        <view class="section-title">待接单订单</view>
        <view class="section-more" @tap="navigateTo('orderList')">查看全部 ></view>
      </view>
      <view class="order-list">
        <view 
          class="order-item" 
          v-for="(order, index) in pendingOrders" 
          :key="order.id"
          @tap="goToOrderDetail(order)"
        >
          <view class="order-header">
            <text class="order-no">{{ order.orderNo }}</text>
            <text class="order-time">{{ order.createTime }}</text>
          </view>
          <view class="order-content">
            <image :src="order.serviceImage" mode="aspectFill"></image>
            <view class="order-details">
              <text class="service-name">{{ order.serviceName }}</text>
              <text class="service-time">{{ order.serviceDate }} {{ order.serviceTime }}</text>
              <text class="service-address">{{ order.serviceAddress }}</text>
            </view>
            <view class="order-price">¥{{ order.totalPrice }}</view>
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
        <view class="section-title">今日日程</view>
        <view class="section-more" @tap="navigateTo('schedule')">查看全部 ></view>
      </view>
      <view class="schedule-list">
        <view 
          class="schedule-item" 
          v-for="(schedule, index) in todaySchedules" 
          :key="schedule.id"
          @tap="goToOrderDetail(schedule)"
        >
          <view class="schedule-time">
            <text class="time-range">{{ schedule.startTime }}-{{ schedule.endTime }}</text>
          </view>
          <view class="schedule-content">
            <image :src="schedule.serviceImage" mode="aspectFill"></image>
            <view class="schedule-details">
              <text class="service-name">{{ schedule.serviceName }}</text>
              <text class="customer-info">{{ schedule.customerName }} {{ schedule.customerPhone }}</text>
              <text class="service-address">{{ schedule.serviceAddress }}</text>
            </view>
            <view class="schedule-price">¥{{ schedule.totalPrice }}</view>
          </view>
          <view class="schedule-status">
            <u-tag :text="getStatusText(schedule.status)" :type="getStatusType(schedule.status)" size="mini"></u-tag>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      masterInfo: {
        id: 1,
        name: '王师傅',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        rating: 4.8,
        serviceCount: 128,
        totalOrders: 256,
        totalIncome: '25,680',
        completionRate: 98,
        phone: '13900139000'
      },
      todayStats: {
        orders: 5,
        orderTrend: '+2个',
        income: '680',
        incomeTrend: '+15%',
        pending: 2,
        pendingTrend: '2个待接单',
        inProgress: 3,
        inProgressTrend: '3个进行中'
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
      todaySchedules: [
        {
          id: 3,
          orderNo: 'WD202401150003',
          status: 2,
          startTime: '10:00',
          endTime: '12:00',
          serviceName: '洗衣机维修服务',
          serviceImage: 'https://images.unsplash.com/photo-1558024920-b41e1884dc51?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          customerName: '李女士',
          customerPhone: '13700137000',
          serviceAddress: '北京市西城区金融大街1号',
          totalPrice: '150.00'
        },
        {
          id: 4,
          orderNo: 'WD202401150004',
          status: 3,
          startTime: '13:00',
          endTime: '15:00',
          serviceName: '电视维修服务',
          serviceImage: 'https://images.unsplash.com/photo-1593359677879-a2bb988edcb5?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          customerName: '张先生',
          customerPhone: '13800138000',
          serviceAddress: '北京市东城区王府井大街1号',
          totalPrice: '200.00'
        },
        {
          id: 5,
          orderNo: 'WD202401150005',
          status: 3,
          startTime: '15:30',
          endTime: '17:30',
          serviceName: '热水器维修服务',
          serviceImage: 'https://images.unsplash.com/photo-1616455579100-2ceaa4234fc0?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          customerName: '赵女士',
          customerPhone: '13600136000',
          serviceAddress: '北京市丰台区丽泽路1号',
          totalPrice: '180.00'
        }
      ]
    }
  },
  onLoad() {
    this.loadMasterData()
  },
  methods: {
    // 加载师傅工作台数据
    async loadMasterData() {
      console.log('加载师傅工作台数据')
      // 这里可以调用API获取真实数据
    },
    
    // 导航到指定页面
    navigateTo(page) {
      const routes = {
        'orderList': '/pages/master/order/list',
        'schedule': '/pages/master/schedule/manage',
        'income': '/pages/master/income/statistics',
        'profile': '/pages/master/profile/profile'
      }
      
      uni.navigateTo({
        url: routes[page]
      })
    },
    
    // 跳转到订单详情
    goToOrderDetail(order) {
      uni.navigateTo({
        url: `/pages/master/order/detail?id=${order.id}`
      })
    },
    
    // 联系师傅
    callMaster() {
      uni.makePhoneCall({
        phoneNumber: this.masterInfo.phone
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
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        1: '待接单',
        2: '待开始',
        3: '进行中',
        4: '已完成',
        5: '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    
    // 获取状态类型
    getStatusType(status) {
      const typeMap = {
        1: 'warning',
        2: 'primary',
        3: 'success',
        4: 'info',
        5: 'error'
      }
      return typeMap[status] || 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.master-workbench {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
}

// 个人信息卡片
.profile-card {
  background: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      flex-shrink: 0;
    }
    
    .profile-info {
      flex: 1;
      
      .master-name {
        font-size: 32rpx;
        color: #333;
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
          color: #ff9800;
          margin-left: 10rpx;
        }
      }
      
      .master-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
    
    .profile-actions {
      flex-shrink: 0;
    }
  }
  
  .profile-stats {
    display: flex;
    justify-content: space-between;
    
    .stat-item {
      flex: 1;
      text-align: center;
      
      .stat-value {
        font-size: 36rpx;
        color: #333;
        font-weight: bold;
        display: block;
        margin-bottom: 5rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 统计卡片
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
  
  .stats-card {
    background: #fff;
    border-radius: 15rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    
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

// 待接单订单
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

// 今日日程
.today-schedule {
  background: #fff;
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
      border: 1rpx solid #f0f0f0;
      border-radius: 10rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .schedule-time {
        margin-bottom: 15rpx;
        
        .time-range {
          font-size: 26rpx;
          color: #007AFF;
          font-weight: 500;
        }
      }
      
      .schedule-content {
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
        
        .schedule-details {
          flex: 1;
          
          .service-name {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            display: block;
            margin-bottom: 5rpx;
          }
          
          .customer-info {
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
        
        .schedule-price {
          font-size: 32rpx;
          color: #ff6b35;
          font-weight: bold;
        }
      }
      
      .schedule-status {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>