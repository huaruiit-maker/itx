<template>
	<view class="service-manage-container">
		<!-- 顶部统计卡片 -->
		<view class="stats-section">
			<view class="stats-card">
				<view class="stat-item">
					<u-icon name="grid" size="40" color="#007AFF"></u-icon>
					<view class="stat-info">
						<text class="stat-value">{{ serviceStats.total }}</text>
						<text class="stat-label">服务总数</text>
					</view>
				</view>
				<view class="stat-item">
					<u-icon name="eye-fill" size="40" color="#52C41A"></u-icon>
					<view class="stat-info">
						<text class="stat-value">{{ serviceStats.online }}</text>
						<text class="stat-label">已上线</text>
					</view>
				</view>
				<view class="stat-item">
					<u-icon name="eye-off-fill" size="40" color="#FF6B35"></u-icon>
					<view class="stat-info">
						<text class="stat-value">{{ serviceStats.offline }}</text>
						<text class="stat-label">已下线</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 筛选栏 -->
		<view class="filter-section">
			<view class="filter-tabs">
				<view 
					class="filter-tab" 
					v-for="tab in filterTabs" 
					:key="tab.value"
					:class="{ active: currentFilter === tab.value }"
					@click="changeFilter(tab.value)"
				>
					<text class="tab-text">{{ tab.label }}</text>
				</view>
			</view>
			<view class="search-bar">
				<u-search 
					v-model="searchKeyword" 
					placeholder="搜索服务名称"
					shape="round"
					@search="handleSearch"
					@clear="handleClear"
				></u-search>
			</view>
		</view>

		<!-- 服务列表 -->
		<view class="service-list" v-if="serviceList.length > 0">
			<view 
				class="service-item" 
				v-for="service in serviceList" 
				:key="service.id"
			>
				<view class="service-image">
					<u-image 
						:src="service.image" 
						width="200rpx" 
						height="200rpx"
						border-radius="12"
						mode="aspectFill"
					></u-image>
				</view>
				<view class="service-info">
					<view class="service-header">
						<text class="service-name">{{ service.name }}</text>
						<view class="service-status">
							<u-tag 
								:text="service.status === 'online' ? '已上线' : '已下线'" 
								:type="service.status === 'online' ? 'success' : 'warning'"
								size="mini"
							></u-tag>
						</view>
					</view>
					<view class="service-price">
						<text class="price-label">价格：</text>
						<text class="price-value">¥{{ service.price }}</text>
						<text class="price-unit">起</text>
					</view>
					<view class="service-stats">
						<view class="stat-item">
							<u-icon name="eye-fill" size="20" color="#999999"></u-icon>
							<text class="stat-text">{{ service.views }}</text>
						</view>
						<view class="stat-item">
							<u-icon name="list" size="20" color="#999999"></u-icon>
							<text class="stat-text">{{ service.orders }}</text>
						</view>
						<view class="stat-item">
							<u-icon name="star" size="20" color="#999999"></u-icon>
							<text class="stat-text">{{ service.rating }}</text>
						</view>
					</view>
					<view class="service-description">
						<text class="desc-text">{{ service.description }}</text>
					</view>
				</view>
				<view class="service-actions">
					<u-button 
						type="primary" 
						size="mini" 
						plain
						@click="editService(service)"
					>
						编辑
					</u-button>
					<u-button 
						:type="service.status === 'online' ? 'warning' : 'success'" 
						size="mini" 
						plain
						@click="toggleServiceStatus(service)"
					>
						{{ service.status === 'online' ? '下线' : '上线' }}
					</u-button>
					<u-button 
						type="error" 
						size="mini" 
						plain
						@click="deleteService(service)"
					>
						删除
					</u-button>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<u-empty 
				mode="list"
				text="暂无服务数据"
				icon="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
			>
			</u-empty>
			<view class="empty-tips">
				<text>您还没有添加任何服务</text>
				<text>点击下方按钮添加新服务</text>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<u-button 
				type="primary" 
				size="large" 
				shape="circle"
				icon="plus"
				@click="addService"
			>
				添加新服务
			</u-button>
		</view>

		<!-- 服务编辑弹窗 -->
		<u-popup 
			v-model="showServicePopup" 
			mode="bottom" 
			border-radius="16"
			closeable
			close-icon-pos="top-right"
		>
			<view class="service-popup">
				<view class="popup-header">
					<text class="popup-title">{{ isEdit ? '编辑服务' : '添加服务' }}</text>
				</view>
				<view class="popup-content">
					<u-form ref="serviceForm" :model="serviceForm" label-width="160">
						<u-form-item label="服务名称" prop="name" required>
							<u-input 
								v-model="serviceForm.name" 
								placeholder="请输入服务名称"
								border="surround"
							></u-input>
						</u-form-item>
						<u-form-item label="服务分类" prop="category" required>
							<view class="category-selector" @click="showCategoryPicker = true">
								<u-input 
									v-model="serviceForm.categoryText" 
									placeholder="请选择服务分类"
									border="surround"
									:disabled="true"
								></u-input>
								<u-icon name="arrow-right" size="20" color="#999999" class="category-icon"></u-icon>
							</view>
						</u-form-item>
						<u-form-item label="服务价格" prop="price" required>
							<u-input 
								v-model="serviceForm.price" 
								placeholder="请输入服务价格"
								type="number"
								border="surround"
							>
								<view slot="suffix">元</view>
							</u-input>
						</u-form-item>
						<u-form-item label="服务图片" prop="image" required>
							<view class="image-upload">
								<u-upload 
									:fileList="serviceForm.imageList" 
									@afterRead="afterRead" 
									@delete="deleteImage"
									name="images"
									:maxCount="3"
									width="200rpx"
									height="200rpx"
								></u-upload>
							</view>
						</u-form-item>
						<u-form-item label="服务描述" prop="description" required>
							<u-field 
								v-model="serviceForm.description" 
								placeholder="请输入服务描述"
								type="textarea"
								maxlength="200"
								auto-height
								clearable
							></u-field>
						</u-form-item>
						<u-form-item label="服务状态">
							<u-switch 
								v-model="serviceForm.status" 
								:active-value="'online'"
								:inactive-value="'offline'"
								active-color="#52C41A"
							>
								<view slot="open">上线</view>
								<view slot="close">下线</view>
							</u-switch>
						</u-form-item>
					</u-form>
				</view>
				<view class="popup-actions">
					<u-button 
						type="primary" 
						size="large" 
						shape="circle"
						@click="saveService"
					>
						保存服务
					</u-button>
				</view>
			</view>
		</u-popup>

		<!-- 分类选择器 -->
		<u-picker 
			v-model="showCategoryPicker" 
			mode="selector" 
			:range="categoryOptions"
			@confirm="handleCategorySelect"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			serviceStats: {
				total: 0,
				online: 0,
				offline: 0
			},
			filterTabs: [
				{ label: '全部', value: 'all' },
				{ label: '已上线', value: 'online' },
				{ label: '已下线', value: 'offline' }
			],
			currentFilter: 'all',
			searchKeyword: '',
			serviceList: [],
			showServicePopup: false,
			isEdit: false,
			currentEditService: null,
			showCategoryPicker: false,
			serviceForm: {
				name: '',
				category: '',
				categoryText: '',
				price: '',
				image: '',
				imageList: [],
				description: '',
				status: 'online'
			},
			categoryOptions: ['空调维修', '冰箱维修', '洗衣机维修', '电视维修', '热水器维修', '燃气灶维修', '油烟机维修', '水电维修'],
			rules: {
				name: [
					{ required: true, message: '请输入服务名称', trigger: 'blur' }
				],
				category: [
					{ required: true, message: '请选择服务分类', trigger: 'change' }
				],
				price: [
					{ required: true, message: '请输入服务价格', trigger: 'blur' },
					{ pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的价格格式', trigger: 'blur' }
				],
				image: [
					{ required: true, message: '请上传服务图片', trigger: 'change' }
				],
				description: [
					{ required: true, message: '请输入服务描述', trigger: 'blur' }
				]
			}
		}
	},
	onLoad() {
		this.loadServiceList()
	},
	methods: {
		loadServiceList() {
			// 模拟加载服务列表
			const allServices = [
				{
					id: 1,
					name: '空调清洗保养',
					category: '空调维修',
					price: 120,
					image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
					description: '专业空调清洗保养服务，深度清洁，延长使用寿命',
					status: 'online',
					views: 1250,
					orders: 89,
					rating: 4.8
				},
				{
					id: 2,
					name: '冰箱不制冷维修',
					category: '冰箱维修',
					price: 200,
					image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
					description: '冰箱不制冷故障维修，快速诊断，专业修复',
					status: 'online',
					views: 890,
					orders: 45,
					rating: 4.6
				},
				{
					id: 3,
					name: '洗衣机漏水维修',
					category: '洗衣机维修',
					price: 180,
					image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop',
					description: '洗衣机漏水故障维修，密封检查，管道更换',
					status: 'offline',
					views: 650,
					orders: 32,
					rating: 4.5
				}
			]
			
			this.serviceList = allServices.filter(service => {
				if (this.currentFilter === 'all') return true
				return service.status === this.currentFilter
			})
			
			// 更新统计
			this.serviceStats.total = allServices.length
			this.serviceStats.online = allServices.filter(s => s.status === 'online').length
			this.serviceStats.offline = allServices.filter(s => s.status === 'offline').length
		},
		changeFilter(filter) {
			this.currentFilter = filter
			this.loadServiceList()
		},
		handleSearch() {
			console.log('搜索:', this.searchKeyword)
			// 实现搜索逻辑
		},
		handleClear() {
			this.searchKeyword = ''
			this.loadServiceList()
		},
		addService() {
			this.isEdit = false
			this.resetServiceForm()
			this.showServicePopup = true
		},
		editService(service) {
			this.isEdit = true
			this.currentEditService = service
			this.serviceForm = {
				...service,
				categoryText: service.category,
				imageList: [{ url: service.image }]
			}
			this.showServicePopup = true
		},
		toggleServiceStatus(service) {
			const newStatus = service.status === 'online' ? 'offline' : 'online'
			uni.showModal({
				title: '确认操作',
				content: `确定要${newStatus === 'online' ? '上线' : '下线'}该服务吗？`,
				success: (res) => {
					if (res.confirm) {
						service.status = newStatus
						uni.showToast({
							title: newStatus === 'online' ? '已上线' : '已下线',
							icon: 'success'
						})
						this.loadServiceList()
					}
				}
			})
		},
		deleteService(service) {
			uni.showModal({
				title: '删除服务',
				content: '确定要删除该服务吗？此操作不可恢复。',
				success: (res) => {
					if (res.confirm) {
						const index = this.serviceList.findIndex(item => item.id === service.id)
						if (index > -1) {
							this.serviceList.splice(index, 1)
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							this.loadServiceList()
						}
					}
				}
			})
		},
		handleCategorySelect(e) {
			this.serviceForm.category = this.categoryOptions[e[0]]
			this.serviceForm.categoryText = this.categoryOptions[e[0]]
		},
		afterRead(event) {
			const { file } = event
			this.serviceForm.imageList.push(...file)
		},
		deleteImage(event) {
			const { index } = event
			this.serviceForm.imageList.splice(index, 1)
		},
		saveService() {
			this.$refs.serviceForm.validate().then(valid => {
				if (valid) {
					if (this.serviceForm.imageList.length > 0) {
						this.serviceForm.image = this.serviceForm.imageList[0].url
					}
					
					if (this.isEdit) {
						// 更新服务
						const index = this.serviceList.findIndex(item => item.id === this.currentEditService.id)
						if (index > -1) {
							this.serviceList[index] = { ...this.serviceForm, id: this.currentEditService.id }
						}
					} else {
						// 添加新服务
						const newService = {
							...this.serviceForm,
							id: Date.now(),
							views: 0,
							orders: 0,
							rating: 5.0
						}
						this.serviceList.push(newService)
					}
					
					this.showServicePopup = false
					uni.showToast({
						title: this.isEdit ? '更新成功' : '添加成功',
						icon: 'success'
					})
					this.loadServiceList()
				}
			}).catch(errors => {
				console.log('表单验证失败:', errors)
			})
		},
		resetServiceForm() {
			this.serviceForm = {
				name: '',
				category: '',
				categoryText: '',
				price: '',
				image: '',
				imageList: [],
				description: '',
				status: 'online'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.service-manage-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.stats-section {
	padding: 20rpx;
}

.stats-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.stat-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.stat-label {
	font-size: 24rpx;
	color: #999999;
}

.filter-section {
	background-color: #ffffff;
	padding: 20rpx;
}

.filter-tabs {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.filter-tab {
	padding: 16rpx 32rpx;
	background-color: #f8f8f8;
	border-radius: 24rpx;
	cursor: pointer;
}

.filter-tab.active {
	background-color: #007AFF;
	color: #ffffff;
}

.tab-text {
	font-size: 28rpx;
}

.search-bar {
	margin-bottom: 0;
}

.service-list {
	padding: 20rpx;
}

.service-item {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	gap: 20rpx;
}

.service-image {
	flex-shrink: 0;
}

.service-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.service-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.service-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	flex: 1;
}

.service-status {
	flex-shrink: 0;
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
	font-size: 32rpx;
	font-weight: bold;
	color: #ff6b35;
}

.price-unit {
	font-size: 24rpx;
	color: #999999;
}

.service-stats {
	display: flex;
	gap: 24rpx;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-text {
	font-size: 24rpx;
	color: #666666;
}

.service-description {
	margin-top: 8rpx;
}

.desc-text {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.5;
}

.service-actions {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 40rpx;
}

.empty-tips {
	text-align: center;
	margin-top: 40rpx;
}

.empty-tips text {
	display: block;
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 8rpx;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.service-popup {
	background-color: #ffffff;
	border-radius: 16rpx 16rpx 0 0;
}

.popup-header {
	padding: 30rpx;
	text-align: center;
	border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.popup-content {
	padding: 30rpx;
	max-height: 70vh;
	overflow-y: auto;
}

.popup-actions {
	padding: 30rpx;
	border-top: 1rpx solid #f0f0f0;
}

.category-selector {
	position: relative;
}

.category-icon {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
}

.image-upload {
	margin-top: 10rpx;
}
</style>