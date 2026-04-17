<template>
  <view class="business-order-list">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-tabs">
        <view 
          v-for="(tab, index) in tabs" 
          :key="index" 
          class="filter-tab" 
          :class="{ active: currentTab === index }"
          @tap="switchTab(index)"
        >
          {{ tab.name }}
        </view>
      </view>
      <view class="filter-btn" @tap="showFilterPopup">
        <u-icon name="filter" size="24" color="#666"></u-icon>
        <text>筛选</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view 
        class="order-item" 
        v-for="(order, index) in orderList" 
        :key="order.id"
        @tap="goToOrderDetail(order)"
      >
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :style="{ color: getStatusColor(order.status) }">
            {{ getStatusText(order.status) }}
          </text>
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
        
        <view class="order-footer">
          <text class="order-time">下单时间：{{ order.createTime }}</text>
          <view class="order-actions">
            <u-button 
              v-if="order.status === 1" 
              size="mini" 
              plain 
              @tap.stop="rejectOrder(order)"
            >拒单</u-button>
            <u-button 
              v-if="order.status === 1" 
              type="primary" 
              size="mini" 
              @tap.stop="acceptOrder(order)"
            >接单</u-button>
            <u-button 
              v-if="order.status === 2" 
              type="primary" 
              size="mini" 
              @tap.stop="assignMaster(order)"
            >分配师傅</u-button>
            <u-button 
              v-if="order.status === 3" 
              size="mini" 
              plain 
              @tap.stop="contactCustomer(order)"
            >联系客户</u-button>
            <u-button 
              v-if="order.status === 4" 
              type="primary" 
              size="mini" 
              @tap.stop="confirmComplete(order)"
            >确认完成</u-button>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <u-loadmore 
        :status="loadMoreStatus" 
        @loadmore="loadMoreOrders"
      ></u-loadmore>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="orderList.length === 0">
        <u-empty 
          mode="order" 
          text="暂无订单"
        ></u-empty>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <u-popup v-model="showFilter" mode="bottom" border-radius="20">
      <view class="filter-popup">
        <view class="filter-header">
          <text>订单筛选</text>
          <u-icon name="close" size="28" @tap="closeFilterPopup"></u-icon>
        </view>
        
        <view class="filter-section">
          <view class="filter-title">订单状态</view>
          <view class="filter-options">
            <view 
              v-for="(status, index) in statusOptions" 
              :key="index"
              class="filter-option"
              :class="{ active: filterStatus === status.value }"
              @tap="selectFilterStatus(status.value)"
            >
              {{ status.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <view class="filter-title">日期范围</view>
          <view class="date-range">
            <view class="date-picker" @tap="openDatePicker('start')">
              <text>{{ filterDateRange.start || '开始日期' }}</text>
              <u-icon name="calendar" size="24"></u-icon>
            </view>
            <text class="date-separator">至</text>
            <view class="date-picker" @tap="openDatePicker('end')">
              <text>{{ filterDateRange.end || '结束日期' }}</text>
              <u-icon name="calendar" size="24"></u-icon>
            </view>
          </view>
        </view>
        
        <view class="filter-actions">
          <u-button plain @tap="resetFilter">重置</u-button>
          <u-button type="primary" @tap="applyFilter">确定</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { name: '全部', status: 0 },
        { name: '待接单', status: 1 },
        { name: '待分配', status: 2 },
        { name: '进行中', status: 3 },
        { name: '待确认', status: 4 }
      ],
      currentTab: 0,
      orderList: [
        {
          id: 1,
          orderNo: 'WD202401150001',
          status: 1,
          createTime: '2024-01-15 13:30',
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
          status: 2,
          createTime: '2024-01-15 14:15',
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
          status: 3,
          createTime: '2024-01-14 09:20',
          serviceName: '洗衣机维修服务',
          serviceImage: 'https://images.unsplash.com/photo-1558024920-b41e1884dc51?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          serviceTime: '10:00-12:00',
          serviceAddress: '北京市西城区金融大街1号',
          totalPrice: '150.00'
        },
        {
          id: 4,
          orderNo: 'WD202401150004',
          status: 4,
          createTime: '2024-01-14 15:45',
          serviceName: '电视维修服务',
          serviceImage: 'https://images.unsplash.com/photo-1593359677879-a2bb988edcb5?w=200&h=150&fit=crop',
          serviceDate: '2024-01-15',
          serviceTime: '13:00-15:00',
          serviceAddress: '北京市东城区王府井大街1号',
          totalPrice: '200.00'
        }
      ],
      loadMoreStatus: 'loadmore',
      showFilter: false,
      filterStatus: 0,
      filterDateRange: {
        start: '',
        end: ''
      },
      statusOptions: [
        { label: '全部', value: 0 },
        { label: '待接单', value: 1 },
        { label: '待分配', value: 2 },
        { label: '进行中', value: 3 },
        { label: '待确认', value: 4 },
        { label: '已完成', value: 5 },
        { label: '已取消', value: 6 }
      ]
    }
  },
  onLoad() {
    this.loadOrders()
  },
  methods: {
    // 加载订单列表
    async loadOrders() {
      console.log('加载订单列表，状态：', this.tabs[this.currentTab].status)
      // 这里可以调用API获取真实数据
    },
    
    // 切换标签
    switchTab(index) {
      this.currentTab = index
      this.orderList = [] // 清空当前列表
      this.loadOrders() // 重新加载数据
    },
    
    // 加载更多订单
    loadMoreOrders() {
      if (this.loadMoreStatus === 'nomore') return
      
      this.loadMoreStatus = 'loading'
      
      // 模拟加载更多数据
      setTimeout(() => {
        // 这里可以调用API获取更多数据
        this.loadMoreStatus = 'nomore'
      }, 1000)
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        1: '待接单',
        2: '待分配',
        3: '进行中',
        4: '待确认',
        5: '已完成',
        6: '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    
    // 获取状态颜色
    getStatusColor(status) {
      const colorMap = {
        1: '#ff9800', // 待接单 - 橙色
        2: '#2196f3', // 待分配 - 蓝色
        3: '#4caf50', // 进行中 - 绿色
        4: '#9c27b0', // 待确认 - 紫色
        5: '#607d8b', // 已完成 - 灰色
        6: '#f44336'  // 已取消 - 红色
      }
      return colorMap[status] || '#666'
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
            order.status = 2
            
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
            order.status = 6
            
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
    
    // 分配师傅
    assignMaster(order) {
      uni.navigateTo({
        url: `/pages/business/master/assign?orderId=${order.id}`
      })
    },
    
    // 联系客户
    contactCustomer(order) {
      uni.makePhoneCall({
        phoneNumber: '13800138000' // 这里应该是订单中的客户电话
      })
    },
    
    // 确认完成
    confirmComplete(order) {
      uni.showModal({
        title: '确认完成',
        content: '确定要确认这个订单已完成吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟确认完成操作
            order.status = 5
            
            uni.showToast({
              title: '操作成功',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 显示筛选弹窗
    showFilterPopup() {
      this.showFilter = true
    },
    
    // 关闭筛选弹窗
    closeFilterPopup() {
      this.showFilter = false
    },
    
    // 选择筛选状态
    selectFilterStatus(status) {
      this.filterStatus = status
    },
    
    // 打开日期选择器
    openDatePicker(type) {
      // 这里可以调用日期选择器组件
      uni.showToast({
        title: `选择${type === 'start' ? '开始' : '结束'}日期`,
        icon: 'none'
      })
    },
    
    // 重置筛选条件
    resetFilter() {
      this.filterStatus = 0
      this.filterDateRange = {
        start: '',
        end: ''
      }
    },
    
    // 应用筛选条件
    applyFilter() {
      this.closeFilterPopup()
      this.orderList = [] // 清空当前列表
      this.loadOrders() // 重新加载数据
    }
  }
}
</script>

<style lang="scss" scoped>
.business-order-list {
  min-height: 100vh;
  background-color: #f8f8f8;
}

// 筛选栏
.filter-bar {
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .filter-tabs {
    display: flex;
    flex: 1;
    
    .filter-tab {
      font-size: 28rpx;
      color: #666;
      margin-right: 30rpx;
      padding-bottom: 10rpx;
      position: relative;
      
      &.active {
        color: #007AFF;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4rpx;
          background-color: #007AFF;
          border-radius: 2rpx;
        }
      }
    }
  }
  
  .filter-btn {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #666;
    
    text {
      margin-left: 5rpx;
    }
  }
}

// 订单列表
.order-list {
  padding: 20rpx;
  
  .order-item {
    background: #fff;
    border-radius: 15rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .order-no {
        font-size: 26rpx;
        color: #666;
      }
      
      .order-status {
        font-size: 26rpx;
        font-weight: bold;
      }
    }
    
    .order-content {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      image {
        width: 120rpx;
        height: 90rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
      
      .order-details {
        flex: 1;
        
        .service-name {
          font-size: 30rpx;
          color: #333;
          font-weight: 500;
          display: block;
          margin-bottom: 10rpx;
        }
        
        .service-time {
          font-size: 26rpx;
          color: #666;
          display: block;
          margin-bottom: 5rpx;
        }
        
        .service-address {
          font-size: 26rpx;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .order-price {
        font-size: 36rpx;
        color: #ff6b35;
        font-weight: bold;
      }
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .order-time {
        font-size: 24rpx;
        color: #999;
      }
      
      .order-actions {
        display: flex;
        gap: 15rpx;
        
        .u-btn {
          min-width: 120rpx;
        }
      }
    }
  }
}

// 空状态
.empty-state {
  padding: 100rpx 0;
}

// 筛选弹窗
.filter-popup {
  padding: 30rpx;
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    text {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
  }
  
  .filter-section {
    margin-bottom: 40rpx;
    
    .filter-title {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 20rpx;
    }
    
    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .filter-option {
        padding: 10rpx 25rpx;
        background: #f5f5f5;
        border-radius: 30rpx;
        font-size: 26rpx;
        color: #666;
        
        &.active {
          background: #e6f2ff;
          color: #007AFF;
        }
      }
    }
    
    .date-range {
      display: flex;
      align-items: center;
      
      .date-picker {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background: #f5f5f5;
        border-radius: 10rpx;
        
        text {
          font-size: 26rpx;
          color: #666;
        }
      }
      
      .date-separator {
        margin: 0 20rpx;
        font-size: 26rpx;
        color: #666;
      }
    }
  }
  
  .filter-actions {
    display: flex;
    gap: 20rpx;
    
    .u-btn {
      flex: 1;
    }
  }
}
</style>