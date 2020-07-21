//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");
import { IMG_PATH } from "../../../config/appConfig.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      normal: "../../../images/unchecked.png",
      active: "../../../images/check.png",
    },
    radio: "1",
    originalPrice: 0,
    beforeCouponPrice: 0,
    nowPrice: 0,
    show: false,
    showred: false,
    activity: "",
    coupon: [],
    red: [],
    redMoney: 0,
    couponMoney: 0,
    isRed: false,
    isCoupon: false,
    user: "",
    quantity: 1,
    shop: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      orderId: e.orderId,
    });
    this.getActivity(e.id);
    //获取用户信息
    this.getMember();
  },

  //获取指定活动
  getActivity(id) {
    api.getActivity(
      {
        activityId: id,
      },
      (success) => {
        console.log(success);
        this.setData({
          activity: success.data.dto,
          originalPrice: success.data.dto.currentPrice,
          nowPrice: success.data.dto.currentPrice,
          beforeCouponPrice: success.data.dto.currentPrice,
        });
        //获取指定4S店
        api.getStores(
          {
            shopId: success.data.dto.shopId,
          },
          (success) => {
            this.setData({
              shop: success.data.dto,
            });
          }
        );
      }
    );
  },
  //根据手机号获取优惠券
  getCouponList() {
    debugger;
    var token = wx.getStorageSync("token");
    api.getCouponList(
      {
        Authorization: token,
      },
      (success) => {
        console.log(success);
        this.setData({
          couponList: success.data.dto.list,
        });
      }
    );
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  // 异步器
  onAdd(event) {
    this.setData({
      quantity: event.detail,
    });
    //之前红包的金额
    var useMoney = 0;
    for (var i = 0; i < this.data.red.length; i++) {
      useMoney += this.data.red[i].faceAmount;
    }
    //之前优惠券的金额
    var couponMoney = 0;
    for (var i = 0; i < this.data.coupon.length; i++) {
      couponMoney += this.data.coupon[i].faceAmount;
    }
    this.setData({
      nowPrice:
        this.data.beforeCouponPrice * event.detail - useMoney - couponMoney,
    });
  },
  //使用优惠券
  showPopup() {
    this.setData({ show: true });
    //设置父组件传值给子组件

    this.selectComponent("#coupon").onShow(this.data.nowPrice);
  },
  //使用红包
  showred() {
    this.setData({ showred: true });
    //设置父组件传值给子组件
    this.selectComponent("#red").Show(this.data.nowPrice);
  },
  onClose() {
    console.log(this.data.coupon);
    this.setData({
      show: false,
      showred: false,
    });
  },
  getRed(e) {
    //获取到红包
    var red = e.detail;
    var money = 0;
    for (var i = 0; i < red.length; i++) {
      money += red[i].faceAmount;
    }
    //之前红包的金额
    var useMoney = 0;
    for (var i = 0; i < this.data.red.length; i++) {
      useMoney += this.data.red[i].faceAmount;
    }
    console.log(useMoney);
    console.log("红包总体金额" + money);
    //判断是否使用过优惠券
    //传来的red
    if (red != this.data.red) {
      this.setData({
        redMoney: money,
        red,
        nowPrice: this.data.nowPrice + useMoney - money,
      });
    }
    this.onClose();
  },
  //优惠券
  getchild(e) {
    //获取到优惠券
    var coupon = e.detail;
    var money = 0;
    for (var i = 0; i < coupon.length; i++) {
      money += coupon[i].faceAmount;
    }
    //之前优惠券的金额
    var useMoney = 0;
    for (var i = 0; i < this.data.coupon.length; i++) {
      useMoney += this.data.coupon[i].faceAmount;
    }
    console.log("优惠券总体金额" + money);
    //传来的coupon
    if (coupon != this.data.coupon) {
      this.setData({
        couponMoney: money,
        coupon,
        nowPrice: this.data.nowPrice + useMoney - money,
      });
    }
    this.onClose();
  },
  //获取用信息
  getMember() {
    var token = wx.getStorageSync("token");
    api.getMember(
      {
        Authorization: token,
        unionId: "",
      },
      (success) => {
        console.log(success);
        this.setData({
          user: success.data.dto,
        });
      }
    );
  },
  //唤起支付
  onSubmit() {
    var token = wx.getStorageSync("token");
    api.orderPay(
      {
        activityId: this.data.activity.id,
        couponId: this.data.activity.couponId,
        Authorization: token,
        quantity: this.data.quantity,
      },
      (success) => {
        debugger;
        console.log(success);
        api.prepareWeixinPay(
          {
            orderId: success.data.dto.id,
            Authorization: token,
          },
          (success) => {
            wx.requestPayment({
              nonceStr: success.data.dto.nonce_str,
              package: success.data.dto.package,
              paySign: success.data.dto.paySign,
              timeStamp: success.data.dto.timeStamp,
              signType: "MD5",
              success: (result) => {
                wx.reLaunch({
                  url: "../../order/index/index",
                });
              },
              fail: (res) => {
                //跳转到待付款页面
                wx.reLaunch({
                  url:
                    "../../readyPay/index/index?token=" +
                    token +
                    "&orderId=" +
                    success.data.dto.orderId,
                });
              },
            });
          }
        );
      }
    );
  },
});
