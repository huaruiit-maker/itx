# 高德地图定位服务

## 概述

本项目集成了高德地图定位服务，通过uniCloud云函数提供精确的定位和地址解析功能。

## 架构优势

- **服务端调用**: 通过云函数调用高德地图API，避免前端暴露API密钥
- **统一管理**: 集中管理定位逻辑，便于维护和更新
- **错误处理**: 服务端统一处理API错误和异常情况
- **性能优化**: 可在服务端实现缓存和优化策略

## 云函数接口

### 1. 逆地理编码 (regeo)

根据经纬度获取详细地址信息。

**调用方式:**
```javascript
vk.callFunction({
  url: 'client/location.regeo',
  data: {
    latitude: 39.9042,    // 纬度
    longitude: 116.4074,  // 经度
    accuracy: 10          // 精度（可选）
  },
  success: (res) => {
    if (res.result.code === 0) {
      const data = res.result.data
      console.log('地址:', data.displayAddress)
      console.log('详细信息:', data)
    }
  }
})
```

**返回数据结构:**
```javascript
{
  code: 0,
  msg: '逆地理编码成功',
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    accuracy: 10,
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    township: '建国门外街道',
    street: '建国门外大街',
    streetNumber: '1号',
    address: '北京市朝阳区建国门外大街1号',
    displayAddress: '北京市朝阳区建国门外大街1号',
    roads: [...],  // 附近道路信息
    pois: [...]    // 附近兴趣点信息
  }
}
```

### 2. IP定位 (ipLocation)

根据IP地址获取大概位置信息。

**调用方式:**
```javascript
vk.callFunction({
  url: 'client/location.ipLocation',
  data: {},
  success: (res) => {
    if (res.result.code === 0) {
      const data = res.result.data
      console.log('IP定位结果:', data.displayAddress)
    }
  }
})
```

### 3. 地理编码 (geocode)

根据地址文本获取经纬度。

**调用方式:**
```javascript
vk.callFunction({
  url: 'client/location.geocode',
  data: {
    address: '北京市朝阳区建国门外大街1号',
    city: '北京市'  // 可选，用于提高精度
  },
  success: (res) => {
    if (res.result.code === 0) {
      const data = res.result.data
      console.log('坐标:', data.latitude, data.longitude)
    }
  }
})
```

## 前端集成

### 自动定位流程

1. **H5环境**: 优先使用高德地图SDK定位
2. **失败时**: 调用云函数进行逆地理编码
3. **再次失败**: 使用IP定位获取大概位置
4. **最后备选**: 使用默认位置

### 代码示例

```javascript
// 在页面中调用定位
selectLocation() {
  // H5环境使用高德地图SDK
  // 小程序环境直接调用云函数
  this.fallbackToCloudFunction(latitude, longitude, accuracy)
}
```

## 配置说明

### 高德地图API密钥

在云函数中配置API密钥：
```javascript
const amapKey = 'your_amap_api_key'
```

### 权限配置

确保在 `manifest.json` 中配置了定位权限：

```json
{
  "mp-weixin": {
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于定位服务"
      }
    }
  }
}
```

## 错误处理

云函数统一返回错误码：
- `code: 0` - 成功
- `code: -1` - 失败，详细信息在 `msg` 中

## 部署说明

1. 将云函数部署到uniCloud
2. 确保API密钥正确配置
3. 测试各项功能正常工作

## 注意事项

- 高德地图API有调用频率限制
- 建议在生产环境中添加API调用缓存
- 注意保护API密钥安全，不要在前端代码中暴露