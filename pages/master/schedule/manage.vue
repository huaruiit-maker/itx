<template>
  <view class="master-schedule-container">
    <!-- 日历组件 -->
    <view class="calendar-section">
      <view class="calendar-header">
        <view class="calendar-nav">
          <u-icon name="arrow-left" size="24" @tap="previousMonth"></u-icon>
          <text class="current-month">{{currentYear}}年{{currentMonth}}月</text>
          <u-icon name="arrow-right" size="24" @tap="nextMonth"></u-icon>
        </view>
        <view class="calendar-today" @tap="goToToday">
          <text>今天</text>
        </view>
      </view>
      
      <view class="calendar-weekdays">
        <view v-for="(day, index) in weekDays" :key="index" class="weekday">
          <text>{{day}}</text>
        </view>
      </view>
      
      <view class="calendar-days">
        <view 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="calendar-day"
          :class="{ 
            'other-month': day.otherMonth,
            'today': day.isToday,
            'selected': day.isSelected,
            'has-schedule': day.hasSchedule
          }"
          @tap="selectDay(day)"
        >
          <text class="day-number">{{day.day}}</text>
          <view v-if="day.hasSchedule" class="schedule-dot"></view>
        </view>
      </view>
    </view>

    <!-- 今日日程统计 -->
    <view class="today-summary">
      <view class="summary-item">
        <text class="summary-number">{{todayScheduleCount}}</text>
        <text class="summary-label">今日订单</text>
      </view>
      <view class="summary-item">
        <text class="summary-number">{{todayIncome}}</text>
        <text class="summary-label">预计收入</text>
      </view>
      <view class="summary-item">
        <text class="summary-number">{{availableSlots}}</text>
        <text class="summary-label">空闲时段</text>
      </view>
    </view>

    <!-- 日程列表 -->
    <view class="schedule-list-section">
      <view class="section-header">
        <text class="section-title">{{selectedDate}} 日程</text>
        <view class="header-actions">
          <u-button size="mini" plain @tap="addSchedule">添加日程</u-button>
          <u-button type="primary" size="mini" @tap="setWorkTime">设置工作时间</u-button>
        </view>
      </view>

      <scroll-view scroll-y class="schedule-scroll">
        <view class="schedule-list">
          <view 
            v-for="(schedule, index) in scheduleList" 
            :key="schedule.id"
            class="schedule-item"
            :class="schedule.status"
            @tap="goToScheduleDetail(schedule)"
          >
            <view class="schedule-time">
              <text class="time-range">{{schedule.startTime}} - {{schedule.endTime}}</text>
              <text class="duration">{{schedule.duration}}</text>
            </view>
            
            <view class="schedule-content">
              <view class="content-header">
                <text class="service-name">{{schedule.serviceName}}</text>
                <text class="order-status" :class="schedule.status">{{schedule.statusText}}</text>
              </view>
              <text class="customer-name">{{schedule.customerName}} {{schedule.customerPhone}}</text>
              <text class="service-address">{{schedule.serviceAddress}}</text>
              <view class="service-tags">
                <text v-for="(tag, tagIndex) in schedule.serviceTags" :key="tagIndex" class="service-tag">{{tag}}</text>
              </view>
            </view>
            
            <view class="schedule-actions">
              <view class="price-info">
                <text class="service-price">¥{{schedule.servicePrice}}</text>
                <text class="commission">佣金: ¥{{schedule.commission}}</text>
              </view>
              <view class="action-buttons">
                <u-button 
                  v-if="schedule.status === 'pending'"
                  size="mini" 
                  plain
                  @tap.stop="cancelSchedule(schedule)"
                >取消</u-button>
                <u-button 
                  v-if="schedule.status === 'pending'"
                  type="primary" 
                  size="mini"
                  @tap.stop="confirmSchedule(schedule)"
                >确认</u-button>
                <u-button 
                  v-if="schedule.status === 'confirmed'"
                  type="primary" 
                  size="mini"
                  @tap.stop="startService(schedule)"
                >开始</u-button>
                <u-button 
                  v-if="schedule.status === 'processing'"
                  type="success" 
                  size="mini"
                  @tap.stop="completeService(schedule)"
                >完成</u-button>
                <u-button 
                  size="mini" 
                  plain
                  @tap.stop="callCustomer(schedule)"
                >联系</u-button>
                <u-button 
                  size="mini" 
                  plain
                  @tap.stop="navigateToAddress(schedule)"
                >导航</u-button>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="scheduleList.length === 0">
          <u-empty
            mode="list"
            text="暂无日程安排"
            icon="/static/images/placeholder_1.png"
          >
          </u-empty>
          <view class="empty-tips">
            <text>点击"添加日程"或"设置工作时间"来安排您的日程</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentYear: 2024,
      currentMonth: 1,
      currentDay: 15,
      selectedDay: 15,
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      calendarDays: [],
      todayScheduleCount: 3,
      todayIncome: '¥580',
      availableSlots: 2,
      selectedDate: '2024-01-15',
      scheduleList: []
    }
  },
  onLoad() {
    this.initCalendar()
    this.loadScheduleList()
  },
  methods: {
    // 初始化日历
    initCalendar() {
      const now = new Date()
      this.currentYear = now.getFullYear()
      this.currentMonth = now.getMonth() + 1
      this.currentDay = now.getDate()
      this.selectedDay = this.currentDay
      this.generateCalendar()
    },

    // 生成日历
    generateCalendar() {
      const days = []
      const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth, 0)
      const firstDayWeek = firstDay.getDay()
      const lastDayDate = lastDay.getDate()

      // 上月日期
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth - 1, 0).getDate()
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        days.push({
          day: prevMonthLastDay - i,
          otherMonth: true,
          isToday: false,
          isSelected: false,
          hasSchedule: Math.random() > 0.7
        })
      }

      // 当月日期
      const today = new Date()
      for (let i = 1; i <= lastDayDate; i++) {
        const isToday = this.currentYear === today.getFullYear() && 
                       this.currentMonth === today.getMonth() + 1 && 
                       i === today.getDate()
        const isSelected = i === this.selectedDay
        
        days.push({
          day: i,
          otherMonth: false,
          isToday: isToday,
          isSelected: isSelected,
          hasSchedule: Math.random() > 0.6
        })
      }

      // 下月日期
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i,
          otherMonth: true,
          isToday: false,
          isSelected: false,
          hasSchedule: Math.random() > 0.7
        })
      }

      this.calendarDays = days
      this.updateSelectedDate()
    },

    // 选择日期
    selectDay(day) {
      if (day.otherMonth) return
      this.selectedDay = day.day
      this.generateCalendar()
      this.loadScheduleList()
    },

    // 上一月
    previousMonth() {
      this.currentMonth--
      if (this.currentMonth < 1) {
        this.currentMonth = 12
        this.currentYear--
      }
      this.generateCalendar()
      this.loadScheduleList()
    },

    // 下一月
    nextMonth() {
      this.currentMonth++
      if (this.currentMonth > 12) {
        this.currentMonth = 1
        this.currentYear++
      }
      this.generateCalendar()
      this.loadScheduleList()
    },

    // 回到今天
    goToToday() {
      this.initCalendar()
      this.loadScheduleList()
    },

    // 更新选中日期显示
    updateSelectedDate() {
      this.selectedDate = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-${String(this.selectedDay).padStart(2, '0')}`
    },

    // 加载日程列表
    loadScheduleList() {
      // 模拟API请求
      setTimeout(() => {
        this.scheduleList = this.generateMockSchedule()
      }, 500)
    },

    // 生成模拟日程数据
    generateMockSchedule() {
      const statusMap = {
        pending: { text: '待确认', class: 'status-pending' },
        confirmed: { text: '已确认', class: 'status-confirmed' },
        processing: { text: '服务中', class: 'status-processing' },
        completed: { text: '已完成', class: 'status-completed' },
        cancelled: { text: '已取消', class: 'status-cancelled' }
      }

      const schedules = []
      const timeSlots = [
        { start: '09:00', end: '11:00' },
        { start: '14:00', end: '16:00' },
        { start: '16:00', end: '18:00' },
        { start: '19:00', end: '21:00' }
      ]

      const services = [
        '空调维修清洗',
        '冰箱维修清洗',
        '洗衣机维修',
        '热水器维修',
        '电视维修'
      ]

      const customers = [
        { name: '张先生', phone: '13800138000', address: '朝阳区建国门外大街1号' },
        { name: '李女士', phone: '13900139000', address: '海淀区中关村大街1号' },
        { name: '王先生', phone: '13700137000', address: '西城区金融大街1号' },
        { name: '赵女士', phone: '13600136000', address: '东城区王府井大街1号' }
      ]

      for (let i = 0; i < 3; i++) {
        const timeSlot = timeSlots[i]
        const service = services[Math.floor(Math.random() * services.length)]
        const customer = customers[Math.floor(Math.random() * customers.length)]
        const status = ['pending', 'confirmed', 'processing', 'completed'][Math.floor(Math.random() * 4)]
        const price = (89 + Math.floor(Math.random() * 200)).toFixed(2)
        const commission = (parseFloat(price) * 0.8).toFixed(2)

        schedules.push({
          id: i + 1,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          duration: '2小时',
          serviceName: service,
          customerName: customer.name,
          customerPhone: customer.phone,
          serviceAddress: customer.address,
          serviceTags: ['标准服务', '上门维修'],
          servicePrice: price,
          commission: commission,
          status: status,
          statusText: statusMap[status].text,
          statusClass: statusMap[status].class
        })
      }

      return schedules
    },

    // 添加日程
    addSchedule() {
      uni.navigateTo({
        url: '/pages/master/schedule/add'
      })
    },

    // 设置工作时间
    setWorkTime() {
      uni.navigateTo({
        url: '/pages/master/schedule/work-time'
      })
    },

    // 跳转到日程详情
    goToScheduleDetail(schedule) {
      uni.navigateTo({
        url: `/pages/master/schedule/detail?id=${schedule.id}`
      })
    },

    // 确认日程
    confirmSchedule(schedule) {
      uni.showModal({
        title: '确认日程',
        content: '确定要确认这个日程吗？',
        success: (res) => {
          if (res.confirm) {
            schedule.status = 'confirmed'
            schedule.statusText = '已确认'
            schedule.statusClass = 'status-confirmed'
            
            uni.showToast({
              title: '确认成功',
              icon: 'success'
            })
          }
        }
      })
    },

    // 取消日程
    cancelSchedule(schedule) {
      uni.showModal({
        title: '取消日程',
        content: '确定要取消这个日程吗？请说明原因',
        editable: true,
        placeholderText: '请输入取消原因',
        success: (res) => {
          if (res.confirm && res.content) {
            schedule.status = 'cancelled'
            schedule.statusText = '已取消'
            schedule.statusClass = 'status-cancelled'
            
            uni.showToast({
              title: '取消成功',
              icon: 'success'
            })
          } else if (res.confirm && !res.content) {
            uni.showToast({
              title: '请输入取消原因',
              icon: 'none'
            })
          }
        }
      })
    },

    // 开始服务
    startService(schedule) {
      uni.showModal({
        title: '开始服务',
        content: '确定要开始服务吗？',
        success: (res) => {
          if (res.confirm) {
            schedule.status = 'processing'
            schedule.statusText = '服务中'
            schedule.statusClass = 'status-processing'
            
            uni.showToast({
              title: '服务已开始',
              icon: 'success'
            })
          }
        }
      })
    },

    // 完成服务
    completeService(schedule) {
      uni.showModal({
        title: '完成服务',
        content: '确定要完成服务吗？',
        success: (res) => {
          if (res.confirm) {
            schedule.status = 'completed'
            schedule.statusText = '已完成'
            schedule.statusClass = 'status-completed'
            
            uni.showToast({
              title: '服务已完成',
              icon: 'success'
            })
          }
        }
      })
    },

    // 联系客户
    callCustomer(schedule) {
      uni.makePhoneCall({
        phoneNumber: schedule.customerPhone
      })
    },

    // 导航到地址
    navigateToAddress(schedule) {
      uni.openLocation({
        latitude: 39.9042,
        longitude: 116.4074,
        name: schedule.serviceAddress,
        address: schedule.serviceAddress,
        success: () => {
          console.log('打开地图成功')
        },
        fail: (err) => {
          console.error('打开地图失败:', err)
          uni.showToast({
            title: '导航失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.master-schedule-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

// 日历部分
.calendar-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .calendar-nav {
      display: flex;
      align-items: center;
      gap: 30rpx;
      
      .current-month {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
      }
    }
    
    .calendar-today {
      background: #007AFF;
      color: #fff;
      padding: 10rpx 20rpx;
      border-radius: 20rpx;
      font-size: 26rpx;
    }
  }
  
  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10rpx;
    margin-bottom: 20rpx;
    
    .weekday {
      text-align: center;
      padding: 20rpx 0;
      
      text {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10rpx;
    
    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 10rpx;
      position: relative;
      
      &.other-month {
        opacity: 0.3;
      }
      
      &.today {
        background: #007AFF;
        color: #fff;
      }
      
      &.selected {
        background: #e3f2fd;
        color: #007AFF;
      }
      
      &.has-schedule {
        .schedule-dot {
          position: absolute;
          bottom: 8rpx;
          width: 8rpx;
          height: 8rpx;
          background: #ff6b35;
          border-radius: 50%;
        }
      }
      
      .day-number {
        font-size: 28rpx;
        font-weight: 500;
      }
    }
  }
}

// 今日统计
.today-summary {
  background: #fff;
  padding: 30rpx;
  margin: 0 20rpx 20rpx;
  border-radius: 15rpx;
  display: flex;
  justify-content: space-around;
  
  .summary-item {
    text-align: center;
    
    .summary-number {
      font-size: 36rpx;
      color: #333;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .summary-label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

// 日程列表部分
.schedule-list-section {
  flex: 1;
  background: #fff;
  margin: 0 20rpx;
  border-radius: 15rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  
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
    
    .header-actions {
      display: flex;
      gap: 15rpx;
    }
  }
  
  .schedule-scroll {
    flex: 1;
    
    .schedule-list {
      .schedule-item {
        border: 1rpx solid #f0f0f0;
        border-radius: 10rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        &.status-pending {
          border-color: #fff3cd;
          background: #fffbf0;
        }
        
        &.status-confirmed {
          border-color: #d1e8ff;
          background: #f0f8ff;
        }
        
        &.status-processing {
          border-color: #d4edda;
          background: #f0fff4;
        }
        
        &.status-completed {
          border-color: #d1ecf1;
          background: #f0f8ff;
        }
        
        &.status-cancelled {
          border-color: #f5f5f5;
          background: #fafafa;
          opacity: 0.7;
        }
        
        .schedule-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15rpx;
          
          .time-range {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
          }
          
          .duration {
            font-size: 24rpx;
            color: #666;
          }
        }
        
        .schedule-content {
          margin-bottom: 15rpx;
          
          .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10rpx;
            
            .service-name {
              font-size: 30rpx;
              color: #333;
              font-weight: 500;
            }
            
            .order-status {
              font-size: 24rpx;
              padding: 4rpx 10rpx;
              border-radius: 5rpx;
              
              &.status-pending {
                color: #856404;
                background: #fff3cd;
              }
              
              &.status-confirmed {
                color: #007AFF;
                background: #d1e8ff;
              }
              
              &.status-processing {
                color: #4caf50;
                background: #d4edda;
              }
              
              &.status-completed {
                color: #00bcd4;
                background: #d1ecf1;
              }
              
              &.status-cancelled {
                color: #999;
                background: #f5f5f5;
              }
            }
          }
          
          .customer-name {
            font-size: 26rpx;
            color: #666;
            display: block;
            margin-bottom: 5rpx;
          }
          
          .service-address {
            font-size: 24rpx;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            margin-bottom: 10rpx;
          }
          
          .service-tags {
            display: flex;
            gap: 10rpx;
            
            .service-tag {
              font-size: 20rpx;
              color: #999;
              background: #f5f5f5;
              padding: 4rpx 8rpx;
              border-radius: 4rpx;
            }
          }
        }
        
        .schedule-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .price-info {
            .service-price {
              font-size: 32rpx;
              color: #ff6b35;
              font-weight: bold;
              display: block;
            }
            
            .commission {
              font-size: 24rpx;
              color: #666;
            }
          }
          
          .action-buttons {
            display: flex;
            gap: 10rpx;
            
            .u-btn {
              min-width: 100rpx;
            }
          }
        }
      }
      
      // 空状态
      .empty-state {
        padding: 100rpx 0;
        text-align: center;
        
        .empty-tips {
          margin-top: 20rpx;
          
          text {
            font-size: 26rpx;
            color: #999;
          }
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