// pages/useCoupon/index/index.js
const api = require("../../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupon: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrder(options.orderId);
  },
  getOrder(orderId) {
    debugger
    var token = wx.getStorageSync("token");
    api.getOrder(
      {
        Authorization: token,
        orderId,
      },
      (success) => {
        debugger
        console.log(success)
        api.getMemberCoupon(
          {
            id: success.data.dto.memberCodeId,
          },
          (success) => {
            this.setData({
              coupon: success.data.dto,
            });
          }
        );
      }
    );
  },
});
