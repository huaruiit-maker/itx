<template>
  <view class="address-edit-container">
    <!-- 表单区域 -->
    <view class="form-container">
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">联系人</text>
          <input 
            v-model="addressForm.contact" 
            placeholder="请输入联系人姓名"
            class="form-input"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input 
            v-model="addressForm.phone" 
            type="number"
            placeholder="请输入手机号码"
            class="form-input"
          />
        </view>
        
        <view class="form-item" @tap="showRegionPicker = true">
          <text class="form-label">所在地区</text>
          <view class="region-selector">
            <text :class="{'placeholder': !addressForm.region}">
              {{addressForm.region || '请选择所在地区'}}
            </text>
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
        
        <view class="form-item textarea-item">
          <text class="form-label">详细地址</text>
          <textarea 
            v-model="addressForm.detail" 
            placeholder="请输入详细地址，如街道、门牌号等"
            class="form-textarea"
            maxlength="100"
          />
        </view>
        
        <view class="form-item switch-item">
          <text class="form-label">设为默认地址</text>
          <u-switch v-model="addressForm.isDefault" active-color="#007AFF"></u-switch>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <u-button type="primary" shape="circle" @tap="saveAddress">保存地址</u-button>
      <u-button 
        v-if="mode === 'edit'" 
        type="error" 
        shape="circle" 
        plain
        @tap="deleteAddress"
      >删除地址</u-button>
    </view>

    <!-- 地区选择器 -->
    <u-picker 
      v-model="showRegionPicker"
      mode="region"
      @confirm="onRegionConfirm"
      :area-code="addressForm.areaCode"
    ></u-picker>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mode: 'add', // add 或 edit
      addressId: '',
      addressForm: {
        contact: '',
        phone: '',
        region: '',
        areaCode: [],
        detail: '',
        isDefault: false
      },
      showRegionPicker: false
    }
  },
  onLoad(options) {
    this.mode = options.mode || 'add'
    if (options.id) {
      this.addressId = options.id
      this.loadAddressDetail()
    }
  },
  methods: {
    // 加载地址详情
    async loadAddressDetail() {
      console.log('加载地址详情:', this.addressId)
      // 这里可以调用API获取真实数据
      // 模拟数据
      const mockAddress = {
        contact: '张三',
        phone: '13800138000',
        region: '北京市 朝阳区',
        areaCode: ['11', '1101', '110105'],
        detail: '建国门外大街1号国贸大厦A座1001室',
        isDefault: true
      }
      this.addressForm = { ...mockAddress }
    },
    
    // 地区选择确认
    onRegionConfirm(e) {
      console.log('地区选择:', e)
      this.addressForm.region = `${e.province.label} ${e.city.label} ${e.area.label}`
      this.addressForm.areaCode = [e.province.value, e.city.value, e.area.value]
    },
    
    // 表单验证
    validateForm() {
      if (!this.addressForm.contact.trim()) {
        uni.showToast({
          title: '请输入联系人姓名',
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
      
      // 验证手机号格式
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.addressForm.phone)) {
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
      
      if (!this.addressForm.detail.trim()) {
        uni.showToast({
          title: '请输入详细地址',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    // 保存地址
    async saveAddress() {
      if (!this.validateForm()) {
        return
      }
      
      // 显示加载中
      uni.showLoading({
        title: '保存中...'
      })
      
      // 模拟保存操作
      setTimeout(() => {
        uni.hideLoading()
        
        // 获取缓存中的地址列表
        let addressList = uni.getStorageSync('addressList') || []
        
        if (this.mode === 'add') {
          // 添加新地址
          const newAddress = {
            id: Date.now(),
            ...this.addressForm
          }
          addressList.push(newAddress)
        } else {
          // 编辑现有地址
          const index = addressList.findIndex(item => item.id == this.addressId)
          if (index > -1) {
            addressList[index] = {
              ...addressList[index],
              ...this.addressForm
            }
          }
        }
        
        // 保存到缓存
        uni.setStorageSync('addressList', addressList)
        
        uni.showToast({
          title: '保存成功',
          icon: 'success',
          complete: () => {
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        })
      }, 1000)
    },
    
    // 删除地址
    deleteAddress() {
      uni.showModal({
        title: '提示',
        content: '确定要删除这个地址吗？',
        success: (res) => {
          if (res.confirm) {
            // 显示加载中
            uni.showLoading({
              title: '删除中...'
            })
            
            // 模拟删除操作
            setTimeout(() => {
              uni.hideLoading()
              
              // 获取缓存中的地址列表
              let addressList = uni.getStorageSync('addressList') || []
              
              // 删除地址
              addressList = addressList.filter(item => item.id != this.addressId)
              
              // 保存到缓存
              uni.setStorageSync('addressList', addressList)
              
              uni.showToast({
                title: '删除成功',
                icon: 'success',
                complete: () => {
                  setTimeout(() => {
                    uni.navigateBack()
                  }, 1500)
                }
              })
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-edit-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
}

// 表单区域
.form-container {
  padding: 20rpx;
  
  .form-section {
    background: #fff;
    border-radius: 15rpx;
    padding: 0 30rpx;
    
    .form-item {
      display: flex;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.textarea-item {
        align-items: flex-start;
      }
      
      &.switch-item {
        justify-content: space-between;
      }
      
      .form-label {
        font-size: 30rpx;
        color: #333;
        width: 140rpx;
        flex-shrink: 0;
        font-weight: 500;
      }
      
      .form-input {
        flex: 1;
        font-size: 30rpx;
        color: #333;
        margin-left: 20rpx;
        border: none;
        background: transparent;
      }
      
      .region-selector {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 20rpx;
        
        text {
          font-size: 30rpx;
          color: #333;
          
          &.placeholder {
            color: #999;
          }
        }
      }
      
      .form-textarea {
        flex: 1;
        font-size: 30rpx;
        color: #333;
        margin-left: 20rpx;
        height: 100rpx;
        border: none;
        background: transparent;
        resize: none;
        padding: 10rpx 0;
      }
    }
  }
}

// 底部操作栏
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  
  .u-btn {
    width: 100%;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>