<template>
	<view class="address-manage-container">
		<!-- 地址列表 -->
		<view class="address-list" v-if="addressList.length > 0">
			<view 
				class="address-item" 
				v-for="(address, index) in addressList" 
				:key="address.id"
				@click="selectAddress(address)"
			>
				<view class="address-content">
					<view class="address-header">
						<text class="contact-name">{{ address.name }}</text>
						<text class="contact-phone">{{ address.phone }}</text>
						<view class="default-tag" v-if="address.isDefault">
							<u-tag text="默认" type="success" size="mini"></u-tag>
						</view>
					</view>
					<view class="address-detail">
						<u-icon name="map" size="20" color="#999999"></u-icon>
						<text class="address-text">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
					</view>
					<view class="address-tags" v-if="address.tags.length > 0">
						<u-tag 
							v-for="tag in address.tags" 
							:key="tag"
							:text="tag" 
							type="info" 
							size="mini"
							class="address-tag"
						></u-tag>
					</view>
				</view>
				<view class="address-actions">
					<u-button 
						type="primary" 
						size="mini" 
						plain
						@click.stop="editAddress(address)"
					>
						编辑
					</u-button>
					<u-button 
						type="error" 
						size="mini" 
						plain
						@click.stop="deleteAddress(address)"
					>
						删除
					</u-button>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<u-empty 
				mode="address"
				text="暂无地址信息"
				icon="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
			>
			</u-empty>
			<view class="empty-tips">
				<text>您还没有添加任何地址</text>
				<text>点击下方按钮添加新地址</text>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<u-button 
				type="primary" 
				size="large" 
				shape="circle"
				icon="plus"
				@click="addAddress"
			>
				添加新地址
			</u-button>
		</view>

		<!-- 地址编辑弹窗 -->
		<u-popup 
			v-model="showAddressPopup" 
			mode="bottom" 
			border-radius="16"
			closeable
			close-icon-pos="top-right"
		>
			<view class="address-popup">
				<view class="popup-header">
					<text class="popup-title">{{ isEdit ? '编辑地址' : '添加地址' }}</text>
				</view>
				<view class="popup-content">
					<u-form ref="addressForm" :model="addressForm" label-width="160">
						<u-form-item label="联系人" prop="name" required>
							<u-input 
								v-model="addressForm.name" 
								placeholder="请输入联系人姓名"
								border="surround"
							></u-input>
						</u-form-item>
						<u-form-item label="手机号码" prop="phone" required>
							<u-input 
								v-model="addressForm.phone" 
								placeholder="请输入手机号码"
								type="number"
								border="surround"
							></u-input>
						</u-form-item>
						<u-form-item label="所在地区" prop="region" required>
							<view class="region-selector" @click="showRegionPicker = true">
								<u-input 
									v-model="addressForm.regionText" 
									placeholder="请选择所在地区"
									border="surround"
									:disabled="true"
								></u-input>
								<u-icon name="arrow-right" size="20" color="#999999" class="region-icon"></u-icon>
							</view>
						</u-form-item>
						<u-form-item label="详细地址" prop="detail" required>
							<u-input 
								v-model="addressForm.detail" 
								placeholder="请输入详细地址，如街道、门牌号等"
								type="textarea"
								border="surround"
								height="120rpx"
							></u-input>
						</u-form-item>
						<u-form-item label="设为默认地址">
							<u-switch 
								v-model="addressForm.isDefault" 
								active-color="#007AFF"
							></u-switch>
						</u-form-item>
						<u-form-item label="标签">
							<view class="tag-selector">
								<u-tag 
									v-for="tag in tagOptions" 
									:key="tag"
									:text="tag" 
									:type="addressForm.tags.includes(tag) ? 'primary' : 'info'"
									size="medium"
									@click="toggleTag(tag)"
									class="tag-item"
								></u-tag>
							</view>
						</u-form-item>
					</u-form>
				</view>
				<view class="popup-actions">
					<u-button 
						type="primary" 
						size="large" 
						shape="circle"
						@click="saveAddress"
					>
						保存地址
					</u-button>
				</view>
			</view>
		</u-popup>

		<!-- 地区选择器 -->
		<u-picker 
			v-model="showRegionPicker" 
			mode="region" 
			:area-code="addressForm.regionCode"
			@confirm="handleRegionSelect"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressList: [],
			selectMode: false,
			showAddressPopup: false,
			isEdit: false,
			currentEditAddress: null,
			showRegionPicker: false,
			addressForm: {
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				regionText: '',
				regionCode: [],
				detail: '',
				isDefault: false,
				tags: []
			},
			tagOptions: ['家', '公司', '父母家'],
			rules: {
				name: [
					{ required: true, message: '请输入联系人姓名', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
				],
				region: [
					{ required: true, message: '请选择所在地区', trigger: 'change' }
				],
				detail: [
					{ required: true, message: '请输入详细地址', trigger: 'blur' }
				]
			}
		}
	},
	onLoad(options) {
		this.selectMode = options.selectMode === 'true'
		this.loadAddressList()
	},
	methods: {
		loadAddressList() {
			// 模拟加载地址列表
			this.addressList = [
				{
					id: 1,
					name: '张三',
					phone: '13800138000',
					province: '北京市',
					city: '北京市',
					district: '朝阳区',
					detail: '建国路88号SOHO现代城A座1201室',
					isDefault: true,
					tags: ['家']
				},
				{
					id: 2,
					name: '李四',
					phone: '13900139000',
					province: '上海市',
					city: '上海市',
					district: '浦东新区',
					detail: '陆家嘴环路1000号上海中心大厦',
					isDefault: false,
					tags: ['公司']
				}
			]
		},
		selectAddress(address) {
			if (this.selectMode) {
				// 返回选择的地址
				const pages = getCurrentPages()
				const prevPage = pages[pages.length - 2]
				if (prevPage) {
					prevPage.$vm.contactForm.address = `${address.province}${address.city}${address.district}${address.detail}`
				}
				uni.navigateBack()
			}
		},
		addAddress() {
			this.isEdit = false
			this.resetAddressForm()
			this.showAddressPopup = true
		},
		editAddress(address) {
			this.isEdit = true
			this.currentEditAddress = address
			this.addressForm = {
				...address,
				regionText: `${address.province} ${address.city} ${address.district}`,
				regionCode: [address.provinceCode, address.cityCode, address.districtCode]
			}
			this.showAddressPopup = true
		},
		deleteAddress(address) {
			uni.showModal({
				title: '删除地址',
				content: '确定要删除这个地址吗？',
				success: (res) => {
					if (res.confirm) {
						const index = this.addressList.findIndex(item => item.id === address.id)
						if (index > -1) {
							this.addressList.splice(index, 1)
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						}
					}
				}
			})
		},
		toggleTag(tag) {
			const index = this.addressForm.tags.indexOf(tag)
			if (index > -1) {
				this.addressForm.tags.splice(index, 1)
			} else {
				this.addressForm.tags.push(tag)
			}
		},
		handleRegionSelect(e) {
			this.addressForm.province = e.province.name
			this.addressForm.city = e.city.name
			this.addressForm.district = e.area.name
			this.addressForm.regionText = `${e.province.name} ${e.city.name} ${e.area.name}`
			this.addressForm.regionCode = [e.province.code, e.city.code, e.area.code]
		},
		saveAddress() {
			this.$refs.addressForm.validate().then(valid => {
				if (valid) {
					if (this.isEdit) {
						// 更新地址
						const index = this.addressList.findIndex(item => item.id === this.currentEditAddress.id)
						if (index > -1) {
							this.addressList[index] = { ...this.addressForm, id: this.currentEditAddress.id }
						}
					} else {
						// 添加新地址
						const newAddress = {
							...this.addressForm,
							id: Date.now()
						}
						this.addressList.push(newAddress)
					}
					
					// 处理默认地址
					if (this.addressForm.isDefault) {
						this.addressList.forEach(item => {
							if (item.id !== (this.isEdit ? this.currentEditAddress.id : this.addressList[this.addressList.length - 1].id)) {
								item.isDefault = false
							}
						})
					}
					
					this.showAddressPopup = false
					uni.showToast({
						title: this.isEdit ? '更新成功' : '添加成功',
						icon: 'success'
					})
				}
			}).catch(errors => {
				console.log('表单验证失败:', errors)
			})
		},
		resetAddressForm() {
			this.addressForm = {
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				regionText: '',
				regionCode: [],
				detail: '',
				isDefault: false,
				tags: []
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.address-manage-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.address-list {
	padding: 20rpx;
}

.address-item {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.address-content {
	flex: 1;
}

.address-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.contact-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.contact-phone {
	font-size: 28rpx;
	color: #666666;
}

.default-tag {
	margin-left: auto;
}

.address-detail {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.address-text {
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	flex: 1;
}

.address-tags {
	display: flex;
	gap: 8rpx;
}

.address-tag {
	margin-right: 0;
}

.address-actions {
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

.address-popup {
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

.region-selector {
	position: relative;
}

.region-icon {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
}

.tag-selector {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.tag-item {
	margin-right: 0;
}
</style>