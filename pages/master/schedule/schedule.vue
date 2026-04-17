<template>
	<view class="master-schedule-container">
		<!-- 日期选择器 -->
		<view class="date-selector">
			<view class="date-header">
				<text class="current-date">{{ currentDate }}</text>
				<u-button type="primary" size="mini" plain @click="showDatePicker = true">
					选择日期
				</u-button>
			</view>
			
			<scroll-view scroll-x class="date-tabs">
				<view 
					class="date-tab" 
					v-for="date in weekDates" 
					:key="date.value"
					:class="{ active: selectedDate === date.value }"
					@click="selectDate(date.value)"
				>
					<text class="date-label">{{ date.label }}</text>
					<text class="date-value">{{ date.value }}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 时间轴 -->
		<view class="timeline-section">
			<view class="timeline-header">
				<text class="section-title">今日日程</text>
				<u-button type="primary" size="mini" @click="addSchedule">添加日程</u-button>
			</view>
			
			<view class="timeline-container">
				<view class="time-slots">
					<view class="time-slot" v-for="hour in timeSlots" :key="hour">
						<text class="hour-label">{{ hour }}:00</text>
						<view class="slot-content">
							<view 
								class="schedule-item" 
								v-for="schedule in getScheduleByHour(hour)" 
								:key="schedule.id"
								:style="{ backgroundColor: getScheduleColor(schedule.type) }"
								@click="viewSchedule(schedule)"
							>
								<view class="schedule-header">
									<text class="schedule-title">{{ schedule.title }}</text>
									<text class="schedule-time">{{ schedule.startTime }} - {{ schedule.endTime }}</text>
								</view>
								<view class="schedule-info">
									<text class="schedule-location" v-if="schedule.location">
										<u-icon name="map" size="20" color="#666666"></u-icon>
										{{ schedule.location }}
									</text>
									<text class="schedule-customer" v-if="schedule.customer">
										<u-icon name="account" size="20" color="#666666"></u-icon>
										{{ schedule.customer }}
									</text>
								</view>
								<view class="schedule-status">
									<u-tag 
										:text="getStatusText(schedule.status)" 
										:type="getStatusType(schedule.status)"
										size="mini"
									></u-tag>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 统计信息 -->
		<view class="stats-section">
			<view class="stat-card">
				<view class="stat-header">
					<u-icon name="clock" size="32" color="#1890ff"></u-icon>
					<text class="stat-title">今日预约</text>
				</view>
				<view class="stat-value">{{ todayAppointments }}</view>
				<view class="stat-desc">已完成 {{ completedToday }}/{{ todayAppointments }}</view>
			</view>
			
			<view class="stat-card">
				<view class="stat-header">
					<u-icon name="rmb" size="32" color="#52c41a"></u-icon>
					<text class="stat-title">预计收入</text>
				</view>
				<view class="stat-value">¥{{ todayIncome }}</view>
				<view class="stat-desc">今日收入</view>
			</view>
			
			<view class="stat-card">
				<view class="stat-header">
					<u-icon name="star" size="32" color="#fa8c16"></u-icon>
					<text class="stat-title">服务评分</text>
				</view>
				<view class="stat-value">{{ averageRating }}</view>
				<view class="stat-desc">平均评分</view>
			</view>
		</view>

		<!-- 添加日程弹窗 -->
		<u-popup v-model="showAddSchedule" mode="bottom" border-radius="16">
			<view class="add-schedule-popup">
				<view class="popup-header">
					<text class="popup-title">添加日程</text>
					<u-icon name="close" size="24" color="#999999" @click="showAddSchedule = false"></u-icon>
				</view>
				
				<view class="schedule-form">
					<view class="form-item">
						<text class="form-label">日程标题</text>
						<u-input 
							v-model="newSchedule.title" 
							placeholder="请输入日程标题"
							border="bottom"
						></u-input>
					</view>
					
					<view class="form-item">
						<text class="form-label">开始时间</text>
						<u-input 
							v-model="newSchedule.startTime" 
							placeholder="请选择开始时间"
							border="bottom"
							@click="showStartTimePicker = true"
							disabled
						></u-input>
					</view>
					
					<view class="form-item">
						<text class="form-label">结束时间</text>
						<u-input 
							v-model="newSchedule.endTime" 
							placeholder="请选择结束时间"
							border="bottom"
							@click="showEndTimePicker = true"
							disabled
						></u-input>
					</view>
					
					<view class="form-item">
						<text class="form-label">客户姓名</text>
						<u-input 
							v-model="newSchedule.customer" 
							placeholder="请输入客户姓名"
							border="bottom"
						></u-input>
					</view>
					
					<view class="form-item">
						<text class="form-label">服务地址</text>
						<u-input 
							v-model="newSchedule.location" 
							placeholder="请输入服务地址"
							border="bottom"
						></u-input>
					</view>
					
					<view class="form-item">
						<text class="form-label">服务类型</text>
						<u-radio-group v-model="newSchedule.type">
							<u-radio name="repair">维修服务</u-radio>
							<u-radio name="install">安装服务</u-radio>
							<u-radio name="clean">清洗服务</u-radio>
							<u-radio name="other">其他服务</u-radio>
						</u-radio-group>
					</view>
				</view>
				
				<view class="popup-actions">
					<u-button type="default" plain @click="showAddSchedule = false">取消</u-button>
					<u-button type="primary" @click="saveSchedule">保存</u-button>
				</view>
			</view>
		</u-popup>

		<!-- 时间选择器 -->
		<u-picker 
			v-model="showStartTimePicker" 
			mode="time" 
			:params="timeParams"
			@confirm="handleStartTimeSelect"
		></u-picker>
		
		<u-picker 
			v-model="showEndTimePicker" 
			mode="time" 
			:params="timeParams"
			@confirm="handleEndTimeSelect"
		></u-picker>
		
		<!-- 日期选择器 -->
		<u-calendar 
			v-model="showDatePicker" 
			mode="date" 
			@change="handleDateChange"
		></u-calendar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentDate: '',
			selectedDate: '',
			weekDates: [],
			timeSlots: [],
			schedules: [],
			todayAppointments: 8,
			completedToday: 5,
			todayIncome: 1280,
			averageRating: 4.8,
			showAddSchedule: false,
			showDatePicker: false,
			showStartTimePicker: false,
			showEndTimePicker: false,
			timeParams: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
			},
			newSchedule: {
				title: '',
				startTime: '',
				endTime: '',
				customer: '',
				location: '',
				type: 'repair',
				status: 'pending'
			}
		}
	},
	onLoad() {
		this.initDateData()
		this.loadScheduleData()
	},
	methods: {
		initDateData() {
			const today = new Date()
			this.currentDate = this.formatDate(today)
			this.selectedDate = this.formatDate(today)
			
			// 生成一周日期
			const weekDates = []
			for (let i = 0; i < 7; i++) {
				const date = new Date(today)
				date.setDate(today.getDate() + i)
				weekDates.push({
					label: i === 0 ? '今天' : i === 1 ? '明天' : this.getWeekDay(date),
					value: this.formatDate(date)
				})
			}
			this.weekDates = weekDates
			
			// 生成时间槽
			const timeSlots = []
			for (let i = 8; i <= 20; i++) {
				timeSlots.push(i)
			}
			this.timeSlots = timeSlots
		},
		loadScheduleData() {
			// 模拟加载日程数据
			this.schedules = [
				{
					id: 1,
					title: '空调维修服务',
					startTime: '09:00',
					endTime: '10:30',
					customer: '张先生',
					location: '朝阳区建国路88号SOHO现代城A座1502室',
					type: 'repair',
					status: 'completed',
					hour: 9
				},
				{
					id: 2,
					title: '冰箱安装服务',
					startTime: '11:00',
					endTime: '12:00',
					customer: '李女士',
					location: '海淀区中关村大街1号中关村广场3号楼1201室',
					type: 'install',
					status: 'processing',
					hour: 11
				},
				{
					id: 3,
					title: '洗衣机清洗服务',
					startTime: '14:00',
					endTime: '15:30',
					customer: '王女士',
					location: '西城区金融街甲9号金融街中心15层',
					type: 'clean',
					status: 'pending',
					hour: 14
				},
				{
					id: 4,
					title: '空调清洗保养',
					startTime: '16:00',
					endTime: '17:00',
					customer: '赵先生',
					location: '东城区王府井大街99号',
					type: 'clean',
					status: 'pending',
					hour: 16
				}
			]
		},
		formatDate(date) {
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const day = date.getDate().toString().padStart(2, '0')
			return `${month}-${day}`
		},
		getWeekDay(date) {
			const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
			return days[date.getDay()]
		},
		selectDate(date) {
			this.selectedDate = date
			this.loadScheduleData()
		},
		getScheduleByHour(hour) {
			return this.schedules.filter(schedule => schedule.hour === hour)
		},
		getScheduleColor(type) {
			const colorMap = {
				repair: '#1890ff20',
				install: '#52c41a20',
				clean: '#fa8c1620',
				other: '#722ed120'
			}
			return colorMap[type] || '#99999920'
		},
		getStatusText(status) {
			const statusMap = {
				pending: '待处理',
				processing: '进行中',
				completed: '已完成',
				cancelled: '已取消'
			}
			return statusMap[status] || '未知状态'
		},
		getStatusType(status) {
			const typeMap = {
				pending: 'warning',
				processing: 'primary',
				completed: 'success',
				cancelled: 'error'
			}
			return typeMap[status] || 'info'
		},
		viewSchedule(schedule) {
			uni.navigateTo({
				url: `/pages/master/schedule/detail?id=${schedule.id}`
			})
		},
		addSchedule() {
			this.showAddSchedule = true
			this.resetNewSchedule()
		},
		resetNewSchedule() {
			this.newSchedule = {
				title: '',
				startTime: '',
				endTime: '',
				customer: '',
				location: '',
				type: 'repair',
				status: 'pending'
			}
		},
		handleStartTimeSelect(e) {
			this.newSchedule.startTime = `${e.hour}:${e.minute}`
		},
		handleEndTimeSelect(e) {
			this.newSchedule.endTime = `${e.hour}:${e.minute}`
		},
		handleDateChange(e) {
			this.selectedDate = this.formatDate(new Date(e.date))
			this.loadScheduleData()
		},
		saveSchedule() {
			if (!this.newSchedule.title || !this.newSchedule.startTime || !this.newSchedule.endTime) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			// 解析小时
			const startHour = parseInt(this.newSchedule.startTime.split(':')[0])
			this.newSchedule.hour = startHour
			
			// 添加到日程列表
			this.schedules.push({
				...this.newSchedule,
				id: Date.now()
			})
			
			this.showAddSchedule = false
			uni.showToast({
				title: '日程添加成功',
				icon: 'success'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.master-schedule-container {
	background-color: #f8f8f8;
	min-height: 100vh;
}

.date-selector {
	background-color: #ffffff;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.date-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.current-date {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.date-tabs {
	white-space: nowrap;
}

.date-tab {
	display: inline-block;
	padding: 20rpx 30rpx;
	text-align: center;
	margin-right: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	cursor: pointer;
}

.date-tab.active {
	background-color: #007AFF;
	color: #ffffff;
}

.date-label {
	display: block;
	font-size: 24rpx;
	margin-bottom: 8rpx;
}

.date-value {
	display: block;
	font-size: 28rpx;
	font-weight: bold;
}

.timeline-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.timeline-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.timeline-container {
	max-height: 800rpx;
	overflow-y: auto;
}

.time-slots {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.time-slot {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
}

.hour-label {
	width: 100rpx;
	font-size: 28rpx;
	color: #666666;
	font-weight: 500;
	padding-top: 20rpx;
}

.slot-content {
	flex: 1;
	min-height: 100rpx;
	border-left: 2rpx solid #f0f0f0;
	padding-left: 20rpx;
	position: relative;
}

.slot-content::before {
	content: '';
	position: absolute;
	left: -6rpx;
	top: 30rpx;
	width: 12rpx;
	height: 12rpx;
	background-color: #007AFF;
	border-radius: 50%;
}

.schedule-item {
	background-color: #ffffff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	cursor: pointer;
}

.schedule-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.schedule-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.schedule-time {
	font-size: 24rpx;
	color: #666666;
}

.schedule-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.schedule-location,
.schedule-customer {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 26rpx;
	color: #666666;
}

.schedule-status {
	display: flex;
	justify-content: flex-end;
}

.stats-section {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 20rpx;
	padding: 20rpx;
}

.stat-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	text-align: center;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.stat-header {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	margin-bottom: 16rpx;
}

.stat-title {
	font-size: 24rpx;
	color: #666666;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
}

.stat-desc {
	font-size: 24rpx;
	color: #999999;
}

.add-schedule-popup {
	background-color: #ffffff;
	border-radius: 16rpx 16rpx 0 0;
	padding: 40rpx;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.schedule-form {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
	margin-bottom: 40rpx;
}

.form-item {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.form-label {
	font-size: 28rpx;
	color: #666666;
	font-weight: 500;
}

.popup-actions {
	display: flex;
	gap: 20rpx;
}
</style>