//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");

Page({
  data: {
    tabActive: 0,
    activityList: [],
    hotBrandList: [],
    hotStoresList: [],
    loading: false,
    pageEnd: false,
    pageNo: 1,
    pageSize: 2,
  },

  onLoad: function () {
    this.getActivityList();
    this.getHotBrandListt();
    this.getHotStoresListt();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.pageEnd && !this.data.loading) {
      this.setData({
        loading: true,
        pageNo: this.data.pageNo + 1,
      });
      this.getActivityList();
    }
  },

  //获取活动列表
  getActivityList() {
    api.getGoodsList(
      {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        type: 2,
      },
      (success) => {
        this.setData({
          loading: false,
        });
        if (success.data.dto.list.length > 0) {
          this.setData({
            activityList: this.data.activityList.concat(success.data.dto.list),
          });
        }
        if (success.data.dto.list.length < 2) {
          this.setData({
            pageEnd: true,
          });
        }
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

  //获取热门4s列表
  getHotStoresListt() {
    api.getStoresList(
      {
        pageNo: 1,
        pageSize: 4,
      },
      (success) => {
        this.setData({
          hotStoresList: success.data.dto.list,
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

  // 标签切换
  onChange(e) {
    this.setData({
      tabActive: e.detail.name,
    });
  },
});
