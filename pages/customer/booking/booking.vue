<template>
	<view class="booking-container">
		<!-- 服务信息 -->
		<view class="service-info-section">
			<view class="section-title">
				<u-icon name="grid" size="28" color="#007AFF"></u-icon>
				<text class="title-text">服务信息</text>
			</view>
			<view class="service-card">
				<view class="service-images">
					<u-image 
						v-for="(image, index) in serviceImages" 
						:key="index"
						:src="image" 
						width="200rpx" 
						height="200rpx"
						mode="aspectFill"
						@click="previewImage(image)"
					></u-image>
				</view>
				<view class="service-details">
					<text class="service-name">{{ serviceInfo.name }}</text>
					<view class="service-price">
						<text class="price-label">价格：</text>
						<text class="price-value">¥{{ serviceInfo.price }}</text>
						<text class="price-unit">起</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 师傅信息 -->
		<view class="master-info-section" v-if="selectedMaster">
			<view class="section-title">
				<u-icon name="account" size="28" color="#007AFF"></u-icon>
				<text class="title-text">师傅信息</text>
			</view>
			<view class="master-card">
				<view class="master-avatar">
					<u-avatar :src="selectedMaster.avatar" size="large"></u-avatar>
				</view>
				<view class="master-details">
					<view class="master-name-rating">
						<text class="master-name">{{ selectedMaster.name }}</text>
						<u-rate :value="selectedMaster.rating" disabled size="mini"></u-rate>
						<text class="master-rating">{{ selectedMaster.rating }}分</text>
					</view>
					<view class="master-experience">
						<text class="experience-text">{{ selectedMaster.experience }}年经验</text>
						<text class="order-count">已接{{ selectedMaster.orderCount }}单</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 预约时间 -->
		<view class="appointment-section">
			<view class="section-title">
				<u-icon name="calendar" size="28" color="#007AFF"></u-icon>
				<text class="title-text">预约时间</text>
			</view>
			<view class="appointment-content">
				<view class="date-selection">
					<text class="selection-label">选择日期</text>
					<view class="date-options">
						<view 
							class="date-option" 
							v-for="(date, index) in availableDates" 
							:key="index"
							:class="{ active: selectedDate === date.value }"
							@click="selectDate(date)"
						>
							<text class="date-weekday">{{ date.weekday }}</text>
							<text class="date-day">{{ date.day }}</text>
						</view>
					</view>
				</view>
				<view class="time-selection">
					<text class="selection-label">选择时间</text>
					<view class="time-options">
						<view 
							class="time-option" 
							v-for="(time, index) in availableTimes" 
							:key="index"
							:class="{ 
								active: selectedTime === time.value,
								disabled: time.disabled 
							}"
							@click="selectTime(time)"
						>
							<text class="time-text">{{ time.label }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 联系信息 -->
		<view class="contact-section">
			<view class="section-title">
				<u-icon name="phone" size="28" color="#007AFF"></u-icon>
				<text class="title-text">联系信息</text>
			</view>
			<view class="contact-form">
				<u-form labelPosition="left" :model="contactForm" ref="contactForm">
					<u-form-item label="联系人" prop="name" required>
						<u-input v-model="contactForm.name" placeholder="请输入联系人姓名" border="surround"></u-input>
					</u-form-item>
					<u-form-item label="手机号" prop="phone" required>
						<u-input v-model="contactForm.phone" placeholder="请输入手机号码" border="surround" type="number"></u-input>
					</u-form-item>
					<u-form-item label="服务地址" prop="address" required>
						<view class="address-input" @click="selectAddress">
							<u-input 
								v-model="contactForm.address" 
								placeholder="请选择服务地址" 
								border="surround"
								:disabled="true"
							></u-input>
							<u-icon name="map" size="24" color="#007AFF" class="address-icon"></u-icon>
						</view>
					</u-form-item>
					<u-form-item label="详细地址" prop="detailAddress">
						<u-input 
							v-model="contactForm.detailAddress" 
							placeholder="请输入详细地址（如门牌号）" 
							border="surround"
						></u-input>
					</u-form-item>
				</u-form>
			</view>
		</view>

		<!-- 问题描述 -->
		<view class="problem-section">
			<view class="section-title">
				<u-icon name="edit-pen" size="28" color="#007AFF"></u-icon>
				<text class="title-text">问题描述</text>
			</view>
			<view class="problem-content">
				<u-field 
					v-model="problemDescription" 
					placeholder="请详细描述需要维修的问题，以便师傅更好地准备工具和配件"
					type="textarea"
					maxlength="500"
					auto-height
					clearable
				></u-field>
			</view>
		</view>

		<!-- 图片上传 -->
		<view class="images-section">
			<view class="section-title">
				<u-icon name="photo" size="28" color="#007AFF"></u-icon>
				<text class="title-text">上传图片</text>
				<text class="title-subtitle">（可选，最多6张）</text>
			</view>
			<view class="images-content">
				<u-upload 
					:fileList="uploadImages" 
					@afterRead="afterRead" 
					@delete="deleteImage"
					name="images"
					multiple
					:maxCount="6"
					width="200rpx"
					height="200rpx"
				></u-upload>
			</view>
		</view>

		<!-- 费用明细 -->
		<view class="cost-section">
			<view class="section-title">
				<u-icon name="rmb" size="28" color="#007AFF"></u-icon>
				<text class="title-text">费用明细</text>
			</view>
			<view class="cost-content">
				<view class="cost-item">
					<text class="cost-label">服务费用</text>
					<text class="cost-value">¥{{ serviceInfo.price }}</text>
				</view>
				<view class="cost-item">
					<text class="cost-label">上门费用</text>
					<text class="cost-value">¥{{ visitFee }}</text>
				</view>
				<view class="cost-item total">
					<text class="cost-label">总计</text>
					<text class="cost-value">¥{{ totalCost }}</text>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<view class="cost-summary">
				<text class="summary-label">预计费用：</text>
				<text class="summary-value">¥{{ totalCost }}</text>
			</view>
			<u-button 
				type="primary" 
				size="large" 
				shape="circle"
				@click="submitBooking"
				:disabled="!canSubmit"
			>
				提交预约
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			serviceId: '',
			masterId: '',
			serviceImages: [
				'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
				'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=300&fit=crop'
			],
			serviceInfo: {
				name: '空调维修',
				price: 150
			},
			selectedMaster: null,
			availableDates: [],
			availableTimes: [],
			selectedDate: '',
			selectedTime: '',
			contactForm: {
				name: '',
				phone: '',
				address: '',
				detailAddress: ''
			},
			problemDescription: '',
			uploadImages: [],
			visitFee: 20,
			rules: {
				name: [
					{ required: true, message: '请输入联系人姓名', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请选择服务地址', trigger: 'change' }
				]
			}
		}
	},
	onLoad(options) {
		this.serviceId = options.serviceId || ''
		this.masterId = options.masterId || ''
		this.loadServiceInfo()
		this.loadMasterInfo()
		this.generateAvailableDates()
		this.generateAvailableTimes()
	},
	computed: {
		totalCost() {
			return this.serviceInfo.price + this.visitFee
		},
		canSubmit() {
			return this.selectedDate && 
					this.selectedTime && 
					this.contactForm.name && 
					this.contactForm.phone && 
					this.contactForm.address
		}
	},
	methods: {
		loadServiceInfo() {
			// 模拟加载服务信息
			console.log('加载服务信息:', this.serviceId)
		},
		loadMasterInfo() {
			// 模拟加载师傅信息
			if (this.masterId) {
				this.selectedMaster = {
					id: this.masterId,
					name: '张师傅',
					avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
					rating: 4.9,
					experience: 8,
					orderCount: 1286,
					price: 150
				}
			}
		},
		generateAvailableDates() {
			const dates = []
			const today = new Date()
			
			for (let i = 0; i < 7; i++) {
				const date = new Date(today)
				date.setDate(today.getDate() + i)
				
				const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				const weekday = weekdays[date.getDay()]
				const month = date.getMonth() + 1
				const day = date.getDate()
				
				dates.push({
					label: `${month}月${day}日`,
					value: `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
					weekday: weekday,
					day: `${month}/${day}`
				})
			}
			
			this.availableDates = dates
		},
		generateAvailableTimes() {
			const times = []
			const timeSlots = [
				{ label: '09:00-11:00', value: '09:00-11:00' },
				{ label: '11:00-13:00', value: '11:00-13:00' },
				{ label: '14:00-16:00', value: '14:00-16:00' },
				{ label: '16:00-18:00', value: '16:00-18:00' },
				{ label: '18:00-20:00', value: '18:00-20:00' },
				{ label: '20:00-22:00', value: '20:00-22:00' }
			]
			
			// 模拟某些时间段已被预约
			timeSlots.forEach((slot, index) => {
				times.push({
					...slot,
					disabled: index === 1 || index === 3 // 模拟某些时间段不可用
				})
			})
			
			this.availableTimes = times
		},
		previewImage(image) {
			uni.previewImage({
				urls: [image],
				current: 0
			})
		},
		selectDate(date) {
			this.selectedDate = date.value
		},
		selectTime(time) {
			if (time.disabled) return
			this.selectedTime = time.value
		},
		selectAddress() {
			uni.chooseLocation({
				success: (res) => {
					this.contactForm.address = res.address + res.name
				},
				fail: (err) => {
					uni.showToast({
						title: '选择地址失败',
						icon: 'none'
					})
				}
			})
		},
		afterRead(event) {
			const { file } = event
			this.uploadImages.push(...file)
		},
		deleteImage(event) {
			const { index } = event
			this.uploadImages.splice(index, 1)
		},
		submitBooking() {
			this.$refs.contactForm.validate().then(valid => {
				if (valid) {
					uni.showModal({
						title: '确认预约',
						content: `确认预约${this.serviceInfo.name}服务？\n预约时间：${this.selectedDate} ${this.selectedTime}\n预计费用：¥${this.totalCost}`,
						success: (res) => {
							if (res.confirm) {
								this.createBooking()
							}
						}
					})
				}
			}).catch(errors => {
				console.log('表单验证失败:', errors)
			})
		},
		createBooking() {
			uni.showLoading({ title: '提交预约中...' })
			
			const bookingData = {
				serviceId: this.serviceId,
				masterId: this.masterId,
				appointmentDate: this.selectedDate,
				appointmentTime: this.selectedTime,
				contactName: this.contactForm.name,
				contactPhone: this.contactForm.phone,
				address: this.contactForm.address,
				detailAddress: this.contactForm.detailAddress,
				problemDescription: this.problemDescription,
				images: this.uploadImages.map(file => file.url),
				totalCost: this.totalCost
			}
			
			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '预约成功',
					icon: 'success',
					duration: 2000
				})
				
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/customer/order/list'
					})
				}, 2000)
			}, 2000)
		}
	}
}
</script>

<style lang="scss" scoped>
.booking-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.service-info-section,
.master-info-section,
.appointment-section,
.contact-section,
.problem-section,
.images-section,
.cost-section {
	background-color: #ffffff;
	border-radius: 16rpx;
	margin: 20rpx;
	padding: 30rpx;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 30rpx;
}

.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.title-subtitle {
	font-size: 24rpx;
	color: #999999;
	margin-left: 12rpx;
}

.service-card {
	display: flex;
	gap: 20rpx;
}

.service-images {
	display: flex;
	gap: 12rpx;
}

.service-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.service-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.service-price {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}

.price-label {
	font-size: 24rpx;
	color: #999999;
}

.price-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #ff6b35;
}

.price-unit {
	font-size: 24rpx;
	color: #999999;
}

.master-card {
	display: flex;
	gap: 20rpx;
	align-items: center;
}

.master-avatar {
	flex-shrink: 0;
}

.master-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.master-name-rating {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.master-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.master-rating {
	font-size: 24rpx;
	color: #999999;
}

.master-experience {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.experience-text {
	font-size: 24rpx;
	color: #666666;
}

.order-count {
	font-size: 24rpx;
	color: #999999;
}

.appointment-content {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.date-selection,
.time-selection {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.selection-label {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.date-options {
	display: flex;
	gap: 16rpx;
	overflow-x: auto;
}

.date-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 20rpx 24rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	min-width: 120rpx;
	cursor: pointer;
}

.date-option.active {
	background-color: #007AFF;
	color: #ffffff;
}

.date-weekday {
	font-size: 24rpx;
}

.date-day {
	font-size: 28rpx;
	font-weight: bold;
}

.time-options {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16rpx;
}

.time-option {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	cursor: pointer;
}

.time-option.active {
	background-color: #007AFF;
	color: #ffffff;
}

.time-option.disabled {
	background-color: #f0f0f0;
	color: #cccccc;
	cursor: not-allowed;
}

.time-text {
	font-size: 24rpx;
}

.address-input {
	position: relative;
}

.address-icon {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
}

.problem-content {
	margin-top: 20rpx;
}

.images-content {
	margin-top: 20rpx;
}

.cost-content {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.cost-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.cost-item.total {
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.cost-label {
	font-size: 28rpx;
	color: #666666;
}

.cost-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.cost-item.total .cost-value {
	color: #ff6b35;
	font-size: 36rpx;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.cost-summary {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}

.summary-label {
	font-size: 24rpx;
	color: #999999;
}

.summary-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #ff6b35;
}
</style>