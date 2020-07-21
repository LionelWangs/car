//获取应用实例
const app = getApp();
const api = require("../../utils/api.js");
import { IMG_PATH } from "../../config/appConfig.js";

Page({
  data: {
    searchText: "输入您感兴趣的商品或者服务",
    IMG_PATH,
    tabActive: 0,
    carouselList: [],
    serveList: [],
    goodsList: [],
    activityList: [],
    brandList: [],
    hotBrandList: [],
    hotStoresList: [],
    storesList: [],
    adImgUrl: null,
    storePageEnd: false,
    storeLoading: false,
    //活动分页
    activityPageEnd: false,
    activityLoading: false,
    pageSize: 4,
    storePageSize: 10,
    storePageNo: 1,
    activityPageSize: 10,
    activityPageNo: 1,
    loadingFail: false,
    shopHeight: "176rpx",
    brandHeight: "176rpx",
    text: "打开全部",
    brandText: "打开全部",
    searchList: [],
    search: false,
    city:''
  },
  onLoad: function (e) {
    //判断是否为空
    if (JSON.stringify(e) != "{}") {
      var index = parseInt(e.tabActive);
      this.setData({
        tabActive: index,
      });
      if (e.tabActive == 0) {
        this.setData({
          searchText: "输入您感兴趣的商品或者服务",
        });
      }
    }

    this.getCarouselList();
    this.getServeList();
    this.getActivityList();
    this.getHotBrandListt();
    this.getHotStoresListt();
    this.getStoresListList();
    this.getBrandList();
    this.getCity();
    wx.setTabBarBadge({
      index:3,
      text:"99",
      success:function(){
        setTimeout(function() {
          wx.removeTabBarBadge({
            index:3,
          })
       }, 3000);
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉4s店
    if (this.data.tabActive == 1) {
      if (!this.data.storePageEnd && !this.data.storeLoading) {
        this.setData({
          storePageNo: this.data.storePageNo + 1,
        });
        this.getStoresListList();
      }
    }
    //上拉加载活动
    if (this.data.tabActive == 0) {
      if (!this.data.activityPageEnd && !this.data.activityLoading) {
        this.setData({
          activityPageNo: this.data.activityPageNo + 1,
        });
        this.getActivityList();
      }
    }
  },

  //获取轮播图列表
  getCarouselList() {
    api.getCarouselList(
      {
        pageNo: 1,
        pageSize: 99,
      },
      (success) => {
        console.log(success);
        this.setData({
          carouselList: success.data.dto.list,
        });
      }
    );
  },
  //获取服务列表
  getServeList() {
    api.getServeList(
      {
        pageNo: 1,
        pageSize: 99,
      },
      (success) => {
        this.setData({
          serveList: success.data.dto.list,
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
    api.getActivityList(
      {
        maxResults: this.data.activityPageSize,
        pageNo: this.data.activityPageNo,
        shopId: "",
        status: 1,
      },
      (success) => {
        if (this.data.activityPageNo <= success.data.dto.pagination.pageCount) {
          this.setData({
            activityList: this.data.activityList.concat(success.data.dto.list),
          });
        }
        //判断是否长度大于总条数
        if (
          this.data.pageNo == success.data.dto.pagination.pageCount
        ) {
          this.setData({
            activityLoading: true,
            activityPageEnd: true,
          });
        }
        console.log(this.data.activityList)
      }
    );
  },
  //获取全部4s店列表
  getStoresListList() {
    api.getGoodsList(
      {
        pageNo: this.data.storePageNo,
        pageSize: this.data.storePageSize,
        type: 3,
      },
      (success) => {
        if (this.data.storePageNo <= success.data.dto.pagination.pageCount) {
          this.setData({
            storesList: this.data.storesList.concat(success.data.dto.list),
          });
        }
        //判断是否长度大于总条数
        if (this.data.pageNo == success.data.dto.pagination.pageCount) {
          this.setData({
            storeLoading: true,
            storePageEnd: true,
          });
        }
      }
    );
    var data = this.data.storesList;
    console.log(data);
  },

  //获取热门品牌列表
  getHotBrandListt() {
    api.getBrandList(
      {
        pageNo: 1,
        pageSize: this.data.pageSize,
      },
      (success) => {
        this.setData({
          hotBrandList: success.data.dto.list,
        });
      }
    );
  },

  //获取热门4s列表
  getHotStoresListt() {
    api.getStoresList(
      {
        pageNo: 1,
        pageSize: this.data.pageSize,
      },
      (success) => {
        this.setData({
          hotStoresList: success.data.dto.list,
        });
      }
    );
  },
  //获取所有品牌
  getBrandList() {
    api.getBrandList(
      {
        pageNo: this.data.storePageNo,
        pageSize: this.data.storePageSize,
      },
      (success) => {
        this.setData({
          brandList: success.data.dto.list,
        });
      }
    );
  },
  //扫码
  scan() {
    wx.scanCode({
      success(res) {
        console.log(res);
      },
    });
  },
  /*
    4S子页面
  */
  goShop(e) {
    const shopId = e.currentTarget.dataset.operation.shop.shopId;
    wx.navigateTo({
      url: '../shop/index/index?shopId='+shopId,
    })
  },
  /*
    4S子页面
  */
  goHotShop(e) {
    const shopId = e.currentTarget.dataset.operation.shopId;
    wx.navigateTo({
      url: '../shop/index/index?shopId='+shopId,
    })
  },

  /*品牌子页面 */
  goBrand(e) {
    console.log(e);
    const brandId = e.currentTarget.dataset.operation;
    wx.navigateTo({
      url: '../brand/index/index?brandId='+brandId,
    })
  },
  // 标签切换
  onChange(e) {
    console.log(e.detail.name);
    this.setData({
      tabActive: e.detail.name,
      pageSize: 4,
    });
    if (e.detail.name == 0) {
      this.setData({
        searchText: "输入您感兴趣的商品或者服务",
      });
    } else {
      this.setData({
        searchText: "搜索品牌  |  车系",
      });
    }
  },
  //搜索框
  onInput(event) {
    if (event.detail != "" && this.data.tabActive == 0) {
      api.searchActivityList(
        {
          maxResults: 10,
          pageNo: 1,
          keyword: event.detail,
          status: 1,
        },
        (success) => {
          console.log(success);
          this.setData({
            searchList: success.data.dto.list,
            search: true,
          });
        }
      );
    } else if (
      (event.detail != "" && this.data.tabActive == 1) ||
      this.data.tabActive == 2
    ) {
      api.searchBrandList(
        {
          maxResults: 10,
          pageNo: 1,
          keyword: event.detail,
        },
        (success) => {
          console.log(success);
          this.setData({
            searchList: success.data.dto.list,
            search: true,
          });
        }
      );
    } else {
      this.setData({
        search: false,
      });
    }
  },
  openAll(e) {
    console.log(e);
    if (e.currentTarget.dataset.operation == "打开全部") {
      this.setData({
        pageSize: 12,
        shopHeight: "400rpx",
        brandText: "收起全部",
      });
      this.getHotBrandListt();
    } else if (e.currentTarget.dataset.operation == "收起全部") {
      this.setData({
        pageSize: 4,
        shopHeight: "176rpx",
        brandText: "打开全部",
      });
      this.getHotBrandListt();
    }

    if (e.currentTarget.dataset.operation == "打开全部2") {
      this.setData({
        pageSize: 12,
        brandHeight: "400rpx",
        text: "收起全部",
      });
      this.getHotStoresListt();
    } else if (e.currentTarget.dataset.operation == "收起全部2") {
      this.setData({
        pageSize: 4,
        brandHeight: "176rpx",
        text: "打开全部",
      });
      this.getHotStoresListt();
    }
  },
  goactivity(e) {
    console.log(e);
    var shopId = e.currentTarget.dataset.operation.shopId;
    var activityId = e.currentTarget.dataset.operation.id;
    var status = 1;
    wx.navigateTo({
      url:
        "../shopping/index/index?shopId=" +
        shopId +
        "&id=" +
        activityId +
        "&status=" +
        status,
    });
  },
  goService(e){
    console.log(e)
    let id = e.currentTarget.dataset.operation.id
    let title = e.currentTarget.dataset.operation.serviceName
    wx.navigateTo({
      url: '../buy/index/index?serveTypeId='+id+'&title='+title,
    })
  },
  //获取当前城市
  getCity(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      }
    })
  },
  loadCity(longitude, latitude){
    var that = this;
    wx.request({
      url: 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=EbfH3jKi6p2QO2fjMpUjmdISuGqwVv62&output=json&coordtype=wgs84ll&location='+latitude+','+longitude+'',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success  
        console.log(res);
        var city = res.data.result.addressComponent.city;
        console.log("这是城市"+ city)
        that.setData({ city });
      },
      fail: function () {
        that.setData({ currentCity: "获取定位失败" });
      },
    })
  }
});
