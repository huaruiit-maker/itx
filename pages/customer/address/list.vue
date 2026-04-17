<template>
	<view class="address-container">
		<!-- 地址列表 -->
		<view class="address-list" v-if="addressList.length > 0">
			<view 
				class="address-item" 
				v-for="(item, index) in addressList" 
				:key="item.id"
				@click="selectAddress(item)"
			>
				<view class="address-content">
					<view class="address-header">
						<view class="contact-info">
							<text class="name">{{ item.name }}</text>
							<text class="phone">{{ item.phone }}</text>
							<view class="default-tag" v-if="item.isDefault">默认</view>
						</view>
						<view class="address-actions">
							<u-icon name="edit-pen" size="24" color="#007AFF" @click.stop="editAddress(item)"></u-icon>
							<u-icon name="trash" size="24" color="#ff4757" @click.stop="deleteAddress(item)"></u-icon>
						</view>
					</view>
					<view class="address-detail">
						<u-icon name="map" size="24" color="#666666"></u-icon>
						<text class="address-text">{{ item.fullAddress }}</text>
					</view>
					<view class="address-tag" v-if="item.tag">{{ item.tag }}</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<u-empty text="暂无收货地址" mode="address"></u-empty>
			<view class="empty-tips">
				<text>您还没有添加收货地址</text>
				<text>点击下方按钮添加新地址</text>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="bottom-actions">
			<u-button type="primary" size="large" @click="addAddress">添加新地址</u-button>
		</view>

		<!-- 地址编辑弹窗 -->
		<u-popup v-model="showEditPopup" mode="bottom" border-radius="24">
			<view class="edit-popup">
				<view class="popup-header">
					<view class="popup-title">{{ isEdit ? '编辑地址' : '添加地址' }}</view>
					<u-icon name="close" size="24" color="#666666" @click="closeEditPopup"></u-icon>
				</view>
				
				<view class="edit-form">
					<view class="form-item">
						<view class="form-label">收货人</view>
						<u-input 
							v-model="addressForm.name" 
							placeholder="请输入收货人姓名"
							border
						></u-input>
					</view>
					
					<view class="form-item">
						<view class="form-label">手机号码</view>
						<u-input 
							v-model="addressForm.phone" 
							placeholder="请输入手机号码"
							type="number"
							border
							maxlength="11"
						></u-input>
					</view>
					
					<view class="form-item">
						<view class="form-label">所在地区</view>
						<u-input 
							v-model="addressForm.region" 
							placeholder="请选择所在地区"
							border
							@click="showRegionPicker = true"
							disabled
						></u-input>
					</view>
					
					<view class="form-item">
						<view class="form-label">详细地址</view>
						<u-input 
							v-model="addressForm.detailAddress" 
							placeholder="请输入详细地址"
							type="textarea"
							border
							height="120"
						></u-input>
					</view>
					
					<view class="form-item">
						<view class="form-label">地址标签</view>
						<view class="tag-options">
							<u-tag 
								v-for="tag in addressTags" 
								:key="tag"
								:text="tag" 
								size="medium"
								:type="addressForm.tag === tag ? 'primary' : 'default'"
								@click="selectTag(tag)"
								style="margin-right: 16rpx; margin-bottom: 16rpx;"
							></u-tag>
						</view>
					</view>
					
					<view class="form-item">
						<u-checkbox v-model="addressForm.isDefault">设为默认地址</u-checkbox>
					</view>
				</view>
				
				<view class="popup-actions">
					<u-button type="default" @click="closeEditPopup">取消</u-button>
					<u-button type="primary" @click="saveAddress">保存</u-button>
				</view>
			</view>
		</u-popup>

		<!-- 地区选择器 -->
		<u-picker 
			v-model="showRegionPicker" 
			mode="region" 
			@confirm="onRegionConfirm"
			@cancel="showRegionPicker = false"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressList: [
				{
					id: 1,
					name: '张三',
					phone: '13888888888',
					fullAddress: '北京市朝阳区建国门外大街1号国贸大厦A座1001室',
					region: '北京市朝阳区',
					detailAddress: '建国门外大街1号国贸大厦A座1001室',
					isDefault: true,
					tag: '家'
				},
				{
					id: 2,
					name: '李四',
					phone: '13999999999',
					fullAddress: '北京市海淀区中关村大街1号中关村大厦B座2002室',
					region: '北京市海淀区',
					detailAddress: '中关村大街1号中关村大厦B座2002室',
					isDefault: false,
					tag: '公司'
				}
			],
			showEditPopup: false,
			isEdit: false,
			currentEditId: null,
			addressForm: {
				name: '',
				phone: '',
				region: '',
				detailAddress: '',
				tag: '',
				isDefault: false
			},
			showRegionPicker: false,
			addressTags: ['家', '公司', '父母家', '学校', '其他'],
			isFromOrder: false
		}
	},
	onLoad(option) {
		if (option.from === 'order') {
			this.isFromOrder = true
		}
		this.loadAddressList()
	},
	methods: {
		loadAddressList() {
			// 模拟加载地址列表
			// 这里可以从后端获取数据
		},
		selectAddress(address) {
			if (this.isFromOrder) {
				// 从订单页面来的，选择地址后返回
				const pages = getCurrentPages()
				const prevPage = pages[pages.length - 2]
				if (prevPage && prevPage.$vm.setSelectedAddress) {
					prevPage.$vm.setSelectedAddress(address)
				}
				uni.navigateBack()
			}
		},
		addAddress() {
			this.isEdit = false
			this.currentEditId = null
			this.resetForm()
			this.showEditPopup = true
		},
		editAddress(address) {
			this.isEdit = true
			this.currentEditId = address.id
			this.addressForm = {
				name: address.name,
				phone: address.phone,
				region: address.region,
				detailAddress: address.detailAddress,
				tag: address.tag,
				isDefault: address.isDefault
			}
			this.showEditPopup = true
		},
		deleteAddress(address) {
			uni.showModal({
				title: '提示',
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
		closeEditPopup() {
			this.showEditPopup = false
			this.resetForm()
		},
		resetForm() {
			this.addressForm = {
				name: '',
				phone: '',
				region: '',
				detailAddress: '',
				tag: '',
				isDefault: false
			}
		},
		selectTag(tag) {
			this.addressForm.tag = this.addressForm.tag === tag ? '' : tag
		},
		onRegionConfirm(e) {
			this.addressForm.region = e.province.label + e.city.label + e.area.label
			this.showRegionPicker = false
		},
		validateForm() {
			if (!this.addressForm.name.trim()) {
				uni.showToast({
					title: '请输入收货人姓名',
					icon: 'none'
				})
				return false
			}
			if (!this.addressForm.phone.trim()) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				})
				return false
			}
			if (!/^1[3-9]\d{9}$/.test(this.addressForm.phone)) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				})
				return false
			}
			if (!this.addressForm.region) {
				uni.showToast({
					title: '请选择所在地区',
					icon: 'none'
				})
				return false
			}
			if (!this.addressForm.detailAddress.trim()) {
				uni.showToast({
					title: '请输入详细地址',
					icon: 'none'
				})
				return false
			}
			return true
		},
		saveAddress() {
			if (!this.validateForm()) {
				return
			}
			
			const fullAddress = this.addressForm.region + this.addressForm.detailAddress
			const addressData = {
				...this.addressForm,
				fullAddress: fullAddress
			}
			
			if (this.isEdit) {
				// 编辑模式
				const index = this.addressList.findIndex(item => item.id === this.currentEditId)
				if (index > -1) {
					this.addressList[index] = {
						id: this.currentEditId,
						...addressData
					}
				}
			} else {
				// 添加模式
				const newAddress = {
					id: Date.now(),
					...addressData
				}
				this.addressList.push(newAddress)
			}
			
			// 如果设为默认地址，取消其他地址的默认状态
			if (this.addressForm.isDefault) {
				this.addressList.forEach(item => {
					if (item.id !== (this.isEdit ? this.currentEditId : this.addressList[this.addressList.length - 1].id)) {
						item.isDefault = false
					}
				})
			}
			
			this.closeEditPopup()
			uni.showToast({
				title: this.isEdit ? '编辑成功' : '添加成功',
				icon: 'success'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.address-container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.address-list {
	padding: 20rpx;
}

.address-item {
	background-color: #ffffff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.address-content {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.address-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.contact-info {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.phone {
	font-size: 28rpx;
	color: #666666;
}

.default-tag {
	background-color: #007AFF;
	color: #ffffff;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.address-actions {
	display: flex;
	gap: 24rpx;
}

.address-detail {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
}

.address-text {
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	flex: 1;
}

.address-tag {
	background-color: #f0f0f0;
	color: #666666;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	align-self: flex-start;
}

.empty-state {
	padding: 100rpx 40rpx;
	text-align: center;
}

.empty-tips {
	margin-top: 30rpx;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	color: #999999;
	font-size: 28rpx;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.edit-popup {
	background-color: #ffffff;
	padding: 30rpx;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.edit-form {
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
	color: #333333;
	font-weight: 500;
}

.tag-options {
	display: flex;
	flex-wrap: wrap;
}

.popup-actions {
	display: flex;
	gap: 20rpx;
}

.popup-actions .u-btn {
	flex: 1;
}
</style>