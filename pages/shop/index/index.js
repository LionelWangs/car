// pages/shop/index/index.js
const api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 0,
    carouselList: [],
    activityList: [],
    storesList: [],
    adImgUrl: null,
    storePageEnd: false,
    storeLoading: false,
    storePageSize: 10,
    storePageNo: 1,
    loadingFail: false,
    address: "",
    brandName: "",
    latitude: "",
    longitude: "",
    distance: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsListWithShopId(options.shopId);
    this.getActivityList(options.shopId);
    this.GPSsubmit(options.shopId);
    this.getStores(options.shopId);
  },
    //获取经纬度度
    GPSsubmit: function (shopId) {
      wx.getLocation({
        type: "wgs84",
        success: (res) => {
          var latitude = res.latitude;
          var longitude = res.longitude;
          this.setData({
            latitude: latitude,
            longitude: longitude,
          });
          this.getStoresDistance(shopId,latitude, longitude);
        },
      });
    },
    //获取4S店
    getStores: function (shopId) {
      api.getStores(
        {
          shopId,
        },
        (success) => {
          this.setData({
            address: success.data.dto.adress,
            brandName: success.data.dto.shopName,
          });
        }
      );
    },
    //获取门店经纬度
    getStoresDistance(shopId,latitude, longitude) {
      api.getStoresDistance(
        {
          latitude: latitude,
          longitude: longitude,
          shopId,
        },
        (success) => {
          var distance = success.data.dto.distance.toFixed(0);
          this.setData({
            distance: distance,
          });
        }
      );
    },

    //查询状态
    openMap: function (e) {
      var that = this;
      wx.getSetting({
        success(res) {
          //这里判断是否有地位权限
          if (!res.authSetting["scope.userLocation"]) {
            wx.showModal({
              title: "提示",
              content: "请求获取位置权限",
              success: function (res) {
                if (res.confirm == false) {
                  return false;
                }
                wx.openSetting({
                  success(res) {
                    //如果再次拒绝则返回页面并提示
                    if (!res.authSetting["scope.userLocation"]) {
                      wx.showToast({
                        title: "此功能需获取位置信息，请重新设置",
                        duration: 3000,
                        icon: "none",
                      });
                    } else {
                      //允许授权，调用地图
                      that.chooseMap();
                    }
                  },
                });
              },
            });
          } else {
            //如果有定位权限，调用地图
            that.chooseMap();
          }
        },
      });
    },

    chooseMap() {
      var that = this;
      wx.chooseLocation({
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          });
          that.getStoresDistance(latitude, longitude);
        },
        fail: function (res) {
          console.log(res);
        },
      });
    },
    //获取轮播图列表
    getGoodsListWithShopId(shopId) {
      api.getGoodsListWithShopId(
        {
          pageNo: 1,
          maxResults: 99,
          shopId,
          type: 3,
        },
        (success) => {
          this.setData({
            carouselList: success.data.dto.list,
          });
        }
      );
    },
    //获取商品列表
    getGoodsList() {
      api.getGoodsList(
        {
          pageNo: 1,
          pageSize: 10,
          type: "",
        },
        (success) => {
          this.setData({
            goodsList: success.data.dto.list,
          });
        }
      );
    },

    //获取活动列表
    getActivityList(shopId) {
      api.getActivityList(
        {
          pageNo: this.data.storePageNo,
          maxResults: this.data.storePageSize,
          shopId,
          status: 1,
        },
        (success) => {
          this.setData({
            activityList: success.data.dto.list,
          });
        }
      );
    },

    //获取热门品牌列表
    getHotBrandListt() {
      api.getBrandList(
        {
          pageNo: 1,
          pageSize: 5,
        },
        (success) => {
          this.setData({
            hotBrandList: success.data.dto.list,
          });
        }
      );
    },
    shopping(e) {
      console.log(e);
      var id = e.currentTarget.dataset.operation.id;
      var shopId = e.currentTarget.dataset.operation.shopId;
      wx.navigateTo({
        url: "../../shopping/index/index?id=" + id + "&shopId=" + shopId,
      });
    },
    // 标签切换
    onChange: function (e) {
      console.log(e.detail.name);
      this.setData({
        tabActive: e.detail.name,
      });
    },
})