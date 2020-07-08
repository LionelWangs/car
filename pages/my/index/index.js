const app = getApp();
const api = require("../../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasMobile: false,
    mobile: "",
    reg: false,
    bargain:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.userInfoReadyCallback();
    console.log(e.bargain+"这是砍价")
    this.setData({
      bargain:e.bargain
    })
  },
//回调用户信息
    userInfoReadyCallback(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      if( wx.getStorageSync("mobile") !=''){
        this.setData({
          hasMobile:true,
          mobile: wx.getStorageSync("mobile")
        })
      }
      this.getMember();
    } else {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              if( wx.getStorageSync("mobile") !=''){
                this.setData({
                  hasMobile:true,
                  mobile: wx.getStorageSync("mobile")
                })
              }
              this.getMember();
              
            }
  }
}
    ,
  // //获取登录状态
  getUserInfo: function (e) {
    var that = this;
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        //授权
        api.login(
          {
            code,
          },
          (success) => {
            that.setData({
              reg: success.data.dto.reg,
            });
            var openId = success.data.dto.openId;
            //解码
            api.decrypt(
              {
                openId,
                data: e.detail.encryptedData,
                iv: e.detail.iv,
              },
              (success) => {
                // wx.setStorageSync("unionId", success.data.dto.unionId);
                app.globalData.userInfo = success.data.dto;
                that.setData({
                  userInfo: success.data.dto,
                  hasUserInfo: true,
                });
              }
            );
          }
        );
      },
    });
  },

  //获取手机号
  getPhoneNumber(e) {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; //返回code
        //授权
        api.login(
          {
            code,
          },
          (success) => {
            var openId = success.data.dto.openId;
            var reg = that.data.reg;
            //解码
            api.decrypt(
              {
                openId,
                data: e.detail.encryptedData,
                iv: e.detail.iv,
              },
              (success) => {
                //缓存手机号
                wx.setStorageSync("mobile", success.data.dto.phoneNumber);
                that.setData({
                  mobile: success.data.dto.phoneNumber,
                  hasMobile: true,
                });
                //判断是否注册
                if (reg == true) {
                  that.resigerMember();
                } else {
                  that.getMember();
                }
                //完成砍价操作
                if(that.data.bargain){
                  wx.showToast({
                    title: '砍价完成',
                    icon:'none'
                  })
                }
              }
            );
          }
        );
      },
    });
  },
  //获取用户
  getMember() {
    var that = this;
    var mobile = wx.getStorageSync("mobile");
    var unionId = that.data.userInfo.unionId;
    api.getMember(
      {
        mobile,
        unionId,
      },
      (success) => {
        that.setData({
          userInfo: success.data.dto,
          hasUserInfo: true,
          mobile,
          hasMobile: true,
        });
      }
    );
  },
  exit() {
    app.globalData.userInfo = undefined;
    wx.clearStorage();
    this.setData({
      hasUserInfo: false,
      hasMobile: false,
      mobile:''
    });
  },
  //用户注册()
  resigerMember() {
    var mobile = wx.getStorageSync("mobile");
    var unionId = this.data.userInfo.unionId
    var openId = this.data.userInfo.openId
    api.resigerMember(
      {
        memberName: this.data.userInfo.nickName,
        mobile,
        photo: this.data.userInfo.avatarUrl,
        unionId,
        openId,
      },
      (success) => {}
    );
  },
  order(){
    wx.navigateTo({
      url: '../../order/index/index',
    })
  }
});
