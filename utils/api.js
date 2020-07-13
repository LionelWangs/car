import { API_PATH } from "../config/appConfig.js";
//发送请求
const request = (option) => {
  return new Promise((resolve) => {
    wx.request({
      url: `${API_PATH}${option.url}`,
      data: option.data,
      method: option.method,
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success(res) {
        if (res.data.statusCode == 100) {
          resolve(res);
        } else {
          // wx.showToast({
          //   title: res.data.message,
          // })
        }
      },
      fail() {
        wx.showToast({
          title: "网络请求错误，请打开调试模式体验",
          icon: "none",
        });
      },
    });
  });
};

//支付请求
const pay = (option) => {
  return new Promise((resolve) => {
    wx.request({
      url: `${API_PATH}${option.url}`,
      data: option.data,
      method: option.method,
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success(res) {
        if (res.data.statusCode == 100) {
          resolve(res);
        } else {
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }
      },
      fail() {
        wx.showToast({
          title: "网络请求错误，请打开调试模式体验",
          icon: "none",
        });
      },
    });
  });
};
//获取指定4S店
const getStores = function (option, success) {
  request({
    url: "/admin/microservice/shop/get",
    method: "POST",
    data: {
      // latitude: option.latitude,
      // longitude: option.longitude,
      shopId: option.shopId,
    },
  }).then((res) => {
    return success(res);
  });
};
//获取指定4S店
const getStoresDistance = function (option, success) {
  request({
    url: "/admin/microservice/shop/get",
    method: "POST",
    data: {
      latitude: option.latitude,
      longitude: option.longitude,
      shopId: option.shopId,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取4S店列表
const getStoresList = function (option, success) {
  request({
    url: "/admin/microservice/shop/list",
    method: "POST",
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取品牌列表
const getBrandList = function (option, success) {
  request({
    url: "/admin/microservice/brand/list",
    method: "POST",
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo,
    },
  }).then((res) => {
    return success(res);
  });
};
// 根据4S店活动查询列表
const searchBrandList = function (option, success) {
  request({
    url: "/admin/microservice/brand/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      keyword: option.keyword,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取品牌详情
const getBrandDetails = function (option, success) {
  request({
    url: "/admin/microservice/brand/get",
    method: "POST",
    data: {
      brandId: option.brandId,
    },
  }).then((res) => {
    return success(res);
  });
};
// 根据4S店活动查询列表
const getActivityList = function (option, success) {
  request({
    url: "/admin/microservice/activity/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      shopId: option.shopId,
      status: option.status,
    },
  }).then((res) => {
    return success(res);
  });
};
// 根据4S店活动查询列表
const getActivityListByServerTypeId = function (option, success) {
  request({
    url: "/admin/microservice/activity/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      status: option.status,
      serveTypeId:option.serveTypeId
    },
  }).then((res) => {
    return success(res);
  });
};
// 根据4S店活动查询列表
const searchActivityList = function (option, success) {
  request({
    url: "/admin/microservice/activity/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      keyword: option.keyword,
      status: option.status,
    },
  }).then((res) => {
    return success(res);
  });
};
// 根据4S店活动查询列表 排除已出现的
const getActivityListRemove = function (option, success) {
  request({
    url: "/admin/microservice/activity/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      shopId: option.shopId,
      noActivityId: option.activityId,
      status: option.status,
    },
  }).then((res) => {
    return success(res);
  });
};
// 根据品牌活动查询列表
const getActivityListByBrandId = function (option, success) {
  request({
    url: "/admin/microservice/activity/list",
    method: "POST",
    data: {
      brandId: option.brandId,
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      status: option.status,
    },
  }).then((res) => {
    return success(res);
  });
};
// 活动查询
const getActivity = function (option, success) {
  request({
    url: "/admin/microservice/activity/get",
    method: "POST",
    data: {
      activityId: option.activityId,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取服务列表
const getServeList = function (option, success) {
  request({
    url: "/admin/microservice/serveType/list",
    method: "POST",
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo,
    },
  }).then((res) => {
    return success(res);
  });
};
//获取服务详情
const getServeDetails = function (option, success) {
  request({
    url: "/admin/microservice/serveType/get",
    method: "POST",
    data: {
      typeId: option.typeId,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取商品列表
const getGoodsList = function (option, success) {
  request({
    url: "/admin/microservice/serveInfo/list",
    method: "POST",
    data: {
      maxResults: option.pageSize,
      pageNo: option.pageNo,
      type: option.type,
    },
  }).then((res) => {
    return success(res);
  });
};
//获取商品列表
const getGoodsListWithShopId = function (option, success) {
  request({
    url: "/admin/microservice/serveInfo/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      type: option.type,
      shopId: option.shopId,
    },
  }).then((res) => {
    return success(res);
  });
};
//获取商品列表
const getGoodsListWithActivityId = function (option, success) {
  request({
    url: "/admin/microservice/serveInfo/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      activityId: option.activityId,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取商品列表
const getGoodsListWithBrandId = function (option, success) {
  request({
    url: "/admin/microservice/serveInfo/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      type: option.type,
      brandId: option.brandId,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取商品详情
const getGoodsDetails = function (option, success) {
  request({
    url: "/admin/microservice/serveInfo/get",
    method: "POST",
    data: {
      serviceId: option.serviceId,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取轮播图
const getCarouselList = function (option, success) {
  request({
    url: "/console/microservice/article/list",
    method: "POST",
    data: {
      categoryCode: "FL01",
      pageNo: option.pageNo,
      maxResults: option.pageSize,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取轮播图详情
const getCarouselDetails = function (option, success) {
  request({
    url: "/console/microservice/article/get",
    method: "POST",
    data: {
      id: option.id,
    },
  }).then((res) => {
    return success(res);
  });
};

//获取广告
const getAdlList = function (option, success) {
  request({
    url: "/console/microservice/article/list",
    method: "POST",
    data: {
      categoryCode: "FL02",
      pageNo: option.pageNo,
      maxResults: option.pageSize,
    },
  }).then((res) => {
    return success(res);
  });
};
//登录
//授权
const getMember = function (option, success) {
  request({
    url: "/admin/microservice/member/get",
    method: "POST",
    data: {
      mobile: option.mobile,
      unionId: option.unionId,
    },
  }).then((res) => {
    return success(res);
  });
};

//授权
const login = function (option, success) {
  request({
    url: "/admin/microservice/member/login",
    method: "POST",
    data: {
      code: option.code,
    },
  }).then((res) => {
    return success(res);
  });
};
//信息解密
function decrypt(option, success) {
  request({
    url: "/admin/microservice/member/decrypt",
    method: "POST",
    data: {
      openId: option.openId,
      data: option.data,
      iv: option.iv,
    },
  }).then((res) => {
    return success(res);
  });
}

//注册会员
const resigerMember = function (option, success) {
  request({
    url: "/admin/microservice/member/register",
    method: "POST",
    data: {
      memberName: option.memberName,
      mobile: option.mobile,
      photo: option.photo,
      unionId: option.unionId,
      openId: option.openId,
    },
  }).then((res) => {
    return success(res);
  });
};
//根据手机号获取优惠券列表
const getCouponList = function (option, success) {
  request({
    url: "/admin/microservice/coupon/memberCode/list",
    method: "POST",
    data: {
      mobile: option.mobile,
      pageNo: "1",
      maxResults: "10",
      serveTypeId: 1,
    },
  }).then((res) => {
    return success(res);
  });
};
//根据优惠券id获取优惠券信息
const getCoupon = function (option, success) {
  request({
    url: "/admin/microservice/coupon/memberCode/get",
    method: "POST",
    data: {
      id: option.id,
    },
  }).then((res) => {
    return success(res);
  });
};
//根据手机号获取红包列表
const getredList = function (option, success) {
  request({
    url: "/admin/microservice/coupon/memberCode/list",
    method: "POST",
    data: {
      mobile: option.mobile,
      pageNo: "1",
      maxResults: "10",
      serveTypeId: "",
    },
  }).then((res) => {
    return success(res);
  });
};
//准备支付
const prepareWeixinPay = function (option, success) {
  pay({
    url: "/admin/microservice/coupon/order/prepareWeixinPay",
    method: "POST",
    data: {
      mobile: option.mobile,
      orderId:option.orderId
    },
  }).then((res) => {
    debugger
    return success(res);
  });
};
//唤起支付
const orderPay = function (option, success) {
  pay({
    url: "/admin/microservice/coupon/order/create",
    method: "POST",
    data: {
      couponId: option.couponId,
      mobile: option.mobile,
      quantity: option.quantity,
      activityId: option.activityId,
    },
  }).then((res) => {
    return success(res);
  });
};
//待支付重新支付
const replayPay = function (option, success) {
  pay({
    url: "/admin/microservice/coupon/order/create",
    method: "POST",
    data: {
      couponId: option.couponId,
      mobile: option.mobile,
      quantity: option.quantity,
      activityId: option.activityId,
      orderId: option.orderId,
    },
  }).then((res) => {
    return success(res);
  });
};
//订单评价
const remarkAdd = function (option, success) {
  request({
    url: "/admin/microservice/coupon/order/comment/add",
    method: "POST",
    data: {
      orderId: option.orderId,
      mobile: option.mobile,
      remark: option.remark,
      stars: option.stars,
    },
  }).then((res) => {
    return success(res);
  });
};
//订单列表
const orderAllList = function (option, success) {
  request({
    url: "/admin/microservice/coupon/order/list",
    method: "POST",
    data: {
      mobile: option.mobile,
      statusFlag: option.statusFlag,
      pageNo: option.pageNo,
      maxResult: option.maxResult,
    },
  }).then((res) => {
    return success(res);
  });
};
//查询订单
const getOrder = function (option, success) {
  request({
    url: "/admin/microservice/coupon/order/get",
    method: "POST",
    data: {
      mobile: option.mobile,
      orderId: option.orderId,
    },
  }).then((res) => {
    return success(res);
  });
};
//取消订单
const cancleOrder = function (option, success) {
  request({
    url: "/admin/microservice/coupon/order/delete",
    method: "POST",
    data: {
      mobile: option.mobile,
      orderId: option.orderId,
      remark: option.remark,
      statusFlag: option.statusFlag,
    },
  }).then((res) => {
    return success(res);
  });
};
//获取指定优惠券
const getMemberCoupon = function (option, success) {
  request({
    url: "/admin/microservice/coupon/memberCode/get",
    method: "POST",
    data: {
      id: option.id,
    },
  }).then((res) => {
    return success(res);
  });
};
//获取评价列表
const remarkList = function (option, success) {
  request({
    url: "/admin/microservice/coupon/order/comment/list",
    method: "POST",
    data: {
      activityId: option.activityId,
      pageNo: option.pageNo,
    },
  }).then((res) => {
    return success(res);
  });
};
//发起砍价申请
const knockApply = function (option, success) {
  request({
    url: "/admin/microservice/coupon/order/knock/apply",
    method: "POST",
    data: {
      orderId: option.orderId,
      mobile: option.mobile,
    },
  }).then((res) => {
    return success(res);
  });
};
//砍价列表
const knockList = function (option, success) { pay({
    url: "/admin/microservice/coupon/order/knock/list",
    method: "POST",
    data: {
      maxResults: option.maxResults,
      pageNo: option.pageNo,
      orderId:option.orderId
    },
  }).then((res) => {
    return success(res);
  });
};
//帮砍价
const knockAdd = function (option, success) { pay({
  url: "/admin/microservice/coupon/order/knock/add",
  method: "POST",
  data: {
    orderId:option.orderId,
    mobile:option.mobile
  },
}).then((res) => {
  return success(res);
});
};
//参与砍价的的人数
const knockApplyCount = function (option, success) { request({
  // url: "/microservice/coupon/order/knockapply/count",
  url: "/admin/microservice/coupon/order/knock/count",
  method: "POST",
  data: {
    activityId:option.activityId,
  },
}).then((res) => {
  return success(res);
});
};

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
  getActivityListByServerTypeId,
  getGoodsListWithBrandId,
  getStoresDistance,
  getActivityListRemove,
  getGoodsListWithActivityId,
  login,
  resigerMember,
  decrypt,
  getMember,
  getCouponList,
  getCoupon,
  getredList,
  orderPay,
  remarkAdd,
  orderAllList,
  getOrder,
  cancleOrder,
  getMemberCoupon,
  remarkList,
  replayPay,
  searchActivityList,
  searchBrandList,
  knockApply,
  knockList,
  knockAdd,
  knockApplyCount,
  prepareWeixinPay
};
