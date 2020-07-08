// pages/bargain/index/index.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";
const api = require("../../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    initiate: false,
    activity:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //发起者的手机号
    let mobile = options.mobile;
    console.log("这是mobile" + mobile);
    this.checkAlreadyMobile(mobile);
    this.getActivity(options.activityId)
  },
  //判断用户是否已经注册
  checkAlreadyMobile(mobile) {
    var phone = wx.getStorageSync("mobile");
    console.log("这是phone" + phone);
    if (phone == "") {
      Dialog.confirm({
        message: "请先登录或获取手机号",
      })
        .then(() => {
          //未注册用户可以点击注册后一并发起砍价
          wx.switchTab({
            url: "../../my/index/index?bargain="+true,
          });
        })
        .catch(() => {
        });
    } else {
      this.checkInitiate(mobile);
    }
  },
  //判断是否为发起者
  checkInitiate(mobile) {
    //本地缓存中的手机号
    var phone = wx.getStorageSync("mobile");
    if (mobile == phone) {
      this.setData({
        initiate: true,
      });
    }
    else{
      wx.showToast({
        title: '成功帮好友砍价',
        icon: "none"
      })
      this.setData({
        initiate: false,
      });
    }
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
          });
        }
      );
    },
});

