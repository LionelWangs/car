// components/shop/shop.js
const app = getApp();
const api = require("../../../utils/api.js");
import { IMG_PATH } from "../../../config/appConfig.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    IMG_PATH,
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
  lifetimes: {
    created() {
      this.getGoodsListWithShopId();
      this.getActivityList();
      this.GPSsubmit();
      this.getStores();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      //上拉4s店
      // if (this.data.tabActive == 1) {
      //   if (!this.data.storePageEnd && !this.data.storeLoading) {
      //     this.setData({
      //       storeLoading: true,
      //       storePageNo: this.data.storePageNo + 1
      //     });
      //     this.getStoresListList();
      //   }
      // }
    },

    //获取经纬度度
    GPSsubmit: function () {
      wx.getLocation({
        type: "wgs84",
        success: (res) => {
          var latitude = res.latitude;
          var longitude = res.longitude;
          this.setData({
            latitude: latitude,
            longitude: longitude,
          });
          this.getStoresDistance(latitude, longitude);
        },
      });
    },
    //获取4S店
    getStores: function () {
      const c = wx.getStorageSync("shopId");
      api.getStores(
        {
          shopId: c,
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
    getStoresDistance(latitude, longitude) {
      const c = wx.getStorageSync("shopId");
      console.log(this.data.latitude);
      api.getStoresDistance(
        {
          latitude: latitude,
          longitude: longitude,
          shopId: c,
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
    getGoodsListWithShopId() {
      const c = wx.getStorageSync("shopId");
      api.getGoodsListWithShopId(
        {
          pageNo: 1,
          maxResults: 99,
          shopId: c,
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
    getActivityList() {
      const c = wx.getStorageSync("shopId");
      api.getActivityList(
        {
          pageNo: this.data.storePageNo,
          maxResults: this.data.storePageSize,
          shopId: c,
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
    back() {
      wx.reLaunch({
        url: "../index/index?tabActive=1",
      });
    },
    shopping(e) {
      console.log(e);
      var id = e.currentTarget.dataset.operation.id;
      var shopId = e.currentTarget.dataset.operation.shopId;
      wx.navigateTo({
        url: "../shopping/index/index?id=" + id + "&shopId=" + shopId,
      });
    },
    // 标签切换
    onChange: function (e) {
      console.log(e.detail.name);
      this.setData({
        tabActive: e.detail.name,
      });
    },
  },
});
