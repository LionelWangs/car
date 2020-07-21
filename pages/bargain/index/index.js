// pages/bargain/index/index.js
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";
const api = require("../../../utils/api.js");
const util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maxResults: 2,
    pageNo: 1,
    pageEnd: false,
    loading: false,
    initiate: false,
    activity: [],
    count: 0,
    self: false,
    knock: [],
    peoplesList: [],
    orderId: "",
    bargainProgress: 0,
    kockProgress: [],
    user: "",
    isCurrent: 0,
    lastMoney: 0,
    time: "",
    mobile: "",
    shop: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      mobile: options.mobile,
    });
    this.checkAlreadyMobile(options);
    // this.isSelf(options);
    this.knockPeopleList(options.orderId);
    this.knockApplyCount(options.activityId);
    this.getActivity(options.activityId);
    this.getMember();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉加载活动
    // if (!this.data.pageEnd && !this.data.loading) {
    //   this.setData({
    //     pageNo: this.data.pageNo + 1,
    //   });
    //   this.knockPeopleList(this.data.orderId);
    // }
  },
  onShareAppMessage(e) {
    console.log(e);
    //帮发起者砍单
    if (e.target.dataset.operation == 1) {
      return {
        title: this.data.user.memberName+"帮"+this.data.user.memberName+"邀请您砍价",
        desc: "分享页面的内容",
        link: "https://www.aoshuomusic.com",
        path:
          "pages/bargain/index/index?mobile=" +
          this.data.mobile +
          "&activityId=" +
          this.data.activity.id +
          "&orderId=" +
          this.data.orderId, // 路径，传递参数到指定页面。
        imageUrl: this.data.activity.viewImage,
      };
    } else
      return {
        title: this.data.user.memberName + "正在邀请您砍单，就差你这刀",
        desc: "分享页面的内容",
        link: "https://www.aoshuomusic.com",
        path:
          "pages/bargain/index/index?mobile=" +
          this.data.mobile +
          "&activityId=" +
          this.data.activity.id +
          "&orderId=" +
          this.data.orderId, // 路径，传递参数到指定页面。
        imageUrl: this.data.activity.viewImage,
      };
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
        //获取4S店
        this.getShop(success.data.dto.shopId);
      }
    );
  },
  //参加过该活动的人数
  knockApplyCount(activityId) {
    api.knockApplyCount(
      {
        activityId,
      },
      (success) => {
        console.log(success);
        this.setData({
          count: success.data.dto.random,
        });
      }
    );
  },
  //帮砍价
  knockAdd(orderId) {
    var token = wx.getStorageSync("token");
    console.log("这是token" + token);
    api.knockAdd(
      {
        orderId,
        Authorization: token,
      },
      (success) => {
        console.log("这是返回的数据");
        console.log(success);
        if (success.data.dto.apply.statusFlag == 2) {
          wx.showToast({
            title: "砍价完成",
            icon: "none",
          });
        }
        var timestamp = Date.parse(new Date());
        var time = success.data.dto.apply.endTime - timestamp;
        // var times = util.formatTimeTwo((success.data.dto.apply.endTime - timestamp),'h:m:s')
        var hours = parseInt(time / (1000 * 60 * 60));
        var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((time % (1000 * 60)) / 1000);
        var str = hours + ":" + minutes + ":" + seconds;
        this.setData({
          knock: success.data.dto,
          peoplesList: [],
          time: str,
        });
        this.knockPeopleList(orderId);
      }
    );
  },
  //砍价进程
  knockProgress(orderId) {
    var token = wx.getStorageSync("token");
    api.knockAdd(
      {
        orderId,
        Authorization: token,
      },
      (success) => {
        console.log(success);
        console.log("这是砍价进程");
        //获取当前时间
        var timestamp = Date.parse(new Date());
        var time = success.data.dto.apply.endTime - timestamp;
        // var times = util.formatTimeTwo((success.data.dto.apply.endTime - timestamp),'h:m:s')
        var hours = parseInt(time / (1000 * 60 * 60));
        var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((time % (1000 * 60)) / 1000);
        var str = hours + ":" + minutes + ":" + seconds;
        var isCurrent = (
          success.data.dto.apply.startAmount -
          success.data.dto.apply.currentAmount
        ).toFixed(2);
        var lastMoney =
          success.data.dto.apply.currentAmount -
          success.data.dto.apply.finalAmount;
        console.log(
          (success.data.dto.apply.currentAmount -
            success.data.dto.apply.finalAmount) /
            (success.data.dto.apply.startAmount -
              success.data.dto.apply.finalAmount)
        );
        this.setData({
          bargainProgress:
            (
              success.data.dto.apply.startAmount -
              success.data.dto.apply.currentAmount
            ).toFixed(2) /
            (
              success.data.dto.apply.startAmount -
              success.data.dto.apply.finalAmount
            ).toFixed(2),
          isCurrent,
          lastMoney,
          time: str,
        });
      }
    );
  },
  //当前砍价列表
  knockPeopleList(orderId) {
    api.knockList(
      {
        maxResults: 10,
        pageNo: 1,
        orderId,
      },
      (success) => {
        console.log("这是当前砍价列表");
        console.log(success);
        // if (this.data.pageNo <= success.data.dto.pagination.pageCount) {
        this.setData({
          peoplesList: success.data.dto.list,
        });
        // }
        // if (this.data.pageNo == success.data.dto.pagination.pageCount) {
        // this.setData({
        //   loading: true,
        //   pageEnd: true,
        // });
        // }
      }
    );
  },
  //判断是否是本人
  isSelf(options) {
    //本地缓存的手机号
    var phone = wx.getStorageSync("mobile");
    console.log("这是本地号码" + phone);
    console.log("这是发起者号码" + options.mobile);
    if (options.mobile == phone) {
      this.setData({
        self: true,
      });
      this.knockProgress(options.orderId);
    } else {
      this.knockAdd(options.orderId);
    }
  },
  //判断用户是否已经登录
  checkAlreadyMobile(options) {
    //更新token
    wx.login({
      complete: (res) => {
        api.login(
          {
            code: res.code,
          },
          (success) => {
            console.log("更新后的token" + success.data.dto.token);
            wx.setStorageSync("token", success.data.dto.token);
          }
        );
      },
    });
    var phone = wx.getStorageSync("mobile");
    if (phone == "") {
      Dialog.confirm({
        message: "请先登录或获取手机号",
      })
        .then(() => {
          //未注册用户可以点击注册后一并发起砍价
          wx.reLaunch({
            url: "../../my/index/index?bargain=true&orderId=" + options.orderId,
          });
        })
        .catch(() => {});
    } else {
      this.isSelf(options);
    }
  },
  goActivity() {
    wx.navigateTo({
      url:
        "../../shopping/index/index?shopId=" +
        this.data.activity.shopId +
        "&id=" +
        this.data.activity.id,
    });
  },
  //获取用户信息
  getMember() {
    var token = wx.getStorageSync("token");
    api.getMember(
      {
        Authorization: token,
        unionId: "",
      },
      (success) => {
        this.setData({
          user: success.data.dto,
        });
      }
    );
  },
  //获取4S店
  getShop(shopId) {
    api.getStores(
      {
        shopId,
      },
      (success) => {
        console.log(success);
        this.setData({
          shop: success.data.dto,
        });
      }
    );
  },
});
