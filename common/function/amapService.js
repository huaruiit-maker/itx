const amapKey = 'b225207ab9f44f8e8bc00820a63c1298';

function loadAMapScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('非浏览器环境无法加载高德地图SDK'));
    }

    if (window.AMap) {
      return resolve(window.AMap);
    }

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&plugin=AMap.Geolocation,AMap.Geocoder,AMap.PlaceSearch`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error('高德地图SDK加载完成但未获取到 AMap 对象'));
      }
    };

    script.onerror = () => {
      reject(new Error('高德地图SDK加载失败'));
    };

    document.head.appendChild(script);
  });
}

export async function loadAMapSDK() {
  // #ifdef H5
  return await loadAMapScript();
  // #endif
  // #ifndef H5
  return Promise.reject(new Error('仅H5环境支持高德SDK加载'));
  // #endif
}

export async function getAMapLocation() {
  // #ifdef H5
  const AMap = await loadAMapSDK();

  return new Promise((resolve, reject) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 45000,
      maximumAge: 0,
      convert: true,
      showButton: false,
      showMarker: false,
      showCircle: false,
      panToLocation: false,
      zoomToAccuracy: false,
      useIP: false,
      extensions: 'all'
    });

    geolocation.getCurrentPosition((status, result) => {
      if (status === 'complete') {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
  // #endif
  // #ifndef H5
  return Promise.reject(new Error('仅H5环境支持高德SDK定位'));
  // #endif
}

export async function reverseGeocode(longitude, latitude) {
  // #ifdef H5
  await loadAMapSDK();

  return new Promise((resolve, reject) => {
    const geocoder = new window.AMap.Geocoder({
      city: '',
      radius: 1000
    });

    geocoder.getAddress([longitude, latitude], (status, result) => {
      if (status === 'complete' && result.regeocode) {
        resolve(result.regeocode);
      } else {
        reject(result);
      }
    });
  });
  // #endif
  // #ifndef H5
  return Promise.reject(new Error('仅H5环境支持高德SDK逆地理编码'));
  // #endif
}

export async function searchNearbyPOI(longitude, latitude) {
  // #ifdef H5
  await loadAMapSDK();

  return new Promise((resolve, reject) => {
    const placeSearch = new window.AMap.PlaceSearch({
      city: '',
      type: '',
      pageSize: 1,
      pageIndex: 1,
      extensions: 'all'
    });

    placeSearch.searchNearBy('', [longitude, latitude], 100, (status, result) => {
      if (status === 'complete') {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
  // #endif
  // #ifndef H5
  return Promise.reject(new Error('仅H5环境支持POI搜索'));
  // #endif
}
