import {
  API_PATH
} from "../config/appConfig.js"
import {
  API_PATH2
} from "../config/appConfig.js"

//发送请求
const request = (option) => {
  return new Promise(resolve => {
    wx.request({
      url: `${API_PATH}${option.url}`,
      data: option.data,
      method: option.method,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.statusCode == 100) {
          resolve(res)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求错误，请打开调试模式体验',
          icon: "none"
        })
      }
    })
  })
}


//发送请求
const request2 = (option) => {
  return new Promise(resolve => {
    wx.request({
      url: `${API_PATH2}${option.url}`,
      data: option.data,
      method: option.method,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.statusCode == 100) {
          resolve(res)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求错误，请打开调试模式体验',
          icon: "none"
        })
      }
    })
  })
}
//获取指定4S店
const getStores = function (option, success) {
  request2({
    url: '/admin/microservice/shop/get',
    method: 'POST',
    data: {
      // latitude: option.latitude,
      // longitude: option.longitude,
      shopId:option.shopId
    },
  }).then(res => {
    return success(res)
  })
}
//获取指定4S店
const getStoresDistance = function (option, success) {
  request2({
    url: '/admin/microservice/shop/get',
    method: 'POST',
    data: {
      latitude: option.latitude,
      longitude: option.longitude,
      shopId:option.shopId
    },
  }).then(res => {
    return success(res)
  })
}

//获取4S店列表
const getStoresList = function (option, success) {
  request2({
    url: '/admin/microservice/shop/list',
    method: 'POST',
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo
    },
  }).then(res => {
    return success(res)
  })
}

//获取品牌列表
const getBrandList = function (option, success) {
  request2({
    url: '/admin/microservice/brand/list',
    method: 'POST',
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo
    },
  }).then(res => {
    return success(res)
  })
}

//获取品牌详情
const getBrandDetails = function (option, success) {
  request2({
    url: '/admin/microservice/brand/get',
    method: 'POST',
    data: {
      brandId: option.brandId
    },
  }).then(res => {
    return success(res)
  })
}
// 根据4S店活动查询列表
const getActivityList = function (option, success) {
  request2({
    url: '/admin/microservice/activity/list',
    method: 'POST',
    data: {
      maxResults:option.maxResults,
      pageNo:option.pageNo,
      shopId:option.shopId,
      status:option.status
    },
  }).then(res => {
    return success(res)
  })
}
// 根据品牌活动查询列表
const getActivityListByBrandId = function (option, success) {
  request2({
    url: '/admin/microservice/activity/list',
    method: 'POST',
    data: {
      brandId:option.brandId,
      maxResults:option.maxResults,
      pageNo:option.pageNo,
      status:option.status
    },
  }).then(res => {
    return success(res)
  })
}
// 活动查询
const getActivity = function (option, success) {
  request2({
    url: '/admin/microservice/activity/get',
    method: 'POST',
    data: {
      activityId: option.activityId,
    },
  }).then(res => {
    return success(res)
  })
}

//获取服务列表
const getServeList = function (option, success) {
  request2({
    url: '/admin/microservice/serveType/list',
    method: 'POST',
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo
    },
  }).then(res => {
    return success(res)
  })
}
//获取服务详情
const getServeDetails = function (option, success) {
  request2({
    url: '/admin/microservice/serveType/get',
    method: 'POST',
    data: {
      typeId: option.typeId
    },
  }).then(res => {
    return success(res)
  })
}

//获取商品列表
const getGoodsList = function (option, success) {
  request2({
    url: '/admin/microservice/serveInfo/list',
    method: 'POST',
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo,
      type: option.type
    },
  }).then(res => {
    return success(res)
  })
}
//获取商品列表
const getGoodsListWithShopId = function (option, success) {
  request2({
    url: '/admin/microservice/serveInfo/list',
    method: 'POST',
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      type: option.type,
      shopId:option.shopId
    },
  }).then(res => {
    return success(res)
  })
}

//获取商品列表
const getGoodsListWithBrandId = function (option, success) {
  request2({
    url: '/admin/microservice/serveInfo/list',
    method: 'POST',
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      type: option.type,
      brandId:option.brandId
    },
  }).then(res => {
    return success(res)
  })
}



//获取商品详情
const getGoodsDetails = function (option, success) {
  request2({
    url: '/admin/microservice/serveInfo/get',
    method: 'POST',
    data: {
      serviceId: option.serviceId
    },
  }).then(res => {
    return success(res)
  })
}

//获取轮播图
const getCarouselList = function (option, success) {
  request({
    url: '/console/microservice/article/list',
    method: 'POST',
    data: {
      categoryCode: "FL01",
      pageNo: option.pageNo,
      maxResults: option.pageSize,
    },
  }).then(res => {
    return success(res)
  })
}

//获取轮播图详情
const getCarouselDetails = function (option, success) {
  request({
    url: '/console/microservice/article/get',
    method: 'POST',
    data: {
      id: option.id
    },
  }).then(res => {
    return success(res)
  })
}

//获取广告
const getAdlList = function (option, success) {
  request({
    url: '/console/microservice/article/list',
    method: 'POST',
    data: {
      categoryCode: "FL02",
      pageNo: option.pageNo,
      maxResults: option.pageSize,
    },
  }).then(res => {
    return success(res)
  })
}

module.exports = {
  getBrandList,
  getBrandDetails,
  getServeList,
  getServeDetails,
  getGoodsList,
  getGoodsDetails,
  getCarouselList,
  getCarouselDetails,
  getAdlList,
  getStoresList,
  getActivityList,
  getActivity,
  getStores,
  getGoodsListWithShopId,
  getActivityListByBrandId,
  getGoodsListWithBrandId,
  getStoresDistance
}