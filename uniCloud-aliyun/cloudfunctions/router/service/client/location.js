/**
 * 高德地图定位服务云函数
 * 提供精确的定位和地址解析服务
 */
'use strict';
let vk; // 全局vk实例

let db = uniCloud.database(); // 全局数据库引用
let _ = db.command; // 数据库操作符
let $ = _.aggregate; // 聚合查询操作符

/**
 * 权限注意：访问以下链接查看
 * 文档地址：https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/cloudObject.html#内置权限
 */
let cloudObject = {
	isCloudObject: true, // 标记为云对象模式
	/**
	 * 请求前处理，主要用于调用方法之前进行预处理
	 */
	_before: async function() {
		vk = this.vk; // 将vk定义为全局对象
	},
	/**
	 * 请求后处理，主要用于处理本次调用方法的返回结果或者抛出的错误
	 */
	_after: async function(options) {
		let { err, res } = options;
		if (err) {
			return; // 如果方法抛出错误，直接return;不处理
		}
		return res;
	},

	/**
	 * 逆地理编码 - 根据经纬度获取详细地址信息
	 * @url client/location.regeo 前端调用的url参数地址
	 * @param {Object} data
	 * @param {Number} data.latitude 纬度
	 * @param {Number} data.longitude 经度
	 * @param {Number} data.accuracy 精度（可选）
	 */
	regeo: async function(data) {
		let res = { code: 0, msg: '' };

		try {
			let { latitude, longitude, accuracy } = data;

			// 参数校验
			if (!latitude || !longitude) {
				return { code: -1, msg: '经纬度参数不能为空' };
			}

			console.log('逆地理编码请求参数:', { latitude, longitude, accuracy });

			// 高德地图API密钥
			const amapKey = 'b225207ab9f44f8e8bc00820a63c1298';

			// 调用高德地图Web API逆地理编码
			const url = `https://restapi.amap.com/v3/geocode/regeo?key=${amapKey}&location=${longitude},${latitude}&extensions=all&radius=1000&roadlevel=1&poitype=&batch=false&homeorcorp=0`;

			const response = await uniCloud.httpclient.request(url, {
				method: 'GET',
				dataType: 'json',
				timeout: 10000
			});

			console.log('高德地图API响应:', response);

			if (response && response.data && response.data.status === '1' && response.data.regeocode) {
				const regeocode = response.data.regeocode;
				const addressComponent = regeocode.addressComponent;
				const formattedAddress = regeocode.formatted_address;

				console.log('地址组件详情:', addressComponent);
				console.log('格式化地址:', formattedAddress);
				console.log('道路信息:', regeocode.roads);
				console.log('兴趣点信息:', regeocode.pois);

				// 智能地址解析：优先使用最详细的地址信息
				let displayAddress = formattedAddress;

				// 如果格式化地址不够详细，尝试拼接更完整的地址
				if (!displayAddress || displayAddress.length < 15) {
					const parts = [];
					if (addressComponent.province && addressComponent.province !== addressComponent.city) {
						parts.push(addressComponent.province);
					}
					if (addressComponent.city) parts.push(addressComponent.city);
					if (addressComponent.district) parts.push(addressComponent.district);
					if (addressComponent.township) parts.push(addressComponent.township);
					if (addressComponent.street) parts.push(addressComponent.street);
					if (addressComponent.streetNumber) parts.push(addressComponent.streetNumber);

					displayAddress = parts.join('');
				}

				// 如果还是不够详细，尝试使用道路信息
				if ((!displayAddress || displayAddress.length < 12) && regeocode.roads && regeocode.roads.length > 0) {
					const road = regeocode.roads[0];
					displayAddress = `${addressComponent.city}${addressComponent.district}${road.name}附近`;
				}

				// 如果还是不够详细，尝试使用兴趣点信息
				if ((!displayAddress || displayAddress.length < 10) && regeocode.pois && regeocode.pois.length > 0) {
					const poi = regeocode.pois[0];
					displayAddress = `${addressComponent.city}${addressComponent.district}${poi.name}附近`;
				}

				// 确保至少有城市信息
				if (!displayAddress || displayAddress.trim().length === 0) {
					displayAddress = addressComponent.city || '未知位置';
				}

				// 如果地址太短，添加"附近"以表示大概位置
				if (displayAddress.length < 8 && !displayAddress.includes('附近')) {
					displayAddress += '附近';
				}

				res.data = {
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					accuracy: accuracy ? parseFloat(accuracy) : null,
					province: addressComponent.province,
					city: addressComponent.city,
					district: addressComponent.district,
					township: addressComponent.township,
					street: addressComponent.street,
					streetNumber: addressComponent.streetNumber,
					address: formattedAddress,
					displayAddress: displayAddress,
					roads: regeocode.roads || [],
					pois: regeocode.pois || []
				};

				res.msg = '逆地理编码成功';
				console.log('最终解析地址:', displayAddress);

			} else {
				console.error('高德地图API调用失败:', response);
				return { code: -1, msg: '地址解析失败，请稍后重试' };
			}

		} catch (err) {
			console.error('逆地理编码异常:', err);
			return { code: -1, msg: '服务异常，请稍后重试' };
		}

		return res;
	},

	/**
	 * IP定位 - 根据IP获取大概位置信息
	 * @url client/location.ipLocation 前端调用的url参数地址
	 */
	ipLocation: async function(data) {
		let res = { code: 0, msg: '' };

		try {
			console.log('IP定位请求');

			// 高德地图API密钥
			const amapKey = 'b225207ab9f44f8e8bc00820a63c1298';

			// 调用高德地图IP定位API
			const url = `https://restapi.amap.com/v3/ip?key=${amapKey}&output=json`;

			const response = await uniCloud.httpclient.request(url, {
				method: 'GET',
				dataType: 'json',
				timeout: 5000
			});

			console.log('IP定位响应:', response);

			if (response && response.data && response.data.status === '1') {
				const province = response.data.province || '';
				const city = response.data.city || '';
				const district = response.data.district || '';

				let displayAddress = `${province}${city}${district}`.replace(/undefined/g, '').trim();

				if (!displayAddress) {
					displayAddress = '北京市朝阳区'; // 默认位置
				}

				res.data = {
					province: province,
					city: city,
					district: district,
					displayAddress: displayAddress
				};

				res.msg = 'IP定位成功';

			} else {
				console.error('IP定位失败:', response);
				return { code: -1, msg: 'IP定位失败' };
			}

		} catch (err) {
			console.error('IP定位异常:', err);
			return { code: -1, msg: '服务异常，请稍后重试' };
		}

		return res;
	},

	/**
	 * 地理编码 - 根据地址获取经纬度
	 * @url client/location.geocode 前端调用的url参数地址
	 * @param {Object} data
	 * @param {String} data.address 地址文本
	 * @param {String} data.city 城市（可选，用于提高精度）
	 */
	geocode: async function(data) {
		let res = { code: 0, msg: '' };

		try {
			let { address, city } = data;

			// 参数校验
			if (!address) {
				return { code: -1, msg: '地址参数不能为空' };
			}

			console.log('地理编码请求参数:', { address, city });

			// 高德地图API密钥
			const amapKey = 'b225207ab9f44f8e8bc00820a63c1298';

			// 调用高德地图地理编码API
			let url = `https://restapi.amap.com/v3/geocode/geo?key=${amapKey}&address=${encodeURIComponent(address)}`;
			if (city) {
				url += `&city=${encodeURIComponent(city)}`;
			}

			const response = await uniCloud.httpclient.request(url, {
				method: 'GET',
				dataType: 'json',
				timeout: 10000
			});

			console.log('地理编码响应:', response);

			if (response && response.data && response.data.status === '1' && response.data.geocodes && response.data.geocodes.length > 0) {
				const geocode = response.data.geocodes[0];
				const location = geocode.location.split(',');

				res.data = {
					latitude: parseFloat(location[1]),
					longitude: parseFloat(location[0]),
					formattedAddress: geocode.formatted_address,
					province: geocode.province,
					city: geocode.city,
					district: geocode.district,
					township: geocode.township,
					street: geocode.street,
					streetNumber: geocode.streetNumber,
					level: geocode.level
				};

				res.msg = '地理编码成功';

			} else {
				console.error('地理编码失败:', response);
				return { code: -1, msg: '地址解析失败，请检查地址格式' };
			}

		} catch (err) {
			console.error('地理编码异常:', err);
			return { code: -1, msg: '服务异常，请稍后重试' };
		}

		return res;
	}
};

module.exports = cloudObject;