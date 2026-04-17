## 1.0.1（2025-09-20）
更新截图
## 1.0.0（2025-09-20）
# 星云家电维修

## 项目介绍
星云家电维修是一个基于uni-app和uniCloud开发的多角色家电维修服务平台，支持客户、维修师傅、商家三种角色。平台提供完整的维修服务生态系统，包括服务发布、预约下单、订单管理、支付结算、收入提现等全流程功能。采用uni-app跨平台框架，支持微信小程序、H5、APP多平台部署，使用uniCloud云开发架构，提供稳定可靠的云端服务。

## 主要功能

### 核心功能
- **多角色系统**：客户、维修师傅、商家三种角色，各自拥有独立的功能模块和权限体系
- **用户认证**：手机号注册登录，短信验证码验证，支持角色选择和切换
- **服务管理**：商家发布维修服务，设置价格、描述、服务范围，客户浏览和筛选服务
- **预约下单**：客户在线预约，选择服务、时间、地址，填写问题描述和图片
- **订单管理**：完整的订单生命周期，包括待接单、服务中、待支付、已完成等状态
- **支付系统**：集成vk-uni-pay支付模块，支持在线支付和余额管理
- **收入提现**：师傅和商家收入统计，支持余额提现到银行卡
- **消息通知**：订单状态变更通知，系统消息推送
- **地址管理**：客户地址簿管理，支持地图定位和导航功能

### 客户功能模块
- **首页浏览**：展示家电维修分类（空调、电视、冰箱、洗衣机等），推荐热门服务
- **服务搜索**：支持关键词搜索和分类筛选，快速找到需要的维修服务
- **服务详情**：查看服务价格、描述、服务范围，支持立即预约和收藏
- **在线预约**：填写服务地址、预约时间、问题描述，支持上传故障图片
- **订单管理**：查看订单列表和详情，跟踪订单状态（待接单、服务中、待支付、已完成）
- **个人中心**：客户信息管理，头像、昵称、手机号设置
- **地址管理**：客户地址簿，支持新增、编辑、删除地址，地图定位
- **收藏服务**：收藏喜欢的维修服务，方便下次快速预约
- **支付功能**：在线支付维修费用，支持余额支付

### 维修师傅功能模块
- **师傅工作台**：展示今日订单数量、收入统计、待处理订单提醒
- **订单接收**：查看待接单订单，选择接单或拒单，查看订单详情和客户信息
- **服务管理**：更新订单服务状态（已接单、服务中、已完成），添加服务记录
- **日程安排**：查看个人工作日程，管理可接单时间段
- **技能标签**：管理个人技能标签，设置擅长的维修服务类型
- **收入统计**：查看收入明细和统计，支持余额提现到银行卡
- **个人资料**：师傅个人信息管理，包括姓名、手机号、工作经验等
- **接单设置**：设置是否接受新订单，管理接单范围和时间

### 商家功能模块
- **商家工作台**：数据概览面板，展示今日订单、收入统计、服务数量等关键指标
- **服务发布**：发布新的维修服务，设置服务名称、价格、描述、服务范围等信息
- **服务管理**：管理已发布的服务，支持编辑、下架、查看服务详情和预约情况
- **订单管理**：查看所有订单列表和详情，支持按状态筛选和订单分配
- **师傅管理**：管理旗下维修师傅，查看师傅信息、接单情况、服务评价
- **财务统计**：收入统计和财务管理，支持查看收入明细和余额提现
- **店铺信息**：商家基本信息管理，包括店铺名称、联系方式、营业时间等
- **营业设置**：设置店铺营业状态，管理接单时间和配送范围

## 技术栈

### 前端技术
- **框架**：uni-app (Vue.js跨平台框架)
- **UI组件库**：vk-uview-ui
- **状态管理**：Vuex
- **样式预处理**：SCSS

### 后端技术
- **云开发**：uniCloud (阿里云)
- **数据库**：NoSQL数据库
- **用户系统**：uni-id
- **云函数框架**：vk-unicloud-router

## 项目结构

```
├── App.vue                    # 应用入口文件，全局配置和生命周期
├── main.js                    # 应用入口JS，初始化配置和全局组件注册
├── pages.json                 # 页面路由配置，底部导航栏配置
├── manifest.json              # 应用配置文件，包含AppID、权限等
├── app.config.js              # 应用配置文件，包含API配置等
├── common/                    # 公共资源目录
│   ├── css/                   # 公共样式文件
│   │   ├── app.scss          # 应用级样式
│   │   ├── global-styles.scss # 全局样式定义
│   │   ├── page-styles.scss  # 页面基础样式
│   │   ├── responsive.scss   # 响应式样式
│   │   └── uni.scss          # uni-app样式变量
│   └── function/              # 公共函数库
│       └── myPubFunction.js   # 通用工具函数
├── pages/                     # 页面文件目录（按角色分类）
│   ├── index/                 # 首页入口
│   │   └── index.vue         # 应用首页
│   ├── customer/              # 客户相关页面
│   │   ├── home/             # 客户首页
│   │   ├── service/          # 服务浏览相关
│   │   ├── booking/          # 预约下单相关
│   │   ├── order/            # 订单管理相关
│   │   ├── address/          # 地址管理相关
│   │   ├── profile/          # 个人中心相关
│   │   └── auth/             # 客户认证相关
│   ├── master/                # 维修师傅相关页面
│   │   ├── workbench/        # 师傅工作台
│   │   ├── order/            # 订单管理相关
│   │   ├── schedule/         # 日程安排相关
│   │   ├── skill/            # 技能管理相关
│   │   ├── income/           # 收入统计相关
│   │   ├── profile/          # 个人中心相关
│   │   └── auth/             # 师傅认证相关
│   ├── business/              # 商家相关页面
│   │   ├── dashboard/        # 商家工作台
│   │   ├── service/          # 服务管理相关
│   │   ├── order/            # 订单管理相关
│   │   ├── master/           # 师傅管理相关
│   │   ├── finance/          # 财务管理相关
│   │   ├── profile/          # 店铺设置相关
│   │   └── auth/             # 商家认证相关
│   ├── common/                # 公共页面
│   │   ├── login/            # 登录页面
│   │   ├── register/         # 注册页面
│   │   ├── search/           # 搜索页面
│   │   ├── role/             # 角色选择页面
│   │   ├── profile/          # 个人资料编辑
│   │   ├── about/            # 关于我们页面
│   │   └── setting/          # 设置页面
│   └── mall/                  # 商城相关页面（预留）
├── static/                    # 静态资源目录
│   ├── logo.png              # 应用Logo
│   ├── category/             # 分类图标
│   │   ├── air-conditioner.svg
│   │   ├── tv.svg
│   │   ├── refrigerator.svg
│   │   ├── washing-machine.svg
│   │   ├── water-heater.svg
│   │   ├── gas-stove.svg
│   │   ├── microwave.svg
│   │   └── all.svg
│   ├── guarantee/            # 保障服务图标
│   │   ├── after-sales.svg
│   │   ├── fast-response.svg
│   │   ├── price-transparent.svg
│   │   └── quality.svg
│   ├── images/               # 图片资源
│   ├── tabbar/               # 底部导航栏图标
│   │   ├── home.svg / home-active.svg
│   │   ├── service.svg / service-active.svg
│   │   ├── order.svg / order-active.svg
│   │   └── user.svg / user-active.svg
│   └── upload/               # 上传文件目录（运行时生成）
├── store/                     # Vuex状态管理
│   ├── index.js              # Vuex主入口文件
│   └── modules/              # 状态模块
│       ├── $app.js           # 应用级状态管理
│       └── $user.js          # 用户状态管理
├── uni_modules/               # uni-app模块目录
│   ├── uni-config-center/    # 配置中心模块
│   ├── uni-id/               # 用户认证系统
│   ├── vk-uni-pay/           # 支付模块（集成vk-uni-pay）
│   ├── vk-unicloud/          # 云开发框架
│   └── vk-uview-ui/          # UI组件库
├── uniCloud-aliyun/           # uniCloud云开发资源
│   ├── cloudfunctions/       # 云函数目录
│   │   └── router/           # 路由云函数（vk-unicloud-router）
│   └── database/             # 数据库配置
│       ├── db_init.json      # 数据库初始化配置
│       └── JQL查询.jql       # JQL查询语句
├── unpackage/                 # 编译输出目录
│   └── dist/                 # 各平台编译结果
├── index.html                 # H5入口文件
├── template.h5.html           # H5模板文件
├── uni.scss                   # uni-app样式变量
└── package.json               # 项目依赖配置
```

## 安装指南

### 前置条件
- 安装HBuilderX编辑器
- 注册DCloud开发者账号
- 创建uniCloud云服务空间

### 项目导入
1. 克隆或下载项目代码
2. 在HBuilderX中导入项目
3. 关联uniCloud云服务空间

### 云开发环境配置
1. 右键点击`uniCloud`目录，选择`运行云服务空间初始化向导`
2. 根据提示完成初始化配置
3. 上传`common`模块和`router`云函数

### 前端开发配置
1. **main.js**已配置uView UI引入
```js
import uView from './uni_modules/vk-uview-ui';
Vue.use(uView);
```

2. **App.vue**已引入基础样式
```html
<style lang="scss">
    @import "./uni_modules/vk-uview-ui/index.scss";
</style>
```

3. **uni.scss**已引入全局变量
```css
@import "@/uni_modules/vk-uview-ui/theme.scss";
```

## 功能页面说明

### 客户相关页面
- **首页 (pages/index/index.vue)**: 客户首页，展示维修服务分类和推荐服务
- **服务列表 (pages/customer/service/list.vue)**: 维修服务列表，支持分类筛选和搜索
- **服务详情 (pages/customer/service/detail.vue)**: 服务详情页面，支持立即预约和收藏
- **在线预约 (pages/customer/booking/booking.vue)**: 在线预约维修服务，填写地址、时间、问题描述，支持上传图片
- **客户订单 (pages/customer/order/list.vue)**: 客户维修订单管理，查看订单状态（待接单、服务中、待支付、已完成）
- **订单详情 (pages/customer/order/detail.vue)**: 订单详情页面，查看订单信息、师傅信息、服务进度
- **客户个人中心 (pages/customer/profile/index.vue)**: 客户个人信息和功能入口
- **地址管理 (pages/customer/address/list.vue)**: 客户地址簿管理，支持新增、编辑、删除地址，地图定位
- **收藏服务 (pages/customer/service/favorite.vue)**: 客户收藏的维修服务列表

### 维修师傅相关页面
- **师傅工作台 (pages/master/workbench/index.vue)**: 师傅个人工作台，展示今日订单数量、收入统计、待处理订单
- **待接单列表 (pages/master/order/pending.vue)**: 显示待接单的订单列表，支持接单和拒单
- **师傅订单 (pages/master/order/list.vue)**: 师傅订单管理，查看已接订单和服务状态更新
- **订单详情 (pages/master/order/detail.vue)**: 订单详情页面，查看客户信息、服务地址、问题描述
- **师傅日程 (pages/master/schedule/schedule.vue)**: 师傅工作日程安排，管理可接单时间段
- **技能管理 (pages/master/skill/skill.vue)**: 师傅技能标签管理，设置擅长的维修服务类型
- **收入统计 (pages/master/income/index.vue)**: 师傅收入明细统计和提现功能
- **师傅个人中心 (pages/master/profile/index.vue)**: 师傅个人信息管理和接单设置

### 商家相关页面
- **商家工作台 (pages/business/workbench/index.vue)**: 商家数据概览面板，展示关键经营指标
- **服务发布 (pages/business/service/create.vue)**: 商家发布新的维修服务，设置服务信息
- **服务管理 (pages/business/service/manage.vue)**: 管理已发布的维修服务，支持编辑和下架
- **服务分类 (pages/business/service/category.vue)**: 管理服务分类，设置分类图标和排序
- **商家订单 (pages/business/order/list.vue)**: 商家订单管理，查看所有订单和分配师傅
- **订单详情 (pages/business/order/detail.vue)**: 订单详情页面，支持订单分配和状态管理
- **师傅管理 (pages/business/master/list.vue)**: 管理旗下维修师傅，查看师傅信息和接单情况
- **师傅审核 (pages/business/master/audit.vue)**: 审核申请加入的维修师傅
- **财务统计 (pages/business/finance/overview.vue)**: 商家收入统计和财务管理
- **提现管理 (pages/business/finance/withdraw.vue)**: 处理师傅和商家的提现申请
- **商家设置 (pages/business/profile/index.vue)**: 商家店铺信息管理和营业设置

### 公共页面
- **登录页 (pages/common/login/index.vue)**: 用户登录界面，支持手机号+验证码登录
- **注册页 (pages/common/register/index.vue)**: 用户注册界面，支持手机号+验证码注册
- **角色选择 (pages/common/role/select.vue)**: 新用户注册后选择使用角色（客户/师傅/商家）
- **搜索页面 (pages/common/search/index.vue)**: 全局搜索功能，支持服务搜索和历史记录
- **个人资料编辑 (pages/common/profile/edit.vue)**: 用户资料编辑页面，支持头像上传
- **关于我们 (pages/common/about/index.vue)**: 应用介绍和版本信息页面
- **设置页面 (pages/common/setting/index.vue)**: 应用设置，包括清除缓存、退出登录等

## 开发说明

### 云函数调用方式
项目使用vk-unicloud-router框架，通过统一的云函数入口调用各业务逻辑：

```js
vk.callFunction({
    url: 'service路径',
    data: { /* 请求参数 */ },
    success: (res) => { /* 成功回调 */ }
});
```

### 数据库操作
使用vk.baseDao API简化数据库操作：
- 支持增删改查基本操作
- 提供连表查询、分页查询等高级功能
- 内置权限控制和数据过滤

## 发布部署

### 微信小程序
1. 在manifest.json中配置微信小程序信息
2. 选择发行 -> 小程序-微信
3. 按照提示完成发布流程

### H5
1. 选择发行 -> H5
2. 配置相关参数后生成H5包
3. 部署到Web服务器

### APP
1. 选择发行 -> App云端打包
2. 配置应用信息和证书
3. 等待打包完成并下载安装包

## 注意事项
1. 开发环境和生产环境需要分别配置
2. 敏感信息如AppID、密钥等应配置在安全的地方
3. 云函数修改后需要重新上传才能生效
4. 数据库 schema 修改后需要同步更新

## 更新日志
#
## 2025-01-07
- **项目重构**: 完成多角色家电维修平台开发，支持客户、维修师傅、商家三种角色
- **功能完善**: 实现完整的维修服务业务流程，包括服务发布、预约下单、订单管理、支付结算、收入提现
- **架构升级**: 采用uni-app跨平台框架+uniCloud云开发架构，集成vk-uni-pay支付模块
- **页面重构**: 重新设计客户、师傅、商家三个角色的页面结构和功能模块
- **组件修复**: 修复u-textarea组件导入错误，替换为u-field组件并设置type="textarea"
- **UI修复**: 修复所有u-icon图标size属性和按钮size属性错误，确保组件正常使用
- **文档更新**: 全面更新项目文档，准确描述多角色功能、实际页面结构和项目架构

## License
MIT
